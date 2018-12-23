# Schedule Management Microservice

The multitenant schedule management microservice provides the core APIs and data persistence
for managing schedules for each tenant in a SiteWhere instance. The schedule model is initially
populated based on the scripts included in the tenant template used when creating the tenant.
Most tenant templates include a few example schedules. If using the "Empty" template, no schedule
management data will be populated.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.

## Configuration Schema

[Schedule Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/schedule-management/current/schedule-management.xsd)

### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:sm="http://sitewhere.io/schema/sitewhere/microservice/schedule-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/schedule-management http://sitewhere.io/schema/sitewhere/microservice/schedule-management/current/schedule-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Schedule Management -->
	<sm:schedule-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

	</sm:schedule-management>

</beans>
```

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](web-rest.md) backed by the schedule
management microservice.

- [**Schedule APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/schedules) - REST API methods for managing schedules.

### gRPC APIs

The schedule management microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the schedule management APIs. In the default
configuration, the port is only accessible to the other microservices. The schedule management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set schedule_management.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC schedule management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-schedule-management', version: '2.0.1'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-schedule-management</artifactId>
    <version>2.0.1</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)
