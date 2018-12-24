# Device Registration Microservice

<MicroserviceBadge text="Multitenant Microservice" type="multitenant"/>
The device registration microservice ingests data from a Kafka topic
populated by the inbound processing microservice and acts on events where the device token
indicates a device that is not currently registered in the system. Each tenant engine has
a device registration manager which may be configured to indicate how unregistered
devices are to be treated. The device registration manager processes each inbound
event and can potentially register the device automatically before adding the event
to a re-processing topic to have it processed by the inbound processing microservice.

Events that do not result in auto-registration of a device are pushed to a "dead letter"
topic in Kafka so that they can be tracked or processed out-of-band by external processors.

## Microservice Dependencies

| Microservice                                        | Dependency                                                          |
| :-------------------------------------------------- | :------------------------------------------------------------------ |
| **[Instance Management](./instance-management.md)** | Required to initially bootstrap Zookeeper data.                     |
| **[Device Management](./device-management.md)**     | Used to locate devices and assignments for registration processing. |

## Configuration

### Configuration Schema

[Device Registration Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-registration/current/device-registration.xsd)

#### Example Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:dr="http://sitewhere.io/schema/sitewhere/microservice/device-registration"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/device-registration http://sitewhere.io/schema/sitewhere/microservice/device-registration/current/device-registration.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Device Registration -->
	<dr:device-registration>

		<!-- Configure the default registration manager -->
		<dr:default-registration-manager
			allowNewDevices="false" />

	</dr:device-registration>

</beans>
```
