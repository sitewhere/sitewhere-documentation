# Command Delivery Microservice

El microservicio de entrega de comandos multitenant ingiere datos del tópico de Kafka
que contiene eventos preprocesados y, para las invocaciones de comandos, maneja el
procesamiento de comandos. Esto incluye el uso de restricciones de enrutamiento configuradas
y destinos de comandos que indican cómo se codificará el comando, qué transporte se utilizará
y dónde se entregará el comando

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para localizar dispositivos y asignaciones para la entrega de comandos.

## Esquema de Configuración

[Command Delivery Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/command-delivery/current/command-delivery.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:cd="http://sitewhere.io/schema/sitewhere/microservice/command-delivery"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/command-delivery http://sitewhere.io/schema/sitewhere/microservice/command-delivery/current/command-delivery.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Command delivery -->
	<cd:command-delivery>

		<!-- Default router -->
		<cd:device-type-mapping-router
			defaultDestination="default"></cd:device-type-mapping-router>

		<!-- Command destinations -->
		<cd:mqtt-command-destination
			destinationId="default" hostname="${mqtt.host:localhost}"
			port="${mqtt.port:1883}">
		</cd:mqtt-command-destination>

	</cd:command-delivery>

</beans>
```
