# Rule Processing Microservice

El microservicio de procesamiento de reglas multitenant ingiere datos del tópico Kafka que
contiene eventos preprocesados y aplica lógica condicional para procesar los eventos.
Los motores de los inquilinos pueden usar el procesamiento de eventos complejos incrustados
(WSO2 Siddhi) para detectar patrones en el flujo de eventos y disparar nuevos eventos como
resultado.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Proporcionado como API para que los procesadores de reglas utilicen.
- **Event Management** - Proporcionado como API para que los procesadores de reglas utilicen.

## Esquema de Configuración

[Rule Processing Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/rule-processing/current/rule-processing.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:rp="http://sitewhere.io/schema/sitewhere/microservice/rule-processing"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/rule-processing http://sitewhere.io/schema/sitewhere/microservice/rule-processing/current/rule-processing.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Rule processing -->
	<rp:rule-processing>
	</rp:rule-processing>

</beans>
```

::: warning
This microservice is not fully implemented in SiteWhere 2.0
:::
