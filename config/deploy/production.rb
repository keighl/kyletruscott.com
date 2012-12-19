server "54.243.210.160", :web, :app, :db, :primary => true

set (:user) { "ubuntu" }
set (:application) { "keighl.com" }
set (:deploy_to) { "/home/#{user}/#{application}" }
set (:deploy_env) { 'production' }
set (:branch) { 'master' }
set (:thin_servers) { 1 }
set (:nginx_server) { "keighl.com" }