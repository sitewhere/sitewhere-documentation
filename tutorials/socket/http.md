---
title: HTTP Socket Tutorial
layout: default
sidebar: sidebar.html
prevLink: index.html
prevTitle: Integration
nextLink: index.html
nextTitle: Integration
---

# {{page.title}}
SiteWhere supports interacting with remote systems or devices by accepting HTTP requests
and processing the payloads to produce SiteWhere events. This is accomplished by using
a [socket event source](http://documentation.sitewhere.org/userguide/tenant/device-communication.html#socket-event-source)
combined with an HTTP socket interaction handler to properly parse the HTTP request and
send a **200 OK** HTTP response to the caller.

## Configure the Socket Event Source
To accept HTTP requests, a socket event source must be configured for the tenant that
will receive the data. Open the SiteWhere administrative application and choose
**Manage Tenants** from the user dropdown in the top-right corner (note that the 
user must have tenant administration privileges). From the list of tenants, choose the
tenant that will be receiving the HTTP data.

**NOTE: The HTTP socket interaction handler is only available in SiteWhere 1.7 and above**

Choose **Device Communication**, then **Event Sources** in the tenant configuration editor
to enter the event source configuration page. Create a new socket event source by clicking
on the **Add Component** dropdown at the bottom of the page and choosing **Socket Event Source**
as shown below:

<a href="{{ site.url }}/images/tutorials/socket/http/eventsource1.png" data-lightbox="architecture" title="Socket Event Source">
	<img src="{{ site.url }}/images/tutorials/socket/http/eventsource1.png"/>
</a>

The socket event source can be configured to listen on any available server port. Also, multiple
threads can be used to process the socket requests in parallel. An example configuration is shown below:

<a href="{{ site.url }}/images/tutorials/socket/http/socket-config.png" data-lightbox="architecture" title="Socket Configuration">
	<img src="{{ site.url }}/images/tutorials/socket/http/socket-config.png"/>
</a>

Once the socket has been configured, an interaction handler should be assigned in order to control
the way SiteWhere interacts with the socket data. In this case, the interaction uses HTTP, so the
HTTP interaction handler will be chosen. In the **Add Component** dropdown, choose 
**HTTP Socket Interaction Factory** as shown below:

<a href="{{ site.url }}/images/tutorials/socket/http/http-config.png" data-lightbox="architecture" title="HTTP Configuration">
	<img src="{{ site.url }}/images/tutorials/socket/http/http-config.png"/>
</a>

To parse the HTTP payload into SiteWhere events, a binary event decoder will need to be assigned to
the event source. In this case, the HTTP payload will be parsed by a Groovy script so choose
**Add Component** in the binary decoder block and choose **Groovy Binary Event Decoder** as shown below:

<a href="{{ site.url }}/images/tutorials/socket/http/http-groovy.png" data-lightbox="architecture" title="Groovy Decoder">
	<img src="{{ site.url }}/images/tutorials/socket/http/http-groovy.png"/>
</a>

The Groovy script will be loaded from the **conf/global/scripts/groovy** folder by default. For the 
script name, choose **decodeOSS.groovy** as shown below:

<a href="{{ site.url }}/images/tutorials/socket/http/http-groovy-script.png" data-lightbox="architecture" title="Groovy Script">
	<img src="{{ site.url }}/images/tutorials/socket/http/http-groovy-script.png"/>
</a>

The next step is to apply the changes we have made to the configuration so that the tenant will start
using the new event source. Click **Stage Updates** at the bottom of the editor to stage the configuration changes. 
Click the <i style="color: #c00" class="fa fa-power-off fa-white"></i> icon to stop the tenant. After it stops, 
click the <i style="color: #090" class="fa fa-power-off fa-white"></i> icon to start it with the updated configuration.
SiteWhere is now listening for HTTP requests on the port specified in the configuration.

## Send Sample Data to the Socket
To illustrate processing, we will send a sample JSON payload to the socket we have configured. The code included
below will use the Spring REST template and Jackson libraries to send a sample payload using the HTTP
protocol. The example is constructed as a JUnit test so that it can be dynamically executed from an IDE
such as Eclipse.

{% highlight java %}
{% include tutorials/socket/http/LoraTests.java %}
{% endhighlight %}

## Process HTTP Payload Using Groovy
We assigned a Groovy binary decoder to the socket event source, so the payload of the HTTP request will
be forwarded to a Groovy script for processing. The script will parse the binary data by unmarhaling 
the JSON payload and extracting the fields we are interested in using for SiteWhere events. Copy 
the contents of the script below into a new file **conf/global/scripts/groovy/decodeOSS.groovy** and
save the changes. Since Groovy is dynamically recompiled, we do not have to restart the tenant to
see the updates to the script.

{% highlight java %}
{% include tutorials/socket/http/decodeOSS.groovy %}
{% endhighlight %}

## Test Script and View Data
Before sending data to SiteWhere, a device and assignment should be created so that the data
can be recorded. Create a gateway device with a hardware id that matches the **id** field
being passed in the JSON payload. Create an assignment for the device so it can start
receiving events.

To test the HTTP processing script, use the JUnit test from earlier in the tutorial to send
a sample payload to the socket. In the SiteWhere logs, there will be messages indicating that
the JSON payload has been parsed and RSSI and SNR have been extracted.

Open the SiteWhere administrative application, choose the default site, and open the assignment
that corresponds to the gateway device you created previouusly. Clicking on the **measurements**
tab will show the data that has been parsed from the HTTP request.

<a href="{{ site.url }}/images/tutorials/socket/http/data-in-sitewhere.png" data-lightbox="architecture" title="Data in SiteWhere">
	<img src="{{ site.url }}/images/tutorials/socket/http/data-in-sitewhere.png"/>
</a>

## Conclusion
This techique can be used to post data directly from devices or external systems to SiteWhere.
Depending on the amount of inbound traffic on the port, it may be advisable to increase the 
number of threads dedicated to processing. By using a Groovy script for the processing of data,
any form of data can be interpreted. For example, payloads in custom binary formats can be 
interpreted by changing the script to expect the given data format.


