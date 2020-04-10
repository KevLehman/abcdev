---
path: "/from-js-to-go-i"
date: 2019-10-15T17:12:33.962Z
title: "From Javascript to Go I"
tags: golang, javascript, tutorial, opinion
featuredImage: ../../images/node-vs-go.png
draft: false
---
This article, based on the book [_Go for Javascript developers_](http://www.pazams.com/Go-for-Javascript-Developers) aims to help you understand a little bit of the Golang ecosystem, and, why not, help you to start writing Go code!

First, basic information.

## What is Go?
Per its own description, Go is _an open-source programming language that makes it easy to build simple, reliable, and efficient software._ This means, Go focuses on simplicity & efficiency. You will learn how Go does this.

## Who is using Go?
Companies like Uber, Google, Dailymotion, Twitch, Sendgrid and even Medium use Go for their systems.
Uber Eng even wrote a blog post explaining [how they use Go for their real-time geofence lookups](https://eng.uber.com/go-geofence/). 

## Why Go?
Well, I hope you find your own answer to this at the end of the article :) 

That's enough for now, let's see some code!

We will focus on 4 main areas:
- Type system
- Memory Management
- Error Handling
- Module system

## Golang Type System vs JavaScript... types?

Let's start with the basics, how we declare a variable?

In Javascript:
```javascript
// Javascript
const aVariable = 1;
```

In Go:
```go
// Golang
var aVariable int = 1;

// Or the shorthand, with type inference
aVariable := 1;
```

As you can see, variables in Go follow a different structure than the C/C++ family: 
- In C/C++ `type your identifier = value`. 
- In Golang `var yourIdentifier type = value`.
 
In Go, the type is placed _after_ the variable name. Why? Well, Rob Pike [wrote a blog post](https://blog.golang.org/gos-declaration-syntax) explaining this difference and why this way improves declaration readabilty.

We know that JS isn't a strongly typed language, however, we can find 4 basic types on JS
- Numbers
- Strings
- Booleans
- Objects

In Golang, the types are more explicit, having:
- Integers (int, int8, int16, int32, int64, uint, uint32...)
- Floats (float32, float64)
- Arrays & Slices
- Maps
- Channels
- Booleans
- &c

As you can infer, a strongly typed language needs many more predefined types. And should allow you to create your own types on-demand. You can do this by using the language construct `type`:

```go
type ServerResponse map[string]interface{}
```

Let's see some code! (That's why you are here after all)

```javascript
// Type definition on JS
const x = 1.0;
const y = false;
const z = 'string';
const a = { b: 'string' };
```

Let's see the same in Go!
```go
// We will use the shorthand declaration

x := 1.0 // Go will infer this as float32
y := false // This will be inferred as bool
z := "string" // This is a string value
a := struct {
  b string
}{"string"} // Then, a.b will print "string"

```

Let's write down some key differences:

- Go strings must be written using double quotes ("). Single quotes are only used for char values ('c'). In JS, using double or single quotes is a matter of style.
- Go doesn't have Objects as JS does. We can mimic the power of Objects creating structs.
- In Go, a struct can be initialized right after its declaration (as you can see in the code example). Just remember: order matters:

```go
// This will throw a compile-time error
a := struct {
  b string
  c int
}{1, "string"}

// This will compile just fine
a := struct {
  b string
  c int
}{"string", 1}
```
- In Go, you can create variables without initializing them, and Go compiler will initialize them at their corresponding zero values for you. So, if you have:

```go
var x int
var y bool

fmt.Println(x) // will print 0
fmt.Println(y) // will print false
```

For further reading, look at [this chapter](http://www.pazams.com/Go-for-Javascript-Developers/pages/types/) from _Go for Javascript developers_.

## Memory Management

Both Go & JavaScript manage their own memory. Both of them have a GC task looking for variables to kill every second.
Let's talk about them:

### Go GC vs JS GC

Go implemented a Concurrent mark-and-sweep GC routine, so, the entire GC process doesn't block the main thread. You can find examples of how this improves performance looking at this [Tweet from Ngrok creator](https://twitter.com/inconshreveable/status/620650786662555648?s=20). You can manually trigger a GC cycle when you need it.

JS implements the same algorithm for cleaning its memory. However, due to JS thread limitations, the process should be blocked during the mark phase to allow GC to see which variables are not needed anymore. You can't call a GC cycle by yourself. 

### Heap/Stack allocation

Both languages abstract away the Heap/Stack usage & manipulation. None of the languages allow the programmer to allocate memory where they want to. Heap/Stack allocation is done by the compiler (or interpreter, on JS).

## Error Handling

Both languages interpret errors as regular values. So they can be returned or passed along functions.

JS has try/catch/finally constructions as part of its language (remember those times when all was handled by `window.onerror`?). This works for non-async code (or when you use `await`)

```javascript
try {
  throw new Error("This is an error");
  // Code here won't be executed
} catch (e) {
  // Handle e as you want.
  // What about `throw e`? 
} finally {
  // This block will be executed regardless an error ocurred.
}
```

If the errors are product of asynchronous operations, the handling could be like this (using promises as example)

```javascript
aPromise
  .then(value => value)
  .catch(err => /* handle err */);
```

In Golang, Error handling is a little bit more verbose. First, let's talk about the difference between errors and exceptions in Golang:
- An error is the result of an operation that went wrong.
For example, consider you create a function to convert from Dollars to another currency. If the user inputs a string instead of a double, would you call that an _exceptional situation_? So, you use errors for cases like this one:

```go
func ConvertDollarToCurrencyX(input float) (float, error) {
  // Here, if `input` is not a float or can't be converted to it
  // you can handle that error.
} 
```
- An exception, is, as its name says, an exceptional situation. For example, did your database crash for no reason? Well, that's an exceptional situation! In exceptional cases, you should `panic`.

A `panic` instruction means your program cannot continue working normally

```go
err := db.connect("someweirdstringhere")
if err != nil {
  panic("Our database is not working, help!!")
}
```

That instruction will end the program (or goroutine) execution until you `recover` from it. How do you do that? 

```go
func foo() int {
  defer func() {
  if err := recover(); err != nil {
    fmt.Println(err)
  }
  }()
  m := 1
  panic("foo: fail")
  m = 2
  return m
}

```
Did you notice the new word used here? Yes, `defer`. Defer will postpone the execution of a function until the end of its caller function. So, in our example, the `defer`ed function will be called _just before_ exiting the function on which it is defined (foo()). Here, we make a sanity check, since `recover` will only hold value when the function exited because of `panic`, we have to make sure that, if our function didn't `panic`d, we don't process the recover routine.

More on `defer`, `panic` & `recover` on [this great blog post](https://blog.golang.org/defer-panic-and-recover) from Golang's own blog.

Just remember one thing: `defer` execution context might not be what you expect ;).

## Go Modules vs JS Modules

### How to export/import modules?

Since `ES6` JS has a built-in module system. JS wasn't created with modules in mind. In its early years, was common to see long JS files containing all of the necessary code, and this was good since JS was only being used to provide some extra functionality to websites. Later, with the boom of JS as a _real language_, the need for split code emerged. With this need, frameworks and libraries that enable module usage appeared ([CommonJS](https://en.wikipedia.org/wiki/CommonJS), [RequireJS](https://requirejs.org/), &c). But, how do you define an ES6 module?

```javascript
export const name = 'square';

export function draw(ctx, length, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, length, length);
  
  return {
    length,
    x,
    y,
    color,
  };
}
```

And now, _Import it_, cause only exporting is _booring_.

```javascript
import { name, draw } from './path/to/module.js';
```

So now, how is this in Go? Well, history is a little bit different. Go was planned with `packages` support from the beginning. On Go 1.6, there was better support for encapsulating dependent packages inside a `vendor` folder. However, there was a big problem with this: there was no versioning on the libraries/packages you were using, and in fact, you could end with 10 different versions of the same library on a single project! (Problem resolved in JS by `package.json` and `.lock` files used for dependency management). 

In Go, it was not until version 1.11 where we have decent dependency management as part of the language. This version introduced `Go Modules` with the `go.mod` and `go.sum` files, which takes care of dependencies, versioning, and vendoring for your libraries. This allowed reproducible builds, one of the main issues of the Go community.

Now, what's the difference? Well, in JS, you can export any valid JS type. You can export just an unnamed function and use it. This is not possible in Go. Go export `packages`, which are namespaces for the exported functionality on it.

```go
package myPackage

var Name string = "square"

func Draw(ctx context.Context, color string, length, x, y int) context.Context {
  ctx.DoNiceThings(color, length, x, y)
  ctx.Draw(x,y,length)
  return ctx
}
```
And in another file...
```go
// `as` allows to rename an imported package. If not, the name of the package will be used as the descriptor
import "myPackage" as package

package.Draw(...)
```

This might make you wonder: _How Go knows what's being exported from a package if I'm not telling it?_

Well, in Go, every identifier whose name starts with an Uppercase letter will be exported by default. So if you have:
```go
package test

var name string = "not exported"
```
Calling `test.name` will throw an error, since you cannot access a private package property. 

### How to install dependencies?

In JS, you can use the well known [NPM](https://www.npmjs.com/) to install external libraries by running `npm install my-dependency@latest`.

In Go, however, the dependency management is built-in the `go` command, so by running `go get my-library`, you will install `my-library` on your project! As you will learn later, Go deps can be hosted on github, bitbucket, gitlab... 

This is a brief intro to the huge Go ecosystem, how it was designed to be simple, clean & readable. I hope that, at this point, you know:
- Differences between JS and Go in types, modules & syntax
- How to create Golang variables
- How Go manages errors & exceptions

So, let's Go!