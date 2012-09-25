def template(from, to)
  erb = File.read(File.expand_path("../templates/#{from}", __FILE__))
  put ERB.new(erb).result(binding), to
end

def set_default(name, *args, &block)
  set(name, *args, &block) unless exists?(name)
end

namespace :deploy do

  set_default :enable_submodules, false

  desc "Install core software onto the server"
  task :install, roles: :web do
    commands = []
    commands << "#{sudo} apt-get -y upgrade;"
    commands << "#{sudo} apt-get -y update;"
    commands << "#{sudo} apt-get -y install git-core;"
    commands << "#{sudo} apt-get -y install python-software-properties;"
    run commands.join(";")
  end

  desc "Deploy the code"
  task :default do
    update_code
    bundle.install
    thin.restart
    # cleanup ----- nothing to cleanup!
  end

  desc "Setup a GitHub-style deployment."
  task :setup, :except => { :no_release => true } do
    commands = []
    commands << "mkdir -p #{deploy_to}"
    commands << "git clone #{repository} #{deploy_to}"
    run commands.join(";")
  end

  desc "Update the deployed code."
  task :update_code, :except => { :no_release => true } do
    commit   = ENV['COMMIT'] || "origin/#{branch}"
    commands = []
    commands << "cd #{deploy_to}; git fetch origin; git reset --hard #{commit}"
    commands << "cd #{deploy_to}; git submodule init; git submodule -q sync; git submodule -q update" if enable_submodules
    run commands.join(";")
  end

  task :configure do
    bundle.install
    thin.configure
    thin.restart
    nginx.configure
    nginx.restart
  end;
end

namespace :rollback do
  task :default do
    set :branch, "HEAD^"
  end
end