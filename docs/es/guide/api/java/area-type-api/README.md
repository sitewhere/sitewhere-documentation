# :book: Java API - Area Types

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `areatypes` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Area Types

Para buscar resultados de `AreaType` se necesita una instancia de `AreaTypeSearchCriteria`,
la cual serán pasada al método `listAreaTypes` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `AreaType`.

```java
AreaTypeSearchCriteria searchCriteria = new AreaTypeSearchCriteria(1, 100);
SearchResults<AreaType> results = client.listAreaTypes(tenantAuthentication, searchCriteria);
```

El objeto `AreaTypeSearchCriteria` define los criterios de búsqueda para un `AreaType`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad                    | Tipo        | Descripción                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setIncludeContainedAreaTypes | `Boolean`   | Indicates if contained area types are to be returned.          |
| setPageNumber                | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize                  | `Integer`   | Indicar el número de registros por página.                     |

## Obtener un Area Type

Para obtener un `AreaType` por su token utilice el siguiente ejemplo.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the AreaType
AreaType area = client.getAreaTypeByToken(token);
```

## Crear un Area Type

For creating an `AreaType` you need to call `createAreaType` passing the `ITenantAuthentication` object and an
`AreaTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area Type
AreaTypeCreateRequest.Builder builder = new AreaTypeCreateRequest.Builder(token, "my area type");
builder.withDescription("Some description");
AreaTypeCreateRequest createRequest = builder.build();
// Create the Area Type
AreaType createdAreaType = client.createAreaType(tenantAuthentication, createRequest);
```

## Actualizar un existing Area Type

For updating an `AreaType` you need to call `updateAreaType` passing the `ITenantAuthentication` object,
the `token` of the existing `AreaType` and an `AreaTypeCreateRequest` build like in the folling example.

```java
AreaTypeCreateRequest.Builder builder = new AreaTypeCreateRequest.Builder(token, "my area type");
builder.withDescription("Some description");
AreaTypeCreateRequest updateRequest = builder.build();
// Update the Area Type
AreaType updatedArea = client.updateAreaType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Area Type

For deleting an existing `AreaType` you need to call `deleteAreaType` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the area type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area Type
AreaType deletedAreaType = client.deleteAreaType(tenantAuthentication, token);
```
