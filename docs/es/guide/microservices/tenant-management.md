# Tenant Management Microservice

<Seo/>

El microservicio global de administración de inquilinos proporciona las API principales
y la persistencia de datos para administrar inquilinos del sistema. Inicialmente, el
microservicio de administración de instancias lo utiliza para iniciar el sistema con
inquilinos base. Posteriormente, es llamado por el microservicio Web/REST para permitir
la administración de la lista de inquilinos del sistema.

Cuando se agrega/actualiza/elimina un inquilino, los datos del inquilino se envían
a un tema Kafka para que otros oyentes interesados ​​puedan actuar en la actualización.
De forma predeterminada, un oyente está registrado para impulsar a los inquilinos recién
creados al agregar la jerarquía de configuración de inquilinos esperada en ZooKeeper.
Este proceso incluye copiar los archivos de configuración XML por microservicio de la
plantilla del arrendatario en ZooKeeper, luego ejecutar la lista de scripts de inicialización
incluidos con la plantilla. Una vez que se completa este proceso, la configuración del
arrendatario se marca como reforzada para que otros microservicios puedan reaccionar al
arrendatario agregado. Por ejemplo, el microservicio de administración de dispositivos
notará que se ha configurado un nuevo inquilino y esperará el indicador de arranque,
luego cargará el archivo de configuración device-management.xml para inicializar un nuevo
motor de inquilino de administración de dispositivos para el inquilino agregado. Cada vez
que se cambian los archivos dentro de un inquilino, los cambios se transmiten a los motores
de inquilinos que se ejecutan en todos los demás microservicios para que puedan reaccionar
a los cambios. En el ejemplo anterior, si se están ejecutando varios microservicios de
administración de dispositivos (escala> 1), cada microservicio detectará las actualizaciones
y volverá a cargar los motores de inquilinos para reflejar las actualizaciones.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.

## Esquema de Configuración

[Tenant Management Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/tenant-management/current/tenant-management.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:ds="http://sitewhere.io/schema/sitewhere/microservice/common/datastore"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:tm="http://sitewhere.io/schema/sitewhere/microservice/tenant-management"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common/datastore http://sitewhere.io/schema/sitewhere/microservice/common/current/datastore-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/tenant-management http://sitewhere.io/schema/sitewhere/microservice/tenant-management/current/tenant-management.xsd">

	<!-- Tenant Management Configuration -->
	<tm:tenant-management>

		<!-- Use global MongoDB configuration -->
		<ds:device-management-datastore>
			<ds:mongodb-datastore-reference id="global" />
		</ds:device-management-datastore>

	</tm:tenant-management>

</beans>
```
