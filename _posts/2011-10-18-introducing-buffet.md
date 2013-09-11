---
layout: post
title: "Introducing Buffet"
description: "A jQuery carousel plugin."
---

I've released a jQuery plugin this week called [Buffet](http://keighl.github.com/buffet); it's a basic carousel that will tick through a number of list by a specified number. It's by no means earth-shattering, but something I reuse throughout my projects at work, and decided to open source it.

* [Demo](http://keighl.github.com/buffet)
* [GitHub Repo](https://github.com/keighl/buffet)
* [Download](https://github.com/keighl/buffet/zipball/master)

<!--break-->

Have a look at some code:

{% highlight js %}
$('#scroll').buffet({
  scroll_by : 3,
  next      : $('#next'),
  prev      : $('#prev')
});
{% endhighlight %}

{% highlight html %}
<div id="scroll_mask">
  <ul id="scroll">
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
    <li>..</li>
  </ul>
</div>
<a id="prev"></a>
<a id="next"></a>
{% endhighlight %}

{% highlight css %}
#scroll_mask {
  position:relative;
  overflow:hidden;
  width:620px;
  height:140px;
  margin:0 auto;
}

ul#scroll {
  margin:0;
  padding:0;
  position:absolute;
  width:9999em;
  height:140px;
  list-style-type:none;

}

ul#scroll li {
  float:left;
  width:140px;
  height:140px;
  margin:0 20px 0 0;
  background-color:pink;
}

a.inactive {
  display:none;
}
{% endhighlight %}

