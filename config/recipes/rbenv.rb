namespace :rbenv do

  set_default :ruby_version, "1.9.3-p125"
  set_default :rbenv_bootstrap, "bootstrap-ubuntu-12-04"

  desc "Install rbenv, Ruby, and the Bundler gem"
  task :install, roles: :app do
    run "#{sudo} apt-get -y install curl git-core"
    run "curl -L https://raw.github.com/fesplugas/rbenv-installer/master/bin/rbenv-installer | bash"
    bashrc = <<-BASHRC
if [ -d $HOME/.rbenv ]; then
  export PATH="$HOME/.rbenv/bin:$PATH"
  eval "$(rbenv init -)"
fi
BASHRC
    put bashrc, "/tmp/rbenvrc"
    commands = []
    commands << "cat /tmp/rbenvrc ~/.bashrc > ~/.bashrc.tmp"
    commands << "mv ~/.bashrc.tmp ~/.bashrc"
    commands << %q{export PATH="$HOME/.rbenv/bin:$PATH"}
    commands << %q{eval "$(rbenv init -)"}
    commands << "rbenv #{rbenv_bootstrap}"
    commands << "rbenv install #{ruby_version}"
    commands << "rbenv global #{ruby_version}"
    commands << "gem install bundler --no-ri --no-rdoc"
    commands << "rbenv rehash"
    run commands.join(";")
  end

  after "deploy:install", "rbenv:install"
end