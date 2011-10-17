<a href="http://expressionengine.com/">ExpressionEngine</a> is a great tool for managing any kind of content. A feature users depend on, regardless of whether the application is a simple blog or otherwise, is a mini-calendar. It enables them to quickly shuffle through archives or posts. Thankfully, EE has a nice built in calendar module known as <a href="http://expressionengine.com/docs/modules/weblog/calendar.html"><code>{exp:weblog:calendar}</code></a>. It's great at returning one month's worth of links, but cycling through to another month (past or previous) takes the user by default to a respective archive page. Now, the user must shift mental gears, and hunt for the info in a new way; ideally, they should be able to cycle through all the months without leaving the calendar or their current page.

With a little help from <a href="http://jquery.com/">jQuery</a> and AJAX, it's not a difficult procedure. Essentially, we will create a separate EE template that dynamically generates a calendar, and load it in to another template passing some <code>$_POST</code> variables. When the users clicks "Next Month," the calendar is regenerated without a page refresh.

### Calendar Template<

First, create a new EE template <code>lib/calendar</code>, or whatever you'd like to call it. Be sure to set the <a href="http://expressionengine.com/docs/templates/php_templates.html">PHP parsing stage to <strong>input</strong></a>. As you can see, the month, year and weblog parameters for the calendar tag are being dynamically accepted from the <code>$_POST</code> array.

<pre class="prettyprint lang-php">
&lt;?php
$weblog =	 $_POST['weblog'];
if (isset($_POST['month'])) :
	$month = $_POST['month'];
	$year = $_POST['year'];
else :
	$month = date('m');
	$year = date('Y');
endif;
?&gt;
</pre>

<pre class="prettyprint lang-html">
{exp:weblog:calendar weblog=&quot;&lt;?php echo $weblog;?&gt;;&quot; switch=&quot;calendarToday|calendarCell&quot; month=&quot;&lt;?php echo $month; ?&gt;;&quot; year=&quot;&lt;?php echo $year; ?&gt;;&quot;}
	&lt;table class=&quot;calendar&quot; border=&quot;0&quot; cellpadding=&quot;4&quot; cellspacing=&quot;0&quot;&gt;;
		&lt;tr&gt;
			&lt;th class=&quot;calendarHeader&quot;&gt;
				&lt;a href=&quot;&quot; alt=&quot;{previous_date format=&quot;%m&quot;}&quot; class=&quot;{previous_date format=&quot;%Y&quot;}&quot;&gt;;&amp;amp;lt;&lt;/a&gt;
			&lt;/th&gt;
			&lt;th class=&quot;calendarHeader&quot; colspan=&quot;5&quot;&gt;;{date format=&quot;%F %Y&quot;}&lt;/th&gt;
			&lt;th class=&quot;calendarHeader&quot;&gt;
			  &lt;a href=&quot;&quot; alt=&quot;{next_date format=&quot;%m&quot;}&quot; class=&quot;{next_date format=&quot;%Y&quot;}&quot;&gt;;&amp;amp;gt;&lt;/a&gt;
			&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			{calendar_heading}
			  &lt;td class=&quot;calendarDayHeading&quot;&gt;;{lang:weekday_abrev}&lt;/td&gt;
			{/calendar_heading}
		&lt;/tr&gt;
		{calendar_rows }
			{row_start}&lt;tr&gt;{/row_start}
				{if entries}
					{entries}
						&lt;td class=&#x27;{switch} calentry&#x27; align=&#x27;center&#x27;&gt;
							&lt;a href=&quot;{day_path=&lt;?php echo $section;?&gt;;/index}&quot;&gt;;{day_number}&lt;/a&gt;
						&lt;/td&gt;
					{/entries}
				{/if}
				{if not_entries}
					&lt;td class=&#x27;{switch}&#x27; align=&#x27;center&#x27;&gt;;{day_number}&lt;/td&gt;
				{/if}
				{if blank}
					&lt;td class=&#x27;calendarBlank&#x27;&gt;;&amp;amp;nbsp;&lt;/td&gt;
				{/if}
			{row_end}&lt;/tr&gt;{/row_end}
		{/calendar_rows}
	&lt;/table&gt;
{/exp:weblog:calendar}
</pre>

### Javascript

For the user page, where the calendar is to be displayed, first load the jQuery core. Also, create an empty <code>div</code> with an <code>id</code> of "calendar" somewhere on the page.

<pre class="prettyprint lang-html">
&lt;script type=&quot;text/javascript&quot; src=&quot;http://code.jquery.com/jquery-latest.js&quot;&gt;&lt;/script&gt;
</pre>

Create the calendar functions using jQuery's <a href="http://docs.jquery.com/Ajax/jQuery.post"><code>$.post</code></a> method to load the calendar. We send it, via post, the data for the specific month/year we'd like to display. In parallel, jQuery is on the prowl for links embedded in the calendar; clicking on these links trigger the <code>render_calendar()</code> function again, but this time with new month/year data extracted from the prev/next links we set up in <code>lib/calendar</code>. The data is stored as <code>class</code> and <code>alt</code>; you could store them however you want, though.

<pre class="prettyprint lang-js">
$(document).ready(function(){

	var weblog = "xxxxxx";
	var month = xx;
	var year = xxxx;

	render_calendar(section,month,year);

	function render_calendar(section,month,year) {
		$.post(
			"{path='lib/calendar'}",
			{ weblog : weblog, month : month, year : year },
			function(str) {
				$('#calendar').html(str).fadeIn();
			}
		);
	}

	$("#calendar a").live("click", function(){
		$('#calendar').fadeOut();
		month = $(this).attr('alt');
		year = $(this).attr('class');
		render_calendar(section,month,year);
	});

});
</pre>

And that's it!