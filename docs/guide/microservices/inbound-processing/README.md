# :book: Inbound Processing Microservice

<Seo/>

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The inbound processing microservice handles post-processing of events that have
entered the system via event sources or REST API calls. Events from event sources
are looked up to verify they correspond to a registered device with an active
assignment. This microservice also handles the enrichment of persisted events
by adding device and assignment information to the payload before making it
available to consumers interested in event information.

## Microservice Dependencies

| Microservice                                       | Dependency                                      |
| :------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](../instance-management/)** | Required to initially bootstrap Zookeeper data. |
| **[Device Management](../device-management/)**     | Used to enrich inbound events with device data. |
| **[Event Management](../event-management/)**       | Used for persistence of inbound event payloads. |

## Configuration

### Configuration Schema

[Inbound Processing Configuration XML Schema](https://sitewhere.io/schema/sitewhere/microservice/inbound-processing/current/inbound-processing.xsd)

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

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.event-source-decoded-events_

| Topic Name                           | Relation | Content                                                                          |
| :----------------------------------- | :------- | :------------------------------------------------------------------------------- |
| event-source-decoded-events          | Consumer | Non-enriched events which have been decoded by event sources.                    |
| inbound-reprocess-events             | Consumer | Non-enriched events which are queued for reprocessing.                           |
| inbound-persisted-events             | Consumer | Events which have been persisted via event sources or REST APIs.                 |
| inbound-unregistered-device-events   | Producer | Contains events for devices not registered in the system.                        |
| inbound-enriched-events              | Producer | Events which have been enriched with device/assignment information.              |
| inbound-enriched-command-invocations | Producer | Command invocations which have been enriched with device/assignment information. |

## Runtime Behavior

### Inbound Event Processing Logic

#### Validation of Events from Event Sources

The inbound processing microservice ingests data that was produced by the
[event sources](./event-sources.md) microservice after decoding and deduplication
has completed. The inbound data is validated by interacting with the
[device management](./device-management.md) microservice to verify that
the inbound event relates to a registered device with an active device assignment.

#### Handling of Unregistered Devices

If an event is found not to have a corresponding registered device with an
active assignment, the payload is passed to the [device registration](./device-registration.md)
microservice for additional processing. If the device becomes registered as a result,
the event is pushed onto a re-processing topic so that it may be processed again with
the newly registered device.

#### Persistence of Event Source Data

After initial validation, event data is persisted via the event persistence
APIs. Once event storage is complete, the [event management](./event-management.md)
microservice adds persisted events to a topic which is consumed by the inbound
processing microservice. This allows for combined handling of both data from
event sources and data added via the REST APIs. The persisted payload is enriched
with device/assignment data so the information may be used by subsequent processing
steps without the need to look it up again. The resulting payload is pushed to
a Kafka topic that contains events which have been persisted and enriched so that
they may be processed by other microservices.
