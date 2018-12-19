# Event Sources Microservice

El microservicio de orígenes de eventos multitenant aloja motores de arrendamiento que
pueden configurarse para ingerir datos de muchos tipos de productores de datos. Algunos
ejemplos incluyen datos de consumo de topicos de MQTT, peticiones de CoAP, conexiones
directas de socket TCP/IP, WebSockets, peticiones REST a través de modelos push o pull,
y muchas otras fuentes potenciales. Después de ingerir los eventos, se descodifican en
un modelo de datos estandarizado y se envían a un tópico de Kafka específico del
inquilino para su posterior procesamiento. Los topicos de Kafka también se registran
para eventos que no se pueden analizar o se detectan como duplicados por el proceso de
deduplicación.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para la deduplicación de eventos y las secuencias de comandos Groovy.
- **Event Management** - Se utiliza para la deduplicación de eventos y las secuencias de comandos Groovy.

## Esquema de Configuración

[Event Sources Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/event-sources/current/event-sources.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:es="http://sitewhere.io/schema/sitewhere/microservice/event-sources"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/event-sources http://sitewhere.io/schema/sitewhere/microservice/event-sources/current/event-sources.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Event sources Configuration -->
	<es:event-sources>

		<!-- Event source for protobuf messages over MQTT -->
		<es:mqtt-event-source sourceId="protobuf"
			numThreads="1" hostname="${mqtt.host:localhost}"
			port="${mqtt.port:1883}"
			topic="SiteWhere/${tenant.token}/input/protobuf">
			<es:protobuf-event-decoder />
		</es:mqtt-event-source>

		<!-- Event source for JSON device requests over MQTT -->
		<es:mqtt-event-source sourceId="json"
			numThreads="5" hostname="${mqtt.host:localhost}"
			port="${mqtt.port:1883}" topic="SiteWhere/${tenant.token}/input/json">
		</es:mqtt-event-source>

	</es:event-sources>

</beans>
```
