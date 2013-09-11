---
layout: post
title: "Rails & Amistad: Friendships Controller"
description: "How build a simple friendships controller in Rails 3.0 using the awesome Amistad gem."
---

I had to build simple friendship functionality into a Rails 3.0 app recently, and discovered this great gem, <a href="https://github.com/raw1z/amistad">Amistad</a>, that handles all the friend logic for you. Setting up a friendship system between users is a bit tricky because you need to engineer it in both directions; a friendship can only be instantiated by one user, but the both users need to see each other as friends. Ryan Bates does a really good job of explaining this in one of his RailsCasts (<a href="http://railscasts.com/episodes/163-self-referential-association">Self-Referential Associations</a>).

<!--break-->

### Amistad

<a href="https://github.com/raw1z/amistad">Amistad</a> is a gem that will supply you with all the logical methods for setting up friendships between users. What it doesn't do, though, is give you an interface or controller for letting users friend each other ... and that's good, because you typically want a lot of control over that anyway.

So, here is a basic version of the friendship controller I wrote for the app using Amistad. The user model here is driven by <a href="https://github.com/plataformatec/devise">Devise</a>, but I think it would work on any user model.

First, install the gem according to the <a href="https://github.com/raw1z/amistad#readme">documentation</a>.

Next, add the Amistad bindings to your user model.

{% highlight ruby %}
class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :token_authenticatable

  attr_accessible :email, :password, :password_confirmation, :remember_me

  include Amistad::FriendModel

end
{% endhighlight %}

Then, create a controller to handle the friendships, and a resourceful route.

{% highlight bash %}
$ rails g controller friendships
{% endhighlight %}

{% highlight ruby %}
# config/routes.rb
resources :friends, :controller => 'friendships', :except => [:show, :edit] do
  get "requests", :on => :collection
  get "invites", :on => :collection
end
{% endhighlight %}

###The Controller

{% highlight ruby %}
class FriendshipsController < ApplicationController

  before_filter :authenticate_user!

  def index
    @friends = current_user.friends
  end

  def new
    @users = User.all :conditions => ["id != ?", current_user.id]
  end

  def create
    invitee = User.find_by_id(params[:user_id])
    if current_user.invite invitee
      redirect_to new_friend_path, :notice => "Successfully invited friend!"
    else
      redirect_to new_friend_path, :notice => "Sorry! You can't invite that user!"
    end
  end

  def update
    inviter = User.find_by_id(params[:id])
    if current_user.approve inviter
      redirect_to new_friend_path, :notice => "Successfully confirmed friend!"
    else
      redirect_to new_friend_path, :notice => "Sorry! Could not confirm friend!"
    end
  end

  def requests
    @pending_requests = current_user.pending_invited_by
  end

  def invites
    @pending_invites = current_user.pending_invited
  end

  def destroy
    user = User.find_by_id(params[:id])
    if current_user.remove_friendship user
      redirect_to friends_path, :notice => "Successfully removed friend!"
    else
      redirect_to friends_path, :notice => "Sorry, couldn't remove friend!"
    end
  end

end
{% endhighlight %}

So, this is a semi-restful approach to invited, confirming, and removing friendships between users. You'll notice that I removed the "show" and "edit" actions because they don't fit the functionality we're trying to accomplish. Instead of "showing" a friendship, we would want to just show that user's profile. And there aren't enough configurable qualities to warrant an "edit" interface.

Here's a break down of what each of these actions are doing.

### index

This method just returns all of the current user's friends; thanks to Amistad, we can get all friends through one simple method ... regardless of how the friendship was created. Remember, the current user could have invited some friends, and could have been invited by others.

### new

In the new action, I simply listed out all users that the current user <strong>could</strong> invite as friends. Here's how I render out the potential friends in the view. I eventually made this one more robust to totally filter out current friends, and to search by email/name/etc. But here's the simple version.

{% highlight haml %}
%ul
  - for user in @friends
    %li
      - if current_user.friend_with? user
        = user.email
        |
        You are already friends!
      - elsif current_user.invited? user
        = user.email
        |
        Pending request ...
      - elsif user.invited? current_user
        = user.email
        |
        = link_to "Confirm friend?", friend_path(user), :method => "put"
      - else
        = user.email
        |
        = link_to "Add friend?", friends_path(:user_id => user), :method => "post"
{% endhighlight %}

### create

The create action sends a request to another user to start a friendship through the current_user.invite method.

### update

I'm using the update method only to confirm an invitation that another user sent to the current user with the current_user.approve call.

### requests

The request action spits out all pending invitations from other users. You have the user confirm the friendship with a PUT request to the update method.

{% highlight ruby %}
link_to "Confirm friend?", friend_path(user), :method => "put"
{% endhighlight %}

### invites

This would be pending invitations that the current user sent out to other users. In my view, I let the current user cancel the request by linking to the destroy method.

{% highlight ruby %}
= link_to "Cancel invite?", friend_path(user), :method => "delete"
{% endhighlight %}

### destroy

The destroy method can be used to remove a friend (regardless of how the friendship was created), or to cancel a a pending invite with the `current_user.remove_friendship` method.





