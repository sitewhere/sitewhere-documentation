# Outbound Connectors Microservice

The multitenant outbound connectors microservice ingests data from the Kafka topic containing
pre-processed events and allows the event data to be forwarded to other integration points
asynchronously. Each outbound connector is a Kafka consumer that has its own pointer into
the events topic, so the system is not blocked by connectors that occasionally process at
slower rates than the rest of the system. Connectors are available for common use cases such
as forwarding events to a well-known MQTT topic or indexing events in Apache Solr.

## Microservice Dependencies

- **[Instance Management](./instance-management.md)** - Required to initially bootstrap Zookeeper data.
- **[Device Management](./device-management.md)** - Provided as API for outbound connectors to use.
- **[Event Management](./event-management.md)** - Provided as API for outbound connectors to use.

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
