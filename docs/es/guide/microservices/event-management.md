# :book: Event Management Microservice

<Seo/>

El microservicio de gestión de eventos multitenant proporciona las API principales y la
persistencia de datos para administrar eventos del dispositivo (ubicaciones, medidas,
alertas, invocaciones de comandos, etc.) para cada inquilino en una instancia de SiteWhere.
El modelo de evento del dispositivo se rellena inicialmente en función de los scripts
incluidos en la plantilla de inquilino utilizada al crear el inquilino. Por ejemplo, la
plantilla "Construcción" rellena el ejemplo de ubicación, medición y datos de alerta
relevantes para las máquinas en un sitio de construcción. Si se utiliza la plantilla
"Vacía", no se completarán los datos de gestión de eventos.


## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para buscar información de asignación de dispositivo.

## Esquema de Configuración

[Event Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/event-management/current/event-management.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:em="http://sitewhere.io/schema/sitewhere/microservice/event-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/event-management http://sitewhere.io/schema/sitewhere/microservice/event-management/current/event-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Event Management Configuration -->
	<em:event-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:event-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:event-management-datastore>

	</em:event-management>

</beans>
```
