---
layout: post
title: "Alternating UITableViewCell Background Colors"
description: "Alternate the background for an iOS table."
---

To render cells in a `UITableView` so that they have alternating background colors, assign the color to the `backgroundView` property.

Make sure to do it outside of the init conditional. Otherwise, the cells will become the same color once the user starts scrolling around.

<script src="https://gist.github.com/4438822.js"></script>