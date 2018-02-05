require 'sinatra/base'
require 'sinatra/activerecord'

# controllers
require './controllers/ApplicationController'
require './controllers/ItemController'

# models

# routes
map ('/') {
	run ApplicationController
}
map ('/items') {
	run ItemController
}