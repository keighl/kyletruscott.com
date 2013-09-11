---
layout: post
title: "Switching Visual/HTML Modes With TinyMCE"
description: "A simple way to turn the rich-editor on and off in your WordPress plugin, and allow users to edit the HTML."
---

One of the greatest parts of the WordPress interface is the flexibility it gives us from within the editing screen. As a user, I can write this post using the rich-editor (<a href="http://tinymce.moxiecode.com/" target="_blank">TinyMCE</a>), or switch to <em>HTML</em> mode to edit the markup directly. I've received a handful of comments on my previous post regarding <a href="/posts/tinymce-in-wordpress-plugins/">TinyMCE in WordPress Plugins</a> asking how to go about incorporating this flexibility into plugins.

<!--break-->

TinyMCE has a few built-in methods that allow you to turn the editor on and off; essentially this is all you have to do to switch between the two modes. It is not, however, a second interface. The WordPress editor actually has two rich-editors: one for <em>Visual</em>, and one for <em>HTML</em>. Instead of turning  off TinyMCE, WordPress merely switches the rich-editors. That's why you see those nice formatting buttons even through, you're in <em>HTML</em> mode. Accomplishing that type of functionality is difficult. You can see the complexity of the custom `switchEditors` method in <a href="http://core.trac.wordpress.org/browser/trunk/wp-admin/js/editor.dev.js" target="_blank">editor.dev.js</a>.

Too much to cover. For now, I will simply show you how to turn the rich-editor on and off. First, set up a basic TinyMCE editor. This code builds of my other <a href="/posts/tinymce-in-wordpress-plugins/">post</a>. There you can find a more complete description of what's going on. In short, though, `wp_tiny_mce()` does all the initialization for you, and queues it on the page. This example could exist on a <a href="http://codex.wordpress.org/Creating_Options_Pages" target="_blank">plugin options page</a>, the profile editor, a <a href="http://codex.wordpress.org/Function_Reference/add_meta_box" target="_blank">post metabox</a>, or really anywhere you want users to rich-edit.

{% highlight php %}
<?php
wp_tiny_mce(false, // true makes the editor "teeny"
	array(
	"editor_selector" => "foo",
	"height" => 150
	)
);
{% endhighlight %}

{% highlight html %}
<textarea class="foo" id="foo" name="foo"></textarea>
{% endhighlight %}

Although you must setup the editor for your plugin using `wp_tiny_mce()`, the regular TinyMCE methods are all available to call from some custom JavaScript. The ones you want to be concerned with are <a href="http://wiki.moxiecode.com/index.php/TinyMCE:Commands" target="_blank">`mceAddControl`</a> and <a href="http://wiki.moxiecode.com/index.php/TinyMCE:Commands" target="_blank">`mceRemoveControl`</a>. If you spent any time digging through editor.dev.js, you would notice that the complex WordPress switcher still uses these methods.

Above the textarea, stick some links that will act as our switchboard:

{% highlight html %}
<p align="right">
	<a class="button toggleVisual">Visual</a>
	<a class="button toggleHTML">HTML</a>
</p>
<textarea class="foo" id="foo" name="foo"></textarea>
{% endhighlight %}

Now, write some simple jQuery that adds the switching functionality. You could <a href="http://codex.wordpress.org/Function_Reference/wp_enqueue_script">enqueue</a> this as a separate file, or place it with the textarea.

{% highlight js %}
var id = 'foo';

$('a.toggleVisual').click(
	function() {
		tinyMCE.execCommand(‘mceAddControl’, false, id);
	}
);

$('a.toggleHTML').click(
	function() {
		tinyMCE.execCommand(‘mceRemoveControl’, false, id);
	}
);
{% endhighlight %}

The buttons now add or remove the rich-editor respectively. You will notice that, when in <em>HTML</em> mode, the textarea resolves to a very small box. To combat this problem, simply give it some rows and cols markup, or style it with CSS.

Another route in you could take  is a <strong>single button</strong> that toggles the editor on or off. I use this in my <a href="http://wordpress.org/extend/plugins/tinymce-signature/">TinyMCE Signature</a> plugin. It's not terribly different; just add some logic.

{% highlight js %}
$('a.toggleEditor').click(
	function() {
		var id = 'foo';
		if (tinyMCE.get(id)) {
			tinyMCE.execCommand('mceRemoveControl', false, id);	}
		else {
			tinyMCE.execCommand('mceAddControl', false, id);
		}
	}
);
{% endhighlight %}