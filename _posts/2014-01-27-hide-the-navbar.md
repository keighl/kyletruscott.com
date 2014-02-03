---
layout: post
title: "Hide the Navbar For a Specific Controller in a UINavigationController Stack"
description: "Show and hide the navbar in the middle of the UINavigationController stack elegantly."
---

I have a `UINavigationController` stack where the standard navbar is visible in all but one of the view controllers. Specifically the 2nd controller out of 5.

It’s easy to simply `[self.navigationController setNavigationBarHidden:YES animated:YES];` in the controller’s `viewDidLoad`, but the UX of pushing and popping the others on and off the stack is pretty wonky. Especially with the iOS 7 interactive pop gesture. You’ll get weird holes in the UI as the navbars come in and out.

After some trial an error, here’s the strategy that did the trick for me.

    // The navigation controller stack

    UINavigationController
        UIViewController // regular
        CBViewController // no navbar
        UIViewController // regluar
        UIViewController // regular

{% highlight objc %}
@interface CBViewController : UIViewController
@property bool lockNavBarAsHidden;
@end

@implementation CBViewController

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  self.lockNavBarAsHidden = NO;
  [self.navigationController setNavigationBarHidden:YES
                                           animated:animated];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [self.navigationController setNavigationBarHidden:self.lockNavBarAsHidden
                                           animated:animated];
}

- (void)presentModal
{
  self.lockNavBarAsHidden = YES;
  UINavigationController *navController;
  navController = [[UINavigationController alloc] initWithRootViewController:[UIViewController new]];
  [self presentViewController:navController
                     animated:YES
                   completion:nil];
}

@end
{% endhighlight %}

In `viewWillAppear`, tell the `UINavigationController` to hide the navbar with the same `animated` argument the controller itself receives.

In `viewWillDisappear`, instruct the navbar to show itself again. Again, use the `animated` argument from the view controller to determine whether to animate the nav bar back in.

I found one issue with this system, though. If another controller is presented modally from a controller without a navbar, the navbar with show its face briefly. It shows up because `viewWillDisappear` is called when a modal is presented over a controller… and that’s where we instruct the navbar to come back.

My solution is to put a virtual lock (`self.lockNavBarAsHidden`) on the navbar when I present a modal. It’s unlocked whenever `viewWillAppear` is called again.

I hope this helps someone out there get some better navbar UX in their apps.
