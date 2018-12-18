# Web/REST Microservice

The global Web/REST microservice includes an embedded Tomcat container which
provides infrastructure for all of the core REST services including Swagger user
interfaces. This microservice is usually connected to all other microservices in the
system so that API calls may be delegated to the microservices that implement
the functionality. For instance, querying for a device via the REST APIs
results in a gRPC request (potentially cached) to the appropriate
device management tenant engine on one of the device management microservices.

There may be cases where the microservice required to complete a request is not available.
In this case, a _ServiceNotAvailable_ exception is thrown and passed back as an error to
the user/application that made the request. Using this approach, areas of the system may
be shut down to conserve resources while not affecting the functionality of the system as
a whole. Callers to the REST services should be prepared to handle cases where the
subsystem they are calling may be shut down.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.
- **User Management** - Used for processing REST invocations.
- **Tenant Management** - Used for processing REST invocations.
- **Device Management** - Used for processing REST invocations.
- **Event Management** - Used for processing REST invocations.
- **Asset Management** - Used for processing REST invocations.
- **Batch Management** - Used for processing REST invocations.
- **Schedule Management** - Used for processing REST invocations.
- **Label Generation** - Used for processing REST invocations.
- **Device State** - Used for processing REST invocations.

## Configuration Schema

[Web/REST Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/web-rest/current/web-rest.xsd)

### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:web="http://sitewhere.io/schema/sitewhere/microservice/web-rest"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/web-rest http://sitewhere.io/schema/sitewhere/microservice/web-rest/current/web-rest.xsd">

	<!-- Web/REST Configuration -->
	<web:web-rest />

</beans>
```
