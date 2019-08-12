# Java API - Areas

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `areas` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Areas

Para buscar resultados de `Area` se necesita una instancia de `AreaSearchCriteria` y una instancia de `AreaResponseFormat`,
las cuales serán pasadas al método `listAreas` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `Area`.

```java
AreaSearchCriteria searchCriteria = new AreaSearchCriteria(1, 100);
AreaResponseFormat responseFormat = new AreaResponseFormat();
SearchResults<Area> results = client.listAreas(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `AreaSearchCriteria` define los criterios de búsqueda para un `Area`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad          | Tipo      | Descripción                                                 |
| :----------------- | :-------- | :---------------------------------------------------------- |
| setRootOnly        | `Boolean` | Indica si sólo los elementos de la raiz debe ser devueltos. |
| setAreaTypeToken   | `String`  | Sólo coincidir con un tipo de area dado.                    |
| setParentAreaToken | `String`  | Sólo coincidir con un área padre dado.                      |
| setPageNumber      | `Integer` | Indicar el número de pagina del dataset.                    |
| setPageSize        | `Integer` | Indicar el número de registros por página.                  |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`AreaResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad             | Tipo      | Descripción                                            |
| :-------------------- | :-------- | :----------------------------------------------------- |
| setIncludeAreaType    | `Boolean` | Indica si los AreaTypes se incluyen en el resultado.   |
| setIncludeAssignments | `Boolean` | Indica si los Assignments se incluyen en el resultado. |
| setIncludeZones       | `Boolean` | Indica si las Zonas se incluyen en el resultado.       |

## Obtener un Area

Para obtener un `Area` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Area area = client.getAreaByToken(token);
```

## Crear un Area

Para crear un `Area` se necesita llamar a `createArea` pasando el objeto `ITenantAuthentication` y una
instancia de `AreaCreateRequest` construido como en el siguiente ejemplo.

```java
String areaTypeToken = "construction";                 // Token of the area type
String parentToken = "southeast";                      // Token of the parent area
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
AreaCreateRequest.Builder builder = new AreaCreateRequest.Builder(areaTypeToken, parentToken, token, "my area");
builder.withDescription("Some area");
// Build the Create Request
AreaCreateRequest createRequest = builder.build();
// Create the Area
Area createdArea = client.createArea(tenantAuthentication, createRequest);
```

## Actualizar un Area existente

Para actualizar un `Area` se necesita llamar a `updateArea` pasando el objeto `ITenantAuthentication`,
el `token` de un `Area` y una instancia de `AreaCreateRequest` construido como en el siguiente ejemplo.

```java
String areaTypeToken = "construction";                 // Token of the area type
String parentToken = "southeast";                      // Token of the parent area
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
AreaCreateRequest.Builder builder = new AreaCreateRequest.Builder(areaTypeToken, parentToken, token, "my area");
builder.withDescription("Some updated description");
// Build the Create Request
AreaCreateRequest updateRequest = builder.build();
// Update the Area
Area updatedArea = client.updateArea(tenantAuthentication, token, updateRequest);
```

## Borrar un Area existente

Para eliminar un `Area` se necesita llamar a `deleteArea` pasando el objeto `ITenantAuthentication` y el
`token` del `Area` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Area deletedArea = client.deleteArea(tenantAuthentication, token);
```

## Obtener información asociada a un Area

### Obtener Alertas asociadas a un Area

El siguiente ejemplo recupera las primeras 100 `DeviceAlert`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceAlertWithAsset> alerts = client.listAlertsForArea(tenantAuthentication, token, searchCriteria);
```

### Obtener las Asignaciones asociadas a un Area

El siguiente ejemplo recupera las primeras 100 `DeviceAssignment`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
responseFormat.setIncludeCustomer(true);
SearchResults<MarshaledDeviceAssignment> assignments =
  client.listDeviceAssignmentsForArea(tenantAuthentication, token, searchCriteria, responseFormat);
```

### Obtener las Invocaciones a Comandos asociadas a un Area

El siguiente ejemplo recupera las primeras 100 `DeviceCommandInvocation`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandInvocation> commandInvocations =
  client.listCommandInvocationsForArea(tenantAuthentication, token, searchCriteria);
```

### Obtener las Ubicaciones asociadas an un Area

El siguiente ejemplo recupera las primeras 100 `DeviceLocation`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceLocationWithAsset> locations = client
  .listLocationsForArea(tenantAuthentication, token, searchCriteria);
```

### Obtener las Mediciones asociadas a un Area

El siguiente ejemplo recupera las primeras 100 `DeviceMeasurement`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceMeasurementWithAsset> measurements = client
  .listMeasurementsForArea(tenantAuthentication, token, searchCriteria);
```

### Obtener las Respuestas a Comandos asociadas a un Area

El siguiente ejemplo recupera las primeras 100 `DeviceCommandResponse`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandResponseWithAsset> commandResponses = client
  .listCommandResponsesForArea(tenantAuthentication, token, searchCriteria);
```

### Obtener los Cambio de Estado asociados a un Area

El siguiente ejemplo recupera las primeras 100 `DeviceStateChange`s asociadas con un `Area`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 10, startDate, endDate);
SearchResults<DeviceStateChangeWithAsset> stateChanges = client
  .listStateChangesForArea(tenantAuthentication, token, searchCriteria);
```

### Obtener el árbol de Areas

El siguiente ejemplo obtiene la estructura de árbol de areas

```java
List<TreeNode> tree = client.areaTree(tenantAuthentication);
```
