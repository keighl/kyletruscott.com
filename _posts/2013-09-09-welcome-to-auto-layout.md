---
layout: post
title: "Welcome to iOS Auto Layout"
description: "In one of our earlier Clambake iOS releases, I noticed a peculiar issue with our 'moves' interface. Scrolling really quickly down the table would result in the lower images 'flashing' through what looked to be the cell images that came before it. "
published: false
---

I've been preparing [Clambake](https://clambakeapp.com/get-it) for iOS 7. I was disappointed with how the existing build held up in the new OS; broken layout, awkward spacing, clipped text, etc. Along with the new features we had planned for the next release, there was a lot a stuff to do to get it into reasonable shape.

I decided that I begin leveraging Auto Layout since:

  * The iOS 7 transition guide insists that we do, and
  * It purportedly makes laying out a UI easier

<!--break-->

I've always built iOS interfaces using straight up `setFrame`. Also, I refuse to use interface builder on principal. I've become very efficient with this technique. I wrote a bunch [categories](https://github.com/keighl/KTCategories) to help do things like anchor a view to the bottom of its superview, or place one element immediately after another on the y axis... all by manipulating `frame`.

I struggled a lot at first with Auto Layout. My fiancé will attest to that; I worked on it during our vacation in Vermont, and was frustrated by Auto Layout half of the time.

Debugging ambiguos constraints is tormenting. The visual format language is super goofy, and writing out constraints (regularly or using the visual format) takes up tons of lines. And I still won't use interface builder.

However, over the course of a few custom controls and `UITableViewCell` subclasses, I started to get the hang of it. I realized that I had been trying to lay things out relationally in `setFrame` land anyway, and the Auto Layout tools are more robust.

For instance, when using my `(void)anchorToBottomOnRect:(CGRect)rect withMargin:(CGFloat)margin` category method on UIView, I am just trying to position an object in relation to another view (in another superview). It works fine, but via Auto Layout I don't have to think about updating the object's position when the other view changes.

So, I generally like Auto Layout now.

Here is a handful of insights, tips and grievances regarding my first month with Auto Layout. Their validity is questionable since I'm so new to it, but here they are nonetheless.

### Auto Layout in UITableViewCell

I found things generally work better when I add any subviews and constraints to a cell's `contentView`, and not to the cell view directly.

Messing with constraints for `textLabel`, `imageView`, `accessoryView` (etc.) is maddening. The cell applies other constraints to these views that can trip you up. It's easier to create your own views for the label, image, accessory, etc and have full control of the constraints.

{% highlight objc %}
@interface CBUserCell : UITableViewCell
@property (strong) UIImage *userImageView; // not imageView
@property (strong) UILabel *userNameLabel; // not textLabel
@property (strong) UILabel *userLocationLabel; // not detailTextLabel
@end
{% endhighlight %}

### Vertically Stacked/Centered labels

Forcing two stacked labels to vertically center in their superview is slightly challenging. You'll need to wrap them in a container, and center that, or use two other views above and below to fill the voids and push the labels to the vertical center. For the most part I've been using only one label, styling the various 'parts' via `NSAttributedString`, and centering this one view with `NSLayoutAttributeCenterY`.

### Precise Controls with intrinsicContentSize

For items that have a very sensitive intrinsic size, it seems easier to go ahead and override the `intrinsicContentSize` method. Even with hugging and compression resistance set to required, without an explicit intrinsic size, things get wonky fast.

Code / graphic

### Applying Constraints

Apple recommends, from what I remember in the WWDC videos, is to add constraints in updateConstraints. However, I have been setting up constraints that never change in the init methods, and only applying/removing constraints that change in the update constraints method. I find it easier to manage the things that change and leave the other constraints in a set-it-and-forget-it configuration.

Code

### UITableViewCell Height

Having a dynamic height for a cell that uses Auto Layout is tricky. You can still always use sizeWithFont on the cell text, but you can also utilize ststemSizeFitting on the cell contents. For me, this worked in some, not all, situations.

Graphic
Code

### Debugging

Pausing the process and running `po [[UIWindow keyWindow] _autolayoutTrace]` in the console will tell you which views in your layout are ambiguous. However it won't tell you which aspect of the view is ambiguous... so generally useless.

It seems to me that there is just a big learning curve to Auto Layout. Once you understand the patterns it's easier to debug, and avoid issues all together.dynamic height