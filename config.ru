require 'sinatra/base'

# controllers
require './controllers/ApplicationController'

# models

# routes
map ('/') {
	run ApplicationController
}