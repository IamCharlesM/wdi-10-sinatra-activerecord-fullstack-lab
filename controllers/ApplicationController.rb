class ApplicationController < Sinatra::Base

	require 'bundler'
	Bundler.require()

	get '/' do
		"SERVER 👍"
	end
	
end