---
idx: 16
title: "The Apple Books data model"
date: "2026-06-22T19:54:21Z"
slug: "the-apple-books-data-model-1f8h"
tags: ["macos", "sqlite", "programming", "database"]
excerpt: "Apple Books stores everything about your reading on disk, in plain SQLite. Your books, your..."
draft: false
featured: false
canonicalUrl: "https://abcdev.netlify.app/the-apple-books-data-model-1f8h"
devtoUrl: "https://dev.to/kaleman15/the-apple-books-data-model-1f8h"
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fzdsd2dackdju15su4pik.png"
---

Apple Books stores everything about your reading on disk, in plain SQLite. Your books, your highlights, your shelves, your ratings, the dates you finished things, all of it sits in a handful of databases you can open and query right now. The app surfaces only a fraction of it.

This is a reference for that data model: where it lives, the conventions it follows, the entities that matter, and, most importantly, how those entities connect. The relationships are the interesting part. A single table is just a list; the model is the set of links between tables, and Apple Books has three distinct relationship patterns worth understanding.

Everything below is observable on any Mac with Books installed. No private APIs, no entitlements, just SQLite.

## Storage layout

Sandboxed macOS apps keep their data under `~/Library/Containers`. Apple Books spreads its across a few SQLite files in two containers:

```plaintext
~/Library/Containers/com.apple.iBooksX/Data/Documents/
├── BKLibrary/
│   └── BKLibrary-1-091020131601.sqlite           # the library: one row per book
├── AEAnnotation/
│   └── AEAnnotation_v10312011_1727_local.sqlite  # highlights and notes
└── BCRecentlyOpenedBooksDB/
    └── BCRecentlyOpenedBooksDB.sqlite            # recently-opened events
```

The numeric suffixes in the filenames are not stable across installs, so match on the prefix (`BKLibrary-1-*.sqlite`) rather than hardcoding the full name.

## Core Data conventions

Every table and column is uppercase and prefixed with `Z`: `ZBKLIBRARYASSET`, `ZTITLE`, `ZANNOTATIONASSETID`. That prefix is the signature of **Core Data**, Apple's persistence framework, which generates the SQLite schema underneath. Recognizing it tells you what to expect:

- `Z_PK` — integer primary key on every entity table.
- `Z_ENT` — which entity (table) a row belongs to.
- `Z_OPT` — Core Data's optimistic-locking version counter.
- Application columns carry the `Z` prefix too (`ZTITLE`, `ZRATING`, ...).

Two quirks follow from this that affect almost every query:

**Booleans are nullable.** Flags like `ZISFINISHED` are `1` or `NULL`, not `1` or `0`. `WHERE ZISFINISHED = 0` matches nothing. Use `IS NULL` / `!= 1` for the negative case.

**Timestamps use a 2001 epoch.** Core Data counts seconds from `2001-01-01`, not the Unix `1970-01-01`. The two differ by exactly `978307200` seconds. To read any date column as a real date:

```sql
SELECT date(ZDATEFINISHED + 978307200, 'unixepoch') FROM ZBKLIBRARYASSET;
-- 2026-05-16
```

Every date column in every one of these databases uses the same offset.

## Reading the files safely

Books keeps these databases open in **WAL mode** (Write-Ahead Logging). Recent changes live in `-wal` and `-shm` sidecar files next to the main `.sqlite` and have not yet been checkpointed into it. Opening the main file directly while Books is running yields stale reads or lock errors.

The safe approach for read-only analysis is to copy the database **and its sidecars** to a scratch location, then open the copy read-only:

```plaintext
BKLibrary-1-...sqlite      →  copy
BKLibrary-1-...sqlite-wal  →  copy   (must travel together)
BKLibrary-1-...sqlite-shm  →  copy
```

SQLite reconstructs the current state from the copied set, and the originals are never touched.

## The central entity: ZBKLIBRARYASSET

`ZBKLIBRARYASSET` is the hub of the model: one row per item in your library, and the table nearly everything else links back to. It has over a hundred columns; these are the ones that carry meaning:

| Column | Meaning |
|---|---|
| `ZASSETID` | stable identifier for the book — the join key for the entire model |
| `ZTITLE`, `ZAUTHOR`, `ZGENRE`, `ZLANGUAGE` | descriptive metadata |
| `ZPAGECOUNT`, `ZREADINGPROGRESS` | length, and progress as a 0–1 float |
| `ZISFINISHED`, `ZDATEFINISHED` | completion flag (1/NULL) and date |
| `ZRATING` | user star rating; `0` means unrated |
| `ZPURCHASEDATE`, `ZLASTENGAGEDDATE` | acquisition and last-interaction timestamps |
| `ZCONTENTTYPE` | format/role of the row (see the series section) |
| `ZSERIESID`, `ZSERIESNEXTFLAG` | series membership and "next up" marker |
| `ZDURATION` | runtime in seconds for audiobooks (`0` otherwise) |

A baseline query, books finished:

```sql
SELECT count(*) FROM ZBKLIBRARYASSET WHERE ZISFINISHED = 1;
```

`ZASSETID` is the thread that runs through the whole model. Hold onto it.

## The relationships

Three relationships connect to `ZBKLIBRARYASSET`, and each uses a different structural pattern: a cross-database join, a junction table, and a self-join.

### 1. Highlights — a cross-database relationship

Highlights and notes are not stored with the books. They live in a separate database, `AEAnnotation`, in the table `ZAEANNOTATION`. Each row is one annotation:

| Column | Meaning |
|---|---|
| `ZANNOTATIONASSETID` | foreign key to the book |
| `ZANNOTATIONSELECTEDTEXT` | the highlighted text |
| `ZANNOTATIONNOTE` | attached note, if any |
| `ZANNOTATIONSTYLE` | highlight color, `0`–`5` |
| `ZANNOTATIONDELETED` | soft-delete flag — filter `= 0` |

The link is `ZANNOTATIONASSETID`, and the non-obvious detail is which library column it targets. It is **not** `ZEPUBID`; it matches `ZASSETID`.

```plaintext
ZBKLIBRARYASSET.ZASSETID  ──1:N──  ZAEANNOTATION.ZANNOTATIONASSETID
```

Because the two tables live in different files, the join requires attaching one database to the other first. SQLite's `ATTACH` makes them queryable as one:

```sql
ATTACH DATABASE 'annotations.sqlite' AS ann;

SELECT b.ZTITLE, count(*) AS highlights
FROM ann.ZAEANNOTATION a
JOIN ZBKLIBRARYASSET b ON b.ZASSETID = a.ZANNOTATIONASSETID
WHERE a.ZANNOTATIONDELETED = 0
  AND a.ZANNOTATIONSELECTEDTEXT IS NOT NULL
GROUP BY b.ZTITLE
ORDER BY highlights DESC;
```

```plaintext
Become an Effective Software Engineering Manager | 404
La Atalaya, marzo de 2026                        |  53
The Midnight Library: A Novel                    |  25
```

### 2. Shelves — a many-to-many via junction table

Collections (*Want to Read*, *Finished*, and custom shelves) are a many-to-many relationship: a book can belong to several collections, and a collection holds many books. Core Data models this with a junction table in the middle.

```plaintext
ZBKCOLLECTION           ZBKCOLLECTIONMEMBER          ZBKLIBRARYASSET
  Z_PK   ◄──────────────  ZCOLLECTION                     ZASSETID
  ZTITLE                   ZASSETID  ─────────────────────────►
                           ZSORTKEY
```

`ZBKCOLLECTIONMEMBER` holds one row per membership, pointing both ways: `ZCOLLECTION` references the collection's `Z_PK`, and `ZASSETID` references the book. Listing the contents of a named shelf means traversing the junction:

```sql
SELECT b.ZTITLE
FROM ZBKCOLLECTIONMEMBER m
JOIN ZBKCOLLECTION c   ON c.Z_PK = m.ZCOLLECTION
JOIN ZBKLIBRARYASSET b ON b.ZASSETID = m.ZASSETID
WHERE c.ZTITLE = 'Want to Read'
ORDER BY m.ZSORTKEY;
```

### 3. Series — a self-join with a container row

Series have no dedicated table. Instead, two things encode them inside `ZBKLIBRARYASSET` itself:

1. Every book in a series carries a shared `ZSERIESID`.
2. The series itself is a **placeholder row in the same table**, identified by `ZCONTENTTYPE = 5`. It stores the series' name and metadata but is not a readable book.

Reporting on a series therefore means joining `ZBKLIBRARYASSET` to itself: the real members on one side, the container row on the other, matched on `ZSERIESID`.

```sql
SELECT
  (SELECT c.ZTITLE FROM ZBKLIBRARYASSET c
     WHERE c.ZSERIESID = m.ZSERIESID AND c.ZCONTENTTYPE = 5 LIMIT 1) AS series,
  count(*)                                           AS total,
  sum(CASE WHEN m.ZISFINISHED = 1 THEN 1 ELSE 0 END) AS read
FROM ZBKLIBRARYASSET m
WHERE m.ZSERIESID IS NOT NULL AND m.ZCONTENTTYPE != 5
GROUP BY m.ZSERIESID;
```

The `ZCONTENTTYPE != 5` predicate matters beyond this query. The container row counts as a row in the table, so any aggregate over books, totals, format breakdowns, library size, must exclude type `5` or it will overcount by one per series.

## The model at a glance

The three relationships form one compact graph, all anchored on `ZASSETID`:

```plaintext
                    ┌─────────────────────┐
   highlights ──────┤                     ├────── shelves
ZAEANNOTATION       │   ZBKLIBRARYASSET   │   ZBKCOLLECTION
(separate DB,       │      (ZASSETID)     │   via junction table
 ATTACH + JOIN)     │                     │   ZBKCOLLECTIONMEMBER
                    └──────────┬──────────┘
                               │ self-join on ZSERIESID
                               │ (container row, ZCONTENTTYPE = 5)
                            series
```

One central entity, three patterns: a cross-database join for annotations, a junction table for collections, a self-join for series. Most questions about a reading library reduce to one of these traversals.

## A documented limitation: reading sessions

The third database, `BCRecentlyOpenedBooksDB`, contains `ZBCASSETREADINGSESSION`, with `ZTIMEOPENED` and `ZTIMECLOSED` columns that look like they record reading duration. They do not.

```plaintext
opened                | closed               | duration
2026-06-10 17:49:29   | 2026-06-10 17:49:33  | 4 seconds
2026-05-05 14:53:33   | 2026-05-05 14:53:56  | 22 seconds
```

Each session spans a few seconds (an open event, not a reading span), `ZTIMEUPDATED` is empty, and only the most recent handful of rows are retained. Actual time-spent-reading is not persisted and cannot be reconstructed from this data. The open *timestamps* are valid, so they can support an opened-on-this-day signal, but not minutes-read.

## Querying your own library

None of this requires special tooling. On any Mac with Books:

```bash
sqlite3 ~/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-*.sqlite \
  "SELECT ZTITLE, ZAUTHOR FROM ZBKLIBRARYASSET WHERE ZISFINISHED = 1;"
```

From there, the rest of the model is reachable by following `ZASSETID`: attach the annotation database for highlights, walk `ZBKCOLLECTIONMEMBER` for shelves, self-join on `ZSERIESID` for series. The recurring practicalities are the same throughout: recognize the Core Data prefix, add `978307200` to every timestamp, treat boolean flags as nullable, and exclude `ZCONTENTTYPE = 5`.

## Appendix: a reference implementation

To exercise the model end to end, I built **ReadStats**, a small macOS menu-bar app that reads these databases (read-only, via the copy-with-sidecars approach above) and renders the stats they imply: finished-per-year, currently-reading progress, the want-to-read backlog, stalled books, highlight counts and colors, series progress, and a searchable browser over every highlight.


![ReadStats main view](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/497os8zlmrct2i3e5yg7.png)


![ReadStats library view](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/gl2hcen42ibr6p684xh4.png)


Each view in it is, underneath, one of the queries from this document. The library catalog is `ZBKLIBRARYASSET`; the "most highlighted" list is the cross-database join; the backlog is the junction-table traversal; the series card is the self-join. The data model did the hard part. The app is mostly presentation on top of these relationships.

If it's useful as a worked example of mapping a Core Data SQLite schema into a typed domain model, that's the part worth borrowing.

The official disclaimer is that the whole discovery was assisted by Claude. Pretty fun stuff checking the databases and how they connect to each other and being able to re-present the information in a nice way.

