---
layout: post
title: "Codeigniter: Validating File Uploads"
description: "Validate a form AND file uploads at the same time in Codeigniter by utilizing custom callbacks."
---

I've always found it rather difficult to mash together functionalities in Codeigniter's [form validation](http://codeigniter.com/user_guide/libraries/form_validation.html) and [file upload](http://codeigniter.com/user_guide/libraries/file_uploading.html) classes. The problem is, simply put, that the validation class doesn't handle uploads out of the box. So, if you were to have a form with regular inputs/textareas/radios/selects/etc and file uploads, normally you would:

* Run the form validator, show errors
* If it passed, process the upload, show errors
* If the upload processed, write to the DB, etc.

For me, the ideal situation is to validate everything at once. I've been doing this with [custom validation callbacks](http://codeigniter.com/user_guide/libraries/form_validation.html#callbacks) that handle the upload processing and return any upload errors directly to the form validation class.

<!--break-->

What's nice about this is that you do the entire form processing at the same time, and still have a lot of flexibility in how you process the uploads. For instance, if we had multiple uploads, we can register callbacks for each one to tailer the functionality.

Here's an outline of the process:

* Reigster a custom callback on the upload input
* In the callback, process the upload, and return and errors from the upload class
* Calling `$this->form_validation->run()` on form submission will
  * validate the form
  * upload the file(s)
  * return both form and upload errors to the view

You'll see I also posthumously set a `$_POST` value to the uploaded element's filename. This gives the future processing script access to the filename and store in to the DB. You could also do this through an instance variable, but I like using the `$_POST` array since Doctrine has a very convenient `$record->fromArray($_POST)` method.

Do enjoy.

{% highlight php %}
<?php
class Publish extends CI_Controller {

  function __construct()
  {
    parent::__construct();
    $this->load->helper(array('form', 'html', 'file'));
    $this->load->library('form_validation');

    $config['upload_path']   = './uploads/';
    $config['allowed_types'] = 'gif|jpg|png';
    $this->load->library('upload', $config);

    // some validation configurations ...

    // register a custom callback for the image element
    $this->form_validation->set_rules('image', 'Image', 'callback_handle_upload');
  }

  function index()
  {
    if ($this->form_validation->run() == FALSE)
    {
      $this->load->view('form');
    }
    else
    {
      $this->load->view('success');
    }
  }

  function handle_upload()
  {
    if (isset($_FILES['image']) && !empty($_FILES['image']['name']))
      {
      if ($this->upload->do_upload('image'))
      {
        // set a $_POST value for 'image' that we can use later
        $upload_data    = $this->upload->data();
        $_POST['image'] = $upload_data['file_name'];
        return true;
      }
      else
      {
        // possibly do some clean up ... then throw an error
        $this->form_validation->set_message('handle_upload', $this->upload->display_errors());
        return false;
      }
    }
    else
    {
      // throw an error because nothing was uploaded
      $this->form_validation->set_message('handle_upload', "You must upload an image!");
      return false;
    }
  }

}
{% endhighlight %}