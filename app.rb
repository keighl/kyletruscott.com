require 'rubygems'
require 'yaml'
require 'haml'
require 'sinatra'
require 'redcarpet'
require './blog.rb'

PAGE_LIMIT       = 1
SITE_NAME        = "keighl"
SITE_DESCRIPTION = "#programmer #nyc"

get '/' do
  
  blog         = Blog.new
  @posts       = blog.prep_posts(blog.posts)
  total        = @posts.count
  pages        = total.fdiv(PAGE_LIMIT).ceil
  page         = 1
  @prev        = nil
  @next        = (pages == page) ? nil : page + 1;
  @posts       = @posts[0, PAGE_LIMIT]
  @title       = SITE_NAME
  @description = SITE_DESCRIPTION
  
  headers 'X-Hacker' => "annyeong."

  erb :archive

end

get %r{/page/([\d]+)} do
  
  blog  = Blog.new
  @posts = blog.prep_posts(blog.posts)
  total  = @posts.count
  pages  = total.fdiv(PAGE_LIMIT).ceil
  page   = params[:captures].first.to_i
  offset = (page - 1) * PAGE_LIMIT
  @posts = @posts[offset, PAGE_LIMIT]
  
  if @posts.empty?
    halt 404, erb(:not_found)
  end
  
  @prev        = (page == 1) ? nil : page - 1
  @next        = (pages == page) ? nil : page + 1;
  @title       = "Page #{page} | #{SITE_NAME}"
  @description = SITE_DESCRIPTION
  
  headers 'X-Hacker' => "annyeong."
  
  erb :archive
  
end

get '/post/:slug' do
  
  blog  = Blog.new
  @post = blog.posts.find { |post| post[:slug] == params[:slug] }
  
  headers 'X-Hacker' => "annyeong."

  if @post
    @post        = blog.prep_post(@post)
    @title       = "#{@post[:title]} | #{SITE_NAME}"
    @description = @post[:description]
    erb :post
  else
    halt 404, erb(:not_found)
  end
  
end

get '/feed' do
  blog  = Blog.new
  @posts = blog.posts
  @posts = @posts[0, 10]
  @posts = blog.prep_posts(@posts)
  content_type 'application/rss+xml'
  haml(:rss, :format => :xhtml, :escape_html => true, :layout => false)
end

not_found do
  headers 'X-Hacker' => "annyeong."
  erb :not_found
end