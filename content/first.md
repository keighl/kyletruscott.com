There are three major components of every web project that require redundancy in order for FA to mitigate liability and to avoid cluster f***s in general.

* Codebase
* Database
* UGC media
* Server

Often we don't have the capability to achieve all these protocols; for instance if we don't have root access to an environment we cannot install duplicity. However it is important the every project hit as many elements of this strategy as possible.

## Codebase

### Protocol

All projects, regardless of size should be stored in an version control system (github, beanstalk). All development and changes **MUST** committed to the repository.

# Database

Since the database in a production environment is likely changing and growing without our supervision, we **MUST** implement a regular and systematic backup of the entire database(s).

### Protocol

* In a folder outside of the web root directory, create a folder named `db_backup`. 
* In this directory add the following bash script, `db_backup.sh`.
* Configure the bash script to dump ALL relevant databases to the directory. This script will prune backups over **14 days** old.
* Create a cron job to automatically run the script:
	* `@hourly` - for frequently changing data
	* `@daily` - for more stable data
* You **MUST** test the script, and confirm the data is being exported entirely.

<pre class="prettyprint lang-bash">
#!/bin/bash

DB="name_of_db"
DATE=`date +%s`
USER="root"
PASS="password"

cd /path/to/db_backup

echo "Exporting DB ----------->"
echo $DB
mysqldump -u$USER -p$PASS --skip-extended-insert $DB > $DB-$DATE.sql
echo "......... Done!"

MaxFileAge=14 #days
find /path/to/db_backup -name '*.sql' -type f -mtime +$MaxFileAge -exec rm -f {} \;
</pre>

<pre class="prettyprint lang-bash">
#crontab
@hourly bash /path/to/db_backup/db_backup.sh
</pre>

------------------------

# UGC Media

UGC media are files that live outside the of the Codebase repository. For instance, CMS uploads, user file submissions, etc.

We **MUST** implement this backup protocol if we cannot install Duplicity to the server. If there are no mission critical files outside the codebase, we don't need to implement this strategy.

### Protocol 

* in a folder outside the web root, create a directory named `asset_backups`
* in this folder add the following bash script, `asset_backup.sh`. 
* Configure the script to backup the appropriate directory. The script will prune data older than **7 days**. This directory could become quite large, so decrease the backup TTL appropriately when it makes sense.
* Create a cron job to automatically run the script `@daily`.

<pre class="prettyprint lang-bash">
#!/bin/bash

NAME="target_directory"
DATE=`date +%s`

cd /path/to/target/directory # path to b

tar czvf /path/to/asset_backup/$NAME.$DATE.tgz .

MaxFileAge=7 #days
find /path/to/db_backup -name '*.tgz' -type f -mtime +$MaxFileAge -exec rm -f {} \;
</pre>

<pre class="prettyprint lang-bash">
#crontab
@daily bash /path/to/asset_backup/asset_backup.sh
</pre>

--------------------

# Server Images

### Protocol

If the hosting server facilitates it, setup daily **full disk image** backups. Rackspace Cloud Servers have this feature. 

--------------------

# Duplicity

* [Duplicity](http://duplicity.nongnu.org/)
* [Duplicity + S3 Install](http://icelab.com.au/articles/easy-server-backups-to-amazon-s3-with-duplicity/)

Duplicity is an incremental backup tool that will mirror a specified directory in an Amazon S3 bucket.If we have the ability to install the software, and setup it up, we **MUST** fullfill this strategy. 

### Protocol

First, install Duplicity.

<pre class="prettyprint lang-bash">
$ sudo apt-get install duplicity
$ sudo apt-get install python-boto
</pre>

Generate an encryption key. Record your passphrase, you'll need it later. During this stage, you'll need to beef up OS entroy. I found a good way to do this is to clone the Linux kernel through git simlutaneously. Downloading causes a lot of entropy. When it's done, delete the thing you downloaded.

<pre class="prettyprint lang-bash">
$ gpg --gen-key
</pre>


In the AWS account, create a bucket with the following naming convention:

* client.project.duplicity
* eg, yingli.rsvp.duplicity

Then, create a bash script, `duplicity.sh` in the home folder that will perform the incremental backup. It is important to select a directory that includes all relevant items for backup. Usually, the user's home folder would be a good choice. It's important that the backup includes:

* Codebase
* Database backups
* UGC media

<pre class="prettyprint lang-bash">
#!/bin/bash

export PASSPHRASE=your_gpg_passphrase
export AWS_ACCESS_KEY_ID=your_s3_access_key
export AWS_SECRET_ACCESS_KEY=+your_s3_secret

duplicity ~/ s3+http://CLIENT.PROJECT.duplicity
</pre>

Finally set up a crontab to run the script `@hourly`. Since the backup is incremental, the bandwidth should be relatively low. With hardly any real changes hour to hour. 
  
<pre class="prettyprint lang-bash">
#crontab
@hourly bash ~/duplicity.sh
</pre>