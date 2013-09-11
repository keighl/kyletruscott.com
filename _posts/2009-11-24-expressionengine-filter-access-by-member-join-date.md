---
layout: post
title: "ExpressionEngine: Filter Access By Member Join Date"
description: "Restrict access to data based on a member's join date with ExpressionEngine. Works for all kinds of stuff ... even calendars."
---

Depending on the nature of your content within <a href="http://expressionengine.com/">ExpressionEngine</a>, you may want to discriminate member access to entries based upon when they were registered. For instance, if they pay for the information, you don't want them to see backlog entries for free! Unfortunately, EE doesn't have an easy global variable for join date; however, a member's join date is stored in the database (table `exp_members`, column `join_date`), so it is still available for our use.

This process can be done on any template. First, we need to procure the member's id number, with which we can filter the database. There is a global variable for this, `{member_id}`, but it becomes rather unstable when used in conditionals and database queries. I find it easier to simply grab the `$SESS` data. Make sure the <a href="http://expressionengine.com/docs/templates/php_templates.html">PHP parsing stage is set to <strong>input</strong></a>.

<!--break-->

{% highlight php %}
<?php
	global $SESS;
	$member_id = $SESS->userdata['member_id'];
?>
{% endhighlight %}

With this info we can query the database, and use a conditional statement to filter the members' access. If their join date is after the entry's date, we shut them down.

{% highlight php %}
{exp:weblog:entries orderby="date" sort="desc" limit="1"}

	{exp:query sql="SELECT join_date FROM exp_members WHERE member_id = '<?php echo $member_id; ?>'"}

			{if {entry_date} > {join_date} }

					You get what you pay for!

			<!-- EE Entry Data ... -->

			{if:else}

			Forget about it.

			{/if}

	{/exp:query}

{/exp:weblog:entries}
{% endhighlight %}

### Calendar

The same principles, as applied above, can be used within an AJAX-ified mini-calendar. <a href="/post/expressionengine-dynamic-calendar-using-jquery/">Check out my post on the matter, because the following code builds upon it</a>.

From within the `{if_entries}` bit of the calendar tag, you can filter the links by the same method of querying the database with the member's id. If their join date is after the entry, they don't see a link.

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
global $SESS;
$member_id = $SESS->userdata['member_id'];
?>
{% endhighlight %}

{% highlight html %}
{exp:weblog:calendar weblog="<?php echo $weblog;?>" switch="calendarToday|calendarCell" month="<?php echo $month; ?>" year="<?php echo $year; ?>"}
  <table class="calendar" border="0" cellpadding="4" cellspacing="0">
    <tr>
      <th class="calendarHeader">
        <a href="" alt="{previous_date format="%m"}" class="{previous_date format="%Y"}">&amp;lt;</a>
      </th>
      <th class="calendarHeader" colspan="5">{date format="%F %Y"}</th>
      <th class="calendarHeader">
        <a href="" alt="{next_date format="%m"}" class="{next_date format="%Y"}">&amp;gt;</a>
      </th>
      </tr>
    <tr>
      {calendar_heading}
        <td class="calendarDayHeading">
          {lang:weekday_abrev}
        </td>
      {/calendar_heading}
    </tr>
    {calendar_rows}
      {row_start}<tr>{/row_start}
      {if entries}
        {entries}
          {exp:query sql="SELECT join_date FROM exp_members WHERE member_id = '<?php echo $member_id; ?>' "}
            {if {entry_date} > {join_date} }
              <td class='{switch} calentry' align='center'>
                <a href="{day_path=<?php echo $weblog;?>/index}">{day_number}</a>
              </td>
            {if:else}
              <td class='{switch}' align='center'>
                {day_number}
              </td>
            {/if}
          {/exp:query}
        {/entries}
      {/if}
      {if blank}
        <td class='calendarBlank'>&amp;nbsp;</td>
      {/if}
      {row_end}</tr>{/row_end}
    {/calendar_rows}
  </table>
{/exp:weblog:calendar}
{% endhighlight %}