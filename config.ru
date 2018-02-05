require 'sinatra/base'
require 'sinatra/activerecord'

# controllers
require './controllers/ApplicationController'

# models

# routes
map ('/') {
	run ApplicationController
}