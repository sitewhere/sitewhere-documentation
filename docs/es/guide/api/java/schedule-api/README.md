# :book: Java API - Schedules

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `schedules` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Schedules

For searching `Schedule` you need to provide an instance of `ScheduleSearchCriteria` and an instance of `ScheduleResponseFormat` to the method 
`listSchedules` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of device groups.

```java
ScheduleSearchCriteria searchCriteria = new ScheduleSearchCriteria(1, 100);
ScheduleResponseFormat responseFormat = new ScheduleResponseFormat();
SearchResults<Schedule> results = client.listSchedules(tenantAuthentication, searchCriteria, responseFormat);
```

`ScheduleSearchCriteria` defines the search criteria for quering `Schedule`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Schedule

Para obtener un `Schedule` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
Schedule schedule = client.getScheduleByToken(token);
```

## Creating an Schedule

For creating an `Schedule` you need to call `createSchedule` passing the `ITenantAuthentication` object and an
`ScheduleCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
String name = "test schedule";
ScheduleCreateRequest.Builder builder = new ScheduleCreateRequest.Builder(token, name);

builder.withStartDate(new Date());
builder.withSimpleSchedule(10000l, 1);
// Build the Create Request
ScheduleCreateRequest createRequest = builder.build();
// Create the Schedule
Schedule createdSchedule = client.createSchedule(tenantAuthentication, createRequest);
```

## Actualizar un existing Schedule

For updating an `Schedule` you need to call `updateSchedule` passing the `ITenantAuthentication` object,
the `token` of the existing `Schedule` and an `ScheduleCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
String name = "test schedule";
ScheduleCreateRequest.Builder builder = new ScheduleCreateRequest.Builder(token, name);

builder.withStartDate(new Date());
builder.withSimpleSchedule(10000l, 2);
// Build the Create Request
ScheduleCreateRequest updateRequest = builder.build();
// Update the Schedule
Schedule updatedSchedule = client.updateSchedule(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Schedule

For deleting an existing `Schedule` you need to call `deleteSchedule` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the schedule you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
Schedule deletedSchedule = client.deleteSchedule(tenantAuthentication, token);
```
