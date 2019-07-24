# :book: Java API - Devices

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `devices` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Devices

For searching `Devices` you need to provide an instance of `DeviceSearchCriteria`  to the method
`listDevices` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to
list the first page of 100 results of device types.

```java
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceResponseFormat responseFormat = new DeviceResponseFormat();
SearchResults<Device> results = client.listDevices(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `DeviceSearchCriteria` define los criterios de búsqueda para un `Device`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                    | Tipo        | Descripción                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setDeviceTypeToken           | `String`    | Filter by device type.                                         |
| setExcludeAssigned           | `boolean`   | Indicates whether assigned devices should be excluded.         |
| setStartDate                 | `Date`      | Get date range start.                                          |
| setEndDate                   | `Date`      | Get date range end.                                            |
| setPageNumber                | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize                  | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeDeviceType   | `Boolean`   | Indicates if device type information is included.              |
| setIncludeAssignment   | `Boolean`   | Indicates if assignment information is included.               |

## Obtener un Device

Para obtener un `Device` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
Device device = client.getDeviceByToken(token);
```

## Creating an Device

For creating an `Device` you need to call `createDevice` passing the `ITenantAuthentication` object and an
`DeviceCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
String deviceType = "iphone6s";
DeviceCreateRequest.Builder builder = new DeviceCreateRequest.Builder(deviceType, token);
DeviceCreateRequest createRequest = builder.build();
// Create the Device
Device createdDevice = client.createDevice(tenantAuthentication, createRequest);
```

## Actualizar un existing Device

For updating an `Device` you need to call `updateDevice` passing the `ITenantAuthentication` object,
the `token` of the existing `Device` and an `DeviceCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
String deviceType = "iphone6s";
DeviceCreateRequest.Builder builder = new DeviceCreateRequest.Builder(deviceType, token);
DeviceCreateRequest updateRequest = builder.build();
// Update the Device
Device updatedDevice = client.updateDevice(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device

For deleting an existing `Device` you need to call `deleteDevice` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the device type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
Device deletedDevice = client.deleteDevice(tenantAuthentication, token);
```

## Device associated API Calls

### Quering Assignments associated to a Device

The following example retrieves firts 100 `DeviceAssignment`s associated with a `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
SearchResults<MarshaledDeviceAssignment> assignments = client.listDeviceAssignmentsForDevice(
  tenantAuthentication, token, searchCriteria, responseFormat);
```

### Add Multiple Events for a Device

The followin example shows how to create multiple events for a `Device` using a single API Call.

```java
String deviceToken = "60737-MT90-4178968";
DeviceEventBatch batch = new DeviceEventBatch();
batch.setDeviceToken(deviceToken);
batch.getLocations().add(new DeviceLocationCreateRequest.Builder(22.2, 33.3).build());
// Add other events to DeviceEventBatch
...
// Submit and create the Batch Response
DeviceEventBatchResponse response =
  client.addMultipleEventsForDevice(tenantAuthentication, deviceToken, batch);
```

### Create a Device Mapping

The following example shows how to create a `DeviceElementMapping` for a `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
DeviceElementMapping request = new DeviceElementMapping();
request.setDeviceToken(token);
request.setDeviceElementSchemaPath("someschema");
MarshaledDevice device = client.createDeviceMappings(tenantAuthentication, token, request);
```

### Delete a Device Mapping

The following example shows how to delete a `DeviceElementMapping` for a `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
MarshaledDevice device = client.deleteDeviceMappings(tenantAuthentication, token, "someschema");
```

### Listing Devices by Device Group

The following example shows how to list `Devices` that are associated to a `DeviceGroup`.

```java
String groupToken = "e137a55b-7c50-42f9-9dd7-c0c02e84b80e";
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceByGroupResponseFormat responseFormat = new DeviceByGroupResponseFormat();
SearchResults<Device> result = client.listDevicesByDeviceGroup(tenantAuthentication, groupToken,
  searchCriteria, responseFormat);
```

### Listing Devices by Device Group with a Role

The following example shows how to list `Devices` that are associated to a `DeviceGroup` with a `Role`.

```java
String role = "master";
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceByGroupResponseFormat responseFormat = new DeviceByGroupResponseFormat();
SearchResults<Device> result = client.listDevicesByDeviceGroupWithRole(tenantAuthentication, role,
  searchCriteria, responseFormat);
```
