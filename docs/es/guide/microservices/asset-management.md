# Asset Management Microservice

El microservicio de gestión de activos (_Asset Management_) multitenant proporciona
las API principales y la persistencia de datos para administrar los activos para cada
inquilino (_tenant_) en una instancia de SiteWhere. El modelo de activo se rellena
inicialmente en función de los scripts incluidos en la plantilla del tenant utilizada al crear el tenant.
Por ejemplo, la plantilla "Construcción" rellena activos como equipos pesados, remolques de almacenamiento
y varios tipos de dispositivos de rastreo. Si utiliza la plantilla "Vacía", no se completarán
los datos de administración de activos.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Requerido por un subconjunto de tareas de gestión de activos.

## Configuración del Esquema

[Asset Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/asset-management/current/asset-management.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:am="http://sitewhere.io/schema/sitewhere/microservice/asset-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/asset-management http://sitewhere.io/schema/sitewhere/microservice/asset-management/current/asset-management.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Asset Management Configuration -->
	<am:asset-management>

		<!-- Use global MongoDB tenant configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="tenant" />
		</ds:device-management-datastore>

	</am:asset-management>

</beans>
```
