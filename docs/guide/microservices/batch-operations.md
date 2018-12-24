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

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.event-source-decoded-events_

| Topic Name                   | Relation | Content                                                       |
| :--------------------------- | :------- | :------------------------------------------------------------ |
| unprocessed-batch-operations | Producer | Batch operations which have been persisted but not processed. |
| unprocessed-batch-elements   | Producer | Batch elements which have been persisted but not processed.   |
| failed-batch-elements        | Producer | Batch elements which failed processing.                       |
| unprocessed-batch-operations | Consumer | Batch operations which have been persisted but not processed. |
| unprocessed-batch-elements   | Consumer | Batch elements which have been persisted but not processed.   |

## Runtime Behavior

### Batch Operation Manager

Each batch operations tenant engine contains a batch operations manager which processes
operations that are created via the batch management APIs. If multiple instances of the
batch operations microservice are running, the batch processing load will be distributed
amongst them.

#### Creation of Batch Operations

The batch operations manager for each tenant acts as both a producer and consumer of batch
operations. When a batch operation is persisted via the batch management APIs, the basic
operation information is stored, then the operation is pushed onto the unprocessed operations
topic along with the list of device tokens the operation targets. At this point, the status
of the batch operation is `Unprocessed`. The unprocessed batch operations topic is keyed
with the batch operation id so that operations are always processed by the same consumer.
This prevents race conditions where two batch operation tenant engines for the same tenant
attempt to process the same batch operation concurrently.

#### Initialization of Batch Operations

The batch operations manager has a consumer for unprocessed operations which takes the
operation information and the list of device tokens is applies to, then creates batch
elements for each of the device tokens. The status of the batch operation is first updated
to `Initializing`, then batch elements are persisted with a status of `Unprocessed` and
pushed onto the unprocessed batch elements topic. Depending on throttling settings in
the batch operations manager, a delay may be introduced in the creation of batch elements
to prevent overloading the database with a large number of elements in a short period of
time. If all of the batch elements are created and pushed successfully, the batch operation
status is updated to `InitializedSuccessfully`. Otherwise, the operation status is updated
to `InitializedWithErrors`.

#### Processing of Batch Elements

The batch operations manager has a consumer for unprocessed batch elements, which takes
the individual elements for a batch operation and processes them. Note that the batch elements
are keyed by device token, so elements for a given device will always be processed by the
same batch operations manager. The batch element is first updated with a status of
`Processing`, then the processing is handed off to a batch operation handler based on
the `operationType` field on the parent operation. For instance, a handler is registered
for processing batch command invocations and is triggered if the operation type is
`BatchCommandInvocation`. The batch operation manager is designed to support many batch
operation types, but currently only handles batch command invocations.

#### Processing of Batch Command Invocations

If the `operationType` of the batch operation is `BatchCommandInvocation`, the operation is
treated as a batch command invocation, which results in a command invocation event being
generated for each of the batch elements. Based on metadata stored with the parent operation,
both the targeted device and the command to be invoked are looked up via the
[device management](./device-management.md) APIs. After verifying that a device exists
for the token and that it has an active assignment, a new device command invocation event
is created via the [event management](./event-management.md) APIs. The created command invocation
will be picked up by the [inbound processing](./inbound-processing.md) service and forwarded
to the [command delivery](./command-delivery.md) service for delivery to the device.
