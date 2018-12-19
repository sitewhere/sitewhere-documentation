# Event Management Microservice

The multitenant event management microservice provides the core APIs and data persistence
for managing device events (locations, measurements, alerts, command invocations, etc) for
each tenant in a SiteWhere instance. The device event model is initially populated based on
the scripts included in the tenant template used when creating the tenant. For instance, the
"Construction" template populates example location, measurement and alert data relevant to
machines at a construction site. If using the "Empty" template, no event management data
will be populated.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.
- **Device Management** - Used to look up device assignment information.

## Configuration Schema

[Event Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/event-management/current/event-management.xsd)

### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:em="http://sitewhere.io/schema/sitewhere/microservice/event-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/event-management http://sitewhere.io/schema/sitewhere/microservice/event-management/current/event-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Event Management Configuration -->
	<em:event-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:event-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:event-management-datastore>

	</em:event-management>

</beans>
```
