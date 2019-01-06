<Seo/>
# Rule Processing Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The rule processing microservice ingests data from the Kafka topic containing
pre-processed events and applies conditional logic to further process the events. Tenant engines
can use embedded complex event processing (WSO2 Siddhi) to detect patterns in the event
stream and fire new events as the result.

::: warning
This microservice is not fully implemented in SiteWhere 2.0
:::

## Microservice Dependencies

| Microservice                                        | Dependency                                      |
| :-------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data. |
| **[Device Management](./device-management.md)**     | Provided as API for rule processors to use.     |
| **[Event Management](./event-management.md)**       | Provided as API for rule processors to use.     |

## Configuration

### Configuration Schema

[Rule Processing Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/rule-processing/current/rule-processing.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:rp="http://sitewhere.io/schema/sitewhere/microservice/rule-processing"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/rule-processing http://sitewhere.io/schema/sitewhere/microservice/rule-processing/current/rule-processing.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Rule processing -->
	<rp:rule-processing>
	</rp:rule-processing>

</beans>
```

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.inbound-enriched-events_

| Topic Name              | Relation | Content                                        |
| :---------------------- | :------- | :--------------------------------------------- |
| inbound-enriched-events | Consumer | Enriched event stream used by rule processors. |

:::tip
Rule processors work differently than Kafka processors in most other microservices. Each rule
processor has its own Kafka consumer group that processes the stream of enriched events independently.
This allows many rule processors to interact with the event stream concurrently with each keeping its
own index into the stream. A slow rule processor will not block the progress of other processors.
:::
