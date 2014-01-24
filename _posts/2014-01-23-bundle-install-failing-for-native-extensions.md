---
layout: post
title: "Bundle install failing on native extensions.. but gem install works?"
description: "If you have bundler failing for no apparent reason... Make sure you have enough resources on the machine. Specifically shut down memory intensive processes like in memory stores."
---

I had a terrible time trying installing gems with bundler into a new staging environment yesterday (a few EC2 micro instances). My issue was that certain gems with native extensions like nokigiri, or bcrypt-ruby would fail. I was getting fairly ambiguous errors like this;

    Gem::Installer::ExtensionBuildError: ERROR: Failed to build gem native extension.

        /home/ubuntu/.rbenv/versions/2.0.0-p247/bin/ruby extconf.rb

    Gem files will remain installed in /home/ubuntu/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/nokogiri-1.5.11 for inspection.
    Results logged to /home/ubuntu/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/nokogiri-1.5.11/ext/nokogiri/gem_make.out

    An error occurred while installing nokogiri (1.5.11), and Bundler cannot
    continue.
    Make sure that `gem install nokogiri -v '1.5.11'` succeeds before bundling.

It instructs us to go ahead and try to `gem install` the gems directly. Interestingly, that would work. I could install nokigiri without a problem via `gem install`... It only failed during `bundle install`.

Another thing to note is that two of these servers were twins. By that I mean they were spawned from the same AMI and have all required packages installed (libxml, libsqlite, etc). One of them was working, and the other was failing on `bundle install`.

This was kind of baffling me, but then I realized there was one difference between them. The working one is an app server running nginx. The broken one is a worker instance without nginx, but does provide an elasticsearch server.

The elasticsearch instance by default, I noticed, does take up a lot of the EC2 micro instances memory.

    13466 elastics  20   0 1915m 157m  12m S  0.3 26.7   0:06.32 java

I tried shutting down the search server and ran `bundle install` again. All the gems were installed successfully.

Without looking into it further, I've reasoned that the bundler ruby process, plus the native gem extensions being compiled is just too much for this little server whilst running an in-memory store. However, regular old `gem install` is OK.

**The takeaway:** if you have bundler failing for no apparent reason... Make sure you have enough resources on the machine. Specifically shut down memory intensive processes like in memory stores.
