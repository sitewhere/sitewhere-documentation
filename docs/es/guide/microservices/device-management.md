# Device Management Microservice

The multitenant device management microservice provides the core APIs and data persistence
for managing the device model (customers, areas, device types, devices, etc.) for each tenant
in a SiteWhere instance. The device model is initially populated based on the scripts included
in the tenant template used when creating the tenant. For instance, the "Construction" template
will populate the data model with devices appropriate for a construction site. If using the
"Empty" template, no device management data will be populated.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.
- **Event Management** - Used to create state change events on assignment updates.
- **Asset Management** - Used to resolve asset associations for device assignments.

## Configuration Schema

[Device Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-management/current/device-management.xsd)

### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:dm="http://sitewhere.io/schema/sitewhere/microservice/device-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/device-management http://sitewhere.io/schema/sitewhere/microservice/device-management/current/device-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Device Management Configuration -->
	<dm:device-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

	</dm:device-management>

</beans>
```
