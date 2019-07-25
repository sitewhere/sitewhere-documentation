# :book: Java API - Scheduled Jobs

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `jobs` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Scheduled Jobs

Para buscar resultados de `ScheduledJob` se necesita una instancia de `ScheduledJobSearchCriteria` y una instancia de `ScheduledJobResponseFormat`,
las cuales serán pasadas al método `listScheduledJobs` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `ScheduledJob`.

```java
ScheduledJobSearchCriteria searchCriteria = new ScheduledJobSearchCriteria(1, 100);
ScheduledJobResponseFormat responseFormat = new ScheduledJobResponseFormat();
SearchResults<ScheduledJob> results = client.listScheduledJobs(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `ScheduledJobSearchCriteria` define los criterios de búsqueda para un `ScheduledJob`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`ScheduledJobResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeContext      | `Boolean`   | Indica si el contexto debe ser incluido en los resultados.     |

## Obtener un Scheduled Job

Para obtener un `ScheduledJob` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the ScheduledJob
ScheduledJob schedule = client.getScheduledJobByToken(token);
```

## Crear un Scheduled Job

Para crear un `ScheduledJob` se necesita llamar a `createScheduledJob` pasando el objeto `ITenantAuthentication` y una
instancia de `ScheduledJobCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the ScheduledJob
ScheduledJobCreateRequest createRequest = new ScheduledJobCreateRequest();
createRequest.setJobState(ScheduledJobState.Active);
createRequest.setJobType(ScheduledJobType.BatchCommandInvocation);
createRequest.setScheduleToken(token);
createRequest.setToken(token);
createRequest.setJobConfiguration(Collections.emptyMap());
// Create the ScheduledJob
ScheduledJob createdScheduledJob = client.createScheduledJob(tenantAuthentication, createRequest);
```

## Actualizar un Scheduled Job existente

Para actualizar un `ScheduledJob` se necesita llamar a `updateScheduledJob` pasando el objeto `ITenantAuthentication`,
el `token` de un `ScheduledJob` y una instancia de `ScheduledJobCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the ScheduledJob
ScheduledJobCreateRequest createRequest = new ScheduledJobCreateRequest();
createRequest.setJobState(ScheduledJobState.Active);
createRequest.setJobType(ScheduledJobType.BatchCommandInvocation);
createRequest.setScheduleToken(token);
createRequest.setToken(token);
createRequest.setJobConfiguration(Collections.emptyMap());
// Update the ScheduledJob
ScheduledJob updatedScheduledJob = client.updateScheduledJob(tenantAuthentication, token, updateRequest);
```

## Borrar un Scheduled Job existente

Para eliminar un `ScheduledJob` se necesita llamar a `deleteScheduledJob` pasando el objeto `ITenantAuthentication` y el
`token` del `ScheduledJob` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the ScheduledJob
ScheduledJob deletedScheduledJob = client.deleteScheduledJob(tenantAuthentication, token);
```
