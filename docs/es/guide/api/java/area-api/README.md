# :book: Java API - Areas

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `areas` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

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

`AreaSearchCriteria` defines the search criteria for quering `Area`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setRootOnly            | `Boolean`   | Indicates if only root elements are to be returned.            |
| setAreaTypeToken       | `String`    | Only match areas of the given type.                            |
| setParentAreaToken     | `String`    | Requires that areas have the given area as a parent.           |
| setPageNumber          | `Integer`   | Get offset from beginning of dataset.                          |
| setPageSize            | `Integer`   | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `AreaResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeAreaType     | `Boolean`   | Indicates if included area types are to be returned.           |
| setIncludeAssignments  | `Boolean`   | Indicates if assignments are to be returned.                   |
| setIncludeZones        | `Boolean`   | Indicates if zones are to be returned.                         |

## Obtener un Area

To retrieve an `Area` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Area area = client.getAreaByToken(token);
```

## Crear un Area

For creating an `Area` you need to call `createArea` passing the `ITenantAuthentication` object and an
`AreaCreateRequest` build like in the folling example.

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

For updating an `Area` you need to call `updateArea` passing the `ITenantAuthentication` object,
the `token` of the existing `Area` and an `AreaCreateRequest` build like in the folling example.

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

For deleting an existing `Area` you need to call `deleteArea` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the area you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Area deletedArea = client.deleteArea(tenantAuthentication, token);
```

## Quering information associated to an Area

### Quering Alerts associated to an Area

The following example retrieves firts 100 `DeviceAlert`s associated with an `Area`
from the last year.

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

### Quering Assignments associated to an Area

The following example retrieves firts 100 `DeviceAssignment`s associated with an `Area`
from the last year, including the `Customer` information in the results.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
responseFormat.setIncludeCustomer(true);
SearchResults<MarshaledDeviceAssignment> assignments = 
  client.listDeviceAssignmentsForArea(tenantAuthentication, token, searchCriteria, responseFormat);
```

### Quering Command Invocations associated to an Area

The following example retrieves firts 100 `DeviceCommandInvocation`s associated with an `Area`
from the last year.

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

### Quering Locations associated to an Area

The following example retrieves firts 100 `DeviceLocationWithAsset`s associated with an `Area`
from the last year.

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

### Quering Measurements associated to an Area

The following example retrieves firts 100 `DeviceMeasurementWithAsset`s associated with an `Area`
from the last year.

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

### Quering Command Responses associated to an Area

The following example retrieves firts 100 `DeviceCommandResponseWithAsset`s associated with an `Area`
from the last year.

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

### Quering State Changes associated to an Area

The following example retrieves firts 100 `DeviceStateChangeWithAsset`s associated with an `Area`
from the last year.

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

### Retrive Area tree

The following example retrieves the tree structure of areas.

```java
List<TreeNode> tree = client.areaTree(tenantAuthentication);
```
