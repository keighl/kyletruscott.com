require 'rubygems'
require 'yaml'
require 'haml'
require 'sinatra/base'
require 'redcarpet'


PAGE_LIMIT       = 2
SITE_NAME        = "Keighl"
SITE_DESCRIPTION = "#programmer #nyc"

class Keighl < Sinatra::Base

  configure do |c|

    # Bootstrap
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :hard_wrap => true, :autolink => true, :no_intraemphasis => true, :fenced_code => true)
    posts    = YAML::load(File.read("content/manifest.yml"))
    total    = posts.count
    pages    = total.fdiv(PAGE_LIMIT).ceil

    # Markdown
    posts.each do |post|
      content        = File.read("content/#{post[:slug].to_s}.md")
      post[:content] = markdown.render(content)
      post[:date]    = post[:date]
    end

    set :posts, posts
    set :pages, total.fdiv(PAGE_LIMIT).ceil
    set :total, posts.count

  end

  get '/' do
    page         = 1
    @prev        = nil
    @next        = (settings.pages == page) ? nil : page + 1;
    @posts       = settings.posts[0, PAGE_LIMIT]
    @title       = SITE_NAME
    @description = SITE_DESCRIPTION

    headers 'X-Hacker' => "annyeong."

    erb :archive
  end

  get %r{/page/([\d]+)} do
    page   = params[:captures].first.to_i
    offset = (page - 1) * PAGE_LIMIT
    @posts = settings.posts[offset, PAGE_LIMIT]
    if @posts.empty?
      halt 404, erb(:not_found)
    end
    @prev        = (page == 1) ? nil : page - 1
    @next        = (settings.pages == page) ? nil : page + 1;
    @title       = "Page #{page} | #{SITE_NAME}"
    @description = SITE_DESCRIPTION

    headers 'X-Hacker' => "annyeong."

    erb :archive
  end

  get '/post/:slug/?' do

    @post = settings.posts.find { |post| post[:slug] == params[:slug] }

    headers 'X-Hacker' => "annyeong."

    if @post
      @title       = "#{@post[:title]} | #{SITE_NAME}"
      @description = @post[:description]
      erb :post
    else
      halt 404, erb(:not_found)
    end

  end

  get '/feed' do
    @posts = settings.posts[0, 10]
    content_type 'application/rss+xml'
    haml(:rss, :format => :xhtml, :escape_html => true, :layout => false)
  end

  not_found do
    headers 'X-Hacker' => "annyeong."
    erb :not_found
  end

  run! if app_file == $0

end
