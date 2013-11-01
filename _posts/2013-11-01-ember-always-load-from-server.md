---
layout: post
title: "Make Ember Always Hit the API"
description: "Ember routing is a little crazy. Sometimes it loads the model from your API, sometimes it doesn't."
---

I'm building the [Clambake](http://clambakeapp.com) web client using [Ember](http://emberjs.com/). It's been fairly awesome since it plugs into the existing APIs that our iOS app consumes. However, it has thrown me a few learning curves.

One of the challenging aspects conceptually for me is the role that routing plays in the Ember MVC paradigm. I'm used to Rails where routing just decides which controller method to fire.  In Ember routing plays a bigger role; the setup the 'context' for the controller. In other words, they load the data and hand it off to controllers. That's what the `model` method is doing.

The point here is to facilitate fast transitions to resource routes from other parts of the app. For instance, you click on a user, and Ember sets up the user controller's context to be the object from the click.


{% highlight coffeescript %}
CB.Router.map ()->

  @route 'user', path: 'users/:user_id'

  CB.UserRoute = Ember.Route.extend
     model: (params) ->
        # The `model` method isn't called if the context is passed in
        $.getJSON("#{CB.API_BASE}/users/#{params.user_id}")

{% endhighlight %}

{% highlight html %}
{% raw %}
<ul>
  {{#each user in users}}
    <li>
      {{#linkTo 'user' user}}
        {{user.name}}
      {{/linkTo}}
    </li>
  {{/each}}
</ul>
{% endraw %}
{% endhighlight %}

So that's cool, and it feels insanely fast.

<!--break-->

### But....

Sometimes, you really need to make a new request from the API. This is definitely the case with clambake. For instance, we don't send along a users global stats in the API payload unless it's a user show request. We essentially need ember to make an API request any time a controller renders itself, because we can't garuntee that context being passed to the router has all the stuff the controller needs.

One thing to note is that this problem really only applies to routes which may have a context passed in like: linkTo

Here's my way of making an ember router always load it's model from the server. Remember a router's model method isn't always called, but setupController is.


{% highlight coffeescript %}
CB.Router.map ()->

  @route 'user', path: 'users/:user_id'

  CB.UserRoute = Ember.Route.extend
    serialize: (model) ->
      return { user_id: model.id }

    model: (params) ->
      return { id: params.user_id }

    setupController: (controller, model) ->
      controller.set 'model', model
      p = @serialize model
      $.getJSON("#{CB.API_BASE}/users/#{p.user_id}").then (res) ->
        controller.set 'model', res.data
{% endhighlight %}

{% highlight js %}
// GET users#show /api/v2/users/1

{
  data: {
    user: {
      id: 1,
      name: "Kyle Truscott",
      location: "New York City"
      stats: {
        wins: 20,
        moves: 100,
        points: 136,
        clams: 41,
      }
    }
  }
}
{% endhighlight %}

{% highlight html %}
{% raw %}
{{#if user}}
  <h1>{{user.name}}</h1>
  <p>{{user.location}}</p>
{{/if}}
{% endraw %}
{% endhighlight %}

### Discussion

`setupController` is always called, so I make the request from there. This method doesn't have access to the routing parameters, but the necessary info is available in the model argument. The model object that gets passed to `setupController` is either the result the `model` method or an object passed from another controller. Either one can be passed through the serialize method to normalize the output, and use the resulting info to ping the API.

When the `$.getJSON` promise returns, I set the controller's model accordingly. Because there is a brief period where the controller's model doesn't have the right info, I wrap the view in a big `#if user` sanity check.