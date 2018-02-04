![ga_chi](https://avatars3.githubusercontent.com/u/12513784?s=200&v=4)

## wdi-10-chi _fluff-hounds_



# Full Stack Sinatra with ActiveRecord, Sessions, and Bcrypt

Follow each step of this lab. For each step, try to do it yourself and see if you can get it to work. If you're stumped, click the arrow by "Details" to show the hidden code (works best when this file is viewed on github).

If you end up using the code here, type it out yourself.  

For a few sections, the code is not hidden.

<details>

```ruby
#this is an example
def test
	"asdf"
end
```

</details>

### 1. Set up the files for a Sinatra app.

#### Gemfile

> Note because of a bug (documented [here](https://github.com/rails/rails/issues/31673) and [here](https://github.com/rails/rails/issues/31669) and probably several other places) at the time of this writing, it is necessary to manually specify '0.21' or the `pg` gem won't be picked up.  You would normally just be able to put `pg`.

```ruby
source 'https://rubygems.org'

gem 'pg', '0.21'
gem 'sinatra'
gem 'sinatra-activerecord'
gem 'json'
gem 'pry'
gem 'bcrypt'

```

Since we added some gems, we `bundle`. Take a look at the Gemfile.lock that is generated.

```bash
$ bundle
$ less Gemfile.lock
```

---

:red_circle: Commit: "Gemfile + bundle"

---

### 2. Config.ru

Set up the minimum config.ru that you would need to get a ***modular*** Sinatra app to run.  

<details>

`config.ru`
```ruby
require 'sinatra/base'

# controllers
require './controllers/ApplicationController'

# routes
map('/') {
	run ApplicationController
}
```

</details>
<br />

### 3. Application controller

Create a barebones ApplicationController.  What does that inherit from?  Give it a '/' default get route and a 404 route.  Hint: try `not_found`.

<details>


`controllers/ApplicationController.rb`
```ruby
class ApplicationController < Sinatra::Base

	require 'bundler'
	Bundler.require()

	get '/' do
		"hey cool the server runs"
	end

	not_found do
		halt 404
	end

end
```

</details>
<br />

Make sure your app runs.

<details>

```bash
$ bundle exec rackup
```
</details>
<br>

If so then....

---

:red_circle: Commit: "Basic server runs. ApplicationController + config.ru"

---

### 4. Render a view

Create a basic erb template that has an h1 with the name of your app. Something like "Awesome to do list App!." 

:black_small_square: Link up the views folder

<details>
	
#### controllers/ApplicationController.rb, after bundle stuff, before the route

```ruby 
set :views, File.expand_path('../views', File.dirname(__FILE__))
```

</details>
<br/>

:black_small_square: Create the view

<details>

#### views/hello.erb

```erb
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<h1 style="border: 1px solid blue; border-radius: 10px">Awesome Item App (this h1 is in hello.erb)</h1>
</body>
</html>
```
</details>
<br />

:black_small_square: Render the view in your default get route

<details>

#### controllers/ApplicationController.rb

```ruby
get '/' do
	erb :hello
end
```

</details>
<br />

If it renders, then...

---

:red_circle: Commit: "set up views/rendered a template"

---

### 5. Add ActiveRecord, set up migrations.sql and seeds.sql.

For section 5, the code is not hidden.

:black_small_square: Create a file, `db/migrations.sql` to represent our database structure. Write out the SQL below EXACTLY. **Do not change any capitalizations, punctuation, singular/plural, or table/column names.** Notice how we are describing relations between the tables. When you're done typing it out, open your `psql`. Run `DROP DATABASE item;` then copy/paste the contents of the file. 

#### db/migrations.sql

```sql
CREATE DATABASE item;

\c item

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(32),
  password VARCHAR(60)
);

CREATE TABLE items(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  user_id INT REFERENCES users(id)
);
```

:black_small_square: Check that it was successful by

 * reading output from the psql terminal after you paste, and 
 * checking out your tables: `\d users` and `\d items`

Similarly, you can create a `seed.sql` or `seeds.sql` to insert a lot of data all at once. Helpful if you need to clear or reset or move your database, or when you deploy an app, or when you clone an existing project.

:black_small_square: Create a file `db/seeds.sql` with SQL for a user your name (lol) and password. 

#### db/seeds.sql

```sql
INSERT INTO users (username, password) VALUES ('reuben', '12345');
```

> Yes, there is a way to automate the migrations/seeds process. No, people don't always just paste it, but we will be for now.  

:black_small_square: Require ActiveRecord in `config.ru`.

#### config.ru, after sinatra/base and before controllers:

```ruby
require 'sinatra/activerecord'
```

:black_small_square: Add the code to connect to an 'item' database in ApplicationController

#### controllers/ApplicationController.rb, after bundle stuff and before setting views folder:

```ruby
	ActiveRecord::Base.establish_connection(
 		:adapter => 'postgresql', 
 		:database => 'item'
	)
```

If you are able to start your server...

---

:red_circle: Commit: "added ActiveRecord and migrations/seeds"

---

### 6. Set up partials

Since we're about to have several different views, but still want to have a lot of things consistent across our whole site, we're going to use partials.

:black_small_square: Create a `layout.erb` template. Cut **all** of the code from `hello.erb` and paste it into `layout.erb`. In `hello.erb`, which should now be empty, add an `h2` saying "this is the hello template":

<details>

#### views/hello.erb

```erb
<h2 style="border: 1px solid brown; border-radius: 5px">This h2 is in the hello.erb<h2>
```

</details>
<br />

:black_small_square: Add the `yield` to the body in `layout.erb`, below the `<h1>`

<details>

#### views/layout.erb, in the `<body>`, below the `<h1>`

```erb
<%= yield %>
```

</details>
<br />

:black_small_square: For fun, and so users can have a meaningful browser history, let's send a page title from the route. Change the `<title>` to include instance variable for the page name.

<details>

#### views/layout.erb

```erb
<title><%= @page %></title>
```

</details>
<br />

:black_small_square: ...and then set the page title as an instance variable in the route

<details>

#### controllers/ApplicationController.rb

```ruby
 	get '/' do
		@page = "hello"
  		erb :hello
  	end
```

</details>


---

:red_circle: Commit: "set up partials"

---

### 7. Item Controller

Add an Item controller with a dummy '/' index/get route and an "add item" route that renders an add item template (that we will create in a second).  Don't forget to map it.

<details>

`controllers/ItemController.rb`
```ruby
class ItemController < ApplicationController

	# index route
	get '/' do
		"this is get route in ItemController"
	end

	# add route 
	get '/add' do
		erb :add_item # this view will be created in the next step
	end

end
```

`config.ru`
```ruby
map('/items') { 
	run ItemController
}
```

</details>
<br>

If you can view '/items' then...

---

:red_circle: Commit: "Item Controller"

---

### 8. Go nuts with partials and variables

Create a partial `form.erb` with a form that has a red border that posts to `@action` and a method of `@method` where the text field has a value of `@value` and a placeholder of `@placeholder` and the button has a value of `@buttontext`.

<details>
`views/form.erb`
```erb
<form style="border: 1px solid red; border-radius: 4px;" action="<%= @action %>" method="<%= @method %>">
 	<input type="text" name="title" value='<%= @value %>' placeholder='<%= @placeholder %>'/>
 	<input type="submit" name="Submit Button" value="<%= @buttontext %>" />
 	<p>everything in this red box is in the form partial<p>
</form> 
```

</details>
<br>

#### Dabbling with nested partials: you can render a partial within a partial:

Create a the add_item partial mentioned above.  It should have only an `<h2>` with the name of the page and below that the following line: 
```erb
<%= erb(:form) %>
```

Edit the Item add route to send along all the proper values for the instance variables in `form.erb` and `layout.erb` and make the post to an as yet nonexistent '/items' post route.

<details>

`controllers/ItemController.rb`, in the `get '/'` route
```ruby
	@page = "Add Item"
	@action = "/items/add"
	@method = "POST"
	@placeholder = "Enter your item!"
	@value=""
	@buttontext = "Add Item"
```

</details>
<br>

Kind of overkill for our purposes...the purpose is just to demonstrate. But it is certainly very DRY!  

---

:red_circle: Commit: "Nested form partial"

---

### 9. Items dummy post route

Make an item _create_ route that prints the form data to the terminal and just sends back: "you posted. check your terminal."  Try to post something and make sure your data looks right in the terminal.

<details>

#### controllers/ItemController.rb

```ruby
# create route
post '/add' do
	# params are in a hash called params, check your terminal
	pp params
	"you posted. check your terminal."
end
```

</details>
<br>


---

:red_circle: Commit: "Items post route"

---

### 10. Make items create route use ActiveRecord to actually insert in your db.

First you will need to create your model.  You're gonna _love_ how easy it is:

#### models/ItemModel.rb
```ruby
class Item < ActiveRecord::Base

end 
```

Yep, that's it. Now see if you can figure out/google how to make your items create route do a simple insert of one item into a table with ActiveRecord. Again, it's absurdly simple. We won't worry about `users` until we have full CRUD for `items`, so for now, just hard-code the user_id to be `1`. After you save, send the item back as JSON.

<details>

#### controllers/ItemController.rb:

```ruby
 	post '/add' do

  		pp params

  		# this is how you add something with ActiveRecord.  so chill.
		@item = Item.new
		@item.title = params[:title]
		@item.user_id = 1 # for now
		@item.save

		# hey there's a .to_json method. cool.
		@item.to_json

	end
 ```
</details>
<br>

Make sure it works by using `psql` to see what's in your items table.  And check out your terminal where you have `bundle exec rackup` running, and see the SQL that ActiveRecord is writing for you (pretttyyyy colllorrrrss).

<details>

#### in your postgres CLI:

```sql
\c item;
SELECT * FROM items;
```

</details>
<br>

If you got JSON in the browser, and data in your items table and it all looks right...

### Uh oh, it's broke, ain't it?

Would be cool if it worked, but you likely get an error like "Undefined constant Item...." What's that all about? What did we forget? Think about it! See if you can fix it!

<details>

#### config.ru, after controllers

```ruby
require './models/ItemModel'
```

</details>

---

:red_circle: Commit: "Item create route saves data using ActiveRecord"

---

### 11. Create an item index page.

3 steps:
* update item index route get all items with ActiveRecord before you render an `:item_index` template (that you're about to make). Code is very simple.  Try guessing/googling.  Use sending back JSON while you're working on it, then when it's done...
* create the `:item_index` partial that includes an "item list" `<h2>` and then iterates over `@items` to build a `<ul>` of `<li>`s. Render that template from index route.
* When you have a working index page, update the item create (post) route to redirect to that index page

<details>
	
#### controllers/ItemController.rb

```ruby
	# index route
 	get '/' do
		@items = Item.all # beautiful isn't it
		# @items.to_json
		@page = "Index of items"
		erb :item_index
  	end
```

#### views/item_index.erb

```erb
<h2 style="border: 1px solid brown; border-radius: 5px">Item list</h2>
<ul>
	<% @items.each do |item| %>
		<li><%= item.title %></li>
	<% end %>
</ul> 
```

#### views/ItemController.rb (again)

```ruby
		# @item.to_json # we will come back to this
		redirect '/items'
```

</details>
<br>

Again, look at the terminal to see the SQL that's being written for you.


---

:red_circle: Commit "Item index page"

---

### 12. Since we have multiple pages, let's make a `<nav>` real quick.

Add a nav.

<details>

#### views/layout.erb:

```
	<nav>
		<p style="display: inline-block;">Nav:</p>
		<a href="/items">Item list</a> •
		<a href="/items/add">Add Items</a>
	</nav>
```
</details>

---

:red_circle: Commit: "12: Added a nav"

---

### 13. Delete Functionality

3 steps:
* Add the MethodOverride middleware (shown)
* Make each `<li>` in your index a form. The form will `DELETE` by `POST`ing and including a parameter `_method` set to `DELETE`, similarly to Express.  ***However***, this time, use `<input type=`hidden`>` to do it instead of adding it in the query string. How will you know it's working? (Click below to show answer)

<details>
(when you click one of the delete buttons, "....doesn't know this ditty" should be telling you to add a delete route....)
</details>

* So then go ahead and write the item delete route. See if you can figure out/google how to do it. Again, ActiveRecord--very simple. You could probably get it just by guessing. Remember to redirect to index so user can see that the delete was successful.

#### controllers/ApplicationController.rb

```ruby
	use Rack::MethodOverride  # we "use" middleware in Rack-based libraries/frameworks
	set :method_override, true
```

<details>

#### views/item_index.erb

```erb
<ul>
	<% @items.each do |item| %>
		<form action="/items/<%= item.id %>" method="POST">
		<input type="hidden" name="_method" value="DELETE" />
		<li><%= item.title %></li> 
		<button>Delete</button>
		</form>
	<% end %>
</ul> 
```

#### controllers/ItemController.rb

```ruby
	delete '/:id' do
		# there are 1000 ways to do this, this is just one
		@item = Item.find params[:id]
		@item.delete
		redirect '/items'
	end
 ```


</details>
<br>

Again, look at the SQL that's being generated for you.

---

:red_circle: Commit: "Item delete functionality"

---

### 14.  Add a public folder for CSS and put all the CSS in it.

Add a public folder for CSS. Move all your styles there where they belong because this isn't 1995 and we separate content and presentation/formatting/layout/design.

* set it up on the server
* link it up in the template
* make a style to be sure it's working

<details>

#### controllers/ApplicationController.rb

```ruby
set :public_dir, File.expand_path('../public', File.dirname(__FILE__))
```

#### views/layout.erb

```erb
<link rel="stylesheet" type="text/css" href="/css/style.css">
```

#### public/css/style.css

```css
body {
	background-color: #f3d460;
}
```

</details>
<br>

Then put the styles from your html in your CSS and add classes for them, where necessary in your html. How you do all of this is up to you, click below to see an example (html omitted) if you like.

<details>

#### public/css/style.css

```css
body {
	background-color: #f3d460;
}

/* from form.erb */
.form-partial {
	border: 1px solid red; 
	border-radius: 4px; 
}

/* from layout.erb */
h1.app-name {
	border: 1px solid blue; 
	border-radius: 10px;
}
nav p {
	display: inline-block;
}

/* from hello.erb and/or item_index.erb and/or add_item.erb */
h2 {
	border: 1px solid brown; 
	border-radius: 5px;
}
```

</details>
<br>

---

:red_circle: Commit: "Set up CSS public folder and moved CSS there"

---

### 15. Edit/Update

Try to create an edit functionality on your own. You have everything you need to do it at this point... you shouldn't need to google. 

>Don't forget: you can see the SQL that's being generated for you in your terminal.

* First create the edit link, route, and view. Make sure it works. Don't forget to override the method.

<details>

#### views/item_index.erb

```erb
<a href="/items/edit/<%= item.id %>">(Edit)</a>
```

#### controllers/ItemController.rb

```ruby
# edit route
get '/edit/:id' do
	@item = Item.find params[:id]
	@page = "Edit Item #{@item.id}" #why am i using interpolation here?  try with concatenation and see what happens.
	erb :edit_item
end
```

#### views/edit_item.erb

```erb
<h2>Edit Item <%= @item.id %></h2>

<form action="/items/<%= @item.id %>" method="POST">
	<input type="hidden" name="_method" value="PATCH" />
	<input type="text" size="75" name="title" placeholder="Enter new value for item <%= @item.id %>" value="<%= @item.title %>" />
	<button>Update Item</button>
</form>
```

</details>
<br>

* Then create the update route and have it redirect to '/items'. Make sure it works.  See the notes in the code below.

<details>

#### controllers/ItemController.rb

```ruby
# update route
patch '/:id' do
	# like i said -- lots of ways to do this.  
	# http://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html
	# http://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-where
	@items = Item.where(id: params[:id]) 

	# note: .where method gives us an array (Why?). So we must index. 
	# Might there have been a more appropriate query method to use 
	# instead of .where ?
	@item = @items[0]

	@item.title = params[:title]
	@item.save
	redirect '/items'
end
```

</details>

---

:red_circle: Commit: "Update functionality.  Full CRUD achieved."

---

Do you see why people say Ruby and Sinatra (or rails) and a good ORM let you build application prototypes very quickly????????

## Sessions in Sinatra

### 16. Enable sessions, and use it for messaging

We're eventually going to track if the user is logged in with sessions. But first, let's do a sessions exercise -- create a messaging functionality.

Enable sessions: 

#### controllers/ApplicationController.rb

```ruby
# after bundler stuff but before everything else: 

enable :sessions # yep, that's it
```

Set messages in routes:

#### controllers/ItemController.rb, create route

```ruby
# after .save, before redirect:

session[:message] = "You added item \##{@item.id}."
```

#### controllers/ItemController.rb, update route

```ruby
# after .save, before redirect:

session[:message] = "You updated item \##{@item.id}"
```

#### controllers/ItemController.rb, delete route

```ruby
# after .delete, before redirect:

session[:message] = "You deleted item \##{@item.id}"
```

Create a style for the messages.

#### public/css/style.css

```css
p.msg {
	background: lightgreen;
	color: brown;
	border: 1px solid black;
}
```

Display message in `layout.erb`.  Remember to clear it from the session once it's been displayed.

#### views/layout.erb

```erb
<% if session[:message] %>
	<p class="msg">
	<%= session[:message] %>
	</p>
	<% session[:message] = nil
end %>
```

Pretty sweet, right?

>Reminder: Anytime you're trying to figure out anything with sessions, you can `pp session` to see what's in there.

---

:red_circle: Commit: "Enabled sessions and used it to create messaging"

---

## Login/register functionality.

For parts 17 through 22, we will build a login and register functionality. Less guidance is provided. Based on what you've already done, think about what is required to build this and see if you can do it. Again, you have everything you need, so basically no googling should be required. Just keep asking yourself "what am I trying to do right now?" and "where have I done something like this before that worked?".  Don't forget to p or puts or print or pp things to make sure they're what you think they are, and don't forget that you can see any SQL that ActiveRecord wrote for you in your terminal.

### 17. Create a user model

<details>

#### models/UserModel.rb

```ruby
class User < ActiveRecord::Base

end
```

#### config.ru

```ruby
require './models/UserModel'
```

</details>
<br>

---

:red_circle: Commit: "Added user model"

---

### 18. Make the parts: views and a controller with dummy routes.  

Don't worry about making the login actually work yet, just make sure everything is set up first, as we've done above with items.  Routes exist, and just send back JSON.

<details>

#### views/register.erb

```erb
<h2>Sign up:</h2>
<form action="/user/register" method="POST">
	<input type="text" name="username" placeholder="desired username" /><br />
	<input type="password" name="password" placeholder="password"><br />
	<button>Register</button>	
</form>
```	

#### views/login.erb

```erb
<h2>Log in below.</h2>

<h3>Need an account? Sign up <a href="/user/register">here</a></h3>

<form action="/user/login" method="POST">
	<input type="text" name="username" placeholder="username" /><br />
	<input type="password" name="password" placeholder="password"><br />
	<button>Login</button>	
</form>
```

#### controllers/UserController.rb

```ruby
class UserController < ApplicationController

	get '/' do
		redirect '/user/login'
	end

	get '/login' do
		erb :login
	end

	get '/register' do
		erb :register
	end

	post '/login' do
		params.to_json
	end

	post '/register' do
		params.to_json
	end

end
```

#### config.ru

```ruby
require './controllers/UserController'
```

and

```ruby
map('/user') {
	run UserController
}
```

</details>

---

:red_circle: Commit: "User login/register templates, User controller with dummy routes (that just send back JSON)"

---

### 19. Make the post route for login actually do the login.

Remember to set session variables appropriately--is the user logged in?  Once they've successfully logged in, tell them "logged in as...." using the messaging functionality you just built.

Hint: try .find_by 

>Ok we said don't google, but if you want to read about ActiveRecord .find_by method real quick, that's ok. Don't spend 45 minutes reading stackoverflow posts by confused people. Just read about the method in the the ActiveRecord Query methods docs for like 1 minute. But you can probably just use .find_by without even doing that.

<details>
	
#### controllers/UserController.rb

```ruby
	post '/login' do
		@user = User.find_by(username: params[:username])

		if @user && @user.password == params[:password]
			session[:username] = @user.username
			session[:logged_in] = true
			session[:message] = "Logged in as #{@user.username}"
			redirect '/items'
		else
			session[:message] = "Invalid username or password."
			redirect '/user/login'
		end
	end
```

</details>
<br>

---

:red_circle: Commit: "Login works"

---

### 20. Make the register route work.

Remember session stuff. 

>Tip: Don't be rude to the user by forcing them to log in again after registering. Registering should automatically log them in.

<details>

#### controllers/UserController.rb

```ruby
	post '/register' do
		@user = User.new
		@user.username = params[:username]
		@user.password = params[:password]
		@user.save
		session[:logged_in] = true
		session[:username] = @user.username
		session[:message] = "Thank you for registering (as #{@user.username}).  Enjoy the site!"
		redirect '/items'
	end
```
</details>
<br>

---

:red_circle: Commit: "Register works"

---

### 21.  Add login info/links to nav.  

When the user is logged in, it should say, at the top of the page "Logged in as (username)" and show a logout link. 

If the user is not logged in, only a Log In link should be displayed there.

<details>

#### public/css/style.css

```css
nav {
	display: flex;
	justify-content: space-between;
}
```

#### views/layout.erb

```erb
	<nav>
		<div>
			<p>Nav:</p>
			<a href="/items">Item list</a> •
			<a href="/items/add">Add Items</a>
		</div>
		<div>
			<% if !session[:logged_in] %>
				<a href="/user/login">Login</a>
			<% else %>
				<p>Logged in as <%= session[:username] %></p>
				<a href="/user/logout">Logout</a>
			<% end %>
		</div>
	</nav>
```

</details>
<br>

---

:red_circle: Commit: "Logged in as.... in nav"

---

### 22. Create a logout route

<details>
	
```ruby
	get '/logout' do
		session[:username] = nil
		session[:logged_in] = false
		redirect '/user/login'
	end
```
</details>


---

:red_circle: Commit: "Logout works"

---

### 23. "You must be logged in to do that"

In Express we could have written router-level middleware like this at the top of our controller:

```js
app.use((req, res, next) => {
	if(!session.loggedIn) {
		req.session.message = "You must be logged in to do that."
		res.redirect('/user/login');
	} else {
		next();
	}
}) 
```

Writing actual Middleware for Rack-based apps is a little more complex, so we will create a _filter_ with `before` to achieve similar functionality.  

#### controllers/ItemController.rb

```ruby
# this is called a filter and will be run before all requests in this route
before do
	if !session[:logged_in]
		session[:message] = "You must be logged in to do that"
		redirect '/user/login'
	end
end
```

---

:red_circle: Commit: "You must be logged in to do that."

---

### 24. Track `user_id` in session

This is a critical step towards having multiple users!

* In your login and register routes, set `session[:user_id]`.
* Remember to set it to back to `nil` in the logout route.
* Update your item create route to use `session[:user_id]` for inserts instead of the `1` we hard-coded in during step 10.

<details>
	
#### controllers/UserController.rb 

In the login route:

```ruby
session[:user_id] = @user.id
```

In the register route:

```ruby
session[:user_id] = @user.id
```

In the logout route: 

```ruby
session[:user_id] = nil
```

#### controllers/ItemController.rb

In the item create route: 

```ruby
@item.user_id = session[:user_id]
```

</details>

---

:red_circle: Commit: "Stores user_id in session. Updated item create route to use it."

---

### 25. Using bcrypt with sinatra

For this step we will need to modify our database structure to store password hashes (ActiveRecord calls them `password_digest`s) instead of plain-text passwords.

* Stop your server.
* In your migrations file, in the `CREATE TABLE users` statement, change `password` to be: `password_digest`. It MUST be `VARCHAR(60)`--don't use a different number. The rest of the file is fine as is.
* Open `psql`.  Drop the entire database.
* Copy `db/migrations.sql` and paste it into the `psql` console.
* Do whatever investigating you need to do in the psql console to convince yourself everything went as you hoped.

Now, here's a little more ActiveRecord fairy dust. Here's how you set up the user model to bcrypt...just add one line:

#### models/UserModel.rb

```ruby
class User < ActiveRecord::Base
	has_secure_password # ridiculous
	
end
```

Now, if you're trigger happy, and you already tried it, you'll see that we're not quite done yet. You must update your login route where you check the password:

#### controllers/UserController.rb, in the login route:

First, grab the password in the very first line of the route: 

```ruby
post '/login' do
	@pw = params[:password]

...	
```

Then, a few lines down, change your if statement after `User.find` or `User.find_by`: 

```ruby
		# this is what you probably had before adding crypt. delete it
		# if @user && @user.password == params[:password] 

		# ... and add this instead
		if @user && @user.authenticate(@pw)
```

If everything went as planned, then you just implemented bcrypt authentication! Create a username.... actually, create a few usernames, and check in `psql` (`SELECT * FROM USERS;`) and you should see that the passwords are being encrypted.

---

:red_circle: Commit: "Added bcrypt"

---

### 26. Implement relations to fully achieve multiple users.

Ok here's some sweet ActiveRecord magic stuff.

Set up the relations. A user "has many" items, and each item "belongs to" one user. These are "relational data" phrases. They are not arbitrary. 

So.....

#### models/ItemModel.rb

```ruby
class Item < ActiveRecord::Base
	belongs_to :user # add this
end
```

and...

#### models/UserModel.rb

```ruby
class User < ActiveRecord::Base
	has_secure_password

	has_many :items # add this
end
```

Then in your item index route you can just do this: 

#### controllers/ItemController.rb

```ruby
		# @items = Item.all # delete this and replace with: 

		@user = User.find session[:user_id]

		# How cool is this
		@items = @user.items
```

Once again, head on over to your console and check out what SQL this is writing for you. Pretty sweet!

Now if you log in with different users and add items, you should only see the items for whoever you're logged in as.

> Did you notice that we have not done much to prevent hijacking -- ie, someone could update an item that's not theirs. How would that work and how could we stop it? Where are holes in our "security"?

---

:red_circle: Commit: "Added relations and updated item index to use it"

---

Cool so, now you can pretty do everything with Sinatra that you were doing with Express.

# You completed the lab/homework! Good job! 

## Hungry for more?

* Separate the back and front end: 
 * Add jQuery to the `layout.erb`. 
 * Create additional routes (leave the old ones) that do the same CRUD operations using ActiveRecord, but that only send back JSON.  ***Use Postman to build and test your routes***. (See note below about ignoring security)
 * Once the user logs in, render (or provide a link to) a new view `:item_index_ajax` that is similar to `item_index` but without the `<forms>`. **Do NOT print the items with erb.** Instead, add client-side JS **AT THE BOTTOM** of `item_index_ajax`, and in your client-side JS, have an ajax 'GET' call that runs when the page loads. If it gets a successful response, that AJAX call's will include (or call a function that includes) logic to add the items to the page using jQuery DOM manipulation.
  * Each item will still have a delete `<button>`. Just no forms. There won't be any `<form>`s at all.
  * For updating, there will be an "Edit" link for each item that will show a input (NO `<FORM>`, just `<input>`) with the item data already populated, and an "update button." 
  * There will also be an 'Add Item' input and an 'Add Item' button that are always on the page.  
 * Make the add, delete, and update buttons send AJAX requests (using jQuery's `$.ajax`) to your new routes, and when they get JSON back, they will update the html on the page accordingly with DOM manipulation. There should be no page refreshing for any `/item` routes. 
 * Rember to clear the Add Item input field when you do a successful add, and hide the update form once you've successfully updated.
 * Note: For this entire part, if you need to somehow disable security or have these new routes not check if the user is logged in, to get everything working, that's ok.
  

