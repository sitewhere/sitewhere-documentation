# Command Delivery Microservice

<Seo/>

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The command delivery microservice ingests data from the Kafka topic containing
pre-processed events and, for command invocations, handles command processing. This includes
using configured routing constraints and command destinations that indicate how the command
is to be encoded, which transport is to be used, and where the command is to be delivered.

## Microservice Dependencies

| Microservice                                        | Dependency                                                     |
| :-------------------------------------------------- | :------------------------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data.                |
| **[Device Management](./device-management.md)**     | Used to locating devices and assignments for command delivery. |

## Configuration

### Configuration Schema

[Command Delivery Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/command-delivery/current/command-delivery.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:cd="http://sitewhere.io/schema/sitewhere/microservice/command-delivery"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/command-delivery http://sitewhere.io/schema/sitewhere/microservice/command-delivery/current/command-delivery.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Command delivery -->
	<cd:command-delivery>

		<!-- Default router -->
		<cd:device-type-mapping-router
			defaultDestination="default"></cd:device-type-mapping-router>

		<!-- Command destinations -->
		<cd:mqtt-command-destination
			destinationId="default" hostname="${mqtt.host:localhost}"
			port="${mqtt.port:1883}">
		</cd:mqtt-command-destination>

	</cd:command-delivery>

</beans>
```

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.inbound-enriched-command-invocations_

| Topic Name                           | Relation | Content                                          |
| :----------------------------------- | :------- | :----------------------------------------------- |
| inbound-enriched-command-invocations | Consumer | Enriched command invocation events to process.   |
| undelivered-command-invocations      | Producer | Command invocations that could not be delivered. |
