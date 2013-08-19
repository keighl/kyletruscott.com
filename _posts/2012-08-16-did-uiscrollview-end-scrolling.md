---
layout: post
title: "Did UIScrollView End Scrolling?"
description: "Know when a UIScrollView finished scrolling with delegate methods."
---

It's a common requirement for an application to know when a user stops scrolling a `UIScrollView`.

There is the obvious delegate, `scrollViewDidEndDecelerating`, method that announces when a scroll view stops moving. However, this will only fire if the `UIScrollView` did **decelerate** to a stop. It won't fire if a user carefully scrolls to a spot without creating any momentum.

To cover all the bases, you need to also listen to `scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate` for instances where the user stopped dragging and the `UIScrollView` also stopped without accelerating.

<pre class="prettyprint lang-c">
- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
  if (!decelerate)
    [self postScrollExplosion:scrollView];
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
  [self postScrollExplosion:scrollView];
}
</pre>


If will decelerate argument is false, then we know the `UIScrollView` stopped scrolling.