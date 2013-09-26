---
layout: post
title: "iOS 7: Interactive Pop Gesture With Custom Back Button"
description: "How to enable the interactivePopGestureRecognizer and utilize a custom back button in iOS 7."
published: true
---

[Clambake for iPhone](http://clambakeapp.com/get-it) has a custom back button on all its navigation bars; it's a simple chevron with no text. The easiest way to implement a custom button like this is to simply set a `leftBarButtonItem` on the controller's `navigationItem`.

{% highlight objc %}

- (void)viewDidLoad
{
  self.navigationItem.leftBarButtonItem = [self backButton];
}

- (UIBarButtonItem *)backButton
{
  UIImage *image = [UIImage imageNamed:@"back_button"];
  CGRect buttonFrame = CGRectMake(0, 0, image.size.width, image.size.height);

  UIButton *button = [[UIButton alloc] initWithFrame:buttonFrame];
  [button addTarget:self action:@selector(backButtonPressed) forControlEvents:UIControlEventTouchUpInside];
  [button setImage:[UIImage imageNamed:normalImage] forState:UIControlStateNormal];

  UIBarButtonItem *item; = [[UIBarButtonItem alloc] initWithCustomView:button];

  return item;
}
{% endhighlight %}

However, doing this nixes the sweet interactive pop gesture iOS 7 provides. I found a quick fix for that [here.](http://stuartkhall.com/posts/ios-7-development-tips-tricks-hacks)

Through my beta testers, I started receiving crash reports centering around this gesture pop behavior. I found that by panning left really quickly after pushing a new controller to the stack would cause the crash. In other words, if the user immediately tries to swipe back while the push is still in progress, the navigation controller soils itself.

I found this in the debugger log:

{% highlight bash %}
nested pop animation can result in corrupted navigation bar
{% endhighlight %}

After a few hours of wrestling with various solves, I found that I can mitigate the errors like this:

### Set the gesture delegate to the navigation controller

Like [Stuart Hall](http://stuartkhall.com/posts/ios-7-development-tips-tricks-hacks) talks about in his post, assiging a delegate to the gesture resurrects it's behavior when a custom back button is applied. However, with really fast user pop interactions, the controller is sent a message from the gesture after it's been deallocated.

My solution is to simply make the navigation controller itself be the gesture delegate. This technique works best with a `UINavigationController` subclass.

{% highlight objc %}
@interface CBNavigationController : UINavigationController <UIGestureRecognizerDelegate>
@end

@implementation CBNavigationController

- (void)viewDidLoad
{
  __weak CBNavigationController *weakSelf = self;

  if ([self respondsToSelector:@selector(interactivePopGestureRecognizer)])
  {
    self.interactivePopGestureRecognizer.delegate = weakSelf;
  }
}

@end
{% endhighlight %}

### Disable `interactivePopGestureRecognizer` during transitions

When the user starts swiping backwards in the middle of a transition, the pop events stack up and "corrupt" the navigation stack. My workaround is to temporarily disable the gesture recognizer during push transitions, and enable it again when the new view controller loads. Again, this is easier with a `UINavigationController` subclass.

{% highlight objc %}
@interface CBNavigationController : UINavigationController <UINavigationControllerDelegate, UIGestureRecognizerDelegate>
@end

@implementation CBNavigationController

- (void)viewDidLoad
{
  __weak CBNavigationController *weakSelf = self;

  if ([self respondsToSelector:@selector(interactivePopGestureRecognizer)])
  {
    self.interactivePopGestureRecognizer.delegate = weakSelf;
    self.delegate = weakSelf;
  }
}

// Hijack the push method to disable the gesture

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  if ([self respondsToSelector:@selector(interactivePopGestureRecognizer)])
    self.interactivePopGestureRecognizer.enabled = NO;

  [super pushViewController:viewController animated:animated];
}

#pragma mark UINavigationControllerDelegate

- (void)navigationController:(UINavigationController *)navigationController
       didShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animate
{
  // Enable the gesture again once the new controller is shown

  if ([self respondsToSelector:@selector(interactivePopGestureRecognizer)])
    self.interactivePopGestureRecognizer.enabled = YES;
}


@end
{% endhighlight %}

