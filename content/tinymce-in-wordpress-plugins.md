Unlike some of the other JavaScript assets available to plugin developers through <a href="http://codex.wordpress.org/Function_Reference/wp_enqueue_script"><code>wp_enqueue_script()</code></a>, getting <a href="http://tinymce.moxiecode.com/">TinyMCE</a> to function in your plugin is a little different. You would perhaps expect to use it like this:

<pre class="prettyprint lang-php">
&lt;?php
add_action("admin_print_scripts", "js_libs");
function js_libs() {
	wp_enqueue_script('tiny_mce');
}
?&gt;
</pre>

<pre class="prettyprint lang-js">
tinyMCE.init({
	mode : "exact",
	elements: "a_nice_textarea",
	theme : "simple"
});
</pre>

<pre class="prettyprint lang-html">
&lt;textarea id=&quot;a_nice_textarea&quot; name=&quot;a_nice_textarea&quot;&gt;&lt;/textarea&gt;
</pre>

However, enqueuing the TinyMCE really won't get you any results. You need to use the <code>wp_tiny_mce()</code> function, which is not well documented. Essentially, the function pre-constructs the TinyMCE for you, and you override its default options. The main option to override is <code>editor_selector</code> which points TinyMCE at a specific textarea <code><strong>class</strong></code>.

<pre class="prettyprint lang-php">
wp_tiny_mce( false , // true makes the editor "teeny"
	array(
		"editor_selector" => "a_nice_textarea"
	)
);
</pre>

<pre class="prettyprint lang-html">
&lt;textarea class=&quot;a_nice_textarea&quot; id=&quot;a_nice_textarea&quot; name=&quot;a_nice_textarea&quot;&gt;&lt;/textarea&gt;
</pre>

You can stick this anywhere you want, and it will work (for the most part). All the available configuration options for TinyMCE can be determined by referencing it within the array. WordPress has a bunch of them determined by default for the post content editor; most of them are fine as is.

<pre class="prettyprint lang-php">
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
</pre>

For a closer look at <code>wp_tiny_mce()</code>, <a href="http://core.trac.wordpress.org/browser/trunk/wp-admin/includes/post.php">check out the source</a>.

For incorporating the <em>Visual</em>/<em>HTML</em> mode switcher, and turning TinyMCE on and off, see <a href="/post/switching-visualhtml-modes-with-tinymce/">Switching Visual/HTML Modes With TinyMCE</a>.