---
layout: post
title: "ExpressionEngine: Filter Access By Member Join Date"
description: "Restrict access to data based on a member's join date with ExpressionEngine. Works for all kinds of stuff ... even calendars."
---

Depending on the nature of your content within <a href="http://expressionengine.com/">ExpressionEngine</a>, you may want to discriminate member access to entries based upon when they were registered. For instance, if they pay for the information, you don't want them to see backlog entries for free! Unfortunately, EE doesn't have an easy global variable for join date; however, a member's join date is stored in the database (table <code>exp_members</code>, column <code>join_date</code>), so it is still available for our use.

This process can be done on any template. First, we need to procure the member's id number, with which we can filter the database. There is a global variable for this, <code>{member_id}</code>, but it becomes rather unstable when used in conditionals and database queries. I find it easier to simply grab the <code>$SESS</code> data. Make sure the <a href="http://expressionengine.com/docs/templates/php_templates.html">PHP parsing stage is set to <strong>input</strong></a>.

<pre class="prettyprint lang-php">
&lt;?php
	global $SESS;
	$member_id = $SESS->userdata['member_id'];
?&gt;
</pre>

With this info we can query the database, and use a conditional statement to filter the members' access. If their join date is after the entry's date, we shut them down.

<pre class="prettyprint lang-php">
{exp:weblog:entries orderby=&quot;date&quot; sort=&quot;desc&quot; limit=&quot;1&quot;}

	{exp:query sql=&quot;SELECT join_date FROM exp_members WHERE member_id = '&lt;?php echo $member_id; ?&gt;'&quot;}

			{if {entry_date} > {join_date} }

					You get what you pay for!

			<!-- EE Entry Data ... -->

			{if:else}

			Forget about it.

			{/if}

	{/exp:query}

{/exp:weblog:entries}
</pre>

### Calendar

The same principles, as applied above, can be used within an AJAX-ified mini-calendar. <a href="/post/expressionengine-dynamic-calendar-using-jquery/">Check out my post on the matter, because the following code builds upon it</a>.

From within the <code>{if_entries}</code> bit of the calendar tag, you can filter the links by the same method of querying the database with the member's id. If their join date is after the entry, they don't see a link.

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
global $SESS;
$member_id = $SESS->userdata['member_id'];
?&gt;
</pre>

<pre class="prettyprint lang-html">
{exp:weblog:calendar weblog=&quot;&lt;?php echo $weblog;?&gt;&quot; switch=&quot;calendarToday|calendarCell&quot; month=&quot;&lt;?php echo $month; ?&gt;&quot; year=&quot;&lt;?php echo $year; ?&gt;&quot;}
  &lt;table class=&quot;calendar&quot; border=&quot;0&quot; cellpadding=&quot;4&quot; cellspacing=&quot;0&quot;&gt;
    &lt;tr&gt;
      &lt;th class=&quot;calendarHeader&quot;&gt;
        &lt;a href=&quot;&quot; alt=&quot;{previous_date format=&quot;%m&quot;}&quot; class=&quot;{previous_date format=&quot;%Y&quot;}&quot;&gt;&amp;lt;&lt;/a&gt;
      &lt;/th&gt;
      &lt;th class=&quot;calendarHeader&quot; colspan=&quot;5&quot;&gt;{date format=&quot;%F %Y&quot;}&lt;/th&gt;
      &lt;th class=&quot;calendarHeader&quot;&gt;
        &lt;a href=&quot;&quot; alt=&quot;{next_date format=&quot;%m&quot;}&quot; class=&quot;{next_date format=&quot;%Y&quot;}&quot;&gt;&amp;gt;&lt;/a&gt;
      &lt;/th&gt;
      &lt;/tr&gt;
    &lt;tr&gt;
      {calendar_heading}
        &lt;td class=&quot;calendarDayHeading&quot;&gt;
          {lang:weekday_abrev}
        &lt;/td&gt;
      {/calendar_heading}
    &lt;/tr&gt;
    {calendar_rows}
      {row_start}&lt;tr&gt;{/row_start}
      {if entries}
        {entries}
          {exp:query sql=&quot;SELECT join_date FROM exp_members WHERE member_id = &#x27;&lt;?php echo $member_id; ?&gt;&#x27; &quot;}
            {if {entry_date} &gt; {join_date} }
              &lt;td class=&#x27;{switch} calentry&#x27; align=&#x27;center&#x27;&gt;
                &lt;a href=&quot;{day_path=&lt;?php echo $weblog;?&gt;/index}&quot;&gt;{day_number}&lt;/a&gt;
              &lt;/td&gt;
            {if:else}
              &lt;td class=&#x27;{switch}&#x27; align=&#x27;center&#x27;&gt;
                {day_number}
              &lt;/td&gt;
            {/if}
          {/exp:query}
        {/entries}
      {/if}
      {if blank}
        &lt;td class=&#x27;calendarBlank&#x27;&gt;&amp;nbsp;&lt;/td&gt;
      {/if}
      {row_end}&lt;/tr&gt;{/row_end}
    {/calendar_rows}
  &lt;/table&gt;
{/exp:weblog:calendar}
</pre>