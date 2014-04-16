---
layout: post
title: "Handling Errors From Goroutines"
description: "Block a program while goroutines are underway, and exit if one of them fails."
---

I'm writing a web service in Go for processing images. The basic premise is this:

* A client posts an image file to the service
* It creates the versions needed (resizes, thumbnails, blurs, etc)
* It uploads them to an S3 bucket
* It returns a JSON payload with paths, identifiers, and URLs for all the versions.

The experience is fairly synchronous for the client posting the image. Behind the scenes, though, I want to use Go's awesome concurrency to parrelize the processing of all the image versions. The goal is for the whole shebang to not take too much longer than processing one image (even if there are 3-4 to do).

Because it's a synchronous experience for the end user, if there is a problem anywhere, I want to halt the whole circus and retun an error. I've found that in concurrency land, this is not as easy as it sounds. Here's an outline of how I achieve that using goroutines and channels to catch an error and stop all the goroutines. The rest of the program is blocked while it waits for the goroutines to finish/fail.

<script src="https://gist.github.com/keighl/10882541.js"></script>

First, it's important to know how many goroutines will be spawned to how many are remaining in the select statement. Each go routine is passed both a success and error channel; they'll communicate their outcomes via these channels. An infinite `for` loop listens for channel messages via a `select` block. If a message comes through the success channel, it decrements the remaining count. Once the count is zero, the loop is broken and the rest of the program executes.

If an signal is received on the error channel, the function returns and cancels the other goroutines in progress.

From what I learned playing around with `sync.WaitGroup`, it behaves more or less the same as this strategy, but with no error catching.

The more I worked at this, the more I realized it's not a great fundamental concept anyway (i.e. be concurrent until something screws up). I'm trying to use concurrency for speed/arallelization here... but clearly these goroutines are fighting back against the complexity. They seem best used when you'll 'expect' some to fail, and want the others to continue happily.

But, this is my first foray into Go-land, and I'm getting good performance. So I'm happy!
