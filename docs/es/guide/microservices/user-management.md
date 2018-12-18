# User Management Microservice

The global user management microservice provides the core APIs and data persistence used
to manage system users. It is initially used by the instance management microservice
to bootstrap the system with base users. Afterward, it is called by the Web/REST
microservice to allow the list of users to be managed.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.

## Configuration Schema

[User Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/user-management/current/user-management.xsd)

### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:um="http://sitewhere.io/schema/sitewhere/microservice/user-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/user-management http://sitewhere.io/schema/sitewhere/microservice/user-management/current/user-management.xsd">

	<!-- User Management Configuration -->
	<um:user-management>

		<!-- Use global MongoDB configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="global" />
		</ds:device-management-datastore>

	</um:user-management>

</beans>
```
