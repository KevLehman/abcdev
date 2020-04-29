---
path: "/getting-query-performance-stats-with-pg"
date: 2020-04-28T17:12:33.962Z
title: "Getting query performance stats with PostgreSQL"
tags: performance, query, sql, postgresql
featuredImage: ../../images/postgres-monitoring.jpg
draft: false
featured: true
---
In this article, you will see how to use some hidden features of PostgreSQL to get useful insight into your running queries in PostgreSQL.

## The problem
Have you tried to spot performance problems in your application? Maybe some of them live in the code (a map over thousands of elements maybe...) or maybe the performance issue is caused by another factor: badly defined SQL queries.

As a developer, you will have to deal with SQL someday, maybe sooner than later. And probably you will have to work with queries that other people made, or even with queries that the _you_ from the past created. 

The problem is that, without the right tool and the right information, is very difficult to identify a slow query. Why?

### Some queries are slower with more data

For example, imagine a simple query that joins multiple tables. In your local, with probably 10 users the query won't perform bad (and if it is, it is easier to spot it!). 

### Some queries needs an index

Indexing is probably the root cause of performance issues. The lack of them, as well as the presence of them, can cause problems. With a small set of data, you won't be able to see if a query needs an index or not. Even worse (or better, it depends) PostgreSQL can leave the index out of the query if the dataset is small enough to do a sequential scan (this is, row by row).

Without having the issue happening in a production environment, is very difficult to spot issues like this one, and there's a big possibility of the end-user spotting them before you.

This approach (waiting for the user to tell you the app is slow) is very reactive. You have to wait until the problem happens before working on a fix for the issue. But, what about being able to have this information _before_ the issue happens?

For that scenario is the reason why some PostgreSQL views exist. Those maintenance views are a gold mine for developers that want to track the performance of their queries. Let's talk more about them!

## The solution: PostgreSQL maintenance views

PostgreSQL has a lot of views for this purpose. Some of them give us stats about Disk I/O and network statistics. Others allow us to see replication stats and things like that. Here, we'll talk about 3 views that can help you nail down query issues: `pg_stat_user_tables`, `pg_stat_user_indexes` and `pg_stat_statements`.

### `pg_stat_user_tables`

This view shows you statistics about each table per schema (there's one row per table) and gives you information like the number of `sequential scans` that PG has performed in the table, how much `select/insert` operations are done in it and so on

![pg_stat_user_tables example](https://dev-to-uploads.s3.amazonaws.com/i/e9xc3njxfpt1v3l1ythv.png)

As you can see here, for the first row, it has performed 1 `sequential scan` and that scan returned 939 rows. There were 2 index scans and they returned 2 rows. Numbers are low because I'm using a local database, but these numbers should be larger in a production database.

From this view, apart from all the useful information, we can answer something really interesting: _which of my tables need an index?_ You can easily answer this question by querying the `seq_scan` and `seq_tup_read` columns!

```sql
select 
  schemaname,
  relname,
  seq_scan,
  seq_tup_read,
  seq_tup_read / seq_scan as avg,
  idx_scan
from pg_stat_user_tables
where seq_scan > 0
order by seq_tup_read desc limit 25;
```

Running that query will return us the following

![pg_stat_user_tables query result](https://dev-to-uploads.s3.amazonaws.com/i/f2vpvg9pkog0m0j67621.png)

As you can see, it is suggesting me to add an index to those tables since they were used recently in sequential scans. With more data and more runtime, this query will give you a good insight on how your tables are behaving.

### `pg_stat_user_indexes`

Even when adding indexes solves many problems, they are not the holy grail, and they come with a cost: space. Indexes are good, yes, we all concord in that. But something worse than not having an index is to have a useless one. Why? Well, first of all, it will take space from your DB server. Indexes on big tables can be very expensive, and get very very big. The second reason is that the index should be recalculated each time you write to the table. And of course, recalculating a useless index is like paying for food you won't eat!

So, every time you add an index, make sure it makes sense. 

But, what happens if you work on a codebase & DB schema that you didn't design? Is this the world's end? Absolutely! PostgreSQL views to the rescue again! The `pg_stat_user_indexes` table is capable of showing you the _frequency of use_ of your indexes, alongside with the space they are taking. 

![pg_stat_user_indexes view](https://dev-to-uploads.s3.amazonaws.com/i/9n48rzosg10ohstrjjfr.png)

As you can see from the image above, some of my primary keys weren't used yet. But, this doesn't give us too much detail yet. Because we don't know what's the space in disk our index is using! We can get that information by using the `pg_relation_size` function with the `indexrelid` from our results. 

```sql
select schemaname, relname, indexrelname, idx_scan, 
pg_size_pretty(pg_relation_size(indexrelid)) as idx_size,
pg_size_pretty(sum(pg_relation_size(indexrelid))
over (order by idx_scan, indexrelid)) as total
from pg_stat_user_indexes
order by 6;
```

![pg_stat_user_indexes query result](https://dev-to-uploads.s3.amazonaws.com/i/2qx9yf0v759pe1t9wrtc.png)

The result of this query shows you indexes that hadn't been used in a while alongside with its space consumption. This can give you an idea of which indexes to take care of.

> As a note, the result of this query doesn't mean that you should drop all of those indexes that hadn't been used. You should always investigate why the index isn't being used before deleting it!

### `pg_stat_statements`

This is probably the most useful one. It's hard for me to understand why this view isn't enabled by default! This view should be _enabled_ in the PostgreSQL conf to be used by you.

#### Activate

To enable this view, we should include it into the `shared_preload_libraries` list. Since I'm using Docker & Docker Compose to manage my database, I can easily add an option to the start command to be like this:

```yaml
  postgres:
    container_name: postgres
    image: postgres:10
    restart: always
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=${PG_PASSWORD:-postgres}
      - PGDATA='/var/lib/postgresql/data'
    command:
      - "postgres"
      - "-c"
      - "shared_preload_libraries=pg_stat_statements"
```

After this, when you start PostgreSQL again the library will be loaded with the DBMS

#### Create extension

After enabling the library, you should enable it as an extension. You can do this by running the following query

```sql
create extension pg_stat_statements;
```

If that query doesn't give you an error, you are good go! Let's confirm this by running:

```sql
select * from pg_stat_statements;
```

![pg_stat_statements view](https://dev-to-uploads.s3.amazonaws.com/i/2ebch61i8b5zibznzsdt.png)

From this view, we can get very good information about how our queries perform. For example, we have the number of `calls` a given query had. The `mean_time` of execution between all the calls and even the `stddev_time` (Standard Deviation) of the calls, to see if the queries have a consistent runtime or they vary and how much they do. 

From this view, you can even know how many rows a query returned if those rows came from the cache or from disk and so on!

With all of this information, it's easy to get a list of the most expensive queries and get to know why

```sql
select round(( 100 * total_time / sum(total_time) over ())::numeric, 2) percent,
             round(total_time::numeric, 2) as total,
             calls,
             round(mean_time::numeric, 2) as mean,
             stddev_time,
             substring(query, 1, 40) as query
from pg_stat_statements
order by total_time DESC
limit 10;
```

![pg_stat_statements query result](https://dev-to-uploads.s3.amazonaws.com/i/32t84yfy8zmeg72u86rw.png)

With that query, you now have a list of the 10 most expensive queries, how much time they used, how many times they have been called and the deviation from the mean-time those queries have. 

Using this, you can track what queries are the ones that take more time and try to fix them (or understand at least why they perform like that).

## Conclusion

Using PostgreSQL to monitor PostgreSQL is very useful and can point you in the right place to understand the performance of your application and the pain points it has. 

I hope you liked the article and learned something from it! 