# Java API - Zones

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `zones` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del _tenant_ ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Zonas

Para buscar resultados de `Zone` se necesita una instancia de `ZoneSearchCriteria`,
las cuales serán pasadas al método `listZones` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `Zone`.

```java
ZoneSearchCriteria searchCriteria = new ZoneSearchCriteria(1, 100);
SearchResults<Zone> results = client.listZones(tenantAuthentication, searchCriteria);
```

`ZoneSearchCriteria` defines the search criteria for quering `Zone`, the following table shows the properties, with
thier type and description, that can be set to filter the results.

| Propiedad     | Tipo      | Descripción                                   |
| :------------ | :-------- | :-------------------------------------------- |
| setAreaToken  | `String`  | Filtrar por el área al que pertenece la zona. |
| setPageNumber | `Integer` | Indicar el número de pagina del dataset.      |
| setPageSize   | `Integer` | Indicar el número de registros por página.    |

## Obtener una Zona

Para obtener una `Zone` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Zone
Zone zone = client.getZoneByToken(token);
```

## Crear una Zona

Para crear una `Zone` se necesita llamar a `createZone` pasando el objeto `ITenantAuthentication` y una
instancia de `ZoneCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Zone
String areaToken = "peachtree";                        // Some area token
String name = "Test Zone Name";                        // Name of the Zone
Area area = client.getAreaByToken(tenantAuthentication, areaToken);
ZoneCreateRequest.Builder builder = new ZoneCreateRequest.Builder(token, name, area);
builder.withFillColor("#FFCC00");
builder.withBorderColor("#FFCCCC");
builder.withOpacity(0.8);
// Build the Create Request
ZoneCreateRequest createRequest = builder.build();
// Create the Zone
Zone createdZone = client.createZone(tenantAuthentication, createRequest);
```

## Actualizar una Zona existente

Para actualizar una `Zone` se necesita llamar a `updateZone` pasando el objeto `ITenantAuthentication`,
el `token` de un `Zone` y una instancia de `AreaCreateRequest` construido como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Zone
String areaToken = "peachtree";                        // Some area token
String name = "Test Zone Name";                        // Name of the Zone
Area area = client.getAreaByToken(tenantAuthentication, areaToken);
ZoneCreateRequest.Builder builder = new ZoneCreateRequest.Builder(token, name, area);
builder.withFillColor("#FFCC00");
builder.withBorderColor("#FFCCCC");
builder.withOpacity(0.8);
// Build the Create Request
ZoneCreateRequest updateRequest = builder.build();
// Update the Zone
Zone updatedZone = client.updateZone(tenantAuthentication, token, updateRequest);
```

## Deleting una Zona existente

Para eliminar un `Zone` se necesita llamar a `deleteZone` pasando el objeto `ITenantAuthentication` y el
`token` del `Zone` que se quiere eliminar, como en el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Zone
Zone deletedZone = client.deleteZone(tenantAuthentication, token);
```
