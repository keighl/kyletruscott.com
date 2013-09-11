---
layout: post
title: "Nonce and AJAX"
description: "Verify data passed through an AJAX request using the WordPress Nonce system. Not hard!"
---

In the WordPress plugin API, <a href="http://codex.wordpress.org/WordPress_Nonces" target="_blank">Nonce</a> is a way to verify that data passed to/from a plugin is from a trusted source. <a href="http://markjaquith.wordpress.com/2006/06/02/wordpress-203-nonces/" target="_blank">Mark Jaquith</a> can explain this better than I can:

<blockquote>"A nonce is a <strong>n</strong>umber used <strong>once</strong>, and it  is used for intention verification purposes in WordPress.  Think of it  as a password that changes each time it is used. [...] The idea is simple: we verify that user’s request is intentional by  verifying that the request originates from within the WordPress admin."</blockquote>

<!--break-->

WordPress ships with a handful of convenient functions that help you create and verify Nonces. They are chiefly designed for synchronous use, or where data is passed from one web page to another using an HTTP request. You create a nonce in your initial form using `wp_nonce_field()` and then verify that nonce is correct in the method that handles the form with `check_admin_referer()`. It's fairly straight forward and well documented.

However, what if you want to secure your AJAX (asynchronous) transaction with Nonce? With a simple glance at the code, an evil-doer could still send some irresponsible data to your plugin. You can approach the problem with the same theoretical mindset as a normal nonce: pass a code, check it, carry on. The main difference here is how we pass the nonce code.

Let's imagine we have a very simple bulletin plugin that allows a registered user to type a note and post it without a page refresh. First, set up the basic plugin stuff.

{% highlight php %}
$QuickNotes = new QuickNotes();

class QuickNotes {

  function QuickNotes() {
    add_action('admin_menu', array(&$this, 'add_note_page'));
    add_action("admin_print_scripts", array(&$this, 'js_libs'));
    add_action('wp_ajax_quicknotes_add', array(&$this, 'add'));
  }

  function add_note_page() {
    add_theme_page('Quick Notes', 'Quick Notes', 'administrator', 'quick_notes', array(&$this, 'notes'));
  }

  function js_libs() {
    wp_enqueue_script('jquery');
  }

  function notes() {

    if ( function_exists('wp_nonce_field'))
      wp_nonce_field('quicknotes_nonce', 'quicknotes_nonce');

    ?>

    <div class="wrap">
      <h2>Quick Notes</h2>
      <ul id="note_board"></ul>
      <p>
        <textarea id="note"></textarea>
        <a class="button" id="add_note">Add Note</a>
      </p>
    </div>

    <?php

  }

  function add() {

  }

}
{% endhighlight %}

As a quick overview, here's what has happened so far:

  * We added an option page under Appearance that returns the 'form' held in the `notes()` method.
  * Queued the <a href="http://jquery.com/" target="_blank">jQuery</a> library (good for AJAXing)
  * Mapped an AJAX request using `wp_ajax_` (action => `quicknotes_add()`, callback => `add()`)
    * This allows us to use a method within our plugin to handle the AJAX request, as opposed to a separate web page.
  * Created a Nonce to use called `quicknotes_nonce`.

Now let's set up the actual AJAX request with jQuery so the user can add the note without a page refresh. Using the `$.post` method, we'll send the values for both the note <em><strong>and</strong></em> the nonce when the 'Add' button is clicked. Finally, the note is pasted back to note board.

{% highlight php %}
<?php function notes() { ?>
{% endhighlight %}

{% highlight js %}
jQuery(document).ready(function($) {
  $('#add_note').live('click',
    function () {
      note = $("#note").val();
      nonce = $("input#quicknotes_nonce").val();
      $.post(
        "/wp-admin/admin-ajax.php",
        {
          action:"quicknotes_add",
          note : note,
          nonce : nonce
        },
        function (str) {
          $('ul#note_board').html(str);
        }
      );
    }
  );
});
{% endhighlight %}

{% highlight php %}
<?php } // notes() ?>
{% endhighlight %}

So, the nonce is now being passed as a `$_POST` parameter just like standard operating procedure. Next, assert the validity of the nonce in the `add()` method. If the nonce is correct, move on to inserting the note into the database, or just echo it back to the list.

{% highlight php %}
<?php
function add() {

  if (!wp_verify_nonce($_POST['nonce'], 'quicknotes_nonce'))
    exit();

  echo '<li>' . $_POST['note'] . '</li>';
  exit();

}
{% endhighlight %}

That's it! <a href="/assets/media/quick_notes.php.zip">Download the entire example. </a>