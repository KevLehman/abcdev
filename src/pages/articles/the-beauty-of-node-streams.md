---
path: "/the-beauty-of-node-streams"
date: 2020-10-02T17:12:33.962Z
title: "The beauty of Node.JS streams"
tags: nodejs, javascript, streams, beginner
featuredImage: ../../images/stream.jpg
draft: false
featured: false
tweet: "An often ignored feature of Node. Why are streams beautiful?"
---

Probably you have heard of them, probably you don't. But they have been around for a while. We're talking about `streams`, an interesting and often ignored functionality of Node.JS.

## What are streams?
![a river, or stream?](https://extension.unh.edu/sites/default/files/styles/2x_blog_main/public/2MountainStream_MCarp.jpg?itok=DW1-tkGH&timestamp=1516995141)

To make things easier, we will define a stream as a `sequence of data that flows freely`. Think of streams like rivers. Rivers flow from one point to another in a constant way. The receiver doesn't know when the river will stop flowing but it's always there for receiving more water.

In Node, streams are very similar. They are a constant sequence of data. They flow from one point (emitter) to another (receiver). 

The receiver can decide if it wants to receive data or not. Also it decides what to do with the data received. It can `ignore` the data, `pipe` it to another receiver, `parse` it before receiving... 

## Why are streams useful?
This is a really good question. If you have lived without streams your whole life, you will think that you don't need them. And, depending on your use case, this could be true.

But the reality is that we need to use streams for some operations that otherwise will kill us. Let's put an example

### Dealing with files
Let's say we want to create a compressed copy of a file on our disk with a Node application. Usually, we will end up with something like this:

```js
fs.readFile(file, (err, buffer) => {
  zlib.gzip(buffer, (err, buffer) => {
    fs.writeFile(file + '.gz', buffer, err => {
      console.log('Done!!');
    });
  });
});
```

> Imports removed for brevity

Here, we're doing 4 things:
1. We're reading the _entire_ file and saving the data to a variable called `buffer`
2. We're using the `zlib.gzip` to compress the file into a `gzip`. We're passing the buffer to the function call. This will return a new compressed buffer
3. We write the compressed buffer to a new location
4. A `console.log` indicating that the operation finished

Well, this works. What's the problem with this approach? You may be wondering. Well, look again at the first 2 steps. In this approach, we're reading the _whole file_ before starting to process it. Additionally, we're storing the contents of that file in memory. This is not a problem if the file size is in MB. But, if the file size is in the order of GB? Hundreds of GB? Will your computer have all that RAM available to hold the file in it? Probably no. 

So, this approach, even when enough for more simple tasks, represents a problem when we're looking for performance and scalability, or simply we want to support larger files.

The problem can be solved by using `streams`. Let's see how:

```js
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + '.gz'))
  .on('finish', () => console.log('wooh!'));
```

We're doing some things different here:
1. We're creating a `read stream`. This will return us `chunks` of the file until it reaches the end.
2. We're `piping` the chunks to `zlib` for compression. What's important here is that we are not waiting for the whole file to be read before starting the compression.
3. We're creating a `write stream` in which we're passing `chunks` of data so Node can write them to the file.
4. After all, we listen for the `finish` event, which will be triggered when there's nothing more to do.

There's a vast set of details & quirks & functions related to streams which will be covered in other blog posts.

Hope you liked it!