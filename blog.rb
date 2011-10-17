require 'yaml'

class Blog
  
  def set_posts
    yml = File.read("content/manifest.yml")
    @posts = YAML::load(yml)
  end
  
  def posts
    if !@posts
      self.set_posts
    end
    @posts
  end
  
  def prep_post(post)
    post[:content] = load_content(post[:slug])
    post[:date] = Time.parse(post[:date])
    return post
  end
  
  def prep_posts(posts)
    prepped_posts = []
    posts.each do |post|
      prepped_posts << self.prep_post(post)
    end
    return prepped_posts
  end
  
  def markdown(content)
    options = [ :hard_wrap, :autolink, :no_intraemphasis, :fenced_code ]
    Redcarpet.new(content, *options).to_html
  end
  
  def load_content(slug)
    markdown(File.read("content/#{slug.to_s}.md"))
  end
  
end
