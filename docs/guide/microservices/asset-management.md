# Asset Management Microservice

The multitenant asset management microservice provides the core APIs and data persistence
for managing assets for each tenant in a SiteWhere instance. The asset model is initially
populated based on the scripts included in the tenant template used when creating the tenant.
For instance, the "Construction" template populates assets such as heavy equipment, storage
trailers, and various types of tracking devices. If using the "Empty" template, no asset
management data will be populated.

## Microservice Dependencies

- **Instance Management** - Required to initially bootstrap Zookeeper data.
- **Device Management** - Required by a subset of asset management tasks.

## Configuration Schema

[Asset Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/asset-management/current/asset-management.xsd)

### Example Configuration

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
