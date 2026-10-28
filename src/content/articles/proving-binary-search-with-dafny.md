---
idx: 23
title: "I Proved Binary Search Works. Then I Broke It on Purpose"
date: 2026-10-27
slug: "proving-binary-search-with-dafny"
tags: ["javascript", "programming", "algorithms", "formalverification"]
excerpt: "I used Dafny to verify binary search, broke its termination, and compiled the working version to JavaScript."
draft: false
unlisted: true
featured: false
---

In my [previous article about Proof Driven Development](/proof-driven-development), I wrote about using formal specifications to check whether code does what we agreed it should do. Microsoft Research's PDD Kit uses Verus for Rust, though, and most of my work is in JavaScript. So I was left with a question: what can I actually try without rewriting my whole application in Rust?

I ended up trying [Dafny](https://dafny.org/). With help from a coding agent, I wrote and verified a small binary search, deliberately broke it, and compiled the working version to JavaScript.

If you haven't heard of Dafny, it's an open-source programming language and verifier built for writing code alongside its specifications. You describe what must be true before and after a function runs, and Dafny uses tools including the Z3 solver to check whether the implementation satisfies those rules. It can also compile to languages including JavaScript, so you can experiment with a verified piece of logic without writing your whole application in Dafny. Its [documentation](https://dafny.org/dafny/DafnyRef/DafnyRef) explains how the verifier and compiler work.

The interesting part wasn't that the search found a number. It was what I had to tell the verifier about **everything the search had already ruled out**.

## Why binary search?

I wrote about [binary search](/algorithms-in-real-life-binary-search) a few years ago, including the most important requirement:

- Your list must be sorted.
- Your list must be sorted.
- Your list *must* be sorted.

Still true! Binary search looks at the middle of a sorted collection, discards the half that can't contain the value, and repeats. That sounds simple until you have to decide what happens with an empty array, a missing value, duplicates, or a search range with one element left.

We can write tests for all of those. We should. But a test exercises a particular input. I wanted to see what it looked like to describe the rule once and have a verifier check the implementation against it for every sorted integer array within the model.

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

`requires` is the condition the caller must satisfy: the array is sorted in nondecreasing order. Equal values are allowed.

The first `ensures` says the result is `-1` **if and only if** the value is absent. The second says that any other result must be a valid index containing the value. If there are duplicates, returning any matching index is fine; this contract doesn't ask for the first one.

That “if and only if” matters. If we only said “return `-1` when the value is missing,” an implementation could return `-1` even when the value is present. Technically it would satisfy that one direction. Not the most useful search function, but very quick to implement.

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

The invariants describe what must remain true throughout the loop. The first keeps the range inside the array. The other two say that everything before `low` is smaller than the key, and everything at or after `high` is larger. If we find the key, we return its index. If the range becomes empty, those two facts explain why the key can't be anywhere in the array.

`decreases high - low` is the termination argument. The verifier checks that the remaining range gets smaller on each iteration that continues the loop. Otherwise, we might have a function that follows its rules forever without returning anything. Great commitment to the search, but not quite what we wanted.

With Dafny 4.11.0, the verifier reported:

```text
Dafny program verifier finished with 3 verified, 0 errors
```

Those three verified items are the verifier's reported count for the sample; they aren't a count of all the individual properties. The method's contract, bounds and termination are checked under its precondition. Dafny's [guide to specifications](https://dafny.org/dafny/OnlineTutorial/guide) goes into more detail on preconditions, postconditions and invariants.

## Let's break it

I changed one line:

```diff
- low := mid + 1;
+ low := mid;
```

It looks close enough. We've learned that the middle value is too small, so move the lower bound to the middle. What could go wrong?

Take a search range with one element left. `mid` is equal to `low`. If that element is smaller than the key, setting `low` to `mid` doesn't change anything. Next iteration, same element. Next iteration, same element. You get the idea.

Dafny rejected the changed version:

```text
Error: decreases expression might not decrease

Dafny program verifier finished with 2 verified, 1 error
```

This doesn't mean every verification failure comes with a ready-made explanation of the bug. Here, the error pointed to a useful question: **can the range stay the same?** Once we ask that, the one-element case is easy to see.

## But I write JavaScript

Dafny can [compile to JavaScript](https://dafny.org/dafny/Installation). I compiled this sample with `dafny build --target js` and ran the generated program with Node. For `[1, 3, 5, 7, 9]`, it returned `3` for `7` and `-1` for `4`.

The generated JavaScript uses `bignumber.js` for Dafny integers. It also includes generated runtime code, so this isn't the same experience as adding a type annotation to an existing JavaScript function. To call the generated method from an application, we need an integration layer that supplies values in the expected representation. I tried that separately with a small session-policy function; the generated sample needed an export added before a Node wrapper could call it.

And remember the first rule? **The array must be sorted.** The proof assumes that precondition. It doesn't mean an arbitrary JavaScript caller has supplied sorted values, or that the adapter converts values correctly. We still need to decide where that guarantee comes from and test the integration. Dafny integers are mathematical integers; JavaScript `Number` values have their own limits, so the conversion deserves attention too.

The proof also doesn't establish that we picked the right behavior. If the product needs the *first* occurrence of a duplicate, our current contract allows a different matching index. Dafny can verify exactly what we asked for and still leave the product team asking why the result isn't the one they expected.

## What would I take from this?

I don't think we should rewrite every JavaScript project in Dafny. This was a small, self-contained experiment, and the annotations took work. But it made a useful distinction clearer to me: tests gave me examples of the search working, while the verified contract gave me a statement about all sorted inputs covered by the model.

A coding agent helped produce the example, but the useful review wasn't just “does the code look like binary search?” It was: “Does this contract say what we want? What does the loop assume? What must be true when it stops? Who guarantees the input is sorted?” The verifier checked the formal obligations; we still had to decide whether those obligations were the right ones and how the generated code would be used.

That's the part I keep coming back to with proof-driven development. **A proof gives us a stronger answer to a question. Someone still has to ask the right question.**
