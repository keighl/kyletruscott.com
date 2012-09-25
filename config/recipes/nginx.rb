namespace :nginx do

  set_default :nginx_client_max_body_size, "10M"
  set_default :nginx_port, 80
  set_default :nginx_server_name, "www.example.com"

  desc "Install latest stable release of nginx"
  task :install, roles: :web do
    commands = []
    commands << "#{sudo} add-apt-repository ppa:nginx/stable"
    commands << "#{sudo} apt-get -y update"
    commands << "#{sudo} apt-get -y install nginx"
    run commands.join(";")
  end
  after "deploy:install", "nginx:install"

  desc "Setup nginx configuration for this application"
  task :configure, roles: :web do
    template "nginx.erb", "/tmp/nginx_conf"
    commands = []
    commands << "#{sudo} mv /tmp/nginx_conf /etc/nginx/sites-enabled/#{application}"
    commands << "#{sudo} rm -f /etc/nginx/sites-enabled/default"
    run commands.join(";")
  end

  %w[start stop restart].each do |command|
    desc "#{command} nginx"
    task command, roles: :web do
      run "#{sudo} service nginx #{command}"
    end
  end
end
