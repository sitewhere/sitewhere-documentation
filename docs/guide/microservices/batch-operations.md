# Batch Operations Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The batch operations microservice provides the core APIs and data persistence
for managing batch operations for each tenant in a SiteWhere instance. The batch operations
model is empty upon tenant initialization, but may be populated by invoking APIs that
produce batch operations (such as batch command invocations).

## Microservice Dependencies

| Microservice                                        | Dependency                                                       |
| :-------------------------------------------------- | :--------------------------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data.                  |
| **[Device Management](./device-management.md)**     | Used to locate device information when resolving batch elements. |
| **[Event Management](./event-management.md)**       | Used to create command invocation events for batch commands.     |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](web-rest.md) backed by the batch
operations microservice.

| API                                                                                   | Description                                     |
| :------------------------------------------------------------------------------------ | :---------------------------------------------- |
| [**Batch Operation APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/batch-operations) | REST API methods for managing batch operations. |

### gRPC APIs

The batch operations microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the batch management APIs. In the default
configuration, the port is only accessible to the other microservices. The batch management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set batch_operations.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC batch management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-batch-management', version: '2.0.1'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-batch-management</artifactId>
    <version>2.0.1</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[Batch Operations Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/batch-operations/current/batch-operations.xsd)

#### Example Configuration

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

## Runtime Behavior

### Batch Operation Manager

Each batch operations tenant engine contains a batch operation manager that may
be configured to process batch operations that are created via the APIs. The batch operation
manager will turn the batch request into many smaller operations to achieve the batch goal.
