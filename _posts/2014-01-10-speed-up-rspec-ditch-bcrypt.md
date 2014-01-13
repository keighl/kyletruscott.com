---
layout: post
title: "Speed up RSpec. Ditch bcrypt."
description: "In your test suite, don't use bcrypt to hash passwords. Way to slow! Use something like md5 in your tests for a runtime boost."
---

At [Clambake](http://clambakeapp.com), we have an RSpec test suite of about 650 cases. The runtime for the whole suite has grown to about 4 minutes. The sheer amount of time spent waiting for them to finish was discouraging me from writing new tests.

I did some googling around, and discovered a fairly obvious reason why the tests are so slow: [bcrypt](http://en.wikipedia.org/wiki/Bcrypt)

For every user factory generated in the tests (via [factory_girl](https://github.com/thoughtbot/factory_girl)) the password is salted and hashed using bcrypt. The bcrypt algorithm is purposely slow and difficult for CPUs in order to make brute force attacks incredibly hard. But a test suite is kind of like a brute force attack on your software. As fast as it can, it creates hundreds of users (along with other models) to break your system.

It’s clear that bcrypt is a problem when you’re more concerned with speed then security... for instance, while testing.

Our core user model uses [sorcery](https://github.com/NoamB/sorcery) for password salting and hashing. By default, it uses bcrypt but ships with a handful of other [crypto-providers](https://github.com/NoamB/sorcery/tree/master/lib/sorcery/crypto_providers). I changed the sorcery default to md5 (really fast hashing, but susceptible to brute force).

{% highlight objc %}
Rails.application.config.sorcery.configure do |config|
  config.user_config do |user|
    user.encryption_algorithm = :md5 if Rails.env.test?
  end
end
{% endhighlight %}

Just that one change took the RSpec runtime down from around 3 minutes to about **45 seconds on my 8GB i7 MacBook Air.**

**With bcrypt:**

{% highlight bash %}
$ bundle exec rspec -p

Finished in 3 minutes 40.8 seconds
659 examples, 0 failures, 16 pending
{% endhighlight%}

**With md5:**

{% highlight bash %}
$ bundle exec rspec -p

Finished in 45.83 seconds
659 examples, 0 failures, 16 pending
{% endhighlight %}

I found a couple other tips, including [calming down ruby’s garbage collector,](https://gist.github.com/linjian/3141510) which earned me a few more seconds. But using a faster password hashing algorithm in the test environment is a super easy way to see noticeable performance improvements.

