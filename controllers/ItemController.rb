class ItemController < ApplicationController

	# the code this filter will be run on all /item routes
	before do
		if !session[:logged_in]
			session[:message] = "You must be logged in to do that"
			redirect '/user/login'
		end
	end

	get '/ajax' do
		erb :item_index_ajax
	end

	# index route
	get '/' do
		@user = User.find session[:user_id]

		@items = @user.items.order(:id) # how fucking cool is this

		erb :item_index
	end

	# json index route
	get '/j' do
		@user = User.find session[:user_id]
		@items = @user.items.order(:id)
		# building our API response
		# instead of just sending back random json
		resp = {
			status: {
				all_good: true,
				number_of_results: @items.length
			},
			items: @items
		}
		resp.to_json

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

	# edit route
	get '/edit/:id' do
		@item = Item.find params[:id]
		@page = "Edit item #{@item.id}"
		erb :edit_item
	end

	# API edit route
	get '/j/edit/:id' do
		@item = Item.find params[:id]
		resp = {
			status: {
				all_good: true,
				message: "Item found. Sending back item #{params[:id]}"
			},
			item: @item
		}
		resp.to_json
	end 

	# create route
	post '/add' do 
		pp params
		# "good job you posted check termins"

		@item = Item.new
		@item.title = params[:title]
		@item.user_id = session[:user_id]
		@item.save

		session[:message] = "You added item #{@item.id}"

		# @item.to_json
		redirect '/items'

	end

	post '/j' do
		@item = Item.new
		@item.title = params[:title]
		@item.user_id = session[:user_id]
		@item.save

		resp = {
			# you could include a message or something
			# you could include pagination info
			status: {
				all_good: true
				# you could put other infor here
			},
			item: @item
		}
		resp.to_json

	end

	delete '/:id' do
		@item = Item.find params[:id]
		@item.delete
		session[:message] = "You deleted item #{@item.id}"
		redirect '/items'
	end

	# API delete route
	delete '/j/:id' do
		@item = Item.find params[:id]
		@item.delete
		resp = {
			status: {
				all_good: true,
				message: "Deleted item #{params[:id]}"
			}
		}
		resp.to_json
	end

	#update route
	patch '/:id' do
		@item = Item.find params[:id]
		@item.title = params[:title]
		@item.save
		session[:message] = "You updated item #{@item.id}"
		redirect '/items'
	end

	# API update route
	patch '/j/:id' do
		@item = Item.find_by(id: params[:id])
		@item.title = params[:title]
		@item.save

		resp = {
			status: {
				all_good: true,
				message: "updated item #{@item.id}"
			},
			item: @item
		}
		resp.to_json

	end

end




