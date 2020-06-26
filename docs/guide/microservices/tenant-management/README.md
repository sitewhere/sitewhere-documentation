# Tenant Management Microservice

<Seo/>

<MicroserviceBadge text="Global Microservice" type="global"/>
The tenant management microservice provides the core APIs and data persistence for
managing system tenants. It is initially used by the instance management microservice
to bootstrap the system with base tenants. Afterward, it is called by the Web/REST
microservice to allow the list of system tenants to be managed.

## Microservice Dependencies

| Microservice                                       | Dependency                                      |
| :------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](../instance-management/)** | Required to initially bootstrap Zookeeper data. |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](../web-rest/) backed by the tenant
management microservice.

| API                                                                 | Description                            |
| :------------------------------------------------------------------ | :------------------------------------- |
| [**Tenant APIs**](http://sitewhere.io/docs/2.1.0/api2/#tag/tenants) | REST API methods for managing tenants. |

### gRPC APIs

The tenant management microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the tenant management APIs. In the default
configuration, the port is only accessible to the other microservices. The tenant management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set tenant_management.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC tenant management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-tenant-management', version: '2.0.4'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-tenant-management</artifactId>
    <version>2.0.4</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[Tenant Management Configuration XML Schema](https://sitewhere.io/schema/sitewhere/microservice/tenant-management/current/tenant-management.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:tm="http://sitewhere.io/schema/sitewhere/microservice/tenant-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/tenant-management http://sitewhere.io/schema/sitewhere/microservice/tenant-management/current/tenant-management.xsd">

	<!-- Tenant Management Configuration -->
	<tm:tenant-management>

		<!-- Use global MongoDB configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="global" />
		</ds:device-management-datastore>

	</tm:tenant-management>

</beans>
```

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For global microservices, topic names follow a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="global"/>. <MicroserviceBadge text="Instance Id" type="global"/>. global . <MicroserviceBadge text="Topic Name" type="global"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.global.tenant-model-updates_

| Topic Name           | Relation | Content                                                                        |
| :------------------- | :------- | :----------------------------------------------------------------------------- |
| tenant-model-updates | Producer | Reflects updates to the tenant model such as creating a new tenant.            |
| tenant-model-updates | Consumer | Monitors tenant updates and initializes configuration for newly added tenants. |

## Runtime Behavior

### Asynchronous Zookeeper Bootstrapping

When a tenant is added/updated/deleted, the tenant data is pushed to a Kafka topic
so that other interested listeners can act on the update. By default, a listener is
registered to bootstrap newly created tenants by adding the expected tenant configuration
hierarchy in ZooKeeper. This process includes copying the per-microservice XML configuration
files from the tenant template into ZooKeeper, then executing the list of initialization
scripts included with the template.

### Tenant Engine Bootstrapping

Once the initial Zookeeper bootstrap process is complete, the tenant configuration
is marked as bootsrapped so that other microservices can react to the added tenant. For
instance, the device management microservice will notice that a new tenant has been configured
and will wait for the bootstrapped indicator, then will load the `device-management.xml`
configuration file to initialize a new device management tenant engine for the added tenant.
Any time that files within a tenant are changed, the changes are broadcast to tenant engines
running on all other microservices so they can react to the changes. In the previous example,
if multiple device management microservices are running (scale > 1), each microservice will
detect the updates and reload the tenant engines to reflect the updates.
