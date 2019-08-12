# Device State Microservice

<Seo/>

El microservicio de estado de dispositivo multitenant ingiere datos del tópico de Kafka
que contiene eventos preprocesados y utiliza los datos de eventos para actualizar el
estado del dispositivo. El modelo de estado del dispositivo conserva la ubicación,
las mediciones y las alertas más recientes para cada dispositivo, así como la información
sobre cuándo ocurrió la última interacción con el dispositivo.

Cada motor inquilino tiene un administrador de presencia de dispositivo que es responsable
de determinar cuándo ya no están presentes los dispositivos y de activar eventos de cambio
de estado que pueden usarse para desencadenar acciones basadas en la presencia o ausencia
de un dispositivo.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para localizar dispositivos y asignaciones para procesamiento de estado.
- **Event Management** - Se utiliza para registrar los cambios de estado del dispositivo para la gestión de presencia.

## Esquema de Configuración

[Device State Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-state/current/device-state.xsd)

### Configuración de Ejemplo

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
