---
layout: post
title: "Loving RestKit v0.20"
description: "I upgraded RestKit in Clambake to v0.20. A whole lot of things to like."
---

[Clambake for iPhone](http://clambakeapp.com/get-it) uses [RestKit](http://restkit.org/) to map data from our API to Objective-C models. I chose it way back in 2012 when I started building the app. Then at  v0.10, it was a bit tricky to comprehend and implement, but it definitely got the job done. v0.20 came out in March 2013, but I’ve stuck with the older version because transitioning looked hard and v0.10 worked fine as it was.

Internally, we’ve forked our web-services API to make room for a lot of new stuff in the works. I decided to go ahead and switch to RestKit v0.20 while updating the iPhone app to consume v2 of our API.

After a day of migrating over to the new RestKit, I’m really happy with how the RK community (chiefly [Blake Watters](https://github.com/blakewatters)) has alleviated a lot of my previous pain points with the library.

### Better Response Mapping

The older RestKit had some quirks with mapping response objects that were different from posted objects. For instance, our API returns an updated move when the user submits a vote. I previously had to set an empty move as the `RKObjectLoader`’s `targetObject`. Otherwise, the response mapping would fail, since it expected a vote. Something like this:

{% highlight objc %}
// v0.10

[[RKObjectManager sharedManager] postObject:vote
                                 usingBlock:^(RKObjectLoader* loader) {

  // Tell the loader to expect something other than a Vote
  loader.objectMapping = [[RKObjectManager sharedManager].mappingProvider objectMappingForClass:[Move class]];
  loader.delegate = self;
  loader.targetObject = [Move new]; // Setup a new Move object as the target
}];
{% endhighlight %}

In v0.20, the response mapping is working perfectly for me regardless of disparities between what we send and receive from the web services.

{% highlight objc %}
// v0.20

[[RKObjectManager sharedManager] postObject:vote
                                       path:@"votes"
                                 parameters:nil
                                    success:^(RKObjectRequestOperation *o, RKMappingResult *result) {
                                      self.move = result.firstObject; // RestKit maps this correctly as a move!
                                    }
                                    failure:nil
];
{% endhighlight %}

Also, I’ve noticed that debugging mapping issues has become a lot easier. v0.2 has much better error logging  and does good job at explaining what’s broken.

### Super Clear Request API

Restkit v0.10 had seemingly 200 ways to request data, or to send a payload. I would have to carefully choose which methods to use based on how the data from the API was structured, and on which protocol methods made the most sense. Setting additional parameters to a request (like auth creds) was also very confusing since it had to happen in the loader block.

Now it feels really clean and clear (and under control). I can do everything I need right from the object manager through the `getObject`, `putObject`, `postObject`, etc. methods. Add an object (conveniently optional!), set the params as a dictionary, add a path. Done.

{% highlight objc %}
[[RKObjectManager sharedManager] postObject:nil // Optional object to be serialized to NSDictionary

                                       // Relative path from RKObjectManager baseURL
                                       path:@"login"

                                 // Extra information to send along
                                 parameters:@{ @"email" : self.email, @"password" : self.password}

                                    // Success block.
                                    success:^(RKObjectRequestOperation *o, RKMappingResult *result) {
                                      o.HTTPRequestOperation.response.statusCode; // Status code
                                      result.array // All mapped object
                                      result.firstObject; // First mapped object in the array
                                    }

                                    // Error block
                                    failure:^(RKObjectRequestOperation *o, NSError *error) {
                                      o.HTTPRequestOperation.response.statusCode; // Response code
                                      o.HTTPRequestOperation.responseData; // Raw response data
                                    }
];
{% endhighlight %}

The success and failure callback blocks are also very intuitive. Definitely an upgrade from the many delegate method and block choices from before.

### Mapping Setup & Configuration

Setting up your object mapping is definitely different, but not necessarily easier. I found it fairly time consuming. One aspect that took me a few minutes to get my head around was mapping serializers to `NSDictionary` instead of the the object your trying to serialize. It totally makes sense, since your model is being mapped to a vanilla dictionary before being sent to the API. But it confused me nonetheless.

{% highlight objc %}

RKObjectMapping *gameSerializationMapping = [RKObjectMapping mappingForClass:[NSMutableDictionary class]];

[gameSerializationMapping addAttributeMappingsFromDictionary:@{
  @"name": @"name",
  @"duration": @"duration",
  @"privacy": @"private",
  @"description": @"description",
}];

[objectManager addRequestDescriptor:
    [RKRequestDescriptor requestDescriptorWithMapping:gameSerializationMapping
                                          objectClass:[Game class]
                                          rootKeyPath:@"game"
                                               method:RKRequestMethodPOST]];

[objectManager addRequestDescriptor:
    [RKRequestDescriptor requestDescriptorWithMapping:gameSerializationMapping
                                          objectClass:[Game class]
                                          rootKeyPath:@"game"
                                               method:RKRequestMethodPUT]];

{% endhighlight %}

### Overall

RestKit is still awesome. I was thinking about ditching it for AFIncrementalStore; I’m glad I stuck with it.