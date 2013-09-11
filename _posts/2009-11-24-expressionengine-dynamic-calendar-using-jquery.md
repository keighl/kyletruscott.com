---
layout: post
title: "ExpressionEngine: Dynamic Calendar Using jQuery"
description: "Create a dynamic calendar using jQuery for Expression Engine with one template and the $.post() method. Let the people scoll!"
---

<a href="http://expressionengine.com/">ExpressionEngine</a> is a great tool for managing any kind of content. A feature users depend on, regardless of whether the application is a simple blog or otherwise, is a mini-calendar. It enables them to quickly shuffle through archives or posts. Thankfully, EE has a nice built in calendar module known as <a href="http://expressionengine.com/docs/modules/weblog/calendar.html">`{exp:weblog:calendar}`</a>. It's great at returning one month's worth of links, but cycling through to another month (past or previous) takes the user by default to a respective archive page. Now, the user must shift mental gears, and hunt for the info in a new way; ideally, they should be able to cycle through all the months without leaving the calendar or their current page.

<!--break-->

With a little help from <a href="http://jquery.com/">jQuery</a> and AJAX, it's not a difficult procedure. Essentially, we will create a separate EE template that dynamically generates a calendar, and load it in to another template passing some `$_POST` variables. When the users clicks "Next Month," the calendar is regenerated without a page refresh.

### Calendar Template

First, create a new EE template `lib/calendar`, or whatever you'd like to call it. Be sure to set the <a href="http://expressionengine.com/docs/templates/php_templates.html">PHP parsing stage to <strong>input</strong></a>. As you can see, the month, year and weblog parameters for the calendar tag are being dynamically accepted from the `$_POST` array.

{% highlight php %}
<?php
$weblog =	 $_POST['weblog'];
if (isset($_POST['month'])) :
	$month = $_POST['month'];
	$year = $_POST['year'];
else :
	$month = date('m');
	$year = date('Y');
endif;
?>
{% endhighlight %}

{% highlight html %}
{exp:weblog:calendar weblog="<?php echo $weblog;?>;" switch="calendarToday|calendarCell" month="<?php echo $month; ?>;" year="<?php echo $year; ?>;"}
	<table class="calendar" border="0" cellpadding="4" cellspacing="0">;
		<tr>
			<th class="calendarHeader">
				<a href="" alt="{previous_date format="%m"}" class="{previous_date format="%Y"}">;&amp;amp;lt;</a>
			</th>
			<th class="calendarHeader" colspan="5">;{date format="%F %Y"}</th>
			<th class="calendarHeader">
			  <a href="" alt="{next_date format="%m"}" class="{next_date format="%Y"}">;&amp;amp;gt;</a>
			</th>
		</tr>
		<tr>
			{calendar_heading}
			  <td class="calendarDayHeading">;{lang:weekday_abrev}</td>
			{/calendar_heading}
		</tr>
		{calendar_rows }
			{row_start}<tr>{/row_start}
				{if entries}
					{entries}
						<td class='{switch} calentry' align='center'>
							<a href="{day_path=<?php echo $section;?>;/index}">;{day_number}</a>
						</td>
					{/entries}
				{/if}
				{if not_entries}
					<td class='{switch}' align='center'>;{day_number}</td>
				{/if}
				{if blank}
					<td class='calendarBlank'>;&amp;amp;nbsp;</td>
				{/if}
			{row_end}</tr>{/row_end}
		{/calendar_rows}
	</table>
{/exp:weblog:calendar}
{% endhighlight %}

### Javascript

For the user page, where the calendar is to be displayed, first load the jQuery core. Also, create an empty `div` with an `id` of "calendar" somewhere on the page.

{% highlight html %}
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
{% endhighlight %}

Create the calendar functions using jQuery's <a href="http://docs.jquery.com/Ajax/jQuery.post">`$.post`</a> method to load the calendar. We send it, via post, the data for the specific month/year we'd like to display. In parallel, jQuery is on the prowl for links embedded in the calendar; clicking on these links trigger the `render_calendar()` function again, but this time with new month/year data extracted from the prev/next links we set up in `lib/calendar`. The data is stored as `class` and `alt`; you could store them however you want, though.

{% highlight js %}
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
{% endhighlight %}

And that's it!