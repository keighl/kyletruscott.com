---
layout: post
title: "Rectory: Quickly test HTTP redirects"
description: "Have a ton of HTTP redirects, and need to verify they work? Use this. Give rectory a list of live HTTP expectations, and it will tell you what happens: status code, location, and whether it behaved as expected (i.e pass/fail)."
published: true
---

I published a simple gem yesterday called [rectory](http://rubygems.org/gems/rectory). It's a tool for confirming HTTP response expectations. For instance, if you're replacing a website with a slicker one with better IA, you'll likely need to redirect a lot of the previously indexed pages to their new spots. Rectory helps you confirm that you correctly implemented all your redirects.

The gem came out of a daunting task at [FreeAssociation](http://freeassociation.is). We were rebuilding a big non-profit site, and I was responsible for just the redirects. There were around 600 pages that needed to be re-routed to new locations. There were some patterns to the redirects which made it easier, but for the most part the client had, by hand, decided where each old page should go. They gave me that information in a big hairy spreadsheet.

<!--break-->

Once I had got all the redirects set up (some at the NGINX level, others at the ruby level), I needed to test them, but I was not about to click through 600 webpages. I wrote a simple ruby script to check all the expectations in the client's spreadsheet automatically.

That was a good first step, but it took a long time since it checked the expectations one by one. To speed things along, I integrated [celluloid](https://github.com/celluloid/celluloid) into the script for concurrency. By performing 10-15 requests at a time, testing the expectations went much faster.

That was a few months ago, and I found the script while doing some harddrive cleaning. I wrote some specs, cleaned up the logic, and [threw it up](https://github.com/keighl/rectory). Hopefully it might help someone solve a similar problem.

Here's an overview of how it works (taken from the [README.md](https://github.com/keighl/rectory/blob/master/README.md)):

### Installation

    gem 'rectory'

    # Or

    $ gem install rectory

### Using a spreadsheet?

The easiest way to run a redirect test is using a CSV spreadsheet.

**1) Generate a new spreadsheet**

    $ rectory new -o example.com.csv

**2) Open up the CSV file and fill in your expectations.**

* `url` - The URL to test.
* `location` - Where the URL should redirect. If the request should not redirect (for instance, a 200 code), leave it blank
* `code` - The HTTP status code the request should return

<div class="table-container">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>url</th>
        <th>location</th>
        <th>code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>http://google.com</td>
        <td>http://www.google.com</td>
        <td>301</td>
      </tr>
      <tr>
        <td>http://www.google.com</td>
        <td></td>
        <td>200</td>
      </tr>
    </tbody>
  </table>
</div>

**3) Run a test using the expectations in your spreadsheet**

    $ rectory test example.com.csv

**4) Examine the results in results_example.com.csv**

<div class="table-container">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>url</th>
        <th>location</th>
        <th>code</th>
        <th>result_location</th>
        <th>result_code</th>
        <th>pass</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>http://google.com</td>
        <td>http://www.google.com</td>
        <td>301</td>
        <td>http://www.google.com</td>
        <td>301</td>
        <td>true</td>
      </tr>
      <tr>
        <td>http://www.google.com</td>
        <td></td>
        <td>200</td>
        <td></td>
        <td>200</td>
        <td>true</td>
      </tr>
    </tbody>
  </table>
</div>

## Using the code?

**Testing a single HTTP expectation**

{% highlight ruby %}
expectation = Rectory::Expectation.new("http://google.com", location: "http://www.google.com/", code: 301)
result      = expectation.pass?
{% endhighlight %}

**Testing many expectations**

{% highlight ruby %}
expectations = [
  Rectory::Expectation.new("http://google.com", location: "http://www.google.com/", code: 301),
  Rectory::Expectation.new("http://google.com", location: "http://www.google.com/", code: 301),
  Rectory::Expectation.new("http://google.com", location: "http://www.google.com/", code: 301)
]

Rectory.perform expectations

expectations.each do |e|
  puts "#{e.url} ---> #{e.pass?.to_s}"
end
{% endhighlight %}

The `Rectory.perform` class method utilizes [celluloid](https://github.com/celluloid/celluloid)... so it's nice and fast.
