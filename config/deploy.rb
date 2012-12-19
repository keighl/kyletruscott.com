require "capistrano/ext/multistage"
require 'capistrano_colors'
require "bundler/capistrano"

def template(from, to)
  erb = File.read(File.expand_path("../templates/#{from}", __FILE__))
  put ERB.new(erb).result(binding), to
end

set :application, "keighl.com"
set :repository, "git@github.com:keighl/keighl.com.git"
set :stages, %w(production)
set :use_sudo, false
set :deploy_via, :remote_cache
set :keep_releases, 2

set :default_environment, {
  'PATH' => "$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH"
}

ssh_options[:forward_agent] = true

after "deploy:setup", "deploy:config"
after "deploy:restart", "deploy:cleanup"
after "deploy:config", "nginx:restart"
after "deploy:update_code", "bundle:install"

namespace :deploy do

  desc "Deploy the MFer"
  task :default do
    update
    restart
    cleanup
  end

  desc "Setup a GitHub-style deployment."
  task :setup, :except => { :no_release => true } do
    run "git clone #{repository} #{current_path};"
    run "cd #{current_path}; git checkout #{branch}"
    run "cd #{current_path}; git submodule -q foreach git pull origin master"
  end

  desc "Update the deployed code."
  task :update_code, :except => { :no_release => true } do
    run "cd #{current_path}; git pull origin #{branch};"
    run "cd #{current_path}; git submodule -q foreach git pull origin master"
  end

  task :config, :roles => :app do
    nginx.config
    thin.config
  end

  task :cleanup do
    logger.info "Nothing to cleanup!"
  end

  task :create_symlink do
    logger.info "Nothing to symlink!"
  end

  task :restart do
    thin.restart
  end
end

namespace :nginx do
  %w[start stop restart].each do |command|
    desc "#{command} nginx"
    task command, roles: :app do
      run "sudo /etc/init.d/nginx #{command}"
    end
  end

  task :config, :roles => :app do
    template "nginx.erb", "/tmp/nginx.conf"
    run "mkdir -p #{deploy_to}/tmp"
    run "#{sudo} mv /tmp/nginx.conf /etc/nginx/sites-enabled/#{application}.conf"
    run "mkdir -p /home/#{user}/www; touch /home/#{user}/www/index.html"
  end
end

namespace :thin do
  %w[start stop restart].each do |command|
    desc "#{command} thin"
    task command, roles: :app do
      run "cd #{current_path}; bundle exec thin #{command} -C #{deploy_to}/tmp/thin.yml"
    end
  end

  task :config, :roles => :app do
    template "thin.yml.erb", "/tmp/thin.yml"
    run "mkdir -p #{deploy_to}/tmp"
    run "mkdir -p #{shared_path}/pids"
    run "mkdir -p #{shared_path}/logs"
    run "mv /tmp/thin.yml #{deploy_to}/tmp/thin.yml"
  end
end

namespace :delayed_job do
  %w[start stop restart].each do |command|
    desc "#{command} thin"
    task command, :roles => :worker do
      run "mkdir -p #{current_path}/tmp/pids"
      run "cd #{current_path}; RAILS_ENV=#{rails_env} script/delayed_job #{command}"
    end
  end
end

namespace :bundle do
  desc 'Install gems'
  task :install, :except => {:no_release => true} do
    bundle_cmd     = fetch(:bundle_cmd, 'bundle')
    bundle_flags   = fetch(:bundle_flags, '--deployment')
    bundle_without = [*fetch(:bundle_without, [:development, :test])].compact
    args           = [bundle_flags.to_s, "--quiet"]
    args << "--without #{bundle_without.join(' ')}" unless bundle_without.empty?
    run "cd #{current_path} && #{bundle_cmd} install #{args.join(' ')}; rbenv rehash;"
  end
end

namespace :deploy do
  desc 'Deploy & migrate'
  task :migrations do
    update
    restart
    cleanup
  end

  desc 'Run migrations'
  task :migrate, :roles => :db, :only => {:primary => true} do
    run "cd #{current_path} && RAILS_ENV=#{rails_env} bundle exec rake db:migrate"
  end
end

namespace :assets do
  task :precompile, :only => { :primary => true } do
    run_locally("mkdir -p public/__assets")
    run_locally("mv public/__assets public/assets")
    run_locally("bundle exec rake assets:clean_expired; bundle exec rake assets:precompile;")
    servers = find_servers :roles => [:app, :worker], :except => { :no_release => true }
    servers.each do |s|
      run_locally("rsync -av ./public/assets/ #{user}@#{s}:#{current_path}/public/assets/;")
    end
    run_locally("mv public/assets public/__assets")
  end
end

namespace :cache do
  task :install_locally, :roles => :app do
    run "#{sudo} apt-get -y install memcached"
  end
end