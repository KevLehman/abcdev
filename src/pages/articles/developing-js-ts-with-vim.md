---
path: "/develop-js-ts-with-vim"
date: 2020-06-17T17:12:33.962Z
title: "Develop JS/TS with Vim"
tags: "vim, javascript, typescript, webdev, dev"
featuredImage: ../../images/vim-8.png
draft: false
featured: true
---

In the beginning, there were editors. And VIM was an editor. And VIM was _the_ editor.

I started to code 3 years ago. When I started to code, I remember having one coworker that was using Emacs. He just stared at its screen without using the mouse, and all he was doing was using the keyboard to do what he needed. He tried to convince me to use Emacs as well, but something didn't feel so good when using it.

I, then, started to use VSCode. The good VSCode. I don't have anything to say against him. VSCode is an excellent editor. The only thing that stressed me out was its insane memory usage! After all, it's built in the top of Chromium, so it will use the RAM accordingly. VSCode is a perfect editor for almost anything you want to do. Do you want to write Java? There's a plugin. Do you want to test your API? There's a plugin. Do you want to manage your database? There. Is. A. Plugin. It's not an IDE because they haven't given the title to it!

Even when that rich ecosystem is something beautiful by itself, it can led to some issues. The memory usage may go insane as you install more extensions. And disabling them based on the workspace (which you have to configure manually) instead of filetype stressed me more.

So, there was a time, when I was working in a project that used a lot of docker containers, they used a lot of RAM by themselves, and I was using VSCode too. The RAM cake was starting to finish. Also, I had Chrome and another applications that I use to do my work (like Slack, which is also on top of Chromium) trying to get a piece of cake too... My computer didn't like that, so it crashed. This happened consistently for one month. I tried to change browser, to use Slack in my phone, to do some kind of black magic to get the most of my PC, even I tried to [download](https://downloadmoreram.com/) more RAM (I really expected this one to work... :( ). But nothing happened.

Then, the illumination came to me.

I took a course, and one of the instructors was using VIM, but it was like an IDE. It was perfect. He moved so quickly between tabs (buffers) and commands were intuitive. The color scheme was great, the speed was really impressive. He had autocompletion and listing... everything was perfect.

Motivated by this, I went to my laptop and installed VIM. But...
![first vim opening](https://dev-to-uploads.s3.amazonaws.com/i/w4ehqeleysrz2ubtxo2j.png)

IT WAS NOT LIKE THE VIDEO. WHY? I didn't have the autocomplete, neither the status bar nor the file explorer... it was just an empty console. Like Emacs was. And also I wasn't able to get out of it.

I realized that Vim was not pretty out-of-the-box. You have to work on it before using it to write code. So I spent a few days reading VIM tutorials and contents. I looked for online resources, and found these:

- [Try VIM online](https://www.openvim.com/)
- [Learn VIM while playing](https://vim-adventures.com/)
- [Learn VimScript the hard way](https://learnvimscriptthehardway.stevelosh.com/)

After finishing 2 of those (obviously the first 2...) I was ready to start to use VIM.

## The shorcuts

This is a list of the basic shortcuts I learnt before using VIM. These ones allowed me to at least know how to use it.

- To exit vim:
  `:q`
- To enter in edit mode:
  `i` (yeah, just type `i` and you will get into edit mode)
- To exit edit mode (and all other modes):
  `esc`
- To "save a file":
  `:w`
- To close without "saving":
  `:q!`
- To split "tabs" vertically:
  `Ctrl + wv`
- To split "tabs" horizontally:
  `Ctrl + ws`
- To change between "tabs":
  `Ctrl + ww`

## The plugins

First of all, like every person looking for knowledge, I typed `How to add plugins to vim` in Google. I followed some links and one of them took me to [Pathogen](https://github.com/tpope/vim-pathogen), which is a package manager that uses Git (just Git) to get the plugins. I also read about [VimPlug](https://github.com/junegunn/vim-plug), but Pathogen was my choice.

Why? Well, I liked the way it should be enabled:

```
execute pathogen#infect()
syntax on
filetype plugin indent on
```

Do you see? Pathogen "infects" VIM. Isn't it nice? Well, I probably lol'ed so hard when reading that, more than I should. That convinced me to use it instead of VimPlug.

Later, I discovered VIM 8 had native plugin support...
![flipping the table](https://i.kym-cdn.com/entries/icons/original/000/006/306/FlipTable.jpg)

### The plugin list

Now that I had a plugin manager, I needed plugins. Where did I find them? I used [Vim Awesome](https://vimawesome.com/) to get a list of most used plugins and filter the ones that were related to JS/TS/Go. Then, I installed them. Here's the list of the modules I have downloaded for my current development:

(Images taken from Vimawesome)

- [The NERDTree](https://vimawesome.com/plugin/nerdtree-red) (to interact with the filesystem)
  ![nerdtree look and feel](https://github.com/preservim/nerdtree/raw/master/screenshot.png)

- [Vim Airline](https://vimawesome.com/plugin/vim-airline-superman) (to get nice look and feel)
  ![vim airline look and feel](https://github.com/vim-airline/vim-airline/wiki/screenshots/demo.gif)

- [Vim Fugitive](https://vimawesome.com/plugin/fugitive-vim) (this plugin is so awesome that it should be illegal)
  ![example git log ran from fugitive.vim](https://dev-to-uploads.s3.amazonaws.com/i/tropsiz4uvt87h9uz7bu.png)

- [Vim Polyglot](https://vimawesome.com/plugin/vim-polyglot) (for really good syntax highlight)
  ![Typescript syntax highlight with Polyglot](https://dev-to-uploads.s3.amazonaws.com/i/qzirhss8oiiea53zi9oj.png)

- [ALE](https://vimawesome.com/plugin/ale) (An asynchronous linting engine. This is very useful to configure `ESLint` and `Prettier` in Vim)
  ![example ale linting js code](https://user-images.githubusercontent.com/3518142/59195938-3a81b100-8b85-11e9-8e8d-6a601b1db908.gif)

- [COC.vim](https://vimawesome.com/plugin/coc-nvim) (the ultimate code completion plugin)
  ![example coc.vim suggesting code](https://user-images.githubusercontent.com/251450/55285193-400a9000-53b9-11e9-8cff-ffe4983c5947.gif)

These aren't all the plugins I use. I just wrote there the most important ones. The ones without its help I wouldn't be able to write code in VIM.

The final product, using the plugins and one theme that I found (it's called `onehalfdark`) was this:

![my vim after the time investment on it](https://dev-to-uploads.s3.amazonaws.com/i/mnpha41bz41n3sjhxrlq.png)

Hope you liked my intro to the Vim world, and maybe this motivates you to start getting into Vim!
