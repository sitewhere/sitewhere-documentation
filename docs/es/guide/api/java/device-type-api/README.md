# :book: Java API - Device Types

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `devicetypes` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device Types

For searching `Device Types` you need to provide an instance of `DeviceTypeSearchCriteria`  to the method 
`listDeviceTypes` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of device types.

```java
DeviceTypeSearchCriteria searchCriteria = new DeviceTypeSearchCriteria(1, 100);
DeviceTypeResponseFormat responseFormat = new DeviceTypeResponseFormat();
SearchResults<DeviceType> results = client.listDeviceTypes(tenantAuthentication, searchCriteria, responseFormat);
```

`DeviceTypeSearchCriteria` defines the search criteria for quering `DeviceType`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Propiedad                    | Tipo        | Descripción                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize                  | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceTypeResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeAsset        | `Boolean`   | Indicates if asset is included.                                |

## Obtener un Device Type

Para obtener un `DeviceType` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceType
DeviceType device = client.getDeviceTypeByToken(token);
```

## Creating an Device Type

For creating an `DeviceType` you need to call `createDeviceType` passing the `ITenantAuthentication` object and an
`DeviceTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
String name = "test type";
DeviceTypeCreateRequest.Builder builder = new DeviceTypeCreateRequest.Builder(token, name);
builder.withDescription("Some description");
DeviceTypeCreateRequest createRequest = builder.build();
// Create the Device Type
DeviceType createdDeviceType = client.createDeviceType(tenantAuthentication, createRequest);
```

## Actualizar un existing Device Type

For updating an `DeviceType` you need to call `updateDeviceType` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceType` and an `DeviceTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
String name = "test group";
DeviceTypeCreateRequest.Builder builder = new DeviceTypeCreateRequest.Builder(token, name);
builder.withDescription("Some updated description");
DeviceTypeCreateRequest updateRequest = builder.build();
// Update the Device Type
DeviceType updatedDevice = client.updateDeviceType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device Type

For deleting an existing `DeviceType` you need to call `deleteDeviceType` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the device type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
DeviceType deletedDeviceType = client.deleteDeviceType(tenantAuthentication, token);
```
