# Device Management Microservice

<Seo/>

El microservicio de administración de dispositivos multitenant proporciona las API principales
y la persistencia de datos para administrar el modelo de dispositivo (clientes, áreas, tipos de
dispositivos, dispositivos, etc.) para cada inquilino en una instancia de SiteWhere. El modelo
de dispositivo se rellena inicialmente en función de los scripts incluidos en la plantilla de
inquilino utilizada al crear el inquilino. Por ejemplo, la plantilla "Construcción" llenará el
modelo de datos con dispositivos apropiados para un sitio de construcción. Si utiliza la plantilla
"Vacía", no se completarán los datos de administración del dispositivo.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Event Management** - Se utiliza para crear eventos de cambio de estado en las actualizaciones de asignación.
- **Asset Management** - Se utiliza para resolver asociaciones de activos para asignaciones de dispositivos.

## Configuration Schema

[Device Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-management/current/device-management.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:dm="http://sitewhere.io/schema/sitewhere/microservice/device-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/device-management http://sitewhere.io/schema/sitewhere/microservice/device-management/current/device-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Device Management Configuration -->
	<dm:device-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

	</dm:device-management>

</beans>
```
