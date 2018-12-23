# Rule Processing Microservice

The multitenant rule processing microservice ingests data from the Kafka topic containing
pre-processed events and applies conditional logic to further process the events. Tenant engines
can use embedded complex event processing (WSO2 Siddhi) to detect patterns in the event
stream and fire new events as the result.

::: warning
This microservice is not fully implemented in SiteWhere 2.0
:::

## Microservice Dependencies

- **[Instance Management](./instance-management.md)** - Required to initially bootstrap Zookeeper data.
- **[Device Management](./device-management.md)** - Provided as API for rule processors to use.
- **[Event Management](./event-management.md)** - Provided as API for rule processors to use.

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
