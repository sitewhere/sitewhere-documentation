# :book: Java API - Zones

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `zones` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Zones

For searching `Zone` you need to provide an instance of `ZoneSearchCriteria` to the method
`listZones` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query
SiteWhere REST API to list the first page of 100 results of zones.

```java
ZoneSearchCriteria searchCriteria = new ZoneSearchCriteria(1, 100);
SearchResults<Zone> results = client.listZones(tenantAuthentication, searchCriteria);
```

`ZoneSearchCriteria` defines the search criteria for quering `Zone`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setAreaToken           | `String`    | Filter by the area zone belongs to.                            |
| setPageNumber          | `Integer`   | Get offset from beginning of dataset.                          |
| setPageSize            | `Integer`   | Get number of records per page of data.                        |

## Obtener un Zone

To retrieve an `Zone` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Zone
Zone zone = client.getZoneByToken(token);
```

## Creating an Zone

For creating an `Zone` you need to call `createZone` passing the `ITenantAuthentication` object and an
`ZoneCreateRequest` build like in the folling example.

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

## Actualizar un existing Zone

For updating an `Zone` you need to call `updateZone` passing the `ITenantAuthentication` object,
the `token` of the existing `Zone` and an `ZoneCreateRequest` build like in the folling example.

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

## Deleting an existing Zone

For deleting an existing `Zone` you need to call `deleteZone` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the zone you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Zone
Zone deletedZone = client.deleteZone(tenantAuthentication, token);
```
