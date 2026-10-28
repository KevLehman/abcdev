---
idx: 23
title: "What it takes to prove binary search works"
date: 2026-10-27
slug: "proving-binary-search-with-dafny"
tags: ["javascript", "programming", "algorithms", "formalverification"]
excerpt: "I used Dafny to verify binary search, broke its termination, and compiled the working version to JavaScript."
draft: false
unlisted: true
featured: false
coverImage: "https://kevinaleman.com/images/dafny-binary-search-header.webp"
---

In my [previous article about Proof Driven Development](/proof-driven-development), I wrote about using formal specifications to check whether code does what we agreed it should do. Microsoft Research's PDD Kit uses Verus for Rust, though, and most of my work is in JavaScript. So I was left with a question: what can I actually try without rewriting my whole application in Rust?

I ended up trying [Dafny](https://dafny.org/). With help from a coding agent, I wrote and verified a small binary search, deliberately broke it, and compiled the working version to JavaScript.

If you haven't heard of Dafny, it's an open-source programming language and verifier. You write code and describe what must be true before and after it runs. Dafny checks the code against those rules using a solver called Z3, and can compile it to languages including JavaScript.

{% embed https://github.com/dafny-lang/dafny %}

> **What is Z3?**
>
> [Z3](https://github.com/Z3Prover/z3) is a solver: you give it logical constraints and it checks whether they can be satisfied. Dafny uses it to help check whether the code could violate the rules we wrote.

## Why binary search?

If you don't know binary search, don't worry: the internet definitely doesn't have enough articles about it yet. I even wrote [one of them](/algorithms-in-real-life-binary-search) a few years ago, including the most important requirement:

- Your list must be sorted.
- Your list must be sorted.
- Your list *must* be sorted.

Still true! Binary search looks at the middle of a sorted collection, discards the half that can't contain the value, and repeats. That sounds simple until you have to decide what happens with an empty array, a missing value, duplicates, or a search range with one element left.

I wanted to see what it would take to check those cases without listing each input in a test. So I wrote down what a correct result should look like and asked Dafny to check the implementation against it.

## What are we actually promising?

Here's the contract I used:

```dafny
method BinarySearch(a: array<int>, key: int) returns (index: int)
  requires forall i, j ::
    0 <= i < j < a.Length ==> a[i] <= a[j]

  ensures index == -1 <==>
    forall k :: 0 <= k < a.Length ==> a[k] != key

  ensures index != -1 ==>
    0 <= index < a.Length && a[index] == key
```

`requires` is the condition the caller must satisfy: the array is sorted in ascending order. Equal values are allowed.

The first `ensures` says the result is `-1` **if and only if** the value is absent. The second says that any other result must be a valid index containing the value. If there are duplicates, returning any matching index is fine; this contract doesn't ask for the first one.

In other words, there are two cases: if the value is missing, return `-1`; if it exists, return an index where it appears. Both clauses work together: the first describes when `-1` is allowed, and the second checks that any other result points to the value.

## The implementation needs an explanation too

Here is the complete method, including the loop invariants:

```dafny
method BinarySearch(a: array<int>, key: int) returns (index: int)
  requires forall i, j ::
    0 <= i < j < a.Length ==> a[i] <= a[j]
  ensures index == -1 <==>
    forall k :: 0 <= k < a.Length ==> a[k] != key
  ensures index != -1 ==>
    0 <= index < a.Length && a[index] == key
{
  var low := 0;
  var high := a.Length;

  while low < high
    invariant 0 <= low <= high <= a.Length
    invariant forall k :: 0 <= k < low ==> a[k] < key
    invariant forall k :: high <= k < a.Length ==> key < a[k]
    decreases high - low
  {
    var mid := low + (high - low) / 2;

    if a[mid] < key {
      low := mid + 1;
    } else if key < a[mid] {
      high := mid;
    } else {
      return mid;
    }
  }

  return -1;
}
```

The search range is `[low, high)`: it includes `low`, but not `high`. At the beginning, that's the whole array. At the end, when `low == high`, there's nothing left to search.

![Searching for 5 in 1, 3, 5, 7, 9: low is 2 and high is 3. The remaining range contains 5; values outside it are too small or too large.](/images/dafny-search-range.svg)

The invariants describe what must remain true throughout the loop. The first keeps the range inside the array. The other two say that everything before `low` is smaller than the key, and everything at or after `high` is larger. If we find the key, we return its index. If the range becomes empty, those two facts explain why the key can't be anywhere in the array.

`decreases high - low` is the termination argument. The verifier checks that the remaining range gets smaller on each iteration that continues the loop. Without that check, we could miss a search that gets stuck repeating the same step.

With Dafny 4.11.0, the verifier reported:

```text
Dafny program verifier finished with 3 verified, 0 errors
```

Those three verified items are the verifier's reported count for the sample; they aren't a count of all the individual properties. The method's contract, bounds and termination are checked under its precondition. Dafny's guide goes into more detail on preconditions, postconditions and invariants.

{% embed https://dafny.org/dafny/OnlineTutorial/guide %}

## Let's break it

I changed one line:

```diff
- low := mid + 1;
+ low := mid;
```

The middle value is too small, so moving the lower bound to the middle might seem reasonable. But we already checked that position; we need to move past it.

Suppose we're looking for `6` and only `5` remains. `low` and `mid` are both `2`, so setting `low` to `mid` leaves the range exactly where it was:

![Searching for 6 with low and mid at 2 and high at 3 leaves only 5. Setting low to mid leaves the same range, so the next iteration checks 5 again.](/images/dafny-search-stuck-diagram.svg)

The next iteration checks `5` again, and the one after that does the same. With `low := mid + 1`, `low` becomes `3`, the range is empty, and the search returns `-1`.

Dafny rejected the changed version:

```text
Error: decreases expression might not decrease

Dafny program verifier finished with 2 verified, 1 error
```

The error doesn't spell out the one-element case, but it points us to the right place: the search range isn't guaranteed to shrink.

## But I write JavaScript

Dafny can compile to JavaScript. I compiled this sample with `dafny build --target js` and ran the generated program with Node. For `[1, 3, 5, 7, 9]`, it returned `3` for `7` and `-1` for `4`.

{% embed https://dafny.org/dafny/Installation %}

The generated JavaScript uses `bignumber.js` for Dafny integers. It also includes generated runtime code, so this isn't the same experience as adding a type annotation to an existing JavaScript function. To call the generated method from an application, we need an integration layer that supplies values in the expected representation. I tried that separately with a small session-policy function; the generated sample needed an export added before a Node wrapper could call it.

And remember the first rule? **The array must be sorted.** Dafny checks that calls from verified Dafny code satisfy the `requires` clause; our sample's `Main` does. But the search method itself assumes its input is sorted, and the generated JavaScript doesn't automatically check an array supplied by a JavaScript caller. We need to establish that guarantee at the boundary or elsewhere in the application. Checking every element on every call takes linear time, which can outweigh the benefit of binary search.

We also need to check how the JavaScript adapter converts values. Dafny integers are mathematical integers; JavaScript `Number` values have their own limits.

The proof also doesn't establish that we picked the right behavior. If the product needs the *first* occurrence of a duplicate, our current contract allows a different matching index. Dafny can verify exactly what we asked for and still leave the product team asking why the result isn't the one they expected.

## Would I use it?

For this example, the termination check was my favorite part. Changing `mid + 1` to `mid` is the kind of mistake that's easy to miss in review, and Dafny pointed me to the loop instead of letting it hang later.

Getting that check meant writing the invariants and figuring out how to call the generated code from JavaScript. That's more work than dropping a function into a project. For a small search, I'd probably stick with tests. But for a piece of logic where getting an edge case wrong would be expensive, I'd like to try this again.
