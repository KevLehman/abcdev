---
path: "/fuzzy-search-with-postgresql"
date: 2020-05-10T17:12:33.962Z
title: "Fuzzy Search with PostgreSQL"
tags: "postgresql, databases, search, fuzzy, sql"
featuredImage: ../../images/postgres.jpeg
draft: false
featured: true
---

# What's fuzzy search?
A fuzzy search is a type of search where the items are returned even when they are not an exact match. A fuzzy search is performed by a `fuzzy` algorithm that evaluates the likeliness between the search query and the values, even when the search query is misspelled or the order of the words changed.

For example, let's assume that we're using Google to find information about `washin machines`. As you can see, the word `washing` is misspelled. But even when Google knows that it'll return results that are somewhat similar to what you typed. Sometimes it even tries to correct you!

Well, that's a `fuzzy search`. Returning elements that are just `similar` one to another. 

# How's searching occasionally implemented?
Let's take a typical requirement: allow a user to search other users by its name. To accomplish that, you may end up building a query like this one:

```sql
SELECT * FROM users WHERE full_name ilike '%query_param%';
```
Assuming you have a user named `Jonh Doe` in your database, looking for `Jonh`, `JonH`, `jOnh`, `jonh doe`, `Jonh Doe` and so on will return the value you're looking for. But, what if the user types `Doe Jonh`? 

![Nuclear explosion](https://media.giphy.com/media/OMPqWQVhND9Vm/giphy.gif)

Well, for sure your app won't crash with that input. But I'm pretty sure it won't return anything! Why? Because the order of the words is different than what's stored on the database, and `ilike` won't do that rearrange of the words to match. One way to overcome this is to query also for the words in a different order, but that's not elegant.

Apart from that, what happens if now the user (yes, always the user, ugh) types `john doe`? There are some ways to handle this with `ilikes` but, why doing that amount of work when you can let PostgreSQL do that for you?

Let's introduce `pg_trgm`. A PostgreSQL extension based on something called a `trigram` that will be very useful for this! But, first of all, what's a `trigram`?

# PostgreSQL trigrams. What are they?
The basic definition of trigram is: _"A group of 3 consecutive written units, such as words, letters, etc"_. The `pg_trgm` extension allows us to divide a word in such.

## How does a trigram look like? 
To see how a trigram look like, let's enable the PostgreSQL extension first!

```sql
CREATE EXTENSION pg_trgm;
```

After that, run:

```sql
postgres=# select show_trgm('abcdefghijk');
                        show_trgm                        
---------------------------------------------------------
 {"  a"," ab",abc,bcd,cde,def,efg,fgh,ghi,hij,ijk,"jk "}
(1 row)

```

As you see, it'll divide the word into groups of 3 characters. Why there are spaces in the first and last trigrams? Well, that's because PostgreSQL assumes that every word to be converted into a trigram has 2 spaces before and one space after. Why? This allows PostgreSQL to create trigrams for words with less than 3 characters (`we`, for example). Also, this makes the similarity to take into account the first and last characters, which otherwise would have less weight when the trigrams are generated.

## How to use them to find similar words?
If we select the trigrams for 2 words, we should be able to find how similar those strings are. How? By counting the number of trigrams they share! 

```sql
postgres=# select show_trgm('Friend');
              show_trgm              
-------------------------------------
 {"  f"," fr",end,fri,ien,"nd ",rie}
(1 row)

postgres=# select show_trgm('Friendship');
                      show_trgm                      
-----------------------------------------------------
 {"  f"," fr",dsh,end,fri,hip,ien,"ip ",nds,rie,shi}11
(1 row)
```

How we find those similar trigrams between the 2 sets? Correct, an intersection!

```sql
postgres=# select a                                                 
from (select unnest(show_trgm('friends')) as a) as a
intersect select b
from ( select unnest(show_trgm('friendship')) as b) as a;
  a  
-----
 rie
 fri
  fr
   f
 end
 ien
 nds
(7 rows)
```

As you can see, there are 7 trigrams common between the 2 sets. Now, how do we know how similar they are? We can do that by calculating a similarity coefficient between the 2 words. How? 

```
word_similarity = common_trigrams / first_word_total_trigrams
```

Why we use the first word? Well, because we're comparing the first against the second word. We don't care about the excedent trigrams from the second word because we know they won't correlate to the first one.

Now, let's apply the formula. We have `7.00` common trigrams, and we have `8.00` total trigrams in the first word. Let's use PostgreSQL to determine the coefficient:

```sql
postgres=# select 7.00 / 8.00;
        ?column?        
------------------------
 0.87500000000000000000
(1 row)
```
_Here, we use decimals because otherwise, PostgreSQL will ignore the decimal part of the operation, thus returning us 0._

Now, we know that our words have a similarity of `0.875`. That means they are very similar! But, having to do all of this manually may take time... there should be a better way. 

Well, there's a better way! Alongside the trigram extension, we enabled a set of functions that came in the same packages. For example, the whole process we've done for calculating the similarity is abstracted away into a single function: `word_similarity`. By using the function, we can get all of this process into a single line:

```sql
postgres=# select word_similarity('friends', 'friendship');
 word_similarity 
-----------------
           0.875
(1 row)
```

And even better, there's a set of [useful operators](https://www.postgresql.org/docs/9.6/pgtrgm.html) that are built into the same package we're using! For example, we may let PostgreSQL decide if two words are similar or not by using the `<%` operator:

```sql
postgres=# select 'friends' <% 'friendship';
 ?column? 
----------
 t
(1 row)
```

That operator returns if 2 words are similar or not by using a `word_similarity_threshold`, which we can query too:

```sql
postgres=# select show_limit();
 show_limit 
------------
        0.3
(1 row)
```
_Note that `show_limit()` function is deprecated, but still works._

That limit is, the minimum coefficient a pair of words can have before marking them as different. You can modify that threshold using the `set_limit()` function and provide new value, but for most use cases, the default one should work!

Using trigrams, we can also query for the "distance" between 2 words, which is calculated by taking the `similarity` of the words from `1`.

```
distance = 1 - similarity(word_1, word_2);
```

With the `<->` operator. The lower the number the more similar (or less distance) they have.

```sql
postgres=# select 'friends' <-> 'friendship';
 ?column? 
----------
 0.416667
(1 row)
```

We can use this operator to build something like Google's `did you mean` functionality, which is probably done with n-grams.

### Building a `Did you mean` engine

First, let's create a table and populate it with data. For this example, I'll be using the departments of my country, El Salvador.

```sql
postgres=# create table t_departments(name text);
CREATE TABLE
```

And now, some data:

```sql
postgres=# insert into t_departments(name) 
values ('San Salvador'), ('Chalatenango'), ('Ahuachapan'), ('Cabanas'), ('Sonsonate'), ('La Libertad'), ('Santa Ana'), ('La Union'), ('Cuscatlan'), ('San Vicente'), ('La Paz'), ('Usulutan'), ('Morazan'), ('San Miguel');
INSERT 0 14
```
```sql
postgres=# select * from t_departments;
     name     
--------------
 San Salvador
 Chalatenango
 Ahuachapan
 Cabanas
 Sonsonate
 La Libertad
 Santa Ana
 La Union
 Cuscatlan
 San Vicente
 La Paz
 Usulutan
 Morazan
 San Miguel
(14 rows)
```

Now, what happens if the user is looking for `San Salvador` but it misspells it and write `sn salvador`? Our system should recommend the user to write it properly! How? Let's see:

```sql
postgres=# select * from t_departments order by 'sn salvador' <-> name limit 3;
     name     
--------------
 San Salvador
 Santa Ana
 San Miguel
(3 rows)

```

And #:tada:. By returning the first result, we can tell the user that we know what he was trying to write, and still, return results related to its search, as Google does!

### Solving our initial problem

Well, our initial problem was the user, right? Jk, our initial problem was to handle misspellings when users type a name, but they still want a result. 
It's now trivial to do this with our new knowledge, by querying either the `word similarity` or the `distance` between the words.

```sql
postgres=# select * from ( select unnest(array['jonh doe', 'jane doe', 'mark twain', 'some user', 'a person', 'tommy shelby']) as names) as a order by 'doe jonh' <-> a.names limit 3;
   names    
------------
 jonh doe
 jane doe
 mark twain
(3 rows)
```
_Ignore Mark Twain..._

I hope you liked the article, and if you are curious and want to delve more, you can read the [whole documentation](https://www.postgresql.org/docs/9.6/pgtrgm.html) for trigrams and all the operators you can. In my next blog post, I'll share how to index this kind of data so the queries are faster!