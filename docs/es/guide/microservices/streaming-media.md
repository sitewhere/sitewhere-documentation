# Streaming Media Microservice

El microservicio de medios de transmisión multitenant está destinado a permitir el
almacenamiento de datos binarios, como las secuencias de audio y video. Esta característica
está en desarrollo.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.

## Esquema de Configuración

[Streaming Media Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/streaming-media/current/streaming-media.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:sm="http://sitewhere.io/schema/sitewhere/microservice/streaming-media"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/streaming-media http://sitewhere.io/schema/sitewhere/microservice/streaming-media/current/streaming-media.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Streaming Media -->
	<sm:streaming-media />

</beans>
```

::: warning
This microservice is not fully implemented in SiteWhere 2.0
:::
