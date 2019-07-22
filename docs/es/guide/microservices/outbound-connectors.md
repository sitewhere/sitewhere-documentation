# :book: Outbound Connectors Microservice

<Seo/>

El microservicio de conectores de salida multitenant ingiere datos del tópico Kafka que
contienen eventos preprocesados y permite que los datos de eventos se envíen a otros puntos
de integración de forma asíncrona. Cada conector de salida es un consumidor de Kafka que
tiene su propio puntero en el tópico de eventos, por lo que el sistema no está bloqueado por
conectores que ocasionalmente se procesan a velocidades más lentas que el resto del sistema.
Los conectores están disponibles para casos de uso común, como reenviar eventos a un tópico
MQTT conocido o eventos de indexación en Apache Solr.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Proporcionado como API para que los conectores salientes utilicen.
- **Event Management** - Proporcionado como API para que los conectores salientes utilicen.

## Esquema de Configuración

[Outbound Connectors Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors/current/outbound-connectors.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:op="http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors http://sitewhere.io/schema/sitewhere/microservice/outbound-connectors/current/outbound-connectors.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Outbound Connectors -->
	<op:outbound-connectors>

		<!-- Send events via MQTT -->
		<op:mqtt-connector connectorId="mqtt1"
			hostname="${mqtt.host:localhost}" port="${mqtt.port:1883}" topic="SiteWhere/output" />

	</op:outbound-connectors>

</beans>
```
