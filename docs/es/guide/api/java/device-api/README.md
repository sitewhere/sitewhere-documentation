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

Para buscar resultados de `Devices` se necesita una instancia de `DeviceSearchCriteria` y una instancia de `DeviceResponseFormat`,
las cuales serán pasadas al método `listDevices` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `Devices`.

```java
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceResponseFormat responseFormat = new DeviceResponseFormat();
SearchResults<Device> results = client.listDevices(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `DeviceSearchCriteria` define los criterios de búsqueda para un `Device`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                    | Tipo        | Descripción                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setDeviceTypeToken           | `String`    | Filtrar por Device Type.                                       |
| setExcludeAssigned           | `boolean`   | Indica si los dispositivos asignados deben ser excluidos.      |
| setStartDate                 | `Date`      | Fecha de inicio del rango.                                     |
| setEndDate                   | `Date`      | Fecha de fin del range.                                        |
| setPageNumber                | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize                  | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                       |
|:-----------------------|:------------|:------------------------------------------------------------------|
| setIncludeDeviceType   | `Boolean`   | Indica si la información de los Device Type deben ser incluidos.  |
| setIncludeAssignment   | `Boolean`   | Indica si la información de las asignaciones deben ser incluidas. |

## Obtener un Device

Para obtener un `Device` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
Device device = client.getDeviceByToken(token);
```

## Creating an Device

Para crear un `Device` se necesita llamar a `createDevice` pasando el objeto `ITenantAuthentication` y una
instancia de `DeviceCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
String deviceType = "iphone6s";
DeviceCreateRequest.Builder builder = new DeviceCreateRequest.Builder(deviceType, token);
DeviceCreateRequest createRequest = builder.build();
// Create the Device
Device createdDevice = client.createDevice(tenantAuthentication, createRequest);
```

## Actualizar un existing Device

Para actualizar un `Device` se necesita llamar a `updateDevice` pasando el objeto `ITenantAuthentication`,
el `token` de un `Device` y una instancia de `DeviceCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
String deviceType = "iphone6s";
DeviceCreateRequest.Builder builder = new DeviceCreateRequest.Builder(deviceType, token);
DeviceCreateRequest updateRequest = builder.build();
// Update the Device
Device updatedDevice = client.updateDevice(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device

Para eliminar un `Device` se necesita llamar a `deleteDevice` pasando el objeto `ITenantAuthentication` y el
`token` del `Device` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
Device deletedDevice = client.deleteDevice(tenantAuthentication, token);
```

## Llamadas de API asociadas al Device

### Obtener Assignments asociados al Device

El siguiente ejemplo recupera las primeras 100 `DeviceAssignment`s asociadas con un `Device`
del último año.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
SearchResults<MarshaledDeviceAssignment> assignments = client.listDeviceAssignmentsForDevice(
  tenantAuthentication, token, searchCriteria, responseFormat);
```

### Agregar Múltiple eventso al Device

El siguiente ejemplo muestra cómo crear múltiple evento a un `Device` usand una sóla llamada a la API.

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

### Crear un Mapeo de Dispositivo

El siguiente ejemplo muestra cómo crear un `DeviceElementMapping` para un `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
DeviceElementMapping request = new DeviceElementMapping();
request.setDeviceToken(token);
request.setDeviceElementSchemaPath("someschema");
MarshaledDevice device = client.createDeviceMappings(tenantAuthentication, token, request);
```

### Borrar un Mepeo de Dispositivo

El siguiente ejemplo muestra cómo borrar un `DeviceElementMapping` para un `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
MarshaledDevice device = client.deleteDeviceMappings(tenantAuthentication, token, "someschema");
```

### Listar Dispositivos por Grupo de Dispositivo

El siguiente ejemplo muestra cómo listar `Devices` que están asociados a un `DeviceGroup`.

```java
String groupToken = "e137a55b-7c50-42f9-9dd7-c0c02e84b80e";
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceByGroupResponseFormat responseFormat = new DeviceByGroupResponseFormat();
SearchResults<Device> result = client.listDevicesByDeviceGroup(tenantAuthentication, groupToken,
  searchCriteria, responseFormat);
```

### Listar Dispositivos por Grupo de Dispositivo con un Role

El siguiente ejemplo muestra cómo listar `Devices` que están asociados a un `DeviceGroup` con un `Role`.

```java
String role = "master";
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceByGroupResponseFormat responseFormat = new DeviceByGroupResponseFormat();
SearchResults<Device> result = client.listDevicesByDeviceGroupWithRole(tenantAuthentication, role,
  searchCriteria, responseFormat);
```
