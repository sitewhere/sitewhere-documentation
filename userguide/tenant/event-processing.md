---
title: Tenant Event Processing
layout: default
sidebar: sidebar.html
prevLink: userguide/tenant/device-communication.html
prevTitle: Tenant Device Communication
nextLink: userguide/adminui/adminui.html
nextTitle: Administrative Application
---

# {{page.title}}
After data has been pulled into the system via event sources, the normalized data is handled
by the event processing subsystem. Events are handed off to an **inbound processing strategy**
implementation which controls aspects such as queueing and threading for pending events. The
events are passed to the **inbound processing chain** -- an ordered list of 
**inbound event processors**, which act on each unsaved event in a chained fashion. 
If the **event storage processor** is configured in the inbound chain, the events 
will be saved to the underlying datastore. After being successfully saved, the 
events are handed to the **outbound processing strategy** which
handles queueing and threading for outbound processing. The events are then each processed
by the **outbound processing chain** which is an ordered chain of **outbound event processors**.
Each outbound processor acts on the already saved event to initiate custom processing for the event.

## Inbound Processing Strategy
The inbound processing strategy is responsible for moving events from event sources into the
inbound processing chain. It is responsible for handling threading and reliably delivering
events for processing. An inbound processing strategy must implement the 
[IInboundProcessingStrategy](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IInboundProcessingStrategy.html)
interface.

### Blocking Queue Inbound Processing Strategy
This default inbound processing strategy for SiteWhere CE uses a bounded queue to hold events
being delivered from event sources. It creates a thread pool that consumes the queue to 
deliver events to the inbound processing chain. If events are delivered faster than the thread
pool can process them, the queue will eventually start blocking the event receiver threads.
Increasing the number of threads for event processing takes load from the queue but increases
processing load on the core system. SiteWhere CE does not persist the inbound queue, so shutting 
down the server may result in data loss. SiteWhere EE offers a more advanced inbound processing
strategy implementation with persistent queues and transactional semantics.

{% highlight xml %}
<sw:event-processing>
   
	<!-- Inbound Processing Strategy -->
	<sw:inbound-processing-strategy>
		<sw:blocking-queue-inbound-processing-strategy
			maxQueueSize="10000" numEventProcessorThreads="10" enableMonitoring="false"
			monitoringIntervalSec="3"/>
		</sw:inbound-processing-strategy>
{% endhighlight %}

The following attributes may be specified for the **blocking-queue-inbound-processing-strategy** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| maxQueueSize             | optional | Maximum number of items in queue before blocking. Defaults to *10000*.                  
| numEventProcessorThreads | optional | Number of threads used to process incoming events. Defaults to *100*.                  
| enableMonitoring         | optional | Enables monitoring of event processing in the log. Defaults to *false*.            
| monitoringIntervalSec    | optional | Interval (in seconds) at which monitoring messages are posted. Defaults to *5*. 
    
## Inbound Processing Chain
After data has been decoded into SiteWhere device events by event sources, the
inbound processing strategy queues up events to be processed by the 
**inbound processing chain**. The chain is a series of **inbound event processors** (implementing 
[IInboundEventProcessor](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/event/processor/IInboundEventProcessor.html))
that each handle the inbound events in series. New inbound event processors can be added to the chain to augment
the existing functionality. For instance, a metrics processor could keep count of events processed per second. 

**Since REST calls (or other calls that directly invoke the device management APIs) do not enter the system via event sources, 
they are not processed by the inbound processing chain.**

### Event Storage Processor
By default, an instance of **event-storage-processor** is configured in the inbound chain. This processor
takes care of persisting device events via the device management service provider interfaces. If this 
processor is removed, events will not be stored. The default configuration is shown below:

{% highlight xml %}
<sw:event-processing>
					
	<!-- Add processing logic to inbound events -->        
	<sw:inbound-processing-chain>

		<!-- Store events -->
		<sw:event-storage-processor/>

	</sw:inbound-processing-chain>
{% endhighlight %}

### Registration Processor
By default, an instance of **registration-processor** is configured in the inbound chain. This processor
handles the dynamic registration of devices which includes creating a new device and assignment for
devices requesting registration. If this processor is removed, registration requests will be ignored. 
The default configuration is shown below:

{% highlight xml %}
<sw:event-processing>
       
	<!-- Add processing logic to inbound events -->        
	<sw:inbound-processing-chain>
            
		<!-- Allow devices to dynamically register -->
		<sw:registration-processor/>
   
	</sw:inbound-processing-chain>
{% endhighlight %}


### Device Stream Processor
By default, an instance of **device-stream-processor** is configured in the inbound chain. This processor
handles streaming data from devices. If this processor is removed, stream creation requests as well as requests
for adding data to a stream will be ignored. The default configuration is shown below:

{% highlight xml %}
<sw:event-processing>
               
	<!-- Add processing logic to inbound events -->        
	<sw:inbound-processing-chain>
            
		<!-- Allow devices to create streams and send stream data -->
		<sw:device-stream-processor/>
   
	</sw:inbound-processing-chain>
{% endhighlight %}

### Hazelcast Queue Processor
An instance of **hazelcast-queue-processor** may be configured in the inbound processing chain
to forward all decoded events into a Hazelcast queue. This allows multiple subordinate SiteWhere 
instances to use the **hazelcast-queue-event-source** to pull the events in and 
process them. The events are handed to the subordinate instances in round-robin fashion 
so the processing load can be distributed. If this processor is configured, normally the
other default processors for storage, registration, and stream processing are removed, since
the processing occurs in the subordinate instances.

{% highlight xml %}
<sw:event-processing>
               
	<!-- Add processing logic to inbound events -->        
	<sw:inbound-processing-chain>
         
		<!-- Note that other processors have been removed -->
            
		<!-- Send all events to a Hazelcast queue -->
		<sw:hazelcast-queue-processor/>
   
	</sw:inbound-processing-chain>
{% endhighlight %}

## Outbound Processing Strategy
The outbound processing strategy is responsible for post-processing events after they have been saved
to the datastore. It is responsible for handling threading and reliably delivering
events to the chain of outbound event processors. An inbound processing strategy must implement the 
[IOutboundProcessingStrategy](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IOutboundProcessingStrategy.html)
interface.

### Blocking Queue Outbound Processing Strategy
This default outbound processing strategy for SiteWhere CE uses a bounded queue to hold events
for post-processing after they have been stored. It creates a thread pool that consumes the queue to 
deliver events to the inbound processing chain. If events are delivered faster than the thread
pool can process them, the queue will eventually start blocking the threads for inbound processing.
Increasing the number of threads for outbound event processing takes load from the queue but increases
processing load on the core system. SiteWhere CE does not persist the outbound queue, so shutting 
down the server may result in data loss. SiteWhere EE offers a more advanced outbound processing
strategy implementation with persistent queues and transactional semantics.

{% highlight xml %}
<sw:event-processing>
   
	<!-- Outbound Processing Strategy -->
	<sw:outbound-processing-strategy>
		<sw:blocking-queue-outbound-processing-strategy
			maxQueueSize="10000" numEventProcessorThreads="10"/>
		</sw:outbound-processing-strategy>
{% endhighlight %}

The following attributes may be specified for the **blocking-queue-outbound-processing-strategy** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| maxQueueSize             | optional | Maximum number of items in queue before blocking. Defaults to *10000*.                  
| numEventProcessorThreads | optional | Number of threads used to process incoming events. Defaults to *10*.                  
                
## Outbound Processing Chain
In the default provisioning implementation, each time an event is saved via the device management 
service provider interfaces, the outbound event processing chain is invoked. In the same way the 
inbound processing chain acts on unsaved inbound event data, the oubound processing chain acts on 
data that has been successfully persisted to the datastore. Each **outbound event processor** (implementing 
[IOutboundEventProcessor](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/event/processor/IOutboundEventProcessor.html))
is executed in series. New outbound event processors can be added to the chain to augment existing
functionality. For instance, SiteWhere has an event processor for sending all outbound events to
Hazelcast subscribers, allowing external clients to act on the events.

**REST calls (or other calls that directly invoke the device management APIs) are processed by the
outbound processing chain in the same manner as events from event sources.**

### Available Event Processors
* [Apache Solr Event Processor](event-processing.html#apache-solr-event-processor) - Sends events to the Apache Solr search engine for indexing.
* [Azure Event Hub Event Processor](event-processing.html#azure-event-hub-event-processor) - Forwards events to an Azure EventHub for further processing.
* [Command Delivery Event Processor](event-processing.html#command-delivery-event-processor) - Delivers command invocations to devices.
* [Dweet.io Event Processor](event-processing.html#dweet-io-event-processor) - Forwards events to the Dweet.io cloud service.
* [Groovy Event Processor](event-processing.html#groovy-event-processor) - Delegates event processing to a Groovy script.
* [Hazelcast Event Processor](event-processing.html#hazelcast-event-processor) - Forwards events to Hazelcast topics for further processing.
* [InitialState.com Event Processor](event-processing.html#initialstate-com-event-processor) - Sends events to InitialState.com for advanced visualization.
* [MQTT Event Processor](event-processing.html#mqtt-event-processor) - Forwards matching events to an MQTT topic.
* [Siddhi (CEP) Event Processor](event-processing.html#siddhi-cep-event-processor) - Performs complex event processing on events using WSO2 Siddhi.
* [Zone Test Event Processor](event-processing.html#zone-test-event-processor) - Determines zone containment for location events and fires alerts as a result.

### Apache Solr Event Processor
SiteWhere supports forwarding events to [Apache Solr](http://lucene.apache.org/solr/) to leverage
the sophisticated search and analytics features it provides. The Solr outbound event processor uses
the [Solrj](https://cwiki.apache.org/confluence/display/solr/Using+SolrJ) library to send each
outbound event to a Solr instance. The events are stored using a custom SiteWhere document schema,
allowing event data to be indexed based on its type. For instance, location events are stored with
geospatial indexes to allow efficient location searches. To enable the Solr event processor, first add the configuration
information to the **globals** section of the global configuration file as shown below:

{% highlight xml %}
<sw:configuration>

	<sw:globals>
		<sw:hazelcast-configuration configFileLocation="${catalina.home}/conf/sitewhere/hazelcast.xml"/>
		<sw:solr-configuration solrServerUrl="http://localhost:8983/solr/SiteWhere"/>
	</sw:globals>
{% endhighlight %}
   
The **solrServerUrl** attribute needs to point to the Solr core being used for SiteWhere data. To
add the outbound event processor to the chain, reference it as shown below:

{% highlight xml %}
<sw:outbound-processing-chain>
		
	<!-- Routes commands for outbound processing -->
	<sw:command-delivery-event-processor/>
			
	<!-- Index events in Solr -->
	<sw:solr-event-processor/>

</sw:outbound-processing-chain>
{% endhighlight %}
   
Note that on system startup, the event processor attempts to ping the Solr server to verify the 
settings are correct. If the ping fails, the component will not be started.

### Azure Event Hub Event Processor
The **azure-eventhub-event-processor** outbound event processor connects to an 
[Azure Event Hub](http://azure.microsoft.com/en-us/services/event-hubs/) and forwards
device events to it. The current implementation sends all events in JSON format. Future
implementations will allow for filtering which events are sent and choosing the wire 
format of the event data. An Azure Event Hub outbound event
processor can be figured as shown below:

{% highlight xml %}
<sw:outbound-processing-chain>
      
	<sw:azure-eventhub-event-processor sasKey="{azure.sas.key}" sasName="default" 
		serviceBusName="sitewhere.servicebus.windows.net" eventHubName="sitewhere"/>

</sw:outbound-processing-chain>
{% endhighlight %}
   
Note that a SAS name and key are required in order to connect to the Event Hub. See
[this](https://msdn.microsoft.com/en-us/library/azure/dn170477.aspx) article to find
more information about Shared Access Signatures.

The following attributes may be specified for the **azure-eventhub-event-processor** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| serviceBusName           | required | Name of the service bus where the event hub is configured.
| eventHubName             | required | Name of the event hub to connect to.
| sasName                  | required | Name of SAS entity to connect with.
| sasKey                   | required | Key for SAS entity to connect with.

### Command Delivery Event Processor
By default, an instance of **command-delivery-event-processor** is configured in the outbound chain. This
processor hands off device command invocations to the communication subsystem for processing. If this 
processor is removed, device command invocations will be persisted, but will never be processed. The
default configuration is shown below:

{% highlight xml %}
<sw:device-communication>
					
	<sw:outbound-processing-chain>
      
		<!-- Routes commands for outbound processing -->
		<sw:command-delivery-event-processor/>
				
		<!-- Send outbound device events over Hazelcast -->
		<sw:outbound-event-processor ref="hazelcastDeviceEventProcessor"/>
	
	</sw:outbound-processing-chain>
{% endhighlight %}

This example also shows the addition of a custom outbound event processor which references a Spring bean
defined elsewhere in the configuration. Events will be passed to the custom processor after they have
been processed by the provisioning processor.

### Dweet.io Event Processor
Forwards SiteWhere events to the [Dweet.io](http://www.dweet.io) cloud service. For every assignment with
forwarded events, there is a 'thing' name that corresponds to the assignment token. Data from Dweet.io can
be used to integrate with other cloud services that use dweets as a data source. An example of the
configuration is below:

{% highlight xml %}
<sw:device-communication>
					
	<sw:outbound-processing-chain>
				
		<!-- Foward events to dweet.io -->
		<sw:dweet-io-event-processor/>
	
	</sw:outbound-processing-chain>
{% endhighlight %}

### Groovy Event Processor
This outbound processor allows events processed by a Groovy script.
The script is given access to the event data and a builder object that allows new events to be
created. This allows the script to impose conditional logic on the incoming stream of events and
create new events in response. 

{% highlight xml %}
<sw:device-communication>
					
	<sw:outbound-processing-chain>
				
		<!-- Process events using Groovy script -->
		<sw:groovy-event-processor scriptPath="path/to/logic.groovy"/>
	
	</sw:outbound-processing-chain>
{% endhighlight %}

| Groovy Variable         | Description                                      
|-------------------------|-------------------------------------------------------------
| event                   | Wrapper with convenience methods and allowing access to the event itself
| eventBuilder            | Builder interface for creating new events
| hazelcast               | Handle to HazelcastInstance interface. Allows sharing of data across cluster
| logger                  | Allows script to write to the SiteWhere log

### Hazelcast Event Processor
SiteWhere has support for broadcasting events over [Hazelcast](http://hazelcast.com/) topics, making it
easy to share events with external agents. To enable Hazelcast broadcasting, first add the configuration
information to the **globals** section in the global configuration file as shown below:

{% highlight xml %}
<sw:configuration>

	<sw:globals>
		<sw:hazelcast-configuration configFileLocation="${catalina.home}/conf/sitewhere/hazelcast.xml"/>
	</sw:globals>
{% endhighlight %}
   
Note that the *configFileLocation* attribute specifies full path to a Hazelcast configuration file.
The configuration above is the default which assumes SiteWhere is running inside a Tomcat container.
Once the configuration has been declared, it may be referenced as part of the outbound processing chain to
enable broadcasting of events.

{% highlight xml %}
<sw:outbound-processing-chain>
      
	<!-- Routes commands for outbound processing -->
	<sw:command-delivery-event-processor/>

	<!-- Send outbound device events over Hazelcast -->
	<sw:hazelcast-event-processor/>

</sw:outbound-processing-chain>
{% endhighlight %}
   
To consume events from the Hazelcast topics, listen on the topic names as defined in 
[ISiteWhereHazelcast](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/server/hazelcast/ISiteWhereHazelcast.html).

### InitialState.com Event Processor
SiteWhere events can be forwarded to [InitialState.com](https://www.initialstate.com/) to
allow them to be visualized using the advanced dashboarding features offered by the platform.
To enable event forwarding, add the **initial-state-event-processor** element and
specify the streaming access key made available when you create an InitialState account.
Separate data streams are created for each device assignment based on the unique token
for the assignment. An example configuration is shown below:

{% highlight xml %}
<sw:outbound-processing-chain>
      
	<!-- Routes commands for outbound processing -->
	<sw:command-delivery-event-processor/>
         
	<!-- Sends events to InitialState.com -->
	<sw:initial-state-event-processor streamingAccessKey="your_access_key"/>

</sw:outbound-processing-chain>
{% endhighlight %}

The following attributes may be specified for the **initial-state-event-processor** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| streamingAccessKey       | required | Streaming access key copied from the website.
  
### MQTT Event Processor
Events can be forwarded directly to an MQTT topic using the **mqtt-event-processor** element.
The events are marshaled as JSON data and sent to the topic. By configuring the associated
outbound event processor filters, only certain events can be forwarded.
An example configuration is shown below:

{% highlight xml %}
<sw:outbound-processing-chain>
      
	<sw:mqtt-event-processor hostname="localhost" port="1883"
		protocol="tcp" topic="interested.devices"></sw:mqtt-event-processor>

</sw:outbound-processing-chain>
{% endhighlight %}

The following attributes may be specified for the **mqtt-event-processor** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| hostname                 | required | MQTT broker server hostname or IP address.       
| port                     | required | MQTT broker server port.                         
| protocol                 | optional | Protocol used to connect (tcp or tls). Defaults to *tcp*.                         
| trustStorePath           | optional | Path to trust store when connecting over tls.                         
| trustStorePassword       | optional | Password for trust store when connecting over tls.                         
| topic                    | required | MQTT topic where events will be forwarded.       
   
### Siddhi (CEP) Event Processor
SiteWhere supports integration with [Siddhi](https://github.com/wso2/siddhi) for complex
event processing. Adding a **siddhi-event-processor** to the outbound processing chain
routes all SiteWhere events into Siddhi event streams for processing. The Spring XML configuration
allows multiple queries to be registered with Siddhi while allowing callbacks to be registered
so that the resulting streams can be processed. An example configuration is shown below:

{% highlight xml %}
<sw:outbound-processing-chain>
      
	<!-- Routes commands for outbound processing -->
	<sw:command-delivery-event-processor/>
         
		<!-- Processes event streams using Siddhi for complex event processing -->
	<sw:siddhi-event-processor>
         
		<sw:siddhi-query
			selector="from e1 = MeasurementStream[mxname == 'engine.temp'], e2 = MeasurementStream[mxname == 'engine.temp' and e1.assignment == assignment and ((e2.mxvalue - e1.mxvalue) > 5)] select e1.assignment insert into EngineTempRose">
			<sw:stream-debugger stream="EngineTempRose"/>
		</sw:siddhi-query>
            
		<sw:siddhi-query
			selector="from e1 = LocationStream, e2 = LocationStream[(latitude != e1.latitude or longitude != e1.longitude) and e1.assignment == assignment] select e2.assignment, e2.latitude, e2.longitude insert into LocationChanged">
			<sw:stream-debugger stream="LocationChanged"/>
		</sw:siddhi-query>
            
		<sw:siddhi-query
			selector="from every e1 = AlertStream[type == 'low.bp'] -> e2 = AlertStream[type == 'g.shock' and e1.assignment == assignment] within 7 sec select e1.assignment insert into Fainted">
			<sw:groovy-stream-processor scriptPath="siddhiEventProcessor.groovy" stream="Fainted"/>
		</sw:siddhi-query>

	</sw:siddhi-event-processor>

</sw:outbound-processing-chain>
{% endhighlight %}
   
SiteWhere currently registers three event streams with Siddhi, **MeasurementStream** for individual measurements,
**AlertStream** for alerts, and **LocationStream** for locations. The events injected into the streams contain
all of the same information provided by the core SiteWhere event APIs.

Any number of queries may be registered with Siddhi by adding **siddhi-query** elements within the processor.
Each query specifies a selector which indicates the logic to be performed on the event streams (for more information
on the query language see [the documentation](https://docs.wso2.com/display/CEP310/Queries)). To process the
stream results, any number of callbacks may be registered. The **stream-debugger** callback will print
all events for a given stream to the log. The **groovy-stream-processor** may be used to process stream events
with a Groovy script.

### Zone Test Event Processor
The **zone-test-event-processor** outbound event processor is used to test location events against
a list of predefined zones to verify if they fall within the zone boundaries. Each location event is
tested against the conditions defined in the list of **zone-test** elements. The zone tests
specify the unique token of the zone to test against (defined via the admin interface or REST services)
and the test condition (inside or outside the zone). If the condition is met, a new alert event is 
created based on the alert attributes in the test. The alert event can be processed like any other
alert entering the system, allowing other outbound processing components to handle reaction to the
zone condition.

{% highlight xml %}
<sw:device-communication>
   
	<sw:outbound-processing-chain>
      
		<!-- Routes commands for outbound processing -->
		<sw:command-delivery-event-processor/>
         
		<!-- Performs zone checking for locations -->
		<sw:zone-test-event-processor>
			<sw:zone-test zoneToken="777fa4e5-bc2f-458b-9968-b598b2e2d2ca" condition="outside"
				alertLevel="error" alertType="off.site" alertMessage="Asset has left the worksite."/>
		</sw:zone-test-event-processor>
{% endhighlight %}
 
In the example above, each location will be checked against the zone defined by the given zone token.
If the location is outside the given zone (in this case the worksite where an asset is deployed), an
alert is fired. The alert is an error of type 'off.site' an includes an alert message. If an asset 
goes offsite, the alert event can be used for reactions such as firing an SMS message or sending 
an audible alarm to a device on the worksite.
 
The following attributes may be specified for the **zone-test** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| zoneToken                | required | Unique token for zone to test.
| condition                | required | Condition for test. Either *inside* or *outside*.
| alertType                | required | Alert type for generated alert.
| alertLevel               | optional | Alert level for generated alert. Defaults to *error*.
| alertMessage             | required | Alert message for generated alert.

