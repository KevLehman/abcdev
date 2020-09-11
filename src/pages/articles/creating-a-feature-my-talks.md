---
path: "/creation-of-a-feature-showoff-my-talks"
date: 2020-09-11T17:12:33.962Z
title: "Building a new feature: showoff my talks!"
tags: "gatsby, frontend, pdf, react, webdev, showdev"
featuredImage: ../../images/feature.jpg
draft: false
featured: false
---

I'm a backend developer, so most of the time I'm doing backend things. I feel stressed most of the time when I need to do something at the front. 

Then, I started to build my own personal site. And it was great! It's a blog site located temporarily at [Netlify](https://kaleman.netlify.app) where you can contact me, read what I wrote, share my content with a suggested tweet, and _now_ you can see the talks I've given in my career. 

The talks are mostly about basic topics, one of them is in progress yet, but I wanted to showcase that I made them. And this was when the trouble begins

![prepare for the problems, and make it double!](https://i.pinimg.com/originals/dd/de/62/ddde62f3c506d62e2c10c8d5bd2731c0.gif)

### How?
The first thing was to define what I wanted: I wanted to showcase my presentations. This was easy (in my mind), but, it wasn't easy in real life.

To give you more context, I store all my presentations in Google Drive, so I can work on them wherever I go. This makes things easier for working on them, but a little bit hard if you want to show them offline.

Why? Because first, you have to download the file. This is a no-brain task with a UI, just right-click and download. GG. The task gets more complex when you want _your code_ to perform that process. So I walked a lonely road, the only one that I have ever known: looking for someone who tried the same and succeeds. 

I found multiple [Gatsby plugins](https://www.gatsbyjs.com/plugins) by just typing `drive` or `google drive` into the search box. I tried every single one, with the hope of finding what I wanted. Here's a list of the highlighted ones if you are trying to do something similar:

[gatsby-source-google-docs](https://github.com/cedricdelpoux/gatsby-source-google-docs)
- The problem: the use case I had in mind was very different from what the library did

[gatsby-plugin-drive](https://github.com/fabe/gatsby-plugin-drive)
- The problem: it only allowed me to download DOC files (not presentations, which was what I wanted)

[gatsby-source-drive](https://github.com/jpalmieri/gatsby-source-drive)
- The problem: it didn't work. Maybe I misconfigured something or so.

[gatsby-plugin-docs-sheets](https://github.com/maxsteenbergen/gatsby-plugin-drive)
- The problem: it only allowed me to download Sheets. I'm pretty sure this was based on `gatsby-plugin-drive)

So, since no plugin was able to fulfill my needs, I had to make a difficult decision:
- Give up on my feature
- Create my own plugin

I took the second, and this plugin was the result: [Gatsby-plugin-googledrive](https://github.com/KevLehman/gatsby-plugin-googledrive)

The entire plugin was based on a single idea: given a Google Drive's `folderID`, download all files from the folder, and traverse the subfolders recursively to create the same structure on your selected `destination`. And download the files for each folder.

The technical details can be found at the GitHub of the project and, it's open-source, so if you want to build something around it feel free to do so.

### How? Part 2
After creating my plugin, I "plugged" it and the download started. I finally had the files on my local, and this was one step closer to my goal.

I had the PDFs on my local, now, I wanted to do 3 things:
- Get the URL from the PDF in my filesystem (and application!)
- Get the first page of the PDF (the "cover page")
- Convert that page to an image, and show it on a nice grid

Soo, I needed 3 things: 
- One way to get the PDF from my filesystem
- One way to read the PDF
- One way to convert the read PDF into images

For the first item, since I'm using Gatsby, I used the [gatsby-source-filesystem](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-filesystem) to read my folder and get the actual asset URL pointing to my file. It was really easy, just added this to my `gatsby-config.js` file:

```javascript
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `talks`,
        path: `${__dirname}/src/talks/`,
      },
    },
```

And that's it! Then, to query my filesystem and get the `nodes` with data, some `graphql` was needed:

```graphql
  query {
    allFile (filter: {sourceInstanceName: { eq: "talks" } }) {
      edges {
        node {
          name
          publicURL
        }
      }
    }
  }  
```

That query will do 2 things:
- Get all the files under the `path` of the `instance name` called `talks` (which is the `name` property you pass to the plugin definition)
- For each `node` aka `file`, get its `name` and `publicURL` (which is the URL that the asset will have after the building)

For the second item, I had to do some research. After some looking, I finally found [PDF.JS](https://github.com/mozilla/pdfjs-dist) which is like the standard for managing PDFs in JavaScript. It was written by Mozilla and has a ton of useful functions. I just used the basic API to get my feature working in a few LoC.

```javascript
PDFJS.getDocument(talk.publicURL).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
          // some code goes here
      })
})
```

The introduction to the library in its GitHub page was simple, maybe too small for my taste, but it worked. With this, the only thing left was to find a way to convert the PDF page's data into an actual image.

I found a pretty nice approach to accomplish that. It worked like this:

- Read the PDF page
- Scale the page's width and height (by using the viewport of the page)
- Create a `<canvas>` element
- Set the canvas context to `2d` (since we'll draw an image)
- Set the scaled page as the new data context for the `canvas`

The full code was linked in this [StackOverflow's answer](https://stackoverflow.com/a/12921304) which even had an example of how it worked. Nice.

With all of that in place, the final result: 

![My site, with the talks page populated](https://dev-to-uploads.s3.amazonaws.com/i/s0f8n6jf00jerp5mu57f.png)

Hope you liked the article, feel free to read my other posts here!