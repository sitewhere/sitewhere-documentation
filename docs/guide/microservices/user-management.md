<Seo/>
# User Management Microservice

<MicroserviceBadge text="Global Microservice" type="global"/>
The user management microservice provides the core APIs and data persistence used
to manage system users. It is initially used by the instance management microservice
to bootstrap the system with base users. Afterward, it is called by the Web/REST
microservice to allow the list of users to be managed.

## Microservice Dependencies

| Microservice                                        | Dependency                                      |
| :-------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data. |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](web-rest.md) backed by the user
management microservice.

| API                                                             | Description                          |
| :-------------------------------------------------------------- | :----------------------------------- |
| [**User APIs**](http://sitewhere.io/docs/2.0.0/api2/#tag/users) | REST API methods for managing users. |

### gRPC APIs

The user management microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the user management APIs. In the default
configuration, the port is only accessible to the other microservices. The user management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set user_management.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC user management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-user-management', version: '2.0.1'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-user-management</artifactId>
    <version>2.0.1</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[User Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/user-management/current/user-management.xsd)

#### Example Configuration

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
