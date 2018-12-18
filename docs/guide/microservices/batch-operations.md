# Batch Operations Microservice

The multitenant batch operations microservice provides the core APIs and data persistence
for managing batch operations for each tenant in a SiteWhere instance. The batch operations
model is empty upon tenant initialization, but may be populated by invoking APIs that
produce batch operations (such as batch command invocations).

Each batch operations tenant engine also contains a batch operation manager that may
be configured to process batch operations that are created via the APIs. The batch operation
manager will turn the batch request into many smaller operations to achieve the batch goal.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.
- **Device Management** - Used to locate device information when resolving batch elements.
- **Device Event Management** - Used to create command invocation events for batch commands.

## Configuration Schema

[Batch Operations Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/batch-operations/current/batch-operations.xsd)

### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:bop="http://sitewhere.io/schema/sitewhere/microservice/batch-operations"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/batch-operations http://sitewhere.io/schema/sitewhere/microservice/batch-operations/current/batch-operations.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Batch Operations -->
	<bop:batch-operations>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

		<!-- Batch operation manager configuration -->
		<bop:batch-operation-manager
			throttleDelayMs="100" />

	</bop:batch-operations>

</beans>
```
