# :book: Schedule Management Microservice

<Seo/>

El microservicio de administración de horarios multitenant proporciona las API principales
y la persistencia de datos para administrar los cronogramas de cada inquilino en una instancia
de SiteWhere. El modelo de programación se completa inicialmente en función de los scripts
incluidos en la plantilla del arrendatario que se utiliza al crear el arrendatario. La mayoría
de las plantillas de inquilinos incluyen algunos ejemplos de horarios Si se usa la plantilla
"Vacía", no se completarán los datos de administración de la programación.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.

## Esquema de Configuración

[Schedule Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/schedule-management/current/schedule-management.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:sm="http://sitewhere.io/schema/sitewhere/microservice/schedule-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/schedule-management http://sitewhere.io/schema/sitewhere/microservice/schedule-management/current/schedule-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Schedule Management -->
	<sm:schedule-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

	</sm:schedule-management>

</beans>
```
