---
layout: post
title: "SDWebImage / UITableViewCell"
description: "In one of our earlier Clambake iOS releases, I noticed a peculiar issue with our 'moves' interface. Scrolling really quickly down the table would result in the lower images 'flashing' through what looked to be the cell images that came before it. "
---

In one of our earlier [Clambake](http://clambakeapp.com) iOS releases, I noticed a peculiar issue with our 'moves' interface. Scrolling really quickly down the feed (`UITableView`) would result in some cells 'flashing' through the cell images that came before it. It would eventually load the correct image, but clearly something was wrong, and sometimes users would vote on the wrong post erroneously.

The implementation looked like this:

* Standard table view and reusable cell structure.
* SDWebImage for downloading and locally caching images from our servers.

I was using the `setImageWithURL:placeholderImage:options:` category method on `UIImageView` to set the cell's image. This was fine when there was not too many images since they would load in farily quickly.

However, since the cells were being reused, these download operations were sometimes carried over to the next reused cell if the image hadn't finished downloading.

To resolve the wonky behaviour in the interface, I switched to another SDWebImage api method (`[SDWebImageManager downloadWithURL:options:progress:completed]`) which returns a reference to the actual download operation. I store this reference to an `imageOperation` property and nullify it during the `prepareForResuse` call.

The result: just one download operation at a time per cell … no more flashy images from previous cells.

{% gist 6319942 %}

