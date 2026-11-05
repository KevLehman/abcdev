---
idx: 1
title: "From JavaScript to Go I"
date: 2019-10-15T17:12:33.962Z
slug: "from-js-to-go-i"
canonicalUrl: "https://kevinaleman.com/from-js-to-go-i"
devtoUrl: "https://dev.to/kaleman15/from-javascript-to-go-50ef"
tags: ["golang", "javascript", "tutorial", "opinion"]
excerpt: "A gentle intro to the Go ecosystem for JavaScript developers — what Go is, who uses it, and why you might start writing it."
draft: false
featured: false
series:
  id: js-to-go
  title: "From JavaScript to Go"
  order: 1
featuredImage: "../../assets/images/javascript-to-go-illustration.png"
---
This article, based on the book [_Go for JavaScript developers_](https://www.pazams.com/Go-for-Javascript-Developers) aims to help you understand a little bit of the Golang ecosystem, and, why not, help you to start writing Go code!

First, basic information.

## What is Go?
Per its own description, Go is _an open-source programming language that makes it easy to build simple, reliable, and efficient software._ This means, Go focuses on simplicity & efficiency. You will learn how Go does this.

## Who is using Go?
In 2019, companies like Uber, Google, Dailymotion, Twitch, SendGrid and Medium used Go for their systems.
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

In JavaScript:
```javascript
// JavaScript
const aVariable = 1;
```

In Go:
```go
// Golang
var aVariable int = 1;

// Or, as an alternative declaration, with type inference
aVariable := 1;
```

As you can see, variables in Go follow a different structure than the C/C++ family: 
- In C/C++ `type your identifier = value`. 
- In Golang `var yourIdentifier type = value`.
 
In Go, the type is placed _after_ the variable name. Why? Well, Rob Pike [wrote a blog post](https://blog.golang.org/gos-declaration-syntax) explaining this difference and why this way improves declaration readabilty.

JavaScript is dynamically typed: a variable can hold values of different types. Some of its value types include:
- Numbers
- Strings
- Booleans
- Objects

This is not a complete list: JavaScript also has types such as `undefined`, `bigint`, and `symbol`.

In Golang, the types are more explicit, having:
- Integers (int, int8, int16, int32, int64, uint, uint32...)
- Floats (float32, float64)
- Arrays & Slices
- Maps
- Channels
- Booleans
- &c

Go is statically typed: each variable has a type checked by the compiler. You can also define your own types using `type`:

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

x := 1.0 // Go will infer this as float64
y := false // This will be inferred as bool
z := "string" // This is a string value
a := struct {
  b string
}{"string"} // Then, a.b will print "string"

```

Let's write down some key differences:

- Go strings use double quotes or backticks for raw string literals. Single quotes denote rune literals, such as 'c'. In JS, single and double quotes both delimit strings.
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

For further reading, look at [this chapter](https://www.pazams.com/Go-for-Javascript-Developers/pages/types/) from _Go for JavaScript developers_.

{% embed https://www.pazams.com/Go-for-Javascript-Developers/ %}

## Memory Management

Both Go and JavaScript manage memory automatically. Their garbage collectors reclaim memory that is no longer reachable. Let's look at how they differ:

### Go GC vs JS GC

Go uses a concurrent mark-and-sweep garbage collector. Much of its work runs alongside the program, though collection includes brief pauses. You can request a cycle with `runtime.GC()`. See the [Go GC guide](https://go.dev/doc/gc-guide) for details.

JavaScript engines also use garbage collection, but the language does not prescribe one implementation. Modern engines use mark-and-sweep with techniques such as incremental or concurrent collection. JavaScript itself does not expose a way to trigger GC, although some runtimes offer debugging options.

### Heap/Stack allocation

Both languages abstract away most heap and stack management. In Go, the compiler decides where values can be allocated; JavaScript allocation is handled by the engine. The details depend on the implementation.

## Error Handling

Both languages can represent errors as values, but their usual control flow differs. JavaScript code can throw exceptions; Go functions commonly return an `error` alongside a result.

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
  .catch(err => { /* handle err */ });
```

Go error handling is a little more explicit. For an expected failure, a function normally returns an `error`. For example, converting user input from a string to a number can fail:

```go
func ParseDollars(input string) (float64, error) {
  return strconv.ParseFloat(input, 64)
}
```

This snippet uses the standard library package `strconv`. The caller checks the returned error before using the value.

Go also has `panic` for situations where normal execution cannot continue, such as a violated program invariant. A database connection failure is usually better returned as an error: the caller may be able to retry or report it.

A panic unwinds the current goroutine, running deferred functions. If it is not recovered, the program terminates. A deferred function in the same goroutine can call `recover`:

```go
func foo() {
  defer func() {
    if err := recover(); err != nil {
      fmt.Println(err)
    }
  }()
  panic("foo: fail")
}

```
Did you notice `defer`? It schedules a function call to run when the surrounding function returns or unwinds. Here, the deferred function calls `recover` and checks its result before printing it.

More on `defer`, `panic` & `recover` on [this great blog post](https://go.dev/blog/defer-panic-and-recover) from Go's own blog.

{% embed https://go.dev/blog/defer-panic-and-recover %}

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

So now, how is this in Go? Well, history is a little bit different. Go was planned with `packages` support from the beginning. Go 1.6 improved support for keeping dependencies in a `vendor` folder, but the language toolchain did not yet provide the module-based version management it does today. JavaScript projects commonly use `package.json` and lockfiles to manage dependencies.

Go 1.11 introduced modules. A module's `go.mod` records its dependencies and versions; `go.sum` records checksums used to verify downloaded module content. Modules also support vendoring. Together these tools help make builds reproducible.

Now, what's the difference? Well, in JS, you can export any valid JS type. You can export just an unnamed function and use it. This is not possible in Go. Go organizes code into packages, which provide namespaces for exported identifiers.

```go
package square

var Name = "square"

func Area(side int) int {
  return side * side
}
```
And in another file...
```go
// An import name can rename the package locally.
import shape "example.com/project/square"

func example() int {
  return shape.Area(4)
}
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

In Go, dependency management is built into the `go` command. From a module, run `go get example.com/my-library` to add or update a dependency. To install an executable, use `go install example.com/tool@latest`. Dependencies can be hosted on GitHub, GitLab, and other servers.

This is a brief intro to the huge Go ecosystem, how it was designed to be simple, clean & readable. I hope that, at this point, you know:
- Differences between JS and Go in types, modules & syntax
- How to create Golang variables
- How Go manages errors & exceptions

So, let's Go!
