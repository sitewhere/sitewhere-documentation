# Device Registration Microservice

El microservicio de registro de dispositivos multitenant ingiere datos de un tópico de
Kafka poblado por el microservicio de procesamiento de entrada y actúa en eventos donde
el token del dispositivo indica un dispositivo que no está registrado actualmente en el
sistema. Cada motor de arrendatario tiene un administrador de registro de dispositivos
que puede configurarse para indicar cómo deben tratarse los dispositivos no registrados.
El administrador de registro del dispositivo procesa cada evento entrante y potencialmente
puede registrar el dispositivo automáticamente antes de agregar el evento a un tópico
de reprocesamiento para que sea procesado por el microservicio de procesamiento entrante.

Los eventos que no dan como resultado el registro automático de un dispositivo se
envían a un tópico de "letra muerta" en Kafka para que puedan ser rastreados o procesados
fuera de banda por procesadores externos.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para localizar dispositivos y asignaciones para el proceso de registro.

## Esquema de Configuración

[Device Registration Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/device-registration/current/device-registration.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:dr="http://sitewhere.io/schema/sitewhere/microservice/device-registration"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/device-registration http://sitewhere.io/schema/sitewhere/microservice/device-registration/current/device-registration.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Device Registration -->
	<dr:device-registration>

		<!-- Configure the default registration manager -->
		<dr:default-registration-manager
			allowNewDevices="false" />

	</dr:device-registration>

</beans>
```
