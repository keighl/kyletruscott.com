---
layout: post
title: "A System Ruby!"
description: ""
---

I was catching up on a few [Changelog](http://thechangelog.com/120/) episodes last week, and heard some great advice on managing ruby versions in deployment environments.

[@postmodern](https://github.com/postmodern), creator and maintainer of [chruby](https://github.com/postmodern/chruby), said essentially, "Don’t use a ruby switcher in production. You don’t need it. Install a system ruby.""

It’s kind of funny coming from a guy who writes a ruby switcher, but he’s totally right. I took a look at my Capistrano recipes and saltstack states, and there was a surprising amount of overhead to using a ruby switcher on production (I’ve been using [rbenv](https://github.com/sstephenson/rbenv) on the 20 or so deployment machines that I manage):

* Every user who needs to run ruby has rbenv installed, configured, and initialized in their dotfiles. Systemwide rbenv configurations are hard.
* Installing gems via your automated tools? Don’t forget to rbenv rehash!
* Any ruby command issued without a shell (e.g via Capistrano) needs to have an explicit `PATH` appended with the rbenv paths/shims
* How often am I updating the ruby version on your servers? Never?

Ruby switchers are really awesome on your development machine, but they clearly get in the way for deployments.

So I took a few minutes to update a cluster of machines to use a system ruby instead of a shimmed one via rbenv. I use [SaltStack](http://www.saltstack.com) to manage infrastructure so it was as easy as something like this to compile and install ruby from source:

{% highlight bash %}
wget -c http://cache.ruby-lang.org/pub/ruby/2.1/ruby-2.1.2.tar.gz
tar xzf ruby-2.1.2.tar.gz
cd ruby-2.1.2
./configure
make
make install
{% endhighlight %}

This could be even easier, most likely, if I used a containerization tool like docker. But regardless, with way less code and overhead I can resolve all the issues listed above.

Thanks to [@postmodern](https://github.com/postmodern) for some good advice!


