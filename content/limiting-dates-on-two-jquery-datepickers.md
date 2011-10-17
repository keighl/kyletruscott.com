I just ran into a scenario where I had two separate jQuery UI datepickers, and needed to have the first calendar limit the date choices of the second. Essentially a start date and end date. It doesn't take a degree in relational physics to know that the end cannot come before the beginning; therefore, anything before the date the user chooses in the first calendar needs to be unavailable in the second calendar. 

<pre class="prettyprint lang-js">
$('#start').datepicker({
	dateFormat: "@",
	onSelect: function(dateText, inst) {
		var dateText = eval(dateText);
		var min = new Date();
		min.setTime(dateText);
		$('#end').datepicker('option', 'minDate', min);
	}
});

$('#end').datepicker({
	dateFormat: "@",
});
</pre>