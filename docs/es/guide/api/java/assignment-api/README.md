# Java API - Device Assignments

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `assignments` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device Assignments

For searching `DeviceAssignment` you need to provide an instance of `DeviceAssignmentSearchCriteria` to the method
`listDeviceAssignments` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of assets.

```java
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat format = new DeviceAssignmentResponseFormat();
SearchResults<MarshaledDeviceAssignment> results = client.listDeviceAssignments(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `DeviceAssignmentSearchCriteria` define los criterios de búsqueda para un `DeviceAssignment`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                 | Type                           | Descripción                                                  |
| :------------------------ | :----------------------------- | :----------------------------------------------------------- |
| setAssignmentStatuses     | `List<DeviceAssignmentStatus>` | Limita la búsqueda a la lista de device assignment statuses. |
| setDeviceAssignmentTokens | `List<String>`                 | Limita la búsqueda a la lista de areas tokens.               |
| setAssetTokens            | `List<String>`                 | Limita la búsqueda a la lista de asset tokens.               |
| setCustomerTokens         | `List<String>`                 | Limita la búsqueda a la lista de customer tokens.            |
| setDeviceTokens           | `List<String>`                 | Limita la búsqueda a la lista de device tokens.              |
| setDeviceTypeTokens       | `List<String>`                 | Limita la búsqueda a la lista de device type tokens.         |
| setPageNumber             | `Integer`                      | Indicar el número de pagina del dataset.                     |
| setPageSize               | `Integer`                      | Indicar el número de registros por página.                   |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceAssignmentResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad                  | Tipo      | Descripción                                 |
| :------------------------- | :-------- | :------------------------------------------ |
| setIncludeDeviceAssignment | `Boolean` | Indicates if area is to be returned.        |
| setIncludeAsset            | `Boolean` | Indicates if asset is to be returned.       |
| setIncludeCustomer         | `Boolean` | Indicates if customer is to be returned.    |
| setIncludeDevice           | `Boolean` | Indicates if device is to be returned.      |
| setIncludeDeviceType       | `Boolean` | Indicates if device type is to be returned. |

## Creating an Device Assignment

Para crear un `DeviceAssignment` se necesita llamar a `createDeviceAssignment` pasando el objeto `ITenantAuthentication` y una
instancia de `DeviceAssignmentCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String deviceToken = "15737-UNO-7576364";
String customerToken = "acme";
String areaToken = "southeast";
String assetToken = "derek.adams@sitewhere.com";
DeviceAssignmentCreateRequest.Builder builder =
  new DeviceAssignmentCreateRequest.Builder(deviceToken, customerToken, areaToken, assetToken);
// Build the Create Request
DeviceAssignmentCreateRequest request = builder.build();
request.setToken(token);
// Create the DeviceAssignment
MarshaledDeviceAssignment createdDeviceAssignment = client.createDeviceAssignment(tenantAuthentication, createRequest);
```

## Actualizar un existing Device Assignment

Para actualizar un `DeviceAssignment` se necesita llamar a `updateDeviceAssignment` pasando el objeto `ITenantAuthentication`,
el `token` de un `DeviceAssignment` existente y una instancia de `DeviceAssignmentCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String deviceToken = "15737-UNO-7576364";
String customerToken = "acme";
String areaToken = "southeast";
String assetToken = "derek.adams@sitewhere.com";
DeviceAssignmentCreateRequest.Builder builder =
  new DeviceAssignmentCreateRequest.Builder(deviceToken, customerToken, areaToken, assetToken);
// Build the Create Request
DeviceAssignmentCreateRequest request = builder.build();
request.setToken(token);
// Build the Create Request
DeviceAssignmentCreateRequest updateRequest = builder.build();
// Update the DeviceAssignment
MarshaledDeviceAssignment updatedDeviceAssignment = client.updateDeviceAssignment(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device Assignment

Para eliminar un `DeviceAssignment` se necesita llamar a `deleteDeviceAssignment` pasando el objeto `ITenantAuthentication` y el
`token` del `DeviceAssignment` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
MarshaledDeviceAssignment deletedDeviceAssignment = client.deleteDeviceAssignment(tenantAuthentication, token);
```

## Llamadas a la API asociadas a Device Assignment

### Liberar un Device Assignment

El siguiente ejemplo _livera_ la asocación de un **DeviceAssignment** existente.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
MarshaledDeviceAssignment releasedAssignment =
  client.releaseDeviceAssignment(tenantAuthentication, token);
```

### Marcar un Device Assignment como _Perdido_

El siguiente ejemplo marca a un **DeviceAssignment** existente como **perdido**.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
MarshaledDeviceAssignment makedMissingAssignment =
  client.markMissingDeviceAssignment(tenantAuthentication, token);
```

### Obtener Alertas asociadas a un Device Assignment

El siguiente ejemplo recupera las primeras 100 `DeviceAlert`s asociadas con un `DeviceAssignment`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceAlertWithAsset> alerts =
  client.listAlertsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Crear una Alerta para un Device Assignment

El siguiente ejemplo crea una `Alert` de nivel `error` para un `DeviceAssignment`,
con `type` **engine.overheat**, y `message` **Engine Overheat**.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
DeviceAlertCreateRequest.Builder builder =
  new DeviceAlertCreateRequest.Builder("egine.overheat", "Engine Overheat");

DeviceAlertCreateRequest request = builder
  .error()
  .trackState()
  .build();

DeviceAlertWithAsset alert =
  client.createAlertForDeviceAssignment(tenantAuthentication, token, request);
```

### Obtener las Invocaciones a Comandos asociadas a un Device Assignment

El siguiente ejemplo recupera las primeras 100 `DeviceCommandInvocation`s asociadas con un `DeviceAssignment`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandInvocation> commandInvocations =
  client.listCommandInvocationsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Crear una Invación a Comando para un Device Assignment

El siguiente ejemplo crea un `DeviceCommandInvocation` para un `DeviceAssignment`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String commandToken = "ping";
String target = "Assignment";
String initiatorId = "REST";

DeviceCommandInvocationCreateRequest.Builder builder =
  new DeviceCommandInvocationCreateRequest.Builder(commandToken, target);
DeviceCommandInvocationCreateRequest request = builder.build();

request.setInitiatorId(initiatorId);
request.setInitiator(CommandInitiator.REST);

DeviceCommandInvocation createdCommandInvocation = client
  .createCommandInvocationForDeviceAssignment(tenantAuthentication, token, request);
```

### Crear un ScheduledJob para un Device Assignment

El siguiente ejemplo crea un `ScheduledJob` para un `DeviceAssignment`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String commandToken = "ping";
String target = "Assignment";
String initiatorId = "REST";
String scheduleToken = "de305d54-75b4-431b-adb2-eb6b9e546014";

DeviceCommandInvocationCreateRequest.Builder builder =
  new DeviceCommandInvocationCreateRequest.Builder(commandToken, target);
DeviceCommandInvocationCreateRequest request = builder.build();

request.setInitiatorId(initiatorId);
request.setInitiator(CommandInitiator.REST);

ScheduledJob createdScheduledJob = client
  .scheduleCommandInvocation(tenantAuthentication, token, scheduleToken, request);
```

### Obtener las Ubicaciones asociadas an un Device Assignment

El siguiente ejemplo recupera las primeras 100 `DeviceLocation`s asociadas con un `DeviceAssignment`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceLocationWithAsset> locations = client
  .listLocationsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Crear una Ubicación para un Device Assignment

El siguiente ejemplo crea un `DeviceLocation` para un `DeviceAssignment`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
DeviceLocationCreateRequest.Builder builder = new DeviceLocationCreateRequest.Builder(-27.3313291,-58.961281);
DeviceLocationCreateRequest request = builder.build();

DeviceLocationWithAsset location = client
  .createLocationForDeviceAssignment(tenantAuthentication, token, request);
```

### Obtener las Mediciones asociadas a un Device Assignment

El siguiente ejemplo recupera las primeras 100 `DeviceMeasurement`s asociadas con un `DeviceAssignment`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceMeasurementWithAsset> measurements = client
  .listMeasurementsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Crea un Medición para un Device Assignment

El siguiente ejemplo crea un `DeviceMeasurement` para un `DeviceAssignment`, indicando que
**engine.temp** tiene un valor de **50.0**.

```java
DeviceMeasurementCreateRequest.Builder builder = new DeviceMeasurementCreateRequest.Builder();
builder.measurement("engine.temp", 50.0);
DeviceMeasurementCreateRequest request = builder.build();

DeviceMeasurementWithAsset measurement = client
  .createMeasurementForDeviceAssignment(tenantAuthentication, token, request);
```

### Obtener las Respuestas a Comandos asociadas a un Device Assignment

El siguiente ejemplo recupera las primeras 100 `DeviceCommandResponse`s asociadas con un `DeviceAssignment`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandResponseWithAsset> commandResponses = client
  .listCommandResponsesForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Crear una Respuesta a Comando para un Device Assignment

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String originatingEventId = "abecfa19-f099-4bc6-b351-a916cd057302"; // GUID of the Originated Event
String responseEventId = "7e841790-057d-4b26-bcbb-a6aaefe36ae8"; // GUID of the Response Event
DeviceCommandResponseCreateRequest request = new DeviceCommandResponseCreateRequest();
request.setResponse("ok");
request.setOriginatingEventId(originatingEventId);
request.setResponseEventId(responseEventId);

DeviceCommandResponseWithAsset commandResponse = client
  .createCommandResponseForDeviceAssignment(tenantAuthentication, token, request);
```

### Obtener los Cambio de Estado asociados a un Device Assignment

El siguiente ejemplo recupera las primeras 100 `DeviceStateChange`s asociadas con un `DeviceAssignment`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 10, startDate, endDate);
SearchResults<DeviceStateChangeWithAsset> stateChanges = client
  .listStateChangesForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Crear un Cambio de Estado para un Device Assignment

El siguiente ejemplo crea un `DeviceStateChange` para un `DeviceAssignment`.

```java
DeviceStateChangeCreateRequest request = new DeviceStateChangeCreateRequest();
request.setNewState("PRESENT");
request.setAttribute("Attr");
request.setType("t1");
request.setUpdateState(true);

DeviceStateChangeWithAsset stateChange = client
  .createStateChangeForDeviceAssignment(tenantAuthentication, token, request);
```
