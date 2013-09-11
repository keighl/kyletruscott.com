---
layout: post
title: "TinyMCE in WordPress Plugins"
description: "In order to use TinyMCE from a WordPress plugin, use wp_tiny_mce(), and override the defaults."
---

Unlike some of the other JavaScript assets available to plugin developers through <a href="http://codex.wordpress.org/Function_Reference/wp_enqueue_script">`wp_enqueue_script()`</a>, getting <a href="http://tinymce.moxiecode.com/">TinyMCE</a> to function in your plugin is a little different. You would perhaps expect to use it like this:

<!--break-->

{% highlight php %}
<?php
add_action("admin_print_scripts", "js_libs");
function js_libs() {
	wp_enqueue_script('tiny_mce');
}
?>
{% endhighlight %}

{% highlight js %}
tinyMCE.init({
	mode : "exact",
	elements: "a_nice_textarea",
	theme : "simple"
});
{% endhighlight %}

{% highlight html %}
<textarea id="a_nice_textarea" name="a_nice_textarea"></textarea>
{% endhighlight %}

However, enqueuing the TinyMCE really won't get you any results. You need to use the `wp_tiny_mce()` function, which is not well documented. Essentially, the function pre-constructs the TinyMCE for you, and you override its default options. The main option to override is `editor_selector` which points TinyMCE at a specific textarea class.

{% highlight php %}
<?php
wp_tiny_mce( false , // true makes the editor "teeny"
	array(
		"editor_selector" => "a_nice_textarea"
	)
);
{% endhighlight %}

{% highlight html %}
<textarea class="a_nice_textarea" id="a_nice_textarea" name="a_nice_textarea"></textarea>
{% endhighlight %}

You can stick this anywhere you want, and it will work (for the most part). All the available configuration options for TinyMCE can be determined by referencing it within the array. WordPress has a bunch of them determined by default for the post content editor; most of them are fine as is.

{% highlight php %}
<?php
// TinyMCE init settings
$initArray = array (
	'mode'                              => 'none',
	'onpageload'                        => 'switchEditors.edInit',
	'width'                             => '100%',
	'theme'                             => 'advanced',
	'skin'                              => 'wp_theme',
	'theme_advanced_buttons1'           => "$mce_buttons",
	'theme_advanced_buttons2'           => "$mce_buttons_2",
	'theme_advanced_buttons3'           => "$mce_buttons_3",
	'theme_advanced_buttons4'           => "$mce_buttons_4",
	'language'                          => "$mce_locale",
	'spellchecker_languages'            => "$mce_spellchecker_languages",
	'theme_advanced_toolbar_location'   => 'top',
	'theme_advanced_toolbar_align'      => 'left',
	'theme_advanced_statusbar_location' => 'bottom',
	'theme_advanced_resizing'           => true,
	'theme_advanced_resize_horizontal'  => false,
	'dialog_type'                       => 'modal',
	'relative_urls'                     => false,
	'remove_script_host'                => false,
	'convert_urls'                      => false,
	'apply_source_formatting'           => false,
	'remove_linebreaks'                 => true,
	'paste_convert_middot_lists'        => true,
	'paste_remove_spans'                => true,
	'paste_remove_styles'               => true,
	'gecko_spellcheck'                  => true,
	'entities'                          => '38,amp,60,lt,62,gt',
	'accessibility_focus'               => true,
	'tab_focus'                         => ':prev,:next',
	'content_css'                       => "$mce_css",
	'save_callback'                     => 'switchEditors.saveCallback',
	'wpeditimage_disable_captions'      => $no_captions,
	'plugins'                           => "$plugins"
);
{% endhighlight %}

For a closer look at `wp_tiny_mce()`, <a href="http://core.trac.wordpress.org/browser/trunk/wp-admin/includes/post.php">check out the source</a>.

For incorporating the <em>Visual</em>/<em>HTML</em> mode switcher, and turning TinyMCE on and off, see <a href="/post/switching-visualhtml-modes-with-tinymce/">Switching Visual/HTML Modes With TinyMCE</a>.