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

For searching `ScheduledJob` you need to provide an instance of `ScheduledJobSearchCriteria` and
an instance of `ScheduledJobResponseFormat` to the method  `listScheduledJobs` of `com.sitewhere.spi.ISiteWhereClient`.
The example below shows how you can query SiteWhere REST API to list the first page of 100 results of device groups.

```java
ScheduledJobSearchCriteria searchCriteria = new ScheduledJobSearchCriteria(1, 100);
ScheduledJobResponseFormat responseFormat = new ScheduledJobResponseFormat();
SearchResults<ScheduledJob> results = client.listScheduledJobs(tenantAuthentication, searchCriteria, responseFormat);
```

`ScheduledJobSearchCriteria` defines the search criteria for quering `ScheduledJob`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`ScheduledJobResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeContext      | `Boolean`   | Indicates if context is to be included in the response.        |

## Obtener un Scheduled Job

Para obtener un `ScheduledJob` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the ScheduledJob
ScheduledJob schedule = client.getScheduledJobByToken(token);
```

## Creating an Scheduled Job

For creating an `ScheduledJob` you need to call `createScheduledJob` passing the `ITenantAuthentication` object and an
`ScheduledJobCreateRequest` build like in the folling example.

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

## Actualizar un existing Scheduled Job

For updating an `ScheduledJob` you need to call `updateScheduledJob` passing the `ITenantAuthentication` object,
the `token` of the existing `ScheduledJob` and an `ScheduledJobCreateRequest` build like in the folling example.

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

## Deleting an existing Scheduled Job

For deleting an existing `ScheduledJob` you need to call `deleteScheduledJob` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the schedule you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the ScheduledJob
ScheduledJob deletedScheduledJob = client.deleteScheduledJob(tenantAuthentication, token);
```
