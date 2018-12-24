# Inbound Processing Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The inbound processing microservice ingests data that was produced by the
event sources microservice (after decoding and deduplication has completed). This microservice
validates the inbound data by interacting with the device management microservice to
verify that the inbound event relates to a registered device. The inbound payload is enriched
with device/assignment data so the information may be used by subsequent processing steps
without the need to look it up again. If the device is not registered, the payload is
passed to the device registration microservice for additional processing. If the device becomes
registered as a result, the event is pushed onto a re-processing topic so that it may be
processed again with the newly registered device.

Once the inbound event has been enriched, it is forwarded to the event management
microservice for persistence. The persisted event is eventually (asynchronously) returned
to inbound processing where it is added to a topic for pre-processed events that may
in turn be consumed by other microservices such a rule processing and outbound
connectors.

## Microservice Dependencies

| Microservice                                        | Dependency                                      |
| :-------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data. |
| **[Device Management](./device-management.md)**     | Used to enrich inbound events with device data. |
| **[Event Management](./event-management.md)**       | Used for persistence of inbound event payloads. |

## Configuration

### Configuration Schema

[Inbound Processing Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/inbound-processing/current/inbound-processing.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:ip="http://sitewhere.io/schema/sitewhere/microservice/inbound-processing"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/inbound-processing http://sitewhere.io/schema/sitewhere/microservice/inbound-processing/current/inbound-processing.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<ip:inbound-processing processingThreadCount="25" />

</beans>
```
