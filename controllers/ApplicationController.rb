class ApplicationController < Sinatra::Base

	require 'bundler'
	Bundler.require()

	set :views, File.expand_path('../views', File.dirname(__FILE__))

	ActiveRecord::Base.establish_connection(
 		:adapter => 'postgresql', 
 		:database => 'item'
	)

	get '/' do
		# "SERVER 👍"
		@page = "hello"
		erb :hello
	end

end