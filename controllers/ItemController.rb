class ItemController < ApplicationController

	# index route
	get '/' do
		"we have item control"		
	end

	# add route
	get '/add' do
		@page = "Add Items"
		@action = "/items/add"
		@method = "POST"
		@placeholder = "I AM HUNGRY"
		@value = ""
		@buttontext = "~*~ADD IT~*~🏈"
		# res.render()
		erb :add_item
	end

end