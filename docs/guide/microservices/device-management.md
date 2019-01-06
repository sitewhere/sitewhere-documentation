<Seo/>
# Device Management Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The device management microservice provides the core APIs and data persistence
for managing the device model (customers, areas, device types, devices, etc.) for each tenant
in a SiteWhere instance. The device model is initially populated based on the scripts included
in the tenant template used when creating the tenant. For instance, the "Construction" template
will populate the data model with devices appropriate for a construction site. If using the
"Empty" template, no device management data will be populated.

## Microservice Dependencies

| Microservice                                        | Dependency                                                 |
| :-------------------------------------------------- | :--------------------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data.            |
| **[Event Management](./event-management.md)**       | Used to create state change events on assignment updates.  |
| **[Asset Management](./asset-management.md)**       | Used to resolve asset associations for device assignments. |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](web-rest.md) backed by the device
management microservice.

| API                                                                                 | Description                                       |
| :---------------------------------------------------------------------------------- | :------------------------------------------------ |
| [**Area APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/areas)                     | REST API methods for managing areas.              |
| [**Area Type APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/area-types)           | REST API methods for managing area types.         |
| [**Customer APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/customers)             | REST API methods for managing customers.          |
| [**Customer Type APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/customer-types)   | REST API methods for managing customer types.     |
| [**Device APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/devices)                 | REST API methods for managing devices.            |
| [**Device Assignment APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/assignments)  | REST API methods for managing device assignments. |
| [**Device Command APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/device-commands) | REST API methods for managing device commands.    |
| [**Device Group APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/device-groups)     | REST API methods for managing device groups.      |
| [**Device Status APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/device-statuses)  | REST API methods for managing device statuses.    |
| [**Device Type APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/device-types)       | REST API methods for managing device types.       |

### gRPC APIs

The device management microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the device management APIs. In the default
configuration, the port is only accessible to the other microservices. The device management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set device_management.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC device management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-device-management', version: '2.0.1'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-device-management</artifactId>
    <version>2.0.1</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[Device Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-management/current/device-management.xsd)

#### Example Configuration

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
