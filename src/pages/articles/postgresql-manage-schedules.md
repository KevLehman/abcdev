---
path: "/manage-scheduling-with-postgresql"
date: 2020-04-03T17:12:33.962Z
title: "Manage scheduling with PostgreSQL"
tags: "postgresql, databases, scheduling, development"
featuredImage: ../../images/postgres.jpeg
draft: false
---

How many times you tried to build a scheduling system and found too complex to arrange the dates in a way there are no collisions? Nobody? Only me?
Well, in this article you'll learn an easy way to handle scheduling by using some of the hidden features of PostgreSQL!

In case you don't know, PostgreSQL is a fully-featured and open source DB Engine written mostly in C. PostgreSQL contains a ton of features that can make our lives easier, I'll try to cover some of them in other articles. 

In this article, we'll talk about 3 of those powerful features: GiST indexes, Exclusion operators & ts-ranges.

Let's talk about them a little to have context:

### GiST indexes
A GiST index, or a `Generalized Search Tree` is a very important type of index. They are a "balanced, tree-structured access method that acts as a base template in which to implement arbitrary indexing schemes" according to the [Postgres documentation](https://www.postgresql.org/docs/9.5/gist-intro.html) about them. They are like the "b-trees" that you may have heard of. The difference between them is the operations they support. For example, a "b-tree" supports the standard comparisons between elements in the tree (<,>,=), but, for some types of data (geospatial, text, images) this kind of comparisons doesn't make sense!
This is when GiST saves the day. They allow us to customize the way the data is stored & balanced in the tree so we can perform another kind of operation over the indexed data, for example, calculate overlapping between the data, intersections, containment, etc.

However, they are not enabled by default (at least in my compilation) so, you have to enable them by "creating an extension". Create an extension is basically install it from a predefined source. You can create your own extensions but for this example, we'll be using a predefined one:

```sql
CREATE EXTENSION btree_gist;
```

You can delve into how they work in [this blog post](https://medium.com/postgres-professional/indexes-in-postgresql-5-gist-86e19781b5db) that explains the topic really well!

### TS-Ranges
A `ts-range` or Timestamp Range is a kind of Range datatype in Postgres. This datatype will create a "range" (surprise!) between the 2 dates passed.

```sql
SELECT tsrange('2020-01-01', '2020-01-02');

                    tsrange                    
-----------------------------------------------
 ["2020-01-01 00:00:00","2020-01-02 00:00:00")
(1 row)
```

If curious about what the `[ )` on the range means, you can look at Postgres' [official documentation](https://www.postgresql.org/docs/9.3/rangetypes.html) about ranges.

`tsranges` doesn't have a timezone by default. If you want to include the timezone in your ranges you can use the `tszrange` datatype. 

### Exclusion operators
Indexes are widely used to speed things up and for uniqueness. However, do you know that you can use indexes to define additional constraints? For example, scheduling constraints. As I mentioned earlier, you can determine if 2 pieces of data overlap using GiST indexes. What we'll be doing is to use that in our favor!
Exclusion operators are easy to define, you just state you want to use them:

```sql
CREATE TABLE reservations (
  room_id int,
  from_to tsrange,
  EXCLUDE USING GiST (room_id with =, from_to with &&)
);
```

Basically, what we're saying is: "hey Postgres, create an exclusion rule for this table. And, _when adding new elements_ use the `=` operator to compare `room_id`s and use `&&` (overlap) operator to compare the `from_to` tsrange."

Now that we have the table created, It's time to test!!

- Create the test table we're going to use (in case you didn't)

```sql
CREATE TABLE reservations (
  room_id int,
  from_to tsrange,
  EXCLUDE USING GiST (room_id with =, from_to with &&)
);
```

- Let's book some rooms!

```sql
INSERT INTO reservations VALUES (1, '["2020-01-01", "2020-01-10"]');
INSERT INTO reservations VALUES (2, '["2020-01-01", "2020-01-15"]');
INSERT INTO reservations VALUES (3, '["2020-01-06", "2020-01-12"]');
```

- Test our exclusion rule by inserting a reservation on a scheduled period.
Visually, this is what we're trying to do when inserting the new schedule:
![Current schedule](https://dev-to-uploads.s3.amazonaws.com/i/ltfzki4bblvillv4va95.png)
As you can see, the period in red `overlaps` with the current booked period, so it should fail. Let's try it!

```sql
INSERT INTO reservations VALUES (1, '["2020-01-06", "2020-01-15"]');
```

And what happens when we try to insert that scheduling?

```
ERROR:  conflicting key value violates exclusion constraint "reservations_room_id_from_to_excl"
DETAIL:  Key (room_id, from_to)=(1, ["2020-01-06 00:00:00","2020-01-15 00:00:00"]) conflicts with existing key (room_id, from_to)=(1, ["2020-01-01 00:00:00","2020-01-10 00:00:00"]).
```

That means our implementation is correct! #:tada:
Since we're using timestamps, you can be even more specific by specifying minutes, seconds and so on and Postgres will also take care of them!

I hope you learned something new! And, if you already knew about those features but didn't know you could use them for this, there you have it!

Hope you liked the post, bye! 

Disclaimer: this may not work for all the scenarios.