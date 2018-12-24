# Device State Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The device state microservice ingests data from the Kafka topic containing
pre-processed events and uses the event data to update device state. The device state
model persists the most recent location, measurements, and alerts for each device as
well as information about when the last interaction with the device occurred.

Each tenant engine has a device presence manager that is responsible for determining
when devices are no longer present and firing state change events that can be used to
trigger actions based on a device becoming present or not present.

## Microservice Dependencies

| Microservice                                        | Dependency                                                   |
| :-------------------------------------------------- | :----------------------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data.              |
| **[Device Management](./device-management.md)**     | Used to locate devices and assignments for state processing. |
| **[Event Management](event-management.md)**         | Used to record device state changes for presence management. |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](web-rest.md) backed by the device
state microservice.

| API                                                                             | Description                                  |
| :------------------------------------------------------------------------------ | :------------------------------------------- |
| [**Device State APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/device-states) | REST API methods for managing device states. |

### gRPC APIs

The device state microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the device state APIs. In the default
configuration, the port is only accessible to the other microservices. The device state
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set device_state.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC device state APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-device-state', version: '2.0.1'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-device-state</artifactId>
    <version>2.0.1</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[Device State Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-state/current/device-state.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/device-state"
	xmlns:data="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/device-state http://sitewhere.io/schema/sitewhere/microservice/device-state/current/device-state.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<ds:device-state>

		<!-- Use global MongoDB tenant configuration -->
		<data:device-state-datastore>
			<data:mongodb-datastore-reference
				id="tenant" />
		</data:device-state-datastore>

		<!-- Configure presence manager -->
		<ds:presence-manager checkInterval="10m" presenceMissingInterval="8h"/>

	</ds:device-state>

</beans>
```
