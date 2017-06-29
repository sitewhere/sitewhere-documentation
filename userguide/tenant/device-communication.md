---
title: Tenant Device Communication
layout: default
sidebar: sidebar.html
prevLink: userguide/tenant/tenant-configuration.html
prevTitle: Tenant Configuration
nextLink: userguide/tenant/event-processing.html
nextTitle: Tenant Event Processing
---

# {{page.title}}
The communication subsystem configures how SiteWhere communicates with devices.
On the inbound side, device data is brought in to the system via **event sources**. The inbound 
data is converted into SiteWhere events and passed in to the **inbound processing chain** by 
the **inbound processing strategy**. On the outbound side (as part of the **outbound processing chain**)
commands are sent to external devices via **command destinations**. An **outbound command router** 
makes the choice of which command destination will be used to deliver the command payload.

## Event Sources
Event sources are responsible for bringing data into SiteWhere. All event sources implement the
[IInboundEventSource](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IInboundEventSource.html)
interface and are composed of one or more **event receivers** (implementing 
[IInboundEventReceiver](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IInboundEventReceiver.html)) 
and a single **event decoder** (implementing 
[IDeviceEventDecoder](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IDeviceEventDecoder.html)).
Event receivers take care of dealing with protocols for gathering data. The data is then processed
by the event decoder in order to create SiteWhere events which provide a common representation of
the device data so it can be processed by the inbound processing chain.

### MQTT Event Source
Since consuming MQTT data is common in IoT applications, SiteWhere includes a component that 
streamlines the process. In the example below, an event source is configured to listen for messages
on the given topic, then use the **protobuf-event-decoder** to decode the message payload 
using the standard SiteWhere Google Protocol Buffers message format.

{% highlight xml %}
<sw:device-communication>
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Event source for protobuf messages over MQTT -->
		<sw:mqtt-event-source sourceId="protobuf" hostname="localhost"
			port="1883" topic="SiteWhere/input/protobuf">
			<sw:protobuf-event-decoder/>
		</sw:mqtt-event-source>
{% endhighlight %}


The following attributes may be specified for the **mqtt-event-source** element.
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          
| hostname             | required | MQTT broker server hostname or IP address.       
| port                 | required | MQTT broker server port.                         
| protocol             | optional | Protocol used to connect (tcp or tls). Defaults to *tcp*.                         
| trustStorePath       | optional | Path to trust store when connecting over tls.                         
| trustStorePassword   | optional | Password for trust store when connecting over tls.                         
| topic                | required | MQTT topic where devices will post events.       

### ActiveMQ Event Source
[Apache ActiveMQ](http://activemq.apache.org/) is an open source messaging platform
that supports many wire formats such as AMQP, OpenWire, XMPP, and MQTT. It also supports
the standard Java JMS APIs for message processing. SiteWhere includes an event source
that creates an embedded ActiveMQ broker that listens on a configured transport. A
multithreaded pool of consumers listen on a configured topic and hand off the binary
payload to the configured decoder.

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Event source for protobuf messages over ActiveMQ queue -->
		<sw:activemq-event-source sourceId="activemq" transportUri="tcp://localhost:1234"
			queueName="SITEWHERE.IN" numConsumers="150">
			<sw:protobuf-event-decoder/>
		</sw:activemq-event-source>
{% endhighlight %}
         
The example above listens for JMS connections over TCP/IP with 150 consumer threads that 
read data from the configured queue, decode the data using SiteWhere Google Protocol Buffers
format, then send the decoded events to be processed.

The following attributes may be specified for the **activemq-event-source** element.
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          
| transportUri         | required | Configures the ActiveMQ transport that will be made available for clients to connect to.    
| queueName            | required | Queue that external clients post events to.                       
| numConsumers         | required | Number of threaded consumers used to process data from the queue. Defaults to *3*.       

### Socket Event Source
Many devices connect over direct socket connections to report events. For instance, many
GPS trackers have cellular connectivity and report location or other events over GPRS.
The **socket-event-source** can be used to create a server socket which listens
on a given port, receiving client connections and processing them using a multithreaded
approach. Socket interactions are often complex and stateful, so the processing is
delegated to an implementation of 
[ISocketInteractionHandler](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/socket/ISocketInteractionHandler.html)
which handles the conversation between device and server. The socket interaction handler
returns a payload which is passed to the configured decoder to build SiteWhere events.

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Event source for protobuf messages from socket connections -->
		<sw:socket-event-source port="8585" numThreads="10" sourceId="socket">
			<sw:read-all-interaction-handler-factory/>
			<sw:protobuf-event-decoder/>
			</sw:socket-event-source>
{% endhighlight %}

Configuring the **read-all-interaction-handler-factory** reads all of the input from
the client socket and passes the binary information to the configured decoder. In some cases
(such as sending payloads in the standard SiteWhere Google Protocol Buffers format) this
is sufficient. However, in most cases, the user will need to create an interaction handler that
understands the conversational logic between the device and server. A custom implementation
can be referenced by using the **interaction-handler-factory** element
which references a Spring bean that contains the socket interaction handler factory. The factory implements the
[ISocketInteractionHandlerFactory](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/socket/ISocketInteractionHandlerFactory.html)
interface and creates instances of the socket interaction handler that manages device 
conversation.

The following attributes may be specified for the **socket-event-source** element.
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          
| port                 | optional | Server port to listen on. Defaults to *8484*.    
| numThreads           | required | Queue that external clients post events to.                       
| numConsumers         | required | Number of threads used to process client requests. Defaults to *5*.     

### Polling REST Event Source
Many systems do not offer the option of streaming data in real-time, but do offer
REST services for accessing their data. In this case, a **polling-rest-event-source** 
can be configured to make a call to the external REST service at a given interval and 
parse the resulting data into payloads for decoding. The event source configures a base URL
used to access the REST services as well as a script for controlling the requests
to the service. The Groovy script is called at an interval, makes the REST call,
then returns the list of payloads for decoding. Each payload is then passed to a 
decoder as with any other event source. The configuration looks as follows:

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Event source for polling an external REST service -->
		<sw:polling-rest-event-source baseUrl="http://rest.example.com/service" 
			username="admin" password="password" pollIntervalMs="10000" 
			scriptPath="parseREST.groovy" sourceId="rest" />
{% endhighlight %}

In the configuration above, SiteWhere will call the *parseREST.groovy* script
(which should be located in the *conf/globals/scripts/groovy* folder) every
10 seconds. One of the variables, *rest* passed to the Groovy script is a handle
to a [helper class](https://github.com/sitewhere/sitewhere/blob/master/sitewhere-groovy/src/main/java/com/sitewhere/groovy/device/communication/rest/RestHelper.java)
that contains a [Spring RestTemplate](http://www.baeldung.com/rest-template) that has 
been initialized with the base URL. By accessing the *getJsonNode* method of the *rest*
object with the subpath to be added to the base URL, the REST call is made and a
[JsonNode](https://fasterxml.github.io/jackson-databind/javadoc/2.2.0/com/fasterxml/jackson/databind/JsonNode.html)
is returned. After using the JsonNode to parse the JSON response, the payload should be
added to the *payloads* variable, which contains a list of payloads that will be passed
to the decoder to generate SiteWhere events.

{% highlight groovy %}
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.databind.node.*

def nodes = rest.getJsonNode "nodes"

for (JsonNode node : nodes) {
	def deveui = node.get("deveui")
	if (deveui != null) {
		deveui = deveui.asText()
		def entries = rest.getJsonNode "nodes/${deveui}/payloads/ul"
		
		for (JsonNode entry : entries) {
			((ObjectNode) entry).put('id', deveui)
			def payload = entry.toString().getBytes()
			payloads.add payload
		}
	}
}
{% endhighlight %}

The following attributes may be specified for the **polling-rest-event-source** element.

| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          
| pollIntervalMs       | required | Interval (in milliseconds) to wait between polling requests.     
| scriptPath           | required | Path to a Groovy script that executes logic needed to generate REST request and parse response.                       
| baseUrl              | required | Base URL used for REST requests. Within Groovy script, any REST calls are assumed relative to this base value.                       
| username             | required | Username if REST services requires authentication.                       
| password             | required | Password if REST services requires authentication.                       

### WebSocket Event Source
A common connectivity option for IoT applications is interaction with a remote 
[WebSocket](http://en.wikipedia.org/wiki/WebSocket). 
The **web-socket-event-source** can be used to connect to a WebSocket and
stream data into the system. The data payload can be either binary or text
and the event decoder should be configured based on the expected type of data.

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Event source for WebSocket connectivity -->
		<sw:web-socket-event-source sourceId="websocket"
			webSocketUrl="ws://localhost:6543/sitewhere/stringsender" payloadType="string">
			<sw:groovy-string-event-decoder scriptPath="customDecoder.groovy"/>
		</sw:web-socket-event-source>
{% endhighlight %}
         
Note that the payload type is 'string' and that the **groovy-string-event-decoder** decoder
expects a String input. If a binary decoder is configured for a String payload type or vice versa,
the system will generate an error on startup.

The following attributes may be specified for the **web-socket-event-source** element.
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          
| webSocketUrl         | required | URL of the WebSocket to connect to.     
| payloadType          | required | Either 'string' or 'binary' depending on which type of message is sent from the server socket.                       

### Hazelcast Queue Event Source
This event source is used to pull decoded device events from a Hazelcast queue. 
The usual usage scenario is that one SiteWhere instance uses the
**hazelcast-queue-processor** on the inbound processing chain to send all decoded events
to the queue and the subordinate instances use the **hazelcast-queue-event-source**
element to process the events. Multiple subordinate instances can attach to the
same queue, allowing parallel processing of the events. Note that all subordinate
instances must be in the same Hazelcast group in order to process the queue.

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Event source for pulling events from Hazelcast queue -->
		<sw:hazelcast-queue-event-source sourceId="hzQueue"/>
{% endhighlight %}

The following attributes may be specified for the **hazelcast-queue-event-source** element.
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          

### RabbitMQ Event Source
This event source connects to a RabbitMQ instance using the AMQP protocol and registers
itself to process queued messages. A configurable number of consumers are set up
to read binary payloads from the queue and pass them to the binary decoder configured
for the event source.

**NOTE: If connecting to an existing queue, the *durable* attribute must agree with the setting for the queue.**

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<sw:rabbit-mq-event-source sourceId="rabbit" connectionUri="amqp://localhost"
			durable="false" numConsumers="10" queueName="sitewhere.input">
			<sw:protobuf-event-decoder/>
		</sw:rabbit-mq-event-source>
{% endhighlight %}
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| sourceId             | required | Unique event source id.                          
| connectionUri        | required | URI that determines RabbitMQ connection settings                          
| durable              | optional | Indicates if queue is persisted across restarts. Defaults to *false*.                     
| numConsumers         | optional | Number of consumer threads pulling from queue. Defaults to *5*.                         
| queueName            | optional | Name of queue being consumed. Defaults to *sitewhere.input*.                          

### Custom Event Source
In cases where a custom protocol is needed to support inbound events for devices, SiteWhere makes
it easy to plug in a custom event source. The custom event source class must implement the
[IInboundEventSource](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IInboundEventSource.html)
interface. SiteWhere provides base classes that provide much of the common event source 
functionality. For instance the com.sitewhere.device.communication.BinaryInboundEventSource found
in sitewhere-core provides an event source that deals with binary data. By creating an instance
of BinaryInboundEventSource and plugging in a custom 
[IInboundEventReceiver](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IInboundEventReceiver.html)
and [IDeviceEventDecoder](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/IDeviceEventDecoder.html)
implementation, the behavior can be completely customized. The event receiver takes care of receiving
binary data from the device and the decoder converts the data into SiteWhere events that can be 
processed.

{% highlight xml %}
<sw:device-communication>
   
	<!-- Inbound event sources -->
	<sw:event-sources>

		<!-- Custom event source referencing a Spring bean -->
		<sw:event-source ref="customEventSourceBean"/>
{% endhighlight %}

The following attributes may be specified for the **event-source** element.
      
| Attribute            | Required | Description                                      
|----------------------|----------|--------------------------------------------------
| ref                  | required | Reference to externally defined Spring bean.                          


## Batch Operation Manager
The batch operation manager is responsible for asynchronously processing operations that 
are applied to many devices. Batch operations can be submitted via the administrative
console or via the REST services. The batch operation manager cycles through the list 
of batch operation elements, executing each and keeping state regarding progress of
execution. The default batch operation manager can be configured by using the
**default-batch-operation-manager** element as shown below.

{% highlight xml %}
<sw:device-communication>
               
	<!-- Batch operation management -->
	<sw:batch-operations>
		<sw:default-batch-operation-manager throttleDelayMs="10000"/>
	</sw:batch-operations>
{% endhighlight %}

The throttle delay value can be used to slow down the rate that elements are processed
so that the system is not overloaded by large operations.
      
A custom batch operation manager can be added by creating a class that implements
[IBatchOperationManager](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/batch/IBatchOperationManager.html)
and adding a reference to it using the **batch-operation-manager** element.

The following attributes may be specified for the **default-batch-operation-manager** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| throttleDelayMs          | optional | Number of milliseconds to wait between processing batch operation elements. Defaults to *0*. 

## Command Destinations
Command destinations are responsible for delivering commands to devices. All command destinations implement the
[ICommandDestination](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/ICommandDestination.html)
interface and are composed of a **command encoder** (implementing [ICommandExecutionEncoder](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/ICommandExecutionEncoder.html)),
a **parameter extractor** (implementing [ICommandDeliveryParameterExtractor](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/ICommandDeliveryParameterExtractor.html)),
and a **delivery provider** (implementing [ICommandDeliveryProvider](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/communication/ICommandDeliveryProvider.html)).
The command encoder is used to convert the command payload into a format understood by the device. The parameter
extractor pulls information needed for delivering the message to the delivery provider (e.g. for an SMS provider,
the extractor may pull the SMS phone number for the device from device metadata). The delivery provider takes 
the encoded payload and extracted parameters, then delivers the message to the device.

### MQTT Command Destination
For devices that listen on an MQTT topic for commands, the **mqtt-command-destination** element can 
be used to easily configure a destination. An encoder and parameter extractor should be configured
based on the expected command format and location of MQTT routing information. The 
**hardware-id-topic-extractor** element configures the MQTT topics for delivery based
on an expression that includes the hardware id of the device to be addressed. In cases where this
is not appropriate, a custom parameter extractor can be injected instead.

{% highlight xml %}
<sw:device-communication>
					
	<!-- Outbound command destinations -->
	<sw:command-destinations>

		<!-- Delivers commands via MQTT -->
		<sw:mqtt-command-destination destinationId="default" hostname="localhost" port="1883">
			<sw:protobuf-command-encoder/>
			<sw:hardware-id-topic-extractor commandTopicExpr="SiteWhere/commands/%s"
				systemTopicExpr="SiteWhere/system/%s"/>
		</sw:mqtt-command-destination>
{% endhighlight %}

The following attributes may be specified for the **mqtt-command-destination** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| destinationId            | required | Unique id for destination.                 
| hostname                 | required | MQTT broker hostname.                 
| port                     | required | MQTT broker port.                 

### Twilio Command Destination
For devices that receive commands via SMS messages, the **twilio-command-destination** may be used to
deliver the command via the [Twilio](https://www.twilio.com/) online service. To use the service you will
need to create a Twilio account and pay for the outbound SMS service (including a phone number that
messages will be sent from).

{% highlight xml %}
<sw:device-communication>
					
	<!-- Outbound command destinations -->
	<sw:command-destinations>

		<!-- Delivers commands via Twilio SMS messages -->
		<sw:twilio-command-destination destinationId="laipac"
			accountSid="${twilio.account.sid}" authToken="${twilio.auth.token}" 
			fromPhoneNumber="${twilio.from.phone.number}">
			<sw:protobuf-command-encoder/>
			<sw:parameter-extractor ref="laipacExtractor"/>
		</sw:twilio-command-destination>
{% endhighlight %}
				
The account SID, auth token, and sending phone number are all pieces of data related to the Twilio account.
The parameter extractor implementation should be one that supplies parameters of type 
SmsParameters which is used by the delivery provider to determine the SMS phone number 
to deliver the command to.

The following attributes may be specified for the **twilio-command-destination** element.
      
| Attribute                | Required | Description                                      
|--------------------------|----------|--------------------------------------------------
| destinationId            | required | Unique id for destination.                 
| accountSid               | required | Twilio account SID (from Twilio website).                 
| authToken                | required | Twilio account auth token (from Twilio website).                 
| fromPhoneNumber          | required | Twilio phone number used to originate SMS.                 

## Debugging Device Communication
When developing solutions that use the device communication subsystem, it is often helpful 
to see exactly what SiteWhere is doing to handle inbound and outbound data. To turn on 
communication debugging, scroll down to the following block in
the **lib/log4j.xml** file:

{% highlight xml %}
<sw:device-communication>
<category name="com.sitewhere.device.communication">
	<priority value="INFO" />
</category>
{% endhighlight %}
   
Update the **INFO** value to **DEBUG** and restart the server to see more detailed communication information.
