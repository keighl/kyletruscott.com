---
layout: post
title: "Layout A CAShapeLayer"
description: "How you can utilize a CAShapeLayer within autolayout #ios"
---

I’ve recently discovered the magic of using `CAShapeLayer` for all glyph-iconography throughout my apps. Part of the magic, for me at least, has been my recent investment in [PaintCode](www.paintcodeapp.com). The app makes it ridiculously easy to generate shape paths from SVGs, Sketch files, etc.

After a few days of deep `CAShapeLayer` integration, I have a some key leanings to share regarding positioning and autolayout.

### Can I Use Autolayout With a Shape Layer?

**You can’t.** Autolayout is only applied to `UIView` and subclasses thereof. `CALayer` must be 'manually' sized and positioned using rects.

However, you can certainly insert a `CAShapeLayer` in a `UIView`, override its `intrinsicContentSize` and position it using autolayout.

I’ve been using a simple subclass of `UIView` that manages a single `CAShapeLayer` property. Whenever the shape property is set, the view will calculate it’s bounds, and invalidate the intrinsic content size of the view.

`intrinsicContentSize` is what autolayout will look to for understanding the size of the view.

{% highlight objc %}
CAShapeLayer *shapeLayer = [CAShapeLayer layer];
UIBezierPath *path = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(0, 0, 100, 100)];
shapeLayer.path = path.CGPath;
shapeLayer.frame = path.bounds;
shapeLayer.fillColor = [UIColor blueColor].CGColor;
self.shapeView = [KTShapeView initWithShapeLayer:shapeLayer];
self.shapeView.translatesAutoresizingMaskIntoConstraints = NO;
[self.view addSubview:self.shapeView];

// Center the view on the X axis
[self.view addConstraint:[NSLayoutConstraint constraintWithItem:self.shapeView
                                                      attribute:NSLayoutAttributeCenterX
                                                      relatedBy:NSLayoutRelationEqual
                                                         toItem:self.view
                                                      attribute:NSLayoutAttributeCenterX
                                                     multiplier:1
                                                       constant:0];

// Center the view on the Y axis
[self.view addConstraint:[NSLayoutConstraint constraintWithItem:self.shapeView
                                                      attribute:NSLayoutAttributeCenterY
                                                      relatedBy:NSLayoutRelationEqual
                                                         toItem:self.view
                                                      attribute:NSLayoutAttributeCenterY
                                                     multiplier:1
                                                       constant:0];
{% endhighlight %}

{% highlight objc %}
@interface KTShapeView : UIView
@property (nonatomic, strong) CAShapeLayer *shapeLayer;
+ (id)initWithShapeLayer:(CAShapeLayer *)shapeLayer;
@end

@implementation KTShapeView

+ (id)initWithShapeLayer:(CAShapeLayer *)shapeLayer
{
  KTShapeView *view = [KTShapeView new];
  view.shapeLayer = shapeLayer;
  return view;
}

- (void)setShapeLayer:(CAShapeLayer *)shapeLayer
{
  [self.shapeLayer removeFromSuperlayer];
  _shapeLayer = shapeLayer;
  _shapeLayer.anchorPoint = CGPointMake(0.5, 0.5);
  [self.layer addSublayer:self.shapeLayer];

  [self invalidateIntrinsicContentSize];
  [self setNeedsLayout];
}

- (CGSize)intrinsicContentSize
{
  return self.shapeLayer.bounds.size;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  CGRect frame = self.bounds;
  self.shapeLayer.position = CGPointMake(CGRectGetMidX(frame), CGRectGetMidY(frame));
}
@end
{% endhighlight %}

I've added the `KTShapeView` to my [KTCategories project.](https://github.com/keighl/KTCategories)

* [KTShapeView.h](https://github.com/keighl/KTCategories/blob/master/KTCategories/KTShapeView.h)
* [KTShapeView.m](https://github.com/keighl/KTCategories/blob/master/KTCategories/KTShapeView.m)