# Outbound Connectors Microservice

<Seo/>

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The outbound connectors microservice ingests data from the Kafka topic containing
pre-processed events and allows the event data to be forwarded to other integration points
asynchronously. Each outbound connector is a Kafka consumer that has its own pointer into
the events topic, so the system is not blocked by connectors that occasionally process at
slower rates than the rest of the system. Connectors are available for common use cases such
as forwarding events to a well-known MQTT topic or indexing events in Apache Solr.

## Microservice Dependencies

| Microservice                                        | Dependency                                      |
| :-------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data. |
| **[Device Management](./device-management.md)**     | Provided as API for outbound connectors to use. |
| **[Event Management](./event-management.md)**       | Provided as API for outbound connectors to use. |

## Configuration

### Configuration Schema

[Outbound Connectors Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors/current/outbound-connectors.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:op="http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors/current/outbound-connectors.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Outbound Connectors -->
	<op:outbound-connectors>

		<!-- Send events via MQTT -->
		<op:mqtt-connector connectorId="mqtt1"
			hostname="${mqtt.host:localhost}" port="${mqtt.port:1883}" topic="SiteWhere/output" />

	</op:outbound-connectors>

</beans>
```

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.inbound-enriched-events_

| Topic Name              | Relation | Content                                            |
| :---------------------- | :------- | :------------------------------------------------- |
| inbound-enriched-events | Consumer | Enriched event stream used by outbound connectors. |

:::tip
Outbound connectors work differently than Kafka processors in most other microservices. Each outbound
connector has its own Kafka consumer group that processes the stream of enriched events independently.
This allows many connectors to process the event stream concurrently with each keeping its
own index into the stream. This prevents a slow outbound processor from blocking the progress
of other processors.
:::
