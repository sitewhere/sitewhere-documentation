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

Para buscar resultados de `DeviceStatus` se necesita una instancia de `DeviceStatusSearchCriteria`,
las cuales serán pasadas al método `listDeviceStatuss` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `DeviceStatus`.

```java
DeviceStatusSearchCriteria searchCriteria = new DeviceStatusSearchCriteria(1, 100);
SearchResults<DeviceStatus> results = client.listDeviceStatuss(tenantAuthentication, searchCriteria);
```

El objeto `DeviceStatusSearchCriteria` define los criterios de búsqueda para un `DeviceStatus`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getDeviceTypeToken     | `String`    | Limitar los resultados por Device Type.                        |
| getCode                | `String`    | Limitar los resultados por code.                               |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Device Status

Para obtener un `DeviceStatus` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886";             // GUID for the DeviceStatus
DeviceStatus deviceStatus = client.getDeviceStatusByToken(token);
```

## Crear un Device Status

Para crear un `DeviceStatus` se necesita llamar a `createDeviceStatus` pasando el objeto `ITenantAuthentication` y una
instancia de `DeviceStatusCreateRequest` construido como en el siguiente ejemplo.

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

## Actualizar un Device Status existente

Para actualizar un `DeviceStatus` se necesita llamar a `updateDeviceStatus` pasando el objeto `ITenantAuthentication`,
el `token` de un `DeviceStatus` y una instancia de `DeviceStatusCreateRequest` construido como en el siguiente ejemplo.

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

Para eliminar un `DeviceStatus` se necesita llamar a `deleteDeviceStatus` pasando el objeto `ITenantAuthentication` y el
`token` del `DeviceStatus` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceStatus
DeviceStatus deletedDeviceStatus = client.deleteDeviceStatus(tenantAuthentication, token);
```
