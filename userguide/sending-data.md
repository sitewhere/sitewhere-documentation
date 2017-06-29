---
title: Sending Data to SiteWhere
layout: default
sidebar: sidebar.html
prevLink: userguide.html
prevTitle: SiteWhere User Guide
nextLink: userguide/global-configuration.html
nextTitle: Global Configuration
---

# {{page.title}}
SiteWhere is designed to be flexible in the way that it sends and receives data from devices
and other agents. Most popular communication protocols and encodings are supported 
out-of-the-box, but the system is also designed to be easily extended. Each system tenant
can have any number of protocols configured for communicating with devices. By default, tenants
are configured to communicate over MQTT with support for multiple encodings to allow for 
interactions with many types of devices.

## Using the REST Services
No matter how the device communication is configured on a per-tenant basis, the core SiteWhere
server instance provides [REST services](http://documentation.sitewhere.org/rest/single.html) 
which allow both global and tenant-specific data to be manipulated. The REST 
services require an authenticated user and a tenant authorization token to control 
which functions are available to a particular user. An authenticated user
(depending on permissions) can carry out create/read/update/delete operations on all system
entities. Various types of device event data can be submitted and queried directly from the
REST services. It is an acceptable approach to have devices directly interact with SiteWhere
via the REST services, though the overhead of HTTP limits scalability. Other protocols such 
as MQTT and AMQP allow for more efficient connectivity and provide for bidirectional
communication.

## Sending Device Data Using JSON
SiteWhere supports JSON payloads across most protocols including MQTT, AMQP, WebSockets, and
direct socket connections. The default SiteWhere tenant configuration connects to an MQTT
broker and listens for JSON payloads on the **SiteWhere/input/json** topic. The following 
section in the tenant configuration file enables this functionality:

{% highlight xml %}
<!-- Event source for JSON device requests over MQTT -->
<sw:mqtt-event-source sourceId="json" hostname="localhost" port="1883"
	topic="SiteWhere/input/json">
	<sw:json-device-request-decoder/>
</sw:mqtt-event-source>
{% endhighlight %}

Note the **json-device-request-decoder** element which configures SiteWhere to interpret
the MQTT payloads as JSON packets conforming to the SiteWhere specifications.

### JSON Packet Format
The following sections show examples of JSON data structured to interact with SiteWhere. All
JSON packets share some common information as shown below:

{% highlight json %}
{
	"hardwareId": "(unique hardware id)",
	"type": "(indicator for request type)",
	"request": {
		...
	}
}
{% endhighlight %}

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **hardwareId**          | Hardware id that uniquely identifies a device within a tenant. This informs the system which device is generating events.                         
| **type**                | The type of request for the device. This indicates how the data in the *request* section should be interpreted. 
| **request**             | The request content which is specific to the type of packet being sent as indicated by the *type* field. 

### Register a Device
Before devices can send event data, they must be registered with the system. SiteWhere will send back
a response on the system command channel to indicate whether the device could be registered. It will also
indicate if the device was already registered or not. The JSON packet below can be used to register a device:

{% highlight json %}
{
	"hardwareId": "123-TEST-4567890",
	"type": "RegisterDevice",
	"request": {
		"hardwareId": "123-TEST-4567890",
		"specificationToken": "964e7613-dab3-4fb3-8919-266a91370884",
		"siteToken": "bb105f8d-3150-41f5-b9d1-db04965668d3"
	}
}
{% endhighlight %}

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **hardwareId**          | A unique identifier for the device. No two devices for a given tenant can share the same hardware id.                         
| **specificationToken**  | A token the specifies the type of device being registered. Specifications can be registered in the SiteWhere administrative application.
| **siteToken**           | Indicates which site the device will be associated with. If no site token is specified, the device will be assocaited with the first site in the system. (optional)

### Send a Measurements Event
SiteWhere supports storing measurements related to a device as event data. The JSON format for sending 
device measurements is shown below:

{% highlight json %}
{
    "hardwareId": "123-TEST-4567890",
    "type": "DeviceMeasurements",
    "request": {
        "measurements": { 
        	"fuel.level": 87.1,
        	"engine.temp": 170
        },
        "updateState": true,
        "eventDate": "2016-02-10T19:40:03.391Z"
     }
}
{% endhighlight %}

The following fields are supported for a device measurements create request:

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **measurements**        | One or more measurements, each with a unique identifier and numeric value.                      
| **updateState**           | Indicates whether these measurements should be stored in the device assignment in order to indicate last known state. Over time, the most recent value of each unique identifier will be stored along with related information such as the date the event occurred. (optional)
| **eventDate**             | Date this event originated. If not passed, SiteWhere will assume the current date. (optional)

### Send an Alert Event
SiteWhere supports storing alerts for exceptional conditions as event data. The JSON format for sending 
a device alert is shown below:

{% highlight json %}
{
    "hardwareId": "123-TEST-4567890",
    "type":"DeviceAlert",
    "request": {
        "type": "engine.overheat",
        "level": "Warning",
        "message": "The engine is about to overheat! Turn the machine off!",
        "updateState": false,
        "eventDate": "2016-02-10T19:40:03.391Z",
        "metadata": { 
            "name1": "value1",
            "name2": "value2"
        }
    }
}
{% endhighlight %}

The following fields are supported for a device alert create request:

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **type**                | Alert type indicator. This is an application-specific identifier that indicates the type of alert that has been generated.             
| **level**               | Alert level. This field indicates the severity of an alert condition. Valid values for alert level include *Info*, *Warning*, *Error*, and *Critical*. The meaning of the value is application-specific and can be used to trigger conditional processing logic.
| **message**             | Error message text. This can be a human-readable value or an encoded value that can be interpreted on the server.             
| **updateState**         | Indicates whether the alert should be stored in the device assignment in order to indicate last known state. Over time, the most recent value of each unique alert type will be stored along with related information such as the date the event occurred. (optional)
| **eventDate**           | Date this event originated. If not passed, SiteWhere will assume the current date. (optional)

### Send a Location Event
SiteWhere supports storing device location information as event data. The JSON format for 
sending a device location is shown below:

{% highlight json %}
{
    "hardwareId": "123-TEST-4567890",
    "type":"DeviceLocation",
    "request": {
        "latitude": "33.75",
        "longitude": "-84.39",
        "elevation": "0",
        "updateState": true,
        "eventDate": "2016-02-10T19:40:03.390Z"
    }
}
{% endhighlight %}

The following fields are supported for a device location create request:

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **latitude**            | Latitude component of location.             
| **longitude**           | Longitude component of location.
| **elevation**           | Elevation component of location.           
| **updateState**         | Indicates whether this location should be stored in the device assignment in order to indicate last known state. Over time, the most recent location will be stored along with related information such as the date the event occurred. (optional)
| **eventDate**           | Date this event originated. If not passed, SiteWhere will assume the current date. (optional)

### Acknowledge a Device Command
After a device has received and/or processed a command from SiteWhere, it has the option
of acknowledging the command. The response is correlated by SiteWhere so that each command
invocation is associated with a list of responses. The JSON format for sending an
acknowledgement is shown below:

{% highlight json %}
{
	"hardwareId": "123-TEST-4567890",
	"type": "Acknowledge",
	"request": {
		"response": "Pinged Me!",
		"originatingEventId": "56bf72cba76cfa4ff7901e8d",
		"updateState": false,
		"eventDate": "2016-02-13T18:15:39.563Z"
	}
}
{% endhighlight %}

The following fields are supported for an acknowledgement request:

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **response**            | A response message.             
| **originatingEventId**  | Unique event id for command invocation that originated the command. This is included as part of the command payload.
| **updateState**         | This does not carry any meaning and can be left out or set to *false*. (optional)
| **eventDate**           | Date this event originated. If not passed, SiteWhere will assume the current date. (optional)

## Receiving Device Data Using JSON
SiteWhere supports bidirectional communication with devices, allowing system commands and custom
commands to be issued directly to devices. Commands can currently be sent via MQTT and via Twilio
SMS message, though custom command delivery providers can be created for other protocols.
The default SiteWhere tenant configuration connects to an MQTT broker and routes commands to
MQTT topics determined by the device hardware id. System commands are sent on topic **SiteWhere/system/[hardwareId]** 
while custom commands are sent on **SiteWhere/commands/[hardwareId]**. The following 
section in the tenant configuration file enables this functionality:

{% highlight xml %}
<!-- Used for devices that expect JSON invocations -->
<sw:mqtt-command-destination destinationId="json"
	hostname="localhost" port="1883">
	<sw:json-command-encoder/>
	<sw:hardware-id-topic-extractor commandTopicExpr="SiteWhere/commands/%s"
		systemTopicExpr="SiteWhere/system/%s"/>
</sw:mqtt-command-destination>
{% endhighlight %}

Note the **json-command-encoder** element which configures SiteWhere to encode
the MQTT payloads as JSON packets conforming to the SiteWhere specifications.

### Receiving System Commands
System commands are pieces of data sent from SiteWhere to a device to inform it about
events that have occurred on the server. For instance, if a device has been registered,
a registration response is sent as a system command. All system commands have some fields
in common:

{% highlight json %}
{
	"systemCommand": {
		"type": "RegistrationAck",
		"reason": "NewRegistration"
	},
	"nestingContext": {
		"gateway": {
			"createdDate": "2016-02-13T11:00:39.465-0500",
			"createdBy": "system",
			"deleted": false,
			"hardwareId": "123-TEST-4567890",
			"siteToken": "bb105f8d-3150-41f5-b9d1-db04965668d3",
			"specificationToken": "964e7613-dab3-4fb3-8919-266a91370884",
			"deviceElementMappings": [],
			"comments": "Device created by on-demand registration.",
			"assignmentToken": "aefecc20-2eb3-41f1-a52e-b5dc17557f67",
			"metadata": {}
		},
		"nested": null,
		"path": null
	},
	"assignment": {
		"createdDate": "2016-02-13T11:00:39.467-0500",
		"createdBy": "system",
		"deleted": false,
		"token": "aefecc20-2eb3-41f1-a52e-b5dc17557f67",
		"deviceHardwareId": "123-TEST-4567890",
		"assignmentType": "Unassociated",
		"siteToken": "bb105f8d-3150-41f5-b9d1-db04965668d3",
		"status": "Active",
		"activeDate": "2016-02-13T11:00:39.467-0500",
		"state": {},
		"metadata": {}
	}
}
{% endhighlight %}

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **systemCommand**       | The command content being sent from the server.             
| **nestingContext**      | Provides information about the target of the command. Since SiteWhere supports composite devices, the nesting context can provide information about which contained device is the command target (via the path).
| **assignment**          | Information about the current assignment for the device.

### Device Registration Response
After a device has issued a device registration request, SiteWhere will asynchronously process the request
and send a response on the system channel. The JSON format for a registration response is shown below:

{% highlight json %}
{
	"systemCommand": {
		"type": "RegistrationAck",
		"reason": "NewRegistration"
	},
	"nestingContext": {
		...
	},
	"assignment": {
		...
	}
}
{% endhighlight %}

The following information is returned in a registration response (in the *systemCommand* section):

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **type**                | The type will always be *RegistrationAck* for a registration response.            
| **reason**              | Indicates the registration result. Possible values are *NewRegistration* and *AlreadyRegistered* if registration was successful. For failed registration, possible values are *NewDevicesNotAllowed*, *InvalidSpecificationToken*, and *SiteTokenRequired*.


### Device Custom Command Request
In addition to system commands, each device specification can have any number of custom commands associated
with it. To invoke a command, SiteWhere creates a command invocation event which specifies the entity that
invoked the command and details such as values for the command parameters. The command is then routed to a 
command destination which encodes it. An example for a command received from a destination using the JSON
encoding scheme is shown below;

{% highlight json %}
{
	"command": {
		"command": {
			"createdDate": "2016-02-13T13:50:12.352-0500",
			"createdBy": "admin",
			"updatedDate": null,
			"updatedBy": null,
			"deleted": false,
			"token": "b24ce333-b1a1-4de5-9ca0-cc1d09d697f1",
			"specificationToken": "964e7613-dab3-4fb3-8919-266a91370884",
			"namespace": "http://www.test.com",
			"name": "blinkLed",
			"description": "Blinks an LED on the device.",
			"parameters":[
				{
					"name":"color",
					"type":"String",
					"required":true
				},
				{
					"name":"count",
					"type":"Int32",
					"required":false
				}],
			"metadata":{}
		},
		"invocation": {
			"id": "56bf7c84a76cfa4ff7901e94",
			"eventType": "CommandInvocation",
			"siteToken": "bb105f8d-3150-41f5-b9d1-db04965668d3",
			"deviceAssignmentToken": "aefecc20-2eb3-41f1-a52e-b5dc17557f67",
			"assignmentType": "Unassociated",
			"eventDate": "2016-02-13T13:57:08.274-0500",
			"receivedDate": "2016-02-13T13:57:08.274-0500",
			"initiator": "REST",
			"initiatorId": "admin",
			"target": "Assignment",
			"commandToken": "b24ce333-b1a1-4de5-9ca0-cc1d09d697f1",
			"parameterValues": {
				"color":"#ff0000",
				"count":"3"
			},
			"status": "Pending",
			"metadata": {}
		},
		"parameters": {
			"color": "#ff0000",
			"count": 3
		}
	},
	"nestingContext":{
		...
	},"assignment":{
		...
	}
}
{% endhighlight %}

The following information is sent with a command invocation:

| Field                   | Description                                      
|-------------------------|---------------------------------------------------------
| **command**             | Information about the command that was invoked. This is pulled from the device specification and indicates the command definition independent of the current invocation.            
| **invocation**          | Contains details about the command invocation event such as who initiated the command and what parameters were passed.

