namespace :thin do

  set_default :thin_servers, 3
  set_default :thin_port, 3000
  set_default :thin_address, "127.0.0.1"

  desc "Install the thin rack engine"
  task :configure do
    set_default :thin_config_path, "#{deploy_to}/tmp/thin.yml"
    set_default :thin_log_path, "#{deploy_to}/log/thin.log"
    set_default :thin_pid_path, "#{deploy_to}/tmp/pid/thin.pid"

    template "thin.yaml.erb", "/tmp/thin.yml"
    run "mkdir -p #{deploy_to}/tmp"
    run "#{sudo} mv /tmp/thin.yml #{thin_config_path}"
  end

  %w[start stop restart].each do |command|
    desc "#{command} nginx"
    task command, roles: :web do
      run "cd #{deploy_to}; bundle exec thin #{command} -C #{deploy_to}/tmp/thin.yml"
    end
  end
end
