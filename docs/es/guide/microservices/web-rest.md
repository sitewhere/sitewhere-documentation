# Web/REST Microservice

<Seo/>

El microservicio global Web/REST incluye un contenedor Tomcat incorporado que
proporciona infraestructura para todos los servicios REST principales, incluidas
las interfaces de usuario Swagger. Este microservicio suele estar conectado a todos
los demás microservicios del sistema, de modo que las llamadas a la API pueden delegarse
a los microservicios que implementan la funcionalidad. Por ejemplo, la consulta de un
dispositivo a través de las API REST da como resultado una solicitud gRPC (potencialmente
almacenada en caché) al motor de inquilino de administración de dispositivo apropiado en
uno de los microservicios de administración de dispositivos.

Puede haber casos en que el microservicio requerido para completar una solicitud no esté
disponible. En este caso, se lanza una excepción de _ServiceNotAvailable_ y se devuelve
como un error al usuario/aplicación que realizó la solicitud. Usando este enfoque,
las áreas del sistema pueden cerrarse para conservar recursos sin afectar la funcionalidad
del sistema en su totalidad. Las personas que llaman a los servicios REST deben estar
preparadas para manejar los casos en que el subsistema al que están llamando puede cerrarse.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **User Management** - Se utiliza para procesar invocaciones REST.
- **Tenant Management** - Se utiliza para procesar invocaciones REST.
- **Device Management** - Se utiliza para procesar invocaciones REST.
- **Event Management** - Se utiliza para procesar invocaciones REST.
- **Asset Management** - Se utiliza para procesar invocaciones REST.
- **Batch Management** - Se utiliza para procesar invocaciones REST.
- **Schedule Management** - Se utiliza para procesar invocaciones REST.
- **Label Generation** - Se utiliza para procesar invocaciones REST.
- **Device State** - Se utiliza para procesar invocaciones REST.

## Esquema de Configuración

[Web/REST Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/web-rest/current/web-rest.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:web="http://sitewhere.io/schema/sitewhere/microservice/web-rest"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/web-rest http://sitewhere.io/schema/sitewhere/microservice/web-rest/current/web-rest.xsd">

	<!-- Web/REST Configuration -->
	<web:web-rest />

</beans>
```
