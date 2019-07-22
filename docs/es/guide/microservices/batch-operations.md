# :book: Batch Operations Microservice

<Seo/>

El microservicio de operaciones por lotes multitenant proporciona las API principales
y la persistencia de datos para administrar las operaciones por lotes para cada inquilino
en una instancia de SiteWhere. El modelo de operaciones por lotes está vacío en la
inicialización del arrendatario, pero se puede completar invocando API que producen
operaciones por lotes (como invocaciones de comandos por lotes).

Cada motor de operaciones por lotes del inquilino también contiene un administrador de
operaciones por lotes que se puede configurar para procesar las operaciones por lotes
que se crean a través de las API. El administrador de operaciones de lotes convertirá
la solicitud de lotes en muchas operaciones más pequeñas para lograr el objetivo de lotes.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para localizar información del dispositivo al resolver elementos de lote.
- **Device Event Management** - Se utiliza para crear eventos de invocación de comandos para comandos por lotes.

## Esquema de Configuración

[Batch Operations Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/batch-operations/current/batch-operations.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:bop="http://sitewhere.io/schema/sitewhere/microservice/batch-operations"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/batch-operations http://sitewhere.io/schema/sitewhere/microservice/batch-operations/current/batch-operations.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Batch Operations -->
	<bop:batch-operations>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

		<!-- Batch operation manager configuration -->
		<bop:batch-operation-manager
			throttleDelayMs="100" />

	</bop:batch-operations>

</beans>
```
