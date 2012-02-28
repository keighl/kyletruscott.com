I'm working on a cool side project; it's a game built on Rails. I decided to use MongoDB/Mongoid as the storage engine because of the potential volume of "moves," but more specifically to easily denormalize the scoring mechanisms throughout the application. Instead of performing some massive MySQL calculations for aggregating points, I simply  `{$inc : {'points' : 1}}`. This makes it super easy to sort moves by how many points they have.

However, when it came time to make a leaderboard, I found myself missing MySQL quite a bit. In MongoDB, there's not such thing as subquerying, counting, summing, and grouping all at once.

But, that's kind of the point of MongoDB or any NoSQL solution. It took a few hours, but I ultimately achieved what I wanted using MongoDB's built in MapReduce functions.

### Define

Here's a quick overview of the game framework:

* Players join games
* Players make moves in a game
* Moves are awarded points

The leaderboard should show **all the players in the game**, the **total points each player has accrued** and the **total moves each player has made.** The players should be ordered by the number of points they have

--------------

<pre class="prettyprint lang-ruby">
class Game
  include Mongoid::Document

  has_and_belongs_to_many :players, :class_name => "User", :inverse_of => :games, :autosave => true
  has_many :moves
end
</pre>

<pre class="prettyprint lang-ruby">
class User
  include Mongoid::Document

  has_and_belongs_to_many  :games
  has_many                 :moves
end
</pre>

<pre class="prettyprint lang-ruby">
class Move
  include Mongoid::Document

  belongs_to :user
  belongs_to :game

  field :points, :type => Integer, :default => 0
end
</pre>

--------------

### The Solve

The main goal is to get an array of Ruby hashes that each contain: a player, their total score, their total moves. I want to defer as much "calculating" to MapReduce as possible; so it meant doing to the totalling of points and moves there.

<pre class="prettyprint lang-ruby">
# game.rb

def generate_game_stats
  map = "
    function () {
      emit(this.user_id, {'points' : this.points, 'moves' : 1});
    }
  "

  reduce = "
    function (key, emits) {
      var total = {'points' : 0, 'moves' : 0};
      for (var i in emits) {
        total.points += emits[i].points;
        total.moves  += emits[i].moves;
      }
      return total;
    }
  "
  db.collection('moves').map_reduce(map, reduce, {:out => "game_stats_#{self.id}", :query => {:game_id => self.id}})
end
</pre>

### Map

<pre class="prettyprint lang-js">
function () {
  emit(this.user_id, {'points' : this.points, 'moves' : 1});
}
</pre>

The `map` method is what we use to extract all the relevant information from the database. It's a JS method that fires once for every document (i.e. record) that matches the query. In this case we're looking at moves (`db.collection('moves')`) that belong to the current game (`:query => {:game_id => self.id}`).

For each document, the `map` method "emits" a smaller document that has the necessary data. This document includes the number of `points` a move has, and a value of 1 for `moves`. This small document is grouped by `this.user_id`, where `this` is scoped to the current move over which `map` is iterating.

At the end of `map` we have a lot of litte documents like `{points : 5, moves : 1}` associated with each player id. Then, it hands 'em off to the reduce.

### Reduce

<pre class="prettyprint lang-js">
function (key, emits) {
  var total = {'points' : 0, 'moves' : 0};
  for (var i in emits) {
    total.points += emits[i].points;
    total.moves  += emits[i].moves;
  }
  return total;
}
</pre>

Here in `reduce`, we actually perform our calculations. It means taking all the little `{points : 5, moves : 1}` documents and adding them up to give us totals by user (which is how we grouped them in `map`).

What's interesting about `reduce` is that whatever you return must be capable of going through `reduce` again. In other words, you have to return a small document with the same structure that you were emitting in `map`. The difference, though, is that this small document is an aggregation of other small documents.

In each `reduce` call, you get a key (user id), and an array of emits associated with that key. These represent all the moves a player has made in the game.

* Create a `total` object with both points and moves attributes set to 0; it will increment as we iterate over the emits.
* Loop through each emit associated with the current key.
* Increment `total.points` and `total.moves` by the values stored in each emit.
* Return the `total` object.

The returned object will look something like `{points : 65, moves : 12}`. So, we took a bunch of single emits and boiled them down to one. Notice that this object can run through reduce again and return the same exact thing.

### Output

<pre class="prettyprint lang-ruby">
db.collection('moves').map_reduce(map, reduce, {:out => "game_stats_#{self.id}", :query => {:game_id => self.id}})
</pre>

Finally, after mongo is done reducing all of our emits, we save the result to a collection. It's like creating a new table specifically to hold some calculations. In SQL, this would be frowned upon, but here in NoSQL land ... totally acceptable!

We'll save our output to a collection named with the game's id: `:out => "game_stats_#{self.id}"`. The collection will look like this:

<pre class="prettyprint lang-js">
[
  {
    "_id"   : ObjectId("4f4a7242ec63458c78000001"),
    "value" : {
      "points" : 8,
      "moves"  : 5
    }
  },
  {
    "_id"   : ObjectId("4f4a7242ec63458c78000002"),
    "value" : {
      "points" : 2,
      "moves"  : 1
    }
  },
  {
    "_id"   : ObjectId("4f4a7242ec63458c78000003"),
    "value" : {
      "points" : 12,
      "moves"  : 6
    }
  }
]
</pre>

### Constructing the Leaderboard

So, we have our map-reduced collection of users with points and moves. Unlike an SQL aggregation, this collection isn't exactly ready for frontend implementation. So in order to fullfill the ultimate purpose, I used decorator-esque method to format the collection into something more useful.

<pre class="prettyprint lang-ruby">
# game.rb

def game_stats
  leaders = Mongoid.master.collection("game_stats_#{self.id}").find.to_a
  stats   = {}
  leaders.each do |doc|
    stats[doc["_id"]] = {
      :id     => doc["_id"] ,
      :moves  => doc["value"]["moves"],
      :points => doc["value"]["points"]
    }
  end
  return stats
end

def leaderboard(order = :points)
  stats = self.game_stats
  users = self.players
  final = []
  users.each_with_index do |u, i|
    final.push({
      :user   => u,
      :moves  => (stats.has_key?(u.id)) ? stats[u.id][:moves] : 0,
      :points => (stats.has_key?(u.id)) ? stats[u.id][:points] : 0,
    })
  end
  return final.sort_by { |u| -u[order] }
end
</pre>

By calling `leaderboard`, it first formats the stats collection into a hash keyed by user id in `game_stats`. It then mashes the stats hash and the actual list of players from `self.players`. This makes sure that we pickup any players who haven't made a move yet (since the map-reduce only maps moves, not players). Finally, order the leaderboard by points. Now it's ready for front-end consumption.

### Final Thoughts

There's a bit of Ruby parsing and shuffling that has to occur here to translate the mapreduce output into a usable format, but we save a lot of overhead by caching those calculations in the stats collection. The application triggers `generate_game_stats` via Mongoid callbacks when:

* The game is updated
* A player makes a move
* When a player achieves points (which is fairly infrequent)
* When the game is over

For example:

<pre class="prettyprint lang-ruby">
# move.rb

after_create do |move|
  move.game.generate_game_stats
  return
end
</pre>

I hope this helps somebody utilize the more advanced features of MongoDB/Mongoid. For more detailed look at MapReduce, see the docs: [http://www.mongodb.org/display/DOCS/MapReduce](http://www.mongodb.org/display/DOCS/MapReduce)

