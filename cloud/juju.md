---
title: Ubuntu Juju
layout: default
sidebar: sidebar.html
prevLink: cloud/amazon_ec2.html
prevTitle: Amazon EC2
nextLink: cloud.html
nextTitle: Cloud Deployment
---

# {{page.title}}
Ubuntu's [Juju](https://jujucharms.com/about/features) platform provides the scaffolding for building 
complex systems in a consistent way independent of the underlying infrastructure the components are 
being deployed on. Components are wrapped up as [charms](https://jujucharms.com/store) which are 
deployable services that can be used as building blocks for larger systems. Relationships can 
be established between services to allow them to interact.

SiteWhere provides a [charm](https://jujucharms.com/u/sitewhere/sitewhere/trusty/) that allows it to 
easily be deployed to all of the environments Juju supports including OpenStack, Microsoft Azure, 
Amazon EC2, VMware, and many other providers. Juju also supports running a local container and 
deploying to it. A great feature of Juju deployment is that commands are consistent across all 
environments. Deploying on your local environment is accomplished with exactly the same commands 
necessary for deploying to any of the cloud providers. Environment-specific settings are captured 
separately and become a non-factor in the deployment process.

## Deploying SiteWhere on Juju
The first step in deploying SiteWhere to Juju is setting up the Juju environment. The Juju [installation guide](https://jujucharms.com/get-started) provides an easy path to installing on your native operating 
system and deploying a sample application. With Juju up and running locally, we are ready to deploy 
SiteWhere and its dependencies. If you have not already done so, bootstrap a local Juju environment 
as shown below:

{% highlight bat %}
juju bootstrap -e local
{% endhighlight %}

The next step in deployment is to install the charms we will need to build the system. In this case, 
we need to install SiteWhere Server, MongoDB for the datastore, and Mosquitto for an MQTT broker. 
The components can be installed using the following commands:

{% highlight bat %}
juju deploy cs:~sitewhere/trusty/sitewhere sitewhere
juju deploy cs:~sitewhere/trusty/sitewhere-mongodb mongodb
juju deploy cs:~tasdomas/trusty/mosquitto
{% endhighlight %}

Juju will copy the files associated with the charms to the environment and run the built-in 
installation scripts to create the services. By default, Juju will create a single *unit* for 
each deployed service. By adding more units for a given service it can be scaled to handle a 
heavier load. Keep in mind that the default behavior in Juju is to use a separate virtual 
machine per unit, so when running in the cloud, adding more units will add to your bill. To 
check on the progress of Juju creating the units, type:

{% highlight bat %}
juju stat
{% endhighlight %}

The response will be in the form of a YAML document that describes all aspects of the current 
environment. While the units are allocating and installing the output will look something like 
below:

{% highlight yaml %}
environment: local
machines:
  "0":
    agent-state: started
    agent-version: 1.24.0.1
    dns-name: localhost
    instance-id: localhost
    series: utopic
    state-server-member-status: has-vote
  "1":
    agent-state: pending
    instance-id: osboxes-local-machine-1
    series: trusty
    hardware: arch=amd64
  "2":
    agent-state: pending
    instance-id: osboxes-local-machine-2
    series: trusty
    hardware: arch=amd64
  "3":
    agent-state: pending
    instance-id: osboxes-local-machine-3
    series: trusty
    hardware: arch=amd64
services:
  mongodb:
    charm: cs:~sitewhere/trusty/sitewhere-mongodb-1
    exposed: false
    service-status:
      current: unknown
      message: Waiting for agent initialization to finish
      since: 01 Aug 2015 15:54:05+01:00
    relations:
      replica-set:
      - mongodb
    units:
      mongodb/0:
        workload-status:
          current: unknown
          message: Waiting for agent initialization to finish
          since: 01 Aug 2015 15:54:05+01:00
        agent-status:
          current: allocating
          since: 01 Aug 2015 15:54:05+01:00
        agent-state: pending
        machine: "2"
  mosquitto:
    charm: cs:~tasdomas/trusty/mosquitto-0
    exposed: false
    service-status:
      current: unknown
      message: Waiting for agent initialization to finish
      since: 01 Aug 2015 15:54:25+01:00
    units:
      mosquitto/0:
        workload-status:
          current: unknown
          message: Waiting for agent initialization to finish
          since: 01 Aug 2015 15:54:25+01:00
        agent-status:
          current: allocating
          since: 01 Aug 2015 15:54:25+01:00
        agent-state: pending
        machine: "3"
  sitewhere:
    charm: cs:~sitewhere/trusty/sitewhere-7
    exposed: false
    service-status:
      current: unknown
      message: Waiting for agent initialization to finish
      since: 01 Aug 2015 15:53:50+01:00
    units:
      sitewhere/0:
        workload-status:
          current: unknown
          message: Waiting for agent initialization to finish
          since: 01 Aug 2015 15:53:50+01:00
        agent-status:
          current: allocating
          since: 01 Aug 2015 15:53:50+01:00
        agent-state: pending
        machine: "1"
{% endhighlight %}

The initialization process takes some time as Juju has to spin up the virtual machines, start them, 
then install the charm software. Whether you are running locally, on Amazon AC2, on Microsoft Azure, 
or elsewhere, the **juju stat** command will allow you to see the current state of the 
environment. In our case, the state when completed will have changed to:

{% highlight yaml %}
environment: local
machines:
  "0":
    agent-state: started
    agent-version: 1.24.0.1
    dns-name: localhost
    instance-id: localhost
    series: utopic
    state-server-member-status: has-vote
  "1":
    agent-state: started
    agent-version: 1.24.0.1
    dns-name: 10.0.3.138
    instance-id: osboxes-local-machine-1
    series: trusty
    hardware: arch=amd64
  "2":
    agent-state: started
    agent-version: 1.24.0.1
    dns-name: 10.0.3.76
    instance-id: osboxes-local-machine-2
    series: trusty
    hardware: arch=amd64
  "3":
    agent-state: started
    agent-version: 1.24.0.1
    dns-name: 10.0.3.97
    instance-id: osboxes-local-machine-3
    series: trusty
    hardware: arch=amd64
services:
  mongodb:
    charm: cs:~sitewhere/trusty/sitewhere-mongodb-1
    exposed: false
    service-status:
      current: unknown
      since: 01 Aug 2015 16:02:20+01:00
    relations:
      replica-set:
      - mongodb
    units:
      mongodb/0:
        workload-status:
          current: unknown
          since: 01 Aug 2015 16:02:20+01:00
        agent-status:
          current: idle
          since: 01 Aug 2015 16:02:23+01:00
          version: 1.24.0.1
        agent-state: started
        agent-version: 1.24.0.1
        machine: "2"
        open-ports:
        - 27017/tcp
        - 27019/tcp
        - 27021/tcp
        - 28017/tcp
        public-address: 10.0.3.76
  mosquitto:
    charm: cs:~tasdomas/trusty/mosquitto-0
    exposed: false
    service-status:
      current: unknown
      since: 01 Aug 2015 16:03:48+01:00
    units:
      mosquitto/0:
        workload-status:
          current: unknown
          since: 01 Aug 2015 16:03:48+01:00
        agent-status:
          current: idle
          since: 01 Aug 2015 16:03:50+01:00
          version: 1.24.0.1
        agent-state: started
        agent-version: 1.24.0.1
        machine: "3"
        open-ports:
        - 1883/tcp
        public-address: 10.0.3.97
  sitewhere:
    charm: cs:~sitewhere/trusty/sitewhere-7
    exposed: false
    service-status:
      current: blocked
      message: Waiting for MongoDB relation to be established.
      since: 01 Aug 2015 16:11:29+01:00
    units:
      sitewhere/0:
        workload-status:
          current: blocked
          message: Waiting for MongoDB relation to be established.
          since: 01 Aug 2015 16:11:29+01:00
        agent-status:
          current: idle
          since: 01 Aug 2015 16:11:31+01:00
          version: 1.24.0.1
        agent-state: started
        agent-version: 1.24.0.1
        machine: "1"
        open-ports:
        - 8080/tcp
        public-address: 10.0.3.138
{% endhighlight %}

Note that there is a lot more information available once the agents have started, including the 
public ip address where the unit can be reached and many other details. Also note that the 
**workload-status** field for unit **sitewhere/0** is marked as **blocked** indicating it is 
waiting on MongoDB to be attached.

The next step in creating a working system is to establish relations between the services. 
This provides details to the running units about how to interact with other units. For instance, 
establishing a relationship between SiteWhere and MongoDB passes the hostname and port SiteWhere 
needs to use to connect to MongoDB. Execute the commands below to establish the needed relations:

{% highlight bat %}
juju add-relation sitewhere mongodb
juju add-relation sitewhere mosquitto
{% endhighlight %}

After a short period of time, the relations will have been established. Executing 
the **juju stat** command will show the current status. Once the SiteWhere unit shows 
a status of **active**, the system is properly configured and ready to be used. By 
default, Juju runs units within a protected virtual network that prevents external 
access to the units. In order to access the SiteWhere administrative console, we 
need to ask Juju to expose the service as shown below:

{% highlight bat %}
juju expose sitewhere
{% endhighlight %}

The **exposed** flag on the SiteWhere service will change to **true** and port 8080 will 
become accessible. To test the configuration, open a browser and navigate to:

> http://{public.address}:8080/sitewhere/admin

The public address you use should be the one listed for the **sitewhere/0** unit. 
If everything went as expected, the SiteWhere administrative console machine should 
be displayed in the browser:

<a href="http://www.sitewhere.org/wp-content/uploads/2015/07/juju-login.png" data-lightbox="architecture" title="Admin Console Login">
	<img src="http://www.sitewhere.org/wp-content/uploads/2015/07/juju-login.png"/>
</a>

We now have a completely functional SiteWhere deployment including a MongoDB datastore 
and a Mosquitto MQTT broker configured.

## Changing the Default Configuration
In the deployment above we are falling back on the default system configuration, but 
SiteWhere is intended to be configurable so that many other protocols can be used. 
It is possible to use SSH to connect with the SiteWhere unit and directly edit the 
configuration file. To use this method, execute the following command:

{% highlight bat %}
juju ssh sitewhere/0
{% endhighlight %}

The **juju ssh** command is a simple way to interact directly with the internals of a unit. 
The downside of going this route is that reconfiguring multiple units requires an SSH into 
each one. Also, deploying new units for the service will start the units with the default 
configuration. Rather than manually configuring each unit, Juju allows configuration to be 
done at the service level. The SiteWhere Juju charm allows the configuration to be loaded 
from an external URL as shown below:

{% highlight bat %}
juju set sitewhere config-url=https://goo.gl/V6d9t5
{% endhighlight %}

The URL you point to must be resolvable from the environment the system is running on. 
A great option for storing configuration files is checking them in to GitHub, since it 
allows the configurations to be versioned over time and rolled back if needed. Once the 
configuration URL has been set for the service, all new units will be configured with 
the same URL.

## Next Steps
Now that we have a working base configuration, we can start looking at building out more 
complex SiteWhere deployments. In future tutorials, we will take a look at models for 
scaling SiteWhere across many units to spread the workload and improve performance.
