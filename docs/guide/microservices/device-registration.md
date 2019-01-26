# :book: Device Registration Microservice

<Seo/>

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

## Kafka Topics

The following Kafka topics are used to interact with the event processing pipeline.
For multitenant microservices, topic names are specific to the tenant whose data
they contain and have a standardized format as shown below:

<MicroserviceBadge text="Product Id" type="multitenant"/>. <MicroserviceBadge text="Instance Id" type="multitenant"/>. tenant . <MicroserviceBadge text="Tenant UUID" type="multitenant"/>. <MicroserviceBadge text="Topic Name" type="multitenant"/>

For example, a valid topic name might be:

_sitewhere.sitewhere1.tenant.53daebb2-8b54-4031-a4b9-29e3fc04b4be.inbound-device-registration-events_

| Topic Name                         | Relation | Content                                            |
| :--------------------------------- | :------- | :------------------------------------------------- |
| inbound-device-registration-events | Consumer | Device registration requests from event sources.   |
| inbound-unregistered-device-events | Consumer | Events for devices not registered with the system. |

## Runtime Behavior

### Device Registration Manager

Each tenant for the device registation microservice has its own device registration manager
which controls if/when devices may self-register with the system. By default, automatic
device registation is turned off since it may be a security risk if not properly locked
down. If device auto-registration is enabled, default values may be set for devices that
self-register, including the associated customer and area they are associated with.

### Device Registration Logic

#### Registration Requests from Event Sources

Event sources may forward registration requests from devices that were not previously
registered with the system. Depending on how the device registration manager is configured,
device auto-registration may be prohibited. Otherwise, a registration request causes
a new device to be created along with a device assignment which may be used to establish
the customer and area a device is assigned to.

#### Events from Unregistered Devices

If events are received for unregistered devices, they are forwarded to the device registration
microservice to offer the opportunity for devices to be auto-registered for the events. If
auto-registration is enabled, a new device and assignement will be created, then the
original event is passed into a retry queue consumed by the [inbound processing](./inbound-processing.md)
microservice.

::: warning
Event handling for unregistered devices is not completely implemented in SiteWhere 2.0.
:::
