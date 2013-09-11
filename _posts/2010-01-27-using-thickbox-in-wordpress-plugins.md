---
layout: post
title: "Using Thickbox in WordPress Plugins"
description: "How to use Thickbox in a WordPress plugin; covers loading Thickbox and using jQuery to make it awesome."
---

I have a few qualms about the reliance on Thickbox in the WordPress admin interface. As a plugin developer, I use the modal-box method frequently; it's great for handling all kinds of data asynchronously ... without page refreshes. They keep your file quantities down, and WordPress users are already familiar with how they work.

However, Thickbox is becoming a little antiquated:

* It's no longer maintained (http://jquery.com/demo/thickbox/)
* In the WordPress context, it uses annoying $_GET variables to pass data

<!--break-->

Now that the <a href="http://wordpress.org/development/2010/01/2010-open-source-design/" target="_blank">WordPress interface is being brought towards a more open source model</a>, I hope this is one of things they change. I'd like to see more integration of the <a href="http://jqueryui.com/demos/dialog/" target="_blank">jQuery UI Dialog widget</a>.

Regardless, Thickbox is how it works now; so here's how to use it in a plugin.

### Concept

The most frequent use (I'm saying this with no evidence to support my claim) of any modal box in a plugin is to <em>do something</em> without navigating to another page. For instance, you upload an image through a Thickbox; the page stays current, but an image is uploaded asynchronously through the modal-box.

For this example, let's imagine that it is necessary for a user to decide something: black or white? We want them to open a box, decide, and close the box all from the plugin's interface.

### General Plugin Setup

{% highlight php %}
<?php
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
?>
{% endhighlight %}

Fairly normal. In order to use Thickbox, you need to queue both the script and style respectively. WordPress has these pre-registered for us, so all we need to do is tell it to load with `wp_enqueue_script()` and `wp_enqueue_style()` from the constructor.

### Calling the Thickbox Dialog

In order to actually have the modal-box pop up, it is necessary to do so through the `href` parameter of a link. This is where it gets ugly.

{% highlight php %}
<?php function admin_view() { ?>
{% endhighlight %}

{% highlight html %}
<div class="wrap">
  <h2>Black or White?</h2>
  <p>
    <a class="thickbox button" href="/wp-admin/admin-ajax.php?action=choice&amp;width=150&amp;height=100" title="Choice">
      Choice
    </a>
  </p>
  <p>
    Your choice: <span class="your-choice"></span>
  </p>
</div>
{% endhighlight %}

{% highlight php %}
<?php } ?>
{% endhighlight %}

You need to :

* Declare "thickbox" as one of the link's classes ("button" is nice too)
* Direct the link to: `/wp-admin/admin-ajax.php`
* Give it the following `$_GET` variables
  * <strong>action</strong> - tells WordPress how to handle the AJAX request, or what stuff to load into the Thickbox
  * <strong>width</strong> - the dialog's width in pixels
  * <strong>height</strong> - the dialog's height in pixels

The reason for passing the AJAX request through admin-ajax.php is so we can call one of our plugin functions ... the one for the dialog box content. Back in the constructor, simply tell WordPress to which function it should redirect the AJAX request.

{% highlight php %}
<?php
function __construct() {

  add_action('admin_menu', array(&$this, 'add_admin'));
  add_action("admin_print_scripts", array(&$this, 'js_libs'));
  add_action("admin_print_styles", array(&$this, 'style_libs'));
  add_action('wp_ajax_choice', array(&$this, 'choice'));

}
{% endhighlight %}

Now, when the user clicks "Choose", whatever we have stored in choice() will return within the box.

### In the Thickbox

So far so good, but there is nothing in the modal-box. We need two buttons: <strong>black </strong>and <strong>white</strong>. The dialog box displays whatever is returned from `choice()`. Therefore, that's where the buttons go.

{% highlight php %}
<?php function choice() { ?>
{% endhighlight %}

{% highlight html %}
<p>
  <a class="button choice_button" id="Black">Black</a>
  <a class="button choice_button" id="White">White</a>
</p>
{% endhighlight %}

{% highlight php %}
<?php exit(); } ?>
{% endhighlight %}

Don't forget to `exit()` the function, or you'll get an annoying 0 in the Thickbox. We don't have any `href` info for these links, because we'll be handling their events via jQuery. The goal here is to only have one page, right?

### Some jQuery

{% highlight php %}
<?php function admin_view() { ?>
{% endhighlight %}

{% highlight js %}
<script type="text/javascript">
  jQuery(document).ready(function($) {
    $('.choice_button').live('click',
      function () {
        var choice = $(this).attr('id');
        tb_remove();
        $('.your-choice').html(choice);
      }
    );
  });
</script>
{% endhighlight %}

{% highlight php %}
<?php } ?>
{% endhighlight %}

On the click event of either `choice_button`, we execute a function that returns the user's choice to the main interface.  Use the `live()` method to bind the event, because the buttons were loaded via AJAX.

Removing the Thickbox is much easier than launching it ... simply call the `tb_remove()` function.

### Conclusion

All in all, using the Thickbox in WordPress plugins is not that hard, but it could certainly be easier. Download the full tutorial code here: <a href="/assets/media/black-or-white.php.zip">Black or White?</a>