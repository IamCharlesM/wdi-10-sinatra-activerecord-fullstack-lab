class ItemController < ApplicationController

	# index route
	get '/' do
		# "we have item control"		
		@items = Item.all
		# @items.to_json
		erb :item_index
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

	# create route
	post '/add' do 
		pp params
		# "good job you posted check termins"

		@item = Item.new
		@item.title = params[:title]
		@item.user_id = 1
		@item.save

		# @item.to_json
		redirect '/items'

	end

end