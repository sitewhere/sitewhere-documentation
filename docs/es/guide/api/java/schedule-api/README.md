# Java API - Schedules

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `schedules` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Schedules

Para buscar resultados de `Schedule` se necesita una instancia de `ScheduleSearchCriteria` y una instancia de `ScheduleResponseFormat`,
las cuales serán pasadas al método `listSchedules` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `Schedule`.

```java
ScheduleSearchCriteria searchCriteria = new ScheduleSearchCriteria(1, 100);
ScheduleResponseFormat responseFormat = new ScheduleResponseFormat();
SearchResults<Schedule> results = client.listSchedules(tenantAuthentication, searchCriteria, responseFormat);
```

`ScheduleSearchCriteria` defines the search criteria for quering `Schedule`, the following table shows the properties, with
thier type and description, that can be set to filter the results.

| Propiedad     | Tipo      | Descripción                                |
| :------------ | :-------- | :----------------------------------------- |
| setPageNumber | `Integer` | Indicar el número de pagina del dataset.   |
| setPageSize   | `Integer` | Indicar el número de registros por página. |

## Obtener un Schedule

Para obtener un `Schedule` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
Schedule schedule = client.getScheduleByToken(token);
```

## Crear un Schedule

Para crear un `Schedule` se necesita llamar a `createSchedule` pasando el objeto `ITenantAuthentication` y una
instancia de `ScheduleCreateRequest` construido como en el siguiente ejemplo.

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

## Actualizar un Schedule existente

Para actualizar un `Schedule` se necesita llamar a `updateSchedule` pasando el objeto `ITenantAuthentication`,
el `token` de un `Schedule` y una instancia de `ScheduleCreateRequest` construido como en el siguiente ejemplo.

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

## Barrar an Schedule existente

Para eliminar un `Schedule` se necesita llamar a `deleteSchedule` pasando el objeto `ITenantAuthentication` y el
`token` del `Schedule` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
Schedule deletedSchedule = client.deleteSchedule(tenantAuthentication, token);
```
