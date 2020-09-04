---
path: "/algorithms-in-real-life-binary-search"
date: 2020-09-03T17:12:33.962Z
title: "Algos in real life: Binary Search"
tags: "git, algorithms, beginners, development, advice"
featuredImage: ../../images/algos.jpg
draft: false
featured: true
---
You probably know about algorithms. You probably don't. So here's a basic definition: an algorithm is a chain of steps for moving from A to B.

If you want to make a sandwich, you probably have an algorithm for that. Mine is:

- Get the ingredients
- Separate bread and put it on a plate
- Put some dressing on both halves
- Put lettuce, tomatoes, pickles (if any) on one half
- Put ham, cheese, ham again on one half
- Add extra things (this is, probably whatever I can find that fits my sandwich)
- Put the empty half over the other ingredients
- Eat

Whatever your process is, the point is you use an algorithm for that.

Algos are really useful, in programming and real life. Here, I'll show you an example of how I used one of those algos to make my life (and work) easier.

### The task
Suppose that you were assigned to solve an issue at work. Depending on the kind of issue this may be easy peasy lemon squeezy or you can end stressed depressed lemon zest. 
The issue in this example is a simple one: a function was working at some time in the past, but now it's not. Easy.

You fix the function, upload your changes, and create a merge request. Everything fine at this point.

Then, someone from above asks the hard question: "Hey, this worked in the past, could you tell me _when_ it stopped working?". If like mine, your project has a ton of commits, then you'll have fun, more if your commit history looks like this:

![xkcd commit history](https://imgs.xkcd.com/comics/git_commit_2x.png)

### The solution
You have 3 options here:
1. Cry in a corner
2. Traverse _all_ your commits until you find one where it was working
3. Do something good with the knowledge you have

Ok, after doing the first we can start thinking on a real solution. And here's where algorithms come handy. Let's remember one of them!

#### The binary search algo, or the principle of divide and conquer.

You may remember that algorithm from a class, a course, some reading, or any other place. In case you haven't, I'll leave a brief explanation here: 

The main idea of this algorithm is to, given a sorted list and a value to find as inputs, traverse the list to find the value you're looking for.

The main point of difference between this and other search algos is _how_ the list is traversed. 

In traditional searching, you go from the start until the end (in the worst case) to find what you're looking for. If you reach the end and you haven't found the value, then it's not there. Something like this:

![Linearsearch](https://www.tutorialspoint.com/data_structures_algorithms/images/linear_search.gif)

In a binary search, however, you "divide" the list in halves, then compare the middle value with what you're looking for. If the value is greater, then you repeat the process in the left half, otherwise you use the right half. You repeat this until you cannot divide your input list anymore. Something like this:

![Binary search](https://d18l82el6cdm1i.cloudfront.net/uploads/bePceUMnSG-binary_search_gif.gif)

To use a binary search, you just have to follow some rules:
1. Your list must be sorted
2. Your list must be sorted
3. Your list _must_ be sorted

Ok. You got this, the list must be sorted. Let's continue with the solution!

### The solution (part 2)
Since our commit history is sorted (by the date of the commit) we can perform a binary search on the commit history!

I selected some old commit (like 20 days before) as my start point and my current commit as the last item. 
I, then, selected the middle one (this was made visually) and `checkout`ed to that commit.

Was functionality working? Yes? Select a more recent one! Else, use an older one.

You know how the story ends. I was able to verify the whole commit history in like 20 minutes, when it may have taken 2 hours due to the number of commits in the pool.

Moral: if you know how to do something fast, do it! And, algos are also useful in real life!

Hope you liked this history, and let me know if it helped you! Thanks for reading :tada:
