---
layout: post
title: "Using Thickbox in WordPress Plugins"
description: "How to use Thickbox in a WordPress plugin; covers loading Thickbox and using jQuery to make it awesome."
---

I have a few qualms about the reliance on Thickbox in the WordPress admin interface. As a plugin developer, I use the modal-box method frequently; it's great for handling all kinds of data asynchronously ... without page refreshes. They keep your file quantities down, and WordPress users are already familiar with how they work.

However, Thickbox is becoming a little antiquated:

* It's no longer maintained (http://jquery.com/demo/thickbox/)
* In the WordPress context, it uses annoying $_GET variables to pass data

Now that the <a href="http://wordpress.org/development/2010/01/2010-open-source-design/" target="_blank">WordPress interface is being brought towards a more open source model</a>, I hope this is one of things they change. I'd like to see more integration of the <a href="http://jqueryui.com/demos/dialog/" target="_blank">jQuery UI Dialog widget</a>.

Regardless, Thickbox is how it works now; so here's how to use it in a plugin.

### Concept

The most frequent use (I'm saying this with no evidence to support my claim) of any modal box in a plugin is to <em>do something</em> without navigating to another page. For instance, you upload an image through a Thickbox; the page stays current, but an image is uploaded asynchronously through the modal-box.

For this example, let's imagine that it is necessary for a user to decide something: black or white? We want them to open a box, decide, and close the box all from the plugin's interface.

### General Plugin Setup

<pre class="prettyprint lang-php">
&lt;?php
/*
Plugin Name: Black or White?
Plugin URI: http://www.keighl.com/
Description: You choose.
Version: 0.1
Author: Kyle Truscott
Author URI: http://keighl.com
*/

$BlackOrWhite = new BlackOrWhite();

class BlackOrWhite {

  function __construct() {
    add_action('admin_menu', array(&$this, 'add_admin'));
    add_action("admin_print_scripts", array(&$this, 'js_libs'));
    add_action("admin_print_styles", array(&$this, 'style_libs'));
  }

  function add_admin() {
    add_theme_page('BlackOrWhite', 'BlackOrWhite', 'administrator', 'black-or-white', array(&$this, 'admin_view'));
  }

  function js_libs() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('thickbox');
  }

  function style_libs() {
    wp_enqueue_style('thickbox');
  }

  function admin_view() {}

  function choice() {}

}
?&gt;
</pre>

Fairly normal. In order to use Thickbox, you need to queue both the script and style respectively. WordPress has these pre-registered for us, so all we need to do is tell it to load with <code>wp_enqueue_script()</code> and <code>wp_enqueue_style()</code> from the constructor.

### Calling the Thickbox Dialog

In order to actually have the modal-box pop up, it is necessary to do so through the <code>href</code> parameter of a link. This is where it gets ugly.

<pre class="prettyprint lang-php">
&lt;?php function admin_view() { ?&gt;
</pre>

<pre class="prettyprint lang-html">
&lt;div class=&quot;wrap&quot;&gt;
  &lt;h2&gt;Black or White?&lt;/h2&gt;
  &lt;p&gt;
    &lt;a class=&quot;thickbox button&quot; href=&quot;/wp-admin/admin-ajax.php?action=choice&amp;width=150&amp;height=100&quot; title=&quot;Choice&quot;&gt;
      Choice
    &lt;/a&gt;
  &lt;/p&gt;
  &lt;p&gt;
    Your choice: &lt;span class=&quot;your-choice&quot;&gt;&lt;/span&gt;
  &lt;/p&gt;
&lt;/div&gt;
</pre>

<pre class="prettyprint lang-php">
&lt;?php } ?&gt;
</pre>

You need to :

* Declare "thickbox" as one of the link's classes ("button" is nice too)
* Direct the link to: <code>/wp-admin/admin-ajax.php</code>
* Give it the following <code>$_GET</code> variables
  * <strong>action</strong> - tells WordPress how to handle the AJAX request, or what stuff to load into the Thickbox
  * <strong>width</strong> - the dialog's width in pixels
  * <strong>height</strong> - the dialog's height in pixels

The reason for passing the AJAX request through admin-ajax.php is so we can call one of our plugin functions ... the one for the dialog box content. Back in the constructor, simply tell WordPress to which function it should redirect the AJAX request.

<pre class="prettyprint lang-php">
function __construct() {

  add_action('admin_menu', array(&$this, 'add_admin'));
  add_action("admin_print_scripts", array(&$this, 'js_libs'));
  add_action("admin_print_styles", array(&$this, 'style_libs'));
  add_action('wp_ajax_choice', array(&$this, 'choice'));

}
</pre>

Now, when the user clicks "Choose", whatever we have stored in choice() will return within the box.

### In the Thickbox

So far so good, but there is nothing in the modal-box. We need two buttons: <strong>black </strong>and <strong>white</strong>. The dialog box displays whatever is returned from <code>choice()</code>. Therefore, that's where the buttons go.

<pre class="prettyprint lang-php">
&lt;?php function choice() { ?&gt;
</pre>

<pre class="prettyprint lang-html">
&lt;p&gt;
  &lt;a class=&quot;button choice_button&quot; id=&quot;Black&quot;&gt;Black&lt;/a&gt;
  &lt;a class=&quot;button choice_button&quot; id=&quot;White&quot;&gt;White&lt;/a&gt;
&lt;/p&gt;
</pre>

<pre class="prettyprint lang-php">
&lt;?php exit(); } ?&gt;
</pre>

Don't forget to <code>exit()</code> the function, or you'll get an annoying 0 in the Thickbox. We don't have any <code>href</code> info for these links, because we'll be handling their events via jQuery. The goal here is to only have one page, right?

### Some jQuery

<pre class="prettyprint lang-php">
&lt;?php function admin_view() { ?&gt;
</pre>

<pre class="prettyprint lang-js">
&lt;script type=&quot;text/javascript&quot;&gt;
  jQuery(document).ready(function($) {
    $('.choice_button').live('click',
      function () {
        var choice = $(this).attr('id');
        tb_remove();
        $('.your-choice').html(choice);
      }
    );
  });
&lt;/script&gt;
</pre>

<pre class="prettyprint lang-php">
&lt;?php } ?&gt;
</pre>

On the click event of either <code>choice_button</code>, we execute a function that returns the user's choice to the main interface.  Use the <code>live()</code> method to bind the event, because the buttons were loaded via AJAX.

Removing the Thickbox is much easier than launching it ... simply call the <code>tb_remove()</code> function.

### Conclusion

All in all, using the Thickbox in WordPress plugins is not that hard, but it could certainly be easier. Download the full tutorial code here: <a href="/assets/media/black-or-white.php.zip">Black or White?</a>