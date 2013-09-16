---
layout: post
title: "Welcome to iOS Auto Layout"
description: "In one of our earlier Clambake iOS releases, I noticed a peculiar issue with our 'moves' interface. Scrolling really quickly down the table would result in the lower images 'flashing' through what looked to be the cell images that came before it. "
published: true
---

I've been preparing [Clambake](https://clambakeapp.com/get-it) for iOS 7. I was disappointed with how the existing build held up in the new OS; broken layout, awkward spacing, clipped text, etc. Along with the new features we had planned for the next release, there was a lot a stuff to do to get it into reasonable shape.

I decided to begin leveraging Auto Layout since:

  * The iOS 7 transition guide insists that we do, and
  * It purportedly makes laying out a UI easier

<!--break-->

I've always built iOS interfaces using straight up `setFrame`. Also, I refuse to use interface builder on principal. I've become very efficient with this technique. I wrote a bunch [categories](https://github.com/keighl/KTCategories) to help do things like anchor a view to the bottom of its superview, or place one element immediately after another on the y axis... all by manipulating `frame`.

I struggled a lot at first with Auto Layout. My fiance will attest to that; I worked on it during our vacation in Vermont, and was frustrated by it most of the time.

Debugging ambiguos constraints is tormenting. The visual format language is kind of goofy, and writing out constraints (regularly or using the visual format) takes up tons of lines. And I still won't use interface builder.

However, over the course of a few custom controls and `UITableViewCell` subclasses, I started to get the hang of it. I realized that I had been trying to lay things out relationally in `setFrame` land anyway, and the Auto Layout tools are more robust.

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

Also, it seems good to flush some Auto Layout items in a `UITableViewCell` subclass before reuse. If setting any custom intrinsic sizes, invalidate them, and also call `setNeedsUpdateConstraints`.

{% highlight objc %}
// CBUserCell.m

- (void)prepareForReuse
{
  [super prepareForReuse];
  [self.thingy invalidateIntrinsicContentSize];
  [self setNeedsUpdateConstraints];
}
{% endhighlight %}

### Vertically Centering Multiple Items

Forcing stacked items to vertically center in their superview as a group is slightly challenging. I've found the easiest way is to use spacer views above and below. If the items are labels, though, I can usually get away with just one label, style the components via `NSAttributedString`, and center it with `NSLayoutAttributeCenterY`.

{% highlight objc %}
NSDictionary *views = NSDictionaryOfVariableBindings(viewOne, viewTwo, spacerTop, spacerBottom);

[self addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|[spacerTop][labelOne][viewTwo][spacerBottom(spacerTop)]|"
                                                             options:nil
                                                             metrics:nil
                                                               views:views]];
{% endhighlight %}

### Precise Controls with `intrinsicContentSize`

For items that have a very sensitive intrinsic size, it seems easier to go ahead and override the `intrinsicContentSize` method. Even with hugging and compression resistance set to required, without an explicit intrinsic size, things get wonky fast.

![Clams button in activity cell](/assets/media/intrinsicSizeEg.png)

{% highlight objc %}
// CBClamsButton.m

- (CGSize)intrinsicContentSize
{
  CGSize labelSize = [self.countLabel.text sizeWithFont:self.countLabel.font
                                      constrainedToSize:CGSizeMake(100.f, 30.f)
                                          lineBreakMode:self.countLabel.lineBreakMode];

  return CGSizeMake(labelSize.width + 50.f, 30.f);
}
{% endhighlight %}

### Applying Constraints

Apple recommends, from what I remember in the WWDC videos, adding constraints in `updateConstraints`. However, I have been setting up constraints that never change in the init methods, and only applying/removing constraints that change in the update constraints method. I find it easier to manage the things that change and leave the other constraints in a set-it-and-forget-it configuration.

{% highlight objc %}
@interface SomeView : UIView
@property (strong) NSMutableArray *customConstraints;
@end

@implementation SomeView

- (id)init
{
  self = [super init];
  if (self)
  {
    NSDictionary *views = NSDictionaryOfVariableBindings(....);

    // Some static constraints
    [self addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"......"
                                                                 options:nil
                                                                 metrics:nil
                                                                   views:views]];

  }
  return self;
}

- (void)updateConstraints
{
  [super updateConstraints];

  if (self.customConstraints)
    [self removeConstraints:self.customConstraints];

  self.customConstraints = [[NSMutableArray alloc] init];
  NSDictionary *views = NSDictionaryOfVariableBindings(....);

  // Conditional constraints
  if (something_special)
    [self.customConstraints addObjectsFromArray:[NSLayoutConstraint constraintsWithVisualFormat:@"......"
                                                                                    options:nil
                                                                                    metrics:nil
                                                                                      views:views]];
  else
    [self.customConstraints addObjectsFromArray:[NSLayoutConstraint constraintsWithVisualFormat:@"......"
                                                                                    options:nil
                                                                                    metrics:nil
                                                                                      views:views]];

  [self.contentView addConstraints:self.customConstraints];
}

@end
{% endhighlight %}

### UITableViewCell Height

Having a dynamic height for a cell that uses Auto Layout is tricky. You can still always use sizeWithFont on the cell text, but you can also utilize ststemSizeFitting on the cell contents. For me, this worked in some, not all, situations.

{% highlight objc %}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
  CBActivityCell *cell = [tableView dequeueReusableCellWithIdentifier:@"CBActivityCell"];

  if (nil == cell)
    cell = [[CBActivityCell alloc] initWithStyle:UITableViewCellStyleSubtitle
                                 reuseIdentifier:@"CBActivityCell"];

  // configure the cell...
  //
  //
  // Figure the height for your label(s) and add any padding
  height = [cell.mainLabel systemLayoutSizeFittingSize:UILayoutFittingCompressedSize].height + 20.f;

  return MAX(kMinCellHeight, height);
}
{% endhighlight %}

### Debugging

Pausing the process and running `po [[UIWindow keyWindow] _autolayoutTrace]` in the console will tell you which views in your layout are ambiguous. However it won't tell you which aspect of the view is ambiguous... so generally useless.

It seems to me that there is just a big learning curve to Auto Layout. Once you understand the patterns it's easier to debug, and avoid issues all together.