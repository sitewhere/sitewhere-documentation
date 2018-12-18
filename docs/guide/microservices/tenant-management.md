# Tenant Management Microservice

The global tenant management microservice provides the core APIs and data persistence for
managing system tenants. It is initially used by the instance management microservice
to bootstrap the system with base tenants. Afterward, it is called by the Web/REST
microservice to allow the list of system tenants to be managed.

When a tenant is added/updated/deleted, the tenant data is pushed to a Kafka topic
so that other interested listeners can act on the update. By default, a listener is
registered to boostrap newly created tenants by adding the expected tenant configuration
hierarchy in ZooKeeper. This process includes copying the per-microservice XML configuration
files from the tenant template into ZooKeeper, then executing the list of initialization
scripts included with the template. Once this process is complete, the tenant configuration
is marked as boostrapped so that other microservices can react to the added tenant. For
instance, the device management microservice will notice that a new tenant has been configured
and will wait for the bootstrapped indicator, then will load the device-management.xml
configuration file to initialize a new device management tenant engine for the added tenant.
Any time that files within a tenant are changed, the changes are broadcast to tenant engines
running on all other microservices so they can react to the changes. In the previous example,
if multiple device management microservices are running (scale > 1), each microservice will
detect the updates and reload the tenant engines to reflect the updates.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.

## Configuration Schema

[Tenant Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/tenant-management/current/tenant-management.xsd)

### Example Configuration

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
