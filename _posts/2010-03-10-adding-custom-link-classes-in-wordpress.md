---
layout: post
title: "Adding Custom Link Classes in WordPress"
description: "Add special class to the available list under 'Insert/edit Link' button. Good for plugin and theme developers."
---

Most AJAX-ing and general-web-awesomeness is driven by CSS selectors. For instance, a lightbox pops up exclusively on links with a class of `lightbox`. For a plugin or theme developer, if you're application requires selectors like this, it's best to assume that the users cannot do this on their own. What I mean is this: give them a simple way to add the selector without and hand-coding.

A fine way to do this is via the class setting found under <strong>Insert/edit Link</strong>. Through a plugin or a theme, you can set specific classes from which the user can choose. Use the `tiny_mce_before_init` hook that WordPress provides. It works by declaring some extra classes that are added to the mega array of TinyMCE settings.

<!--break-->

Drop this in your <strong>functions.php</strong> file, or in your plugin:

{% highlight php %}
<?php

add_filter('tiny_mce_before_init', 'add_lightbox_classes');

function add_lightbox_classes($initArray) {

	$initArray['theme_advanced_styles'] = "Lightbox=lightbox;iFrame=iframe";
	return $initArray;

}

?>
{% endhighlight %}

There is a problem with this, though! By using the `tiny_mce_before_init` hook you effectively replace the normal ones like: <em>aligncenter, alignleft, etc</em>. If you examine how the normal ones are generated, you'll find they are not included in the filter. They are fed in through another javascript object. If WordPress sees that there is something other than nothing in the `theme_advanced_styles` key, it replaces everything.

So, if you want to keep the normal ones you need to redo them in your hook function. I should probably submit a core patch that addresses this.