# :book: Inbound Processing Microservice

<Seo/>

El microservicio de procesamiento entrante multitenant ingiere datos que fueron producidos
por el microservicio de orígenes de eventos (después de que se haya completado la descodificación
y la deduplicación). Este microservicio valida los datos entrantes al interactuar con el
microservicio de administración de dispositivos para verificar que el evento entrante se relaciona
con un dispositivo registrado. La carga útil entrante se enriquece con los datos del
dispositivo/asignación, por lo que la información se puede usar en los siguientes pasos de
procesamiento sin la necesidad de buscarla nuevamente. Si el dispositivo no está registrado,
la carga útil se pasa al microservicio de registro del dispositivo para un procesamiento adicional.
Si el dispositivo se registra como resultado, el evento se envía a un tema de reprocesamiento para
que pueda procesarse nuevamente con el dispositivo recién registrado.

Una vez que el evento de entrada se ha enriquecido, se reenvía al microservicio de administración
de eventos para su persistencia. El evento persistente finalmente se devuelve (asincrónicamente)
al procesamiento de entrada, donde se agrega a un tema para los eventos preprocesados que, a su vez,
pueden ser consumidos por otros microservicios, como el procesamiento de reglas y los conectores de
salida.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.
- **Device Management** - Se utiliza para enriquecer eventos entrantes con datos del dispositivo.
- **Event Management** - Se utiliza para la persistencia de las cargas útiles de eventos entrantes.

## Esquema de Configuración

[Inbound Processing Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/inbound-processing/current/inbound-processing.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
	xmlns:ip="http://sitewhere.io/schema/sitewhere/microservice/inbound-processing"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/inbound-processing http://sitewhere.io/schema/sitewhere/microservice/inbound-processing/current/inbound-processing.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<ip:inbound-processing processingThreadCount="25" />

</beans>
```
