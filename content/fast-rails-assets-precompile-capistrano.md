Precompiling assets on a rails server is way slow. Especially if your dealing with small and micro EC2 instances.

Normally, I would precompile the assets during a `cap deploy` ... maybe precompiling them conditionally if there were not any changes to the assets.

I've been experimenting with a much faster way of doing this where the assets are precompiled locally and then rsynced to my web servers. I mean, I've got this powerful Macbook, why not use it?

Also, I was able get even more speed by using the [turbo sprockets gem](https://github.com/ndbroadbent/turbo-sprockets-rails3). It keeps a manifest of what's already been compiled and only compiles new things. A big performance boost.

<script src="https://gist.github.com/4338134.js"></script>