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