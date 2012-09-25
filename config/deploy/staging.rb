server "54.243.210.160", :web, :app

set (:user) { "ubuntu" }
set (:deploy_to) { "/home/#{user}/www/#{application}" }
set (:deploy_env) { 'staging' }
set (:rails_env) { 'staging' }
set (:branch) { 'master' }

set (:nginx_server_name) { 'keighl.com' }
