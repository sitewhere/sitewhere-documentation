# :book: Asset Management Microservice

<Seo/>

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The asset management microservice provides the core APIs and data persistence
for managing assets for each tenant in a SiteWhere instance. The asset model is initially
populated based on the scripts included in the tenant template used when creating the tenant.
For instance, the "Construction" template populates assets such as heavy equipment, storage
trailers, and various types of tracking devices. If using the "Empty" template, no asset
management data will be populated.

## Microservice Dependencies

| Microservice                                       | Dependency                                      |
| :------------------------------------------------- | :---------------------------------------------- |
| **[Instance Management](../instance-management/)** | Required to initially bootstrap Zookeeper data. |
| **[Device Management](../device-management/)**     | Required by a subset of asset management tasks. |

## Available APIs

### REST APIs

The following REST APIs are served by the [Web/REST microservice](../web-rest/) backed by the asset
management microservice.

| API                                                                         | Description                                |
| :-------------------------------------------------------------------------- | :----------------------------------------- |
| [**Asset APIs**](http://sitewhere.io/docs/2.1.0/api2/#tag/assets)           | REST API methods for managing assets.      |
| [**Asset Type APIs**](http://sitewhere.io/docs/2.1.0/api2/#tag/asset-types) | REST API methods for managing asset types. |

### gRPC APIs

The asset management microservice includes a gRPC server which listens on a dedicated port
(9000) and offers high performance access to the asset management APIs. In the default
configuration, the port is only accessible to the other microservices. The asset management
ports may be exposed via load balancer by executing the following Helm command:

`helm upgrade -set asset_management.service.type=LoadBalancer`

### gRPC Clients

Java stubs are available for accessing the gRPC asset management APIs. The stubs
may be included by using the following:

#### Gradle

```groovy
compile group: 'com.sitewhere', name: 'sitewhere-grpc-asset-management', version: '2.0.4'
```

#### Maven

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-grpc-asset-management</artifactId>
    <version>2.0.4</version>
</dependency>
```

See the following repository for
the `proto` definitions if bindings other than Java are needed:

[**https://github.com/sitewhere/sitewhere-grpc-api**](https://github.com/sitewhere/sitewhere-grpc-api)

## Configuration

### Configuration Schema

[Asset Management Configuration XML Schema](https://sitewhere.io/schema/sitewhere/microservice/asset-management/current/asset-management.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:am="http://sitewhere.io/schema/sitewhere/microservice/asset-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/asset-management http://sitewhere.io/schema/sitewhere/microservice/asset-management/current/asset-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Asset Management Configuration -->
	<am:asset-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

	</am:asset-management>

</beans>
```
