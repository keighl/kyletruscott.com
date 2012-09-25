load "config/recipes/base"
load "config/recipes/nginx"
load "config/recipes/thin"
load "config/recipes/rbenv"
load "config/recipes/bundle"

set :application, "keighl.com"
set :repository, "https://ee354fbdde7320b9a5aac89605de6a77d2ebe28e@github.com/keighl/keighl.com.git"
set :stages, %w(staging)
set :use_sudo, false

ssh_options[:keys] = [File.join(ENV["HOME"], ".ssh", "clamdev.pem")]

require "capistrano/ext/multistage"
require 'capistrano_colors'