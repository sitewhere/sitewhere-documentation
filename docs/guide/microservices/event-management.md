<Seo/>
# Event Management Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The event management microservice provides the core APIs and data persistence
for managing device events (locations, measurements, alerts, command invocations, etc) for
each tenant in a SiteWhere instance. The device event model is initially populated based on
the scripts included in the tenant template used when creating the tenant. For instance, the
"Construction" template populates example location, measurement and alert data relevant to
machines at a construction site. If using the "Empty" template, no event management data
will be populated.

## Microservice Dependencies

| Microservice                                        | Dependency                                      |
| :-------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data. |
| **[Device Management](./device-management.md)**     | Used to look up device assignment information.  |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](web-rest.md) backed by the event
management microservice.

| API                                                                                | Description                                                     |
| :--------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| [**Area APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/areas)                    | REST API methods for events associated with areas.              |
| [**Customer APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/customers)            | REST API methods for events associated with customers.          |
| [**Device Assignment APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/assignments) | REST API methods for events associated with device assignments. |
| [**Event APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/device-events)           | REST API methods for managing device events.                    |

### gRPC APIs

The event management microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the event management APIs. In the default
configuration, the port is only accessible to the other microservices. The event management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set event_management.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC event management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-event-management', version: '2.0.1'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-event-management</artifactId>
    <version>2.0.1</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[Event Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/event-management/current/event-management.xsd)

#### Example Configuration

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

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.inbound-persisted-events_

| Topic Name               | Relation | Content                                                      |
| :----------------------- | :------- | :----------------------------------------------------------- |
| inbound-persisted-events | Producer | Forwards events to consumers after they have been persisted. |
