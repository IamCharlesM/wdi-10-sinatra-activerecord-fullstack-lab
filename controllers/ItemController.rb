class ItemController < ApplicationController

	# index route
	get '/' do
		"we have item control"		
	end

	# add route
	get '/add' do
		erb :add_item
	end

end