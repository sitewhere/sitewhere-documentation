---
title: Installing SiteWhere
layout: default
sidebar: sidebar.html
prevLink: userguide.html
prevTitle: SiteWhere User Guide
nextLink: userguide/global-configuration.html
nextTitle: Global Configuration
---

# {{page.title}}
SiteWhere provides many options for installation depending on user requirements. There are options
for running SiteWhere locally or in various cloud environments.

## Installing Locally on Linux
Installing SiteWhere locally with the default configuration requires three components: a SiteWhere
server distribution, a MongoDB instance, and an MQTT broker. The following steps can be executed on
a new Ubuntu 14.04 (or similar) instance. Similar commands should work on other Linux/Unix variants.

### Update Components and Install Required Tools
Start by making sure the Ubuntu instance is running the latest versions of its included software. Also,
the following steps will install the **unzip** command and a JDK.

{% highlight bash %}
sudo su
add-apt-repository ppa:openjdk-r/ppa
apt-get update -y
apt-get install unzip openjdk-8-jdk
{% endhighlight %}

### Install MongoDB for Persistence
The default SiteWhere configuration uses MongoDB for persistence of device management and event data.
Other persistence stores such as Apache HBase and InfluxDB may also be used. The commands below will
install MongoDB with the default settings.

{% highlight bash %}
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
apt-get update
apt-get install -y mongodb-org
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections
service mongod start
{% endhighlight %}

### Install the HiveMQ MQTT Broker
The default SiteWhere configuration uses MQTT for receiving device event data and sending device commands.
HiveMQ provides a free edition with a limited number of connections that works well for most situations.

{% highlight bash %}
cd /opt
wget --content-disposition https://s3.amazonaws.com/sitewhere-hivemq/hivemq-3.0.2.zip
unzip hivemq-3.0.2.zip
wget --content-disposition https://s3.amazonaws.com/sitewhere-hivemq/config.xml
mv config.xml hivemq-3.0.2/conf
cd hivemq-3.0.2/bin
./run.sh &
{% endhighlight %}

HiveMQ is run as a background task. Press *enter* a to return to a command prompt.

### Install a SiteWhere Server Release
These steps will download a SiteWhere distribution from the community website and
install it locally.

{% highlight bash %}
cd /opt
wget https://s3.amazonaws.com/sitewhere/sitewhere-server-1.7.0.tgz
tar -zxvf sitewhere-server-1.7.0.tgz
mv sitewhere-server-1.7.0 /opt/sitewhere
export SITEWHERE_HOME=/opt/sitewhere
cd /opt/sitewhere/bin
sh startup.sh
{% endhighlight %}

## Installing Locally on Windows
Installing SiteWhere locally with the default configuration requires three components: a SiteWhere
server distribution, a MongoDB instance, and an MQTT broker. The following steps can be executed on
any recent Windows release including Windows 7-10.

### Installing MongoDB
Install MongoDB by following the instructions [here](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/).

### Installing HiveMQ
Install HiveMQ by following the instructions [here](http://www.hivemq.com/resources/getting-started/).

### Installing SiteWhere Server
Download the latest SiteWhere release from the community [downloads](http://www.sitewhere.org/downloads) page.
Unzip the archive, then navigate to the **bin** folder and run **startup.bat**.

## Running in the Cloud

### Amazon EC2 and Microsoft Azure
Probably the easiest method of getting started with SiteWhere is to spin up a pre-configured cloud 
instance on your favorite cloud provider. SiteWhere images are currently available for 
[Amazon EC2](http://aws.amazon.com/ec2/) and [Microsoft Azure](http://azure.microsoft.com/en-us/).
The images include SiteWhere server with a MongoDB database which is populated with sample data. 
They also includes the free edition of HiveMQ MQTT broker and an installation of Apache Solr
configured to handle SiteWhere analytics. Detailed instructions are available
[here](../cloud.html).

### Docker Image
SiteWhere is also available as a Docker image which may be downloaded from
[Docker Hub](https://registry.hub.docker.com/u/sitewhere/sitewhere/). The SiteWhere image
may be executed on any cloud platform that implements a Docker engine.
