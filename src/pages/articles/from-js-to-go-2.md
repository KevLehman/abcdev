---
path: "/from-js-to-go-ii"
date: 2019-11-02T17:12:33.962Z
title: "From Javascript to Go II"
tags: golang, javascript, tutorial, opinion
featuredImage: ../../images/node-vs-go.png
draft: false
---
Hey! In my last [blog post](https://dev.to/kaleman15/from-javascript-to-go-50ef), you read some key differences between JS and Go, and how you can start to familiarize yourself with reading Go code. 

In this article, let's see some key differences between types & functions. Specifically, we will see:

- Arrays / Slices
- Dictionaries
- Sets
- Functions

## Arrays / Slices

### How are they made in Javascript?
As you may know, an array in JS is dynamically sized. That means you don't need to set its length when creating it.
```javascript
const myArr = ['this', 'is', 'good'];

console.log(myArr); // ['this', 'is', 'good']
```
The `array` type on JS has some very handful functions on its prototype:
```javascript
myArr.push('b'); // Will add a new value at the end
myArr.shift(); // Will remove the first element of the array
myArr.pop(); // Will remove the first element of the array
myArr.concat(['c']); // This will append ['c'] at the end of myArr
```
And the list goes on! JS has a lot of functionality predefined on array prototype. And you can extend it also:
```javascript
Array.prototype.sayHello = function() { return 'hello' }
myArr.sayHello(); // Prints 'hello'!
```

So, as you can see, the JS API for arrays is vast and very useful!

### How are they made in Go?

Go has 2: Slices & Arrays. What's the difference? Well, the difference is in its length. Arrays are statically sized, and cannot be extended after defined.

For example:
```go
a1 := [3]int{1,2,3} // Will create an array with [1,2,3]
var a2 [3]int // Will create an array with [0,0,0]
```
When you declare an array, its length becomes part of its type. So you cannot use an array of length 2 as an argument to a function expecting an array of length 3:

```go
var arr1 [2]int
var arr2 [3]int

func aDummyFunction(arr [3]int) { /* Do something */ }

aDummyFunction(arr1) // cannot use arr1 (type [2]int) as type [3]int in argument

aDummyFunction(arr2) // Good!
```
The history changes with Slices. Slices are not tied to any length, so they can increase on-demand. Even when every slice is backed up by an array, the length is not a problem for them! So you can have:

```go
var s1 []int // Will define an empty slice
var s2 []int{1,2,3} // Will define an slice with [1,2,3]
s3 := []int{1,2,3} // Will define an slice with [1,2,3]
```

Does this mean that you cannot define a slice's length? Of course, you can:

```go
s4 := make([]int, 10) // Will return a zeroed slice with length 10
s5 := make([]int, 10, 20) // Will return a zeroed slice with length 10 & capacity of 20
```

Hmmm... length, capacity, what's the difference between them?

Well, remember that I mentioned early that every slice is backed up by an array? So, slices are, underneath the hood, fancy arrays! Let's dig this a little deeper:

- A slice's length is the number of items the underlying array has. So when you declare `s4 := make([]int, 10)` you are telling Go that the underlying array should start with 10 elements.
- A slice's capacity is the max amount of elements the underlying array can hold _without having to reallocate_. So here `s5 := make([]int, 10, 20)`, when you `append` to `s5` the element number `21`, Go will copy the underlying array to a new array with the double of `capacity` (so it doesn't have to reallocate in a while).

You can find a more detailed explanation (and how they work internally) in this [blog post](https://blog.golang.org/go-slices-usage-and-internals). For now, let's see how do we work with slices:

- Appending values to a slice

```go
s6 := []int{}

s6 = append(s6, 1) // S6 will contain [1]
```
- Appending a slice to another one

```go
s7 := []int{1,2}
s8 := []int{3,4}

s7 = append(s7, s8...)
```

- Slicing an array

```go
arr := [10]int{1,2,3,4,5,6,7,8,9,0}
s9 := arr[0:3] // s9 will have [1,2,3]
s10 := arr[:3] // Same as above
s11 := arr[7:] // s11 will have [8,9,0]
```

> An important detail to have in mind while slicing arrays is that slices are just references to the sliced array. So, if you change the value of the slice, the value of the array will change in consequence. This is true while you don't _append_ values to the slice since that action will force Go to create a new array to hold the values of the slice.

You can find more useful operations with slices [here](https://github.com/golang/go/wiki/SliceTricks)

## Dictionaries
### How are they made in JS?
You can use `Objects` `Maps` or `WeakMaps` to create dictionaries. Let's focus on `Objects` since they are more used by JS devs. How do we use `Objects` for this? 

```javascript
const x = {
  key1: 'value1',
  key2: 'value2',
};

// Retrieving key/values
x['key1'] // 'value1'
x.key2 // 'value2

// Adding new elements
x['newValue'] = 'value3';
x.newValue = 'value3'; // Both are the same, however, this is the preffered approach when you already know the key.
```

### How are they made in Go?
In Go, there's just one type for maps: `Map`. A `Map` is a reference type, so it should be `make`d before using it. Also, assigning a `Map` to a new variable _WILL NOT_ copy the internal data.

```go
// Create maps
// Using make
m1 := make(map[string]int)
// Using a struct literal
m2 := map[string]string {
  "key1": "value1",
  "key2": "value2",
}

// Accessing values

value := m2["key1"] // "value1"
value, ok := m2["key2"] // "value2". The second value defines if the key was found, so
value, ok := m2["nonValid"] // "", false, since the key is not present on m2
```

## Sets
### How are they made in JS?
Again, JS has 3 types for manipulating sets `Object`, `Set`, `WeakSet`. 
Let's see the `Set` type.

```javascript
const set = new Set([1,1,2,2,3,3,4,4,5,5])
console.log(set) // 1,2,3,4,5 since Set values should be unique.

set.size() // 5
set.add(9) // [1,2,3,4,5,9]
set.remove(9) // [1,2,3,4,5]
set.clear() // []
```

### How are they made in Go?
By the time of writing of this blog post, Go hasn't native support for Sets. However, you can still use a `Map` to recreate a Set. You can find more of it at [this blog post](https://blog.golang.org/go-maps-in-action).

## Functions
### How are they made in JS?
JS treats functions are First Class citizens. That means you can assign a function to a variable, pass functions as parameters and return functions from inside functions, allowing the creation of `closures`. You can also use `lambda` functions on JS!

```javascript
function x() {};
const x = function() {};
const x = () => {};
```
And, let's see closures:
```javascript
function y() {
  const i = 0;
  return function() {
    return i++;
  }
}
```

As you can see from the above example, a `closure` is like a backpack, where the innermost function carries the values from the outer function, in this case, the `i` variable.

In JS, a function can only return a single value, so `return a, b` is not permitted.

## How are they made in Go?
Go also treats functions as first-class citizens. And also allows the return statement to return multiple values.
```go
func x() {}
x := func() {}
```

Let's see closures!
```go
func y() func() int {
  i := 0
  return func() int {
    i += 1
    return i
  }
}
```

The same logic is applied to closures. Just remember, a `func` returning a `func` should define it as its return type, even with the params the inner function will take.
```go
func y() func(int, string, rune) rune {
  return func(i int, b string, c rune) rune {
    return 'c'
  }
}
```

So far, we have learned how we:
- Declare arrays/slices in Go
- Create maps
- Build `set` like structures
- Create functions & create closures.

In the next blog post, we will discover a little bit more about Go execution context & scoping. 

So, let's Go!