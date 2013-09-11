---
layout: post
title: "Secure API Request From iOS to Rails"
description: "Use basic hashing to ensure that an iOS/RestKit request is actually coming from your app."
---

Here's a [gist](https://gist.github.com/4336694) for securing API transactions from an iOS application to your Rails backend. When you don't need to be a robust OAuth provider, I think this works pretty well.

Each user does have an auth token, but they can't do anything without knowing the secret key that only the app and rails layer know.

At the rails endpoint it expects a clean version of the user's auth token and also a hashed version using the secret key. This way rails can be sure the request came from a trusted source. The iOS example connects to the server via RestKit.

<!--break-->

<script src="https://gist.github.com/4336694.js"></script>