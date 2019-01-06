# Event Sources Microservice

<Seo/>

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The event sources microservice hosts tenant engines that may be configured
to ingest data from many types of data producers. Some examples include consuming data
from MQTT topics, CoAP requests, direct TCP/IP socket connections, WebSockets, REST calls
via push or pull models, and many other potential sources. After events are ingested,
they are decoded into a standardized data model and pushed to a tenant-specific Kafka
topic for further processing. Kafka topics are also registered for events that can not
be parsed or are detected as duplicates by deduplication processing.

## Microservice Dependencies

| Microservice                                        | Dependency                                         |
| :-------------------------------------------------- | :------------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data.    |
| **[Device Management](./device-management.md)**     | Used for event deduplication and Groovy scripting. |
| **[Event Management](./event-management.md)**       | Used for event deduplication and Groovy scripting. |

## Configuration

### Configuration Schema

[Event Sources Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/event-sources/current/event-sources.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:es="http://sitewhere.io/schema/sitewhere/microservice/event-sources"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/event-sources http://sitewhere.io/schema/sitewhere/microservice/event-sources/current/event-sources.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Event sources Configuration -->
	<es:event-sources>

		<!-- Event source for protobuf messages over MQTT -->
		<es:mqtt-event-source sourceId="protobuf"
			numThreads="1" hostname="${mqtt.host:localhost}"
			port="${mqtt.port:1883}"
			topic="SiteWhere/${tenant.token}/input/protobuf">
			<es:protobuf-event-decoder />
		</es:mqtt-event-source>

		<!-- Event source for JSON device requests over MQTT -->
		<es:mqtt-event-source sourceId="json"
			numThreads="5" hostname="${mqtt.host:localhost}"
			port="${mqtt.port:1883}" topic="SiteWhere/${tenant.token}/input/json">
		</es:mqtt-event-source>

	</es:event-sources>

</beans>
```

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.event-source-decoded-events_

| Topic Name                         | Relation | Content                                                                    |
| :--------------------------------- | :------- | :------------------------------------------------------------------------- |
| event-source-decoded-events        | Producer | Contains events which have been received and decoded by event sources.     |
| event-source-failed-decode-events  | Producer | Contains events which could not be decoded by event sources.               |
| inbound-device-registration-events | Producer | Contains decoded device registration events which have not been processed. |
