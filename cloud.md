---
title: Cloud Deployment
layout: default
sidebar: combined-sidebar.html
includeNavigation: false
---

# {{page.title}}
SiteWhere has been designed from the ground up to work well in both local, on-premise
installations and when deployed as a cloud application. SiteWhere images have been created
for many of the popular cloud providers as well a cross-platform architectures. Below
are some of the available cloud deployment choices.

## Cloud Provider Images

### Amazon EC2
SiteWhere images for most recent versions are available as Amazon Machine Images that
can be used on Amazon EC2. The images include SiteWhere Server CE, a MonogDB database,
and the free version of the HiveMQ MQTT broker. A complete tutorial for deploying on
Amazon EC2 is available [here]({{ site.url}}/cloud/amazon_ec2.html).

### Microsoft Azure
A SiteWhere image is available on [VM Depot](https://vmdepot.msopentech.com/Vhd/Show?vhdId=50246&version=51392)
for deployment on Mirosoft Azure. The image includes SiteWhere Server CE, a MonogDB database,
and the free version of the HiveMQ MQTT broker. To deploy more recent SiteWhere versions,
the recommended approach is to use the [SiteWhere Juju Charm](https://jujucharms.com/u/sitewhere/sitewhere/trusty/7) 
for deployment.

## Cross-Platform Deployment Options

### Docker
SiteWhere provides a [repository](https://hub.docker.com/r/sitewhere/sitewhere/) of images on Docker Hub
that can be used to start instances on any environment that supports Docker.

### Ubuntu Juju
SiteWhere provides a [charm](https://jujucharms.com/u/sitewhere/sitewhere/trusty/) that allows it to 
easily be deployed to all of the environments Juju supports including OpenStack, Microsoft Azure, 
Amazon EC2, VMware, and many other providers. Juju also supports running a local container and 
deploying to it. A complete tutorial for deploying SiteWhere on Juju is available
[here]({{ site.url}}/cloud/juju.html)