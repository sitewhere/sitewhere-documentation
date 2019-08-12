# User Management Microservice

<Seo/>

El microservicio de administración de usuarios global proporciona las API principales
y la persistencia de los datos que se utilizan para administrar usuarios del sistema.
Inicialmente, el microservicio de administración de instancias lo utiliza para arrancar
el sistema con usuarios base. Luego, es llamado por el microservicio Web/REST para
permitir la gestión de la lista de usuarios.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.

## Esquema de Configuración

[User Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/user-management/current/user-management.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:um="http://sitewhere.io/schema/sitewhere/microservice/user-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/user-management http://sitewhere.io/schema/sitewhere/microservice/user-management/current/user-management.xsd">

	<!-- User Management Configuration -->
	<um:user-management>

		<!-- Use global MongoDB configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="global" />
		</ds:device-management-datastore>

	</um:user-management>

</beans>
```
