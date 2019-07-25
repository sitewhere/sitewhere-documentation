# :book: Java API - Device Commands

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `commands` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Device Commands

Para buscar resultados de `DeviceCommand` se necesita una instancia de `DeviceCommandSearchCriteria`,
las cuales serán pasadas al método `listDeviceCommands` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `DeviceCommand`.

```java
DeviceCommandSearchCriteria searchCriteria = new DeviceCommandSearchCriteria(1, 100);
SearchResults<DeviceCommand> results = client.listDeviceCommands(tenantAuthentication, searchCriteria);
```

El objeto `DeviceCommandSearchCriteria` define los criterios de búsqueda para un `DeviceCommand`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getDeviceTypeToken     | `String`    | Limitar el resultado por un Device Type token                  |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Device Command

Para obtener un `DeviceCommand` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
DeviceCommand deviceCommand = client.getDeviceCommandByToken(token);
```

## Crear un Device Command

Para crear un `DeviceCommand` se necesita llamar a `createDeviceCommand` pasando el objeto `ITenantAuthentication` y una
instancia de `DeviceCommandCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceCommand
String deviceTypeToken = "iphone6s";
String namespace = "default";
String name = "test command";
DeviceCommandCreateRequest.Builder builder = new DeviceCommandCreateRequest.Builder(deviceTypeToken, token, namespace, name);
builder.withDescription("Some description");
// Build the Create Request
DeviceCommandCreateRequest createRequest = builder.build();
// Create the DeviceCommand
DeviceCommand createdDeviceCommand = client.createDeviceCommand(tenantAuthentication, createRequest);
```

## Actualizar un Device Command existente

Para actualizar un `DeviceCommand` se necesita llamar a `updateDeviceCommand` pasando el objeto `ITenantAuthentication`,
el `token` de un `DeviceCommand` y una instancia de `DeviceCommandCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceCommand
String deviceTypeToken = "iphone6s";
String namespace = "default";
String name = "test command";
DeviceCommandCreateRequest.Builder builder = new DeviceCommandCreateRequest.Builder(deviceTypeToken, token, namespace, name);
builder.withDescription("Some updated description");
// Build the Create Request
DeviceCommandCreateRequest updateRequest = builder.build();
// Update the DeviceCommand
DeviceCommand updatedDeviceCommand = client.updateDeviceCommand(tenantAuthentication, token, updateRequest);
```

## Borrar un Device Command existente

Para eliminar un `DeviceCommand` se necesita llamar a `deleteDeviceCommand` pasando el objeto `ITenantAuthentication` y el
`token` del `DeviceCommand` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceCommand
DeviceCommand deletedDeviceCommand = client.deleteDeviceCommand(tenantAuthentication, token);
```
