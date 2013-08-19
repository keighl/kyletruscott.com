---
layout: post
title: "Introducing Buffet"
description: "A jQuery carousel plugin."
---

I've released a jQuery plugin this week called [Buffet](http://keighl.github.com/buffet); it's a basic carousel that will tick through a number of list by a specified number. It's by no means earth-shattering, but something I reuse throughout my projects at work, and decided to open source it.

* [Demo](http://keighl.github.com/buffet)
* [GitHub Repo](https://github.com/keighl/buffet)
* [Download](https://github.com/keighl/buffet/zipball/master)

Have a look at some code:

<pre class="prettyprint lang-js">
$('#scroll').buffet({
  scroll_by : 3,
  next      : $('#next'),
  prev      : $('#prev')
});
</pre>

<pre class="prettyprint lang-html">
&lt;div id=&quot;scroll_mask&quot;&gt;
  &lt;ul id=&quot;scroll&quot;&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
    &lt;li&gt;..&lt;/li&gt;
  &lt;/ul&gt;
&lt;/div&gt;
&lt;a id=&quot;prev&quot;&gt;&lt;/a&gt;
&lt;a id=&quot;next&quot;&gt;&lt;/a&gt;
</pre>

<pre class="prettyprint lang-css">
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
</pre>

