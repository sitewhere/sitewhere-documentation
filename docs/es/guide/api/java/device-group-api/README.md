# :book: Java API - Device Groups

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `devicegroups` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device Groups

Para buscar resultados de `DeviceGroup` se necesita una instancia de `DeviceGroupSearchCriteria`,
las cuales serán pasadas al método `listDeviceGroups` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `DeviceGroup`.

```java
DeviceGroupSearchCriteria searchCriteria = new DeviceGroupSearchCriteria(1, 100);
SearchResults<DeviceGroup> results = client.listDeviceGroups(tenantAuthentication, searchCriteria);
```

El objeto `DeviceGroupSearchCriteria` define los criterios de búsqueda para un `DeviceGroup`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getRole                | `String`    | Limitar la búsqueda por un role.                               |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Device Group

Para obtener un `DeviceGroup` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
DeviceGroup deviceGroup = client.getDeviceGroupByToken(token);
```

## Crear un Device Group

Para crear un `DeviceGroup` se necesita llamar a `createDeviceGroup` pasando el objeto `ITenantAuthentication` y una
instancia de `DeviceGroupCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
String name = "test group";
DeviceGroupCreateRequest.Builder builder = new DeviceGroupCreateRequest.Builder(token, name);
builder.withRole("primary");
builder.withDescription("Some description");
// Build the Create Request
DeviceGroupCreateRequest createRequest = builder.build();
// Create the DeviceGroup
DeviceGroup createdDeviceGroup = client.createDeviceGroup(tenantAuthentication, createRequest);
```

## Actualizar un Device Group existente

Para actualizar un `DeviceGroup` se necesita llamar a `updateDeviceGroup` pasando el objeto `ITenantAuthentication`,
el `token` de un `DeviceGroup` y una instancia de `DeviceGroupCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
String name = "test group";
DeviceGroupCreateRequest.Builder builder = new DeviceGroupCreateRequest.Builder(token, name);
builder.withRole("primary");
builder.withDescription("Some updated description");
// Build the Create Request
DeviceGroupCreateRequest updateRequest = builder.build();
// Update the DeviceGroup
DeviceGroup updatedDeviceGroup = client.updateDeviceGroup(tenantAuthentication, token, updateRequest);
```

## Borrar un Device Group existente

Para eliminar un `DeviceGroup` se necesita llamar a `deleteDeviceGroup` pasando el objeto `ITenantAuthentication` y el
`token` del `DeviceGroup` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
DeviceGroup deletedDeviceGroup = client.deleteDeviceGroup(tenantAuthentication, token);
```
