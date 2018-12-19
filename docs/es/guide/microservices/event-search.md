# Event Search Microservice

El microservicio de búsqueda de eventos multitenant proporciona una API para buscar fuentes
de datos externas que contienen información de eventos de SiteWhere en un formato no estándar.
Por ejemplo, cuando los eventos se indexan en Apache Solr a través de un conector de salida,
es posible que sea necesario consultar directamente a Solr para realizar consultas complejas
que no pueden ser admitidas genéricamente a través de las API de SiteWhere. Los motores de los
inquilinos para este microservicio pueden configurarse para realizar consultas de proxy al
servicio subyacente y devolver los resultados al microservicio Web/REST para su uso por
clientes externos.

## Dependencias del Microservicio

- **Instance Management** - Requerido para arrancar inicialmente los datos de Zookeeper.

## Esquema de Configuración

[Event Search Configuration XML Schema](http://sitewhere.io/schema/sitewhere/microservice/event-search/current/event-search.xsd)

### Configuración de Ejemplo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:sw="http://sitewhere.io/schema/sitewhere/microservice/common"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:es="http://sitewhere.io/schema/sitewhere/microservice/event-search"
	xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
           http://sitewhere.io/schema/sitewhere/microservice/common http://sitewhere.io/schema/sitewhere/microservice/common/current/microservice-common.xsd
           http://sitewhere.io/schema/sitewhere/microservice/event-search http://sitewhere.io/schema/sitewhere/microservice/event-search/current/event-search.xsd">

	<!-- Allow property placeholder substitution -->
	<context:property-placeholder />

	<!-- Event Search -->
	<es:event-search>

		<!-- List of available search providers -->
		<es:search-providers>
		</es:search-providers>

	</es:event-search>

</beans>
```
