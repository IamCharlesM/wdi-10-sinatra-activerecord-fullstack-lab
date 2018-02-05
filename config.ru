require 'sinatra/base'
require 'sinatra/activerecord'

# controllers
require './controllers/ApplicationController'
require './controllers/ItemController'
require './controllers/UserController'

# models
require './models/ItemModel'
require './models/UserModel'

# routes
map ('/') {
	run ApplicationController
}

map ('/items') {
	run ItemController
}

map ('/user') {
	run UserController 
}