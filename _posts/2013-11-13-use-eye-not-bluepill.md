---
layout: post
title: "Use Eye, Not Bluepill"
description: "Bluepill isn’t actively maintained and generally doesn’t work (ask discourse). Eye is another ruby-based process manager with a similar DSL... and it does work."
---

**Bluepill isn’t actively maintained and generally doesn’t work ([ask discourse](http://meta.discourse.org/t/Bluepill-not-working-100/8202/39)). [Eye](https://github.com/kostya/eye) is another ruby-based process manager with a similar DSL... and it does work!**

I spent most of yesterday wrangling with my AWS infrastructure and deployment configuration. My current setup for [Clambake](http://clambakeapp.com/get-it) is entirely managed by Capistrano. I’m splitting off the instance management and configuration to be handled by [SaltStack](http://www.saltstack.com/community/) (which is awesome, by the way).

I figured I might as well also switch to a more robust process management tool instead of a simple [Foreman](https://github.com/ddollar/foreman) export to Upstart. I had read a bit about [Bluepill](https://github.com/bluepill-rb/bluepill), and decided that’s what I would go with.

However, Bluepill straight-up doesn’t work. I had some really simple requirements: daemonize a couple rake tasks, start/stop unicorn, start/stop delayed_job. I’m pretty sure I was using it in a boilerplate fashion, and I understand unix processes and signals (for the most part). Bluepill would start processes, but couldn’t stop them, and will sometimes respawn itself and I’d have 3-4 Bluepill daemons at once.

After wrestling with it for no fewer than 6 hours, I found a [thread on the Discourse forum](http://meta.discourse.org/t/bluepill-not-working-100/8202/39). They are having identical issues with Bluepill. I learned from the thread that Bluepill is no longer maintained and is generally busted. Discourse is looking to [drop it](http://meta.discourse.org/t/bluepill-not-working-100/8202/33).

In the thread, someone randomly recommended [Eye](https://github.com/kostya/eye). It’s another ruby-based process manager, and has a similar DSL to Bluepill. I gave it a whirl.

<!--break-->

It took about 5 minutess to rejigger my Bluepill configs to be Eye configs. I loaded it up on my servers, and it worked perfectly right out of the box. I was amazed. It starts and stops my processes quickly and easily. Unicorn rolling restarts are dead simple. Plus it has all the memory/CPU/etc checks that you would expect.

So here’s the point: **Ditch Bluepill, and switch to Eye. It actually works!**

Here’s an example Eye config:

{% highlight ruby %}

# staging.eye

Eye.config do
  logger "/home/example/eye/eye.log"
end

Eye.application("example") do |app|

  group "services" do

    process :unicorn do
      working_dir '/home/example/dev.api.example.com'
      pid_file "tmp/pids/unicorn.pid"
      stdall "log/eye-unicorn.log"
      start_command   "bundle exec unicorn -c ./unicorn.rb -D"
      stop_command    "kill -QUIT {{PID}}"
      restart_command "kill -USR2 {{PID}}" # for rolling restarts
    end

    process :delayed_job do
      working_dir '/home/example/dev.api.example.com'
      pid_file "tmp/pids/delayed_joby.pid"
      start_command "bundle exec rake jobs:work"
      daemonize true
      stdall "log/eye-delayed_job.log"
    end
  end
end
{% endhighlight %}

{% highlight bash %}
$ eye load staging.eye
{% endhighlight %}

{% highlight bash %}
$ eye start all
{% endhighlight %}