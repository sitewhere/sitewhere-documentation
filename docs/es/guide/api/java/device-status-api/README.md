# :book: Java API - Device Statues

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `statuses` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device Statuses

For searching `DeviceStatus` you need to provide an instance of `DeviceStatusSearchCriteria` to the method
`listDeviceStatuss` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of device statuses.

```java
DeviceStatusSearchCriteria searchCriteria = new DeviceStatusSearchCriteria(1, 100);
SearchResults<DeviceStatus> results = client.listDeviceStatuss(tenantAuthentication, searchCriteria);
```

`DeviceStatusSearchCriteria` defines the search criteria for quering `DeviceStatus`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getDeviceTypeToken     | `String`    | Limit results by device type token.                            |
| getCode                | `String`    | Limit results by code.                                         |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Device Status

To retrieve an `DeviceStatus` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886";             // GUID for the DeviceStatus
DeviceStatus deviceStatus = client.getDeviceStatusByToken(token);
```

## Creating an Device Status

For creating an `DeviceStatus` you need to call `createDeviceStatus` passing the `ITenantAuthentication` object and an
`DeviceStatusCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceStatus
// Build the Create Request
DeviceStatusCreateRequest createRequest = DeviceStatusCreateRequest.newBuilder()
  .withToken(token)
  .withName("status01")
  .withDeviceTypeToken("iphone6s")
  .withCode(token)
  .build();
// Create the DeviceStatus
DeviceStatus createdDeviceStatus = client.createDeviceStatus(tenantAuthentication, createRequest);
```

## Actualizar un existing Device Status

For updating an `DeviceStatus` you need to call `updateDeviceStatus` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceStatus` and an `DeviceStatusCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceStatus
DeviceStatusCreateRequest updateRequest = DeviceStatusCreateRequest.newBuilder()
  .withToken(token)
  .withName("status01-updated")
  .withDeviceTypeToken("iphone6s")
  .withCode(token)
  .build();
// Update the DeviceStatus
DeviceStatus updatedDeviceStatus = client.updateDeviceStatus(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device Status

For deleting an existing `DeviceStatus` you need to call `deleteDeviceStatus` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the deviceStatus you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceStatus
DeviceStatus deletedDeviceStatus = client.deleteDeviceStatus(tenantAuthentication, token);
```
