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

Para buscar resultados de `DeviceType` se necesita una instancia de `DeviceTypeSearchCriteria` y una instancia de `DeviceTypeResponseFormat`,
las cuales serán pasadas al método `listAreas` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `DeviceType`.

```java
DeviceTypeSearchCriteria searchCriteria = new DeviceTypeSearchCriteria(1, 100);
DeviceTypeResponseFormat responseFormat = new DeviceTypeResponseFormat();
SearchResults<DeviceType> results = client.listDeviceTypes(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `DeviceTypeSearchCriteria` define los criterios de búsqueda para un `DeviceType`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                    | Tipo        | Descripción                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize                  | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`DeviceTypeResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeAsset        | `Boolean`   | Indicata si el asset debe ser incluido en la respuesta.        |

## Obtener un Device Type

Para obtener un `DeviceType` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceType
DeviceType device = client.getDeviceTypeByToken(token);
```

## Crear un Device Type

Para crear un `DeviceType` se necesita llamar a `createDeviceType` pasando el objeto `ITenantAuthentication` y una
instancia de `DeviceTypeCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
String name = "test type";
DeviceTypeCreateRequest.Builder builder = new DeviceTypeCreateRequest.Builder(token, name);
builder.withDescription("Some description");
DeviceTypeCreateRequest createRequest = builder.build();
// Create the Device Type
DeviceType createdDeviceType = client.createDeviceType(tenantAuthentication, createRequest);
```

## Actualizar un Device Type existente

Para actualizar un `DeviceType` se necesita llamar a `updateDeviceType` pasando el objeto `ITenantAuthentication`,
el `token` de un `DeviceType` y una instancia de `DeviceTypeCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
String name = "test group";
DeviceTypeCreateRequest.Builder builder = new DeviceTypeCreateRequest.Builder(token, name);
builder.withDescription("Some updated description");
DeviceTypeCreateRequest updateRequest = builder.build();
// Update the Device Type
DeviceType updatedDevice = client.updateDeviceType(tenantAuthentication, token, updateRequest);
```

## Barrar un Device Type existente

Para eliminar un `DeviceType` se necesita llamar a `deleteDeviceType` pasando el objeto `ITenantAuthentication` y el
`token` del `DeviceType` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
DeviceType deletedDeviceType = client.deleteDeviceType(tenantAuthentication, token);
```
