Unlike ERB, or HAML, you can't use the normal [Rails fragment caching](http://guides.rubyonrails.org/caching_with_rails.html) when constructing your JSON views with [jbuilder](https://github.com/rails/jbuilder). There are a couple open [issues](https://github.com/rails/jbuilder/issues/22) over at Github, and I imagine they'll incoporate this functionality soon. Until then, though, you can do something really simple using partials to get around it.

Here's exactly what you **cannot** do:

<pre class="prettyprint lang-ruby">
# app/view/users/index.json.jbuilder

cache "users_index_json" do
  json.array!(@users) do |json, user|
    json.partial! "user", :user => user
  end
end
</pre>

### Solution

Instead of trying to cache from within the jbuilder template, cache something you know you will work (like HAMl) and render the jbuilder template from within as a partial.

Change the `index.json.jbuilder` file to a partial, `_index.json.jbuilder`.

<pre class="prettyprint lang-ruby">
# app/view/users/_index.json.jbuilder

json.array!(@users) do |json, user|
  json.partial! "user", :user => user
end
</pre>

Introduce the regular `index.json` back as a HAML template, and cache the output as a fragment. Return the partial as `html_safe` since you'll need the exact formatting jbuilder gives back.

<pre class="prettyprint lang-ruby">
# app/view/users/index.json.haml

- cache "users_index_json" do
  = render(:partial => "index", :formats => [:json]).html_safe
</pre>

So, it requires an extra file for all your JSON view, but it solves the problem very cleanly. Also your test will still pass if they are matching something like `response.should render_template("index")`.








