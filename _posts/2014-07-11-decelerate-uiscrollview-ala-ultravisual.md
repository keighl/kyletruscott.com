---
layout: post
title: "Decelerate a UIScrollView to a Specific Spot (à la UltraVisual)"
description: ""
---

For a recent prototyping project, I was reverse engineering the awesome scrolling interaction of [UltraVisual](http://ultravisual.com). There are many aspects that make up the responsiveness to their interaction: the cell sizes interpolate their heights as they approach being the ‘featured’ item, the tiled images parallax slightly on scroll, etcetera.

A key aspect, though, is how the scrollview decelerates naturally into another cell position. It does not simply animate to a position after the scroll view stops decelerating  (for an example of that behavior, [check out this other clone I found](https://github.com/RobotsAndPencils/RPSlidingMenu)). I think it’s this nuance that ties everything together.

The technique I landed upon was to implement the `scrollViewWillEndDragging:withVelocity:targetContentOffset` delegate method, and change the `targetContentOffset` to be the position of the appropriate next cell.

{% highlight objc %}
#pragma mark UIScrollViewDelegate

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView
                     withVelocity:(CGPoint)velocity
              targetContentOffset:(inout CGPoint *)targetContentOffset
{
  /**
   * Here we target a specific cell index to move towards
   */

  NSInteger nextIndex;
  CGFloat currentY = scrollView.contentOffset.y;
  CGFloat yDiff = abs(targetContentOffset->y - currentY);

  if (velocity.y == 0.f)
  {
    // A 0 velocity means the user dragged and stopped (no flick)
    // In this case, tell the scroll view to animate to the closest index
    nextIndex = roundf(targetContentOffset->y / kUVCellDragInterval);
    *targetContentOffset = CGPointMake(0, nextIndex * kUVCellDragInterval);
  }
  else if (velocity.y > 0.f)
  {
    // User scrolled downwards
    // Evaluate to the nearest index
    nextIndex = ceil((targetContentOffset->y - yDiff / kUVCellDragInterval);
  }
  else
  {
    // User scrolled upwards
    // Evaluate to the nearest index
    nextIndex = floor((targetContentOffset->y + yDiff / kUVCellDragInterval);
  }

  // Return our adjusted target point
  *targetContentOffset = CGPointMake(0, MAX(nextIndex*kUVCellDragInterval, self.collectionView.contentInset.top));
}
{% endhighlight %}

This provides a nice smooth deceleration directly to where the view should ‘land’.

### Speed up the deceleration

Part of the UltraVisual interaction’s great feel is the very controlled flicks you can give the UI to advance or retreat through the list. Out of the box, the `UIScrollView` decelerates too slowly, making the experience is too slippery and fast.

First you can set the scroll view’s `decelerationRate` to `UIScrollViewDecelerationRateFast`. But that still didn’t feel fast enough. To speed it up more I applied a 'dampener' to the `targetContentOffset` before calculating the next cell index.

{% highlight objc %}
#pragma mark UIScrollViewDelegate

#define kDragVelocityDampener .85

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView
                     withVelocity:(CGPoint)velocity
              targetContentOffset:(inout CGPoint *)targetContentOffset
{
  /**
   * Here we target a specific cell index to move towards
   */

  NSInteger nextIndex;
  CGFloat currentY = scrollView.contentOffset.y;
  CGFloat yDiff = abs(targetContentOffset->y - currentY);

  if (velocity.y == 0.f)
  {
    // A 0 velocity means the user dragged and stopped (no flick)
    // In this case, tell the scroll view to animate to the closest index
    nextIndex = roundf(targetContentOffset->y / kUVCellDragInterval);
    *targetContentOffset = CGPointMake(0, nextIndex * kUVCellDragInterval);
  }
  else if (velocity.y > 0.f)
  {
    // User scrolled downwards
    // Evaluate to the nearest index
    // Err towards closer a index by forcing a slightly closer target offset
    nextIndex = ceil((targetContentOffset->y - (yDiff*kDragVelocityDampener)) / kUVCellDragInterval);
  }
  else
  {
    // User scrolled upwards
    // Evaluate to the nearest index
    // Err towards closer a index by forcing a slightly closer target offset
    nextIndex = floor((targetContentOffset->y + (yDiff*kDragVelocityDampener)) / kUVCellDragInterval);
  }

  // Return our adjusted target point
  *targetContentOffset = CGPointMake(0, MAX(nextIndex*kUVCellDragInterval, self.collectionView.contentInset.top));
}
{% endhighlight %}

[Here’s an example interaction on github](https://github.com/keighl/KTUVDemo). It’s not a perfect interactive clone, but it worked for my prototyping purposes.