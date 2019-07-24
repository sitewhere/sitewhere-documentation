# :book: Java API - Assets

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `assets` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Assets

Para buscar resultados de `Asset` se necesita una instancia de `AssetSearchCriteria`,
la cual será pasada al método `listAssets` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `Area`.

```java
AssetSearchCriteria searchCriteria = new AssetSearchCriteria(1, 100);
SearchResults<Asset> results = client.listAssets(tenantAuthentication, searchCriteria);
```

El objeto `AssetSearchCriteria` define los criterios de búsqueda para un `Asset`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getAssetTypeToken      | `String`    | Only match assets of the given type.                           |
| getIncludeAssetType    | `Boolean`   | Indicates if asset type are to be returned.                    |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

## Crear un Asset

For creating an `Asset` you need to call `createAsset` passing the `ITenantAuthentication` object and an
`AssetCreateRequest` build like in the folling example.

```java
String assetTypeToken = "cat320EL";                // Token of the asset type
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset
AssetCreateRequest.Builder builder = new AssetCreateRequest.Builder(token, assetTypeToken, "my asset");
// Build the Create Request
AssetCreateRequest createRequest = builder.build();
// Create the Asset
Asset createdAsset = client.createAsset(tenantAuthentication, createRequest);
```

## Actualizar un existing Asset

For updating an `Asset` you need to call `updateAsset` passing the `ITenantAuthentication` object,
the `token` of the existing `Asset` and an `AssetCreateRequest` build like in the folling example.

```java
String assetTypeToken = "cat320EL";                // Token of the asset type
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset
AssetCreateRequest.Builder builder = new AssetCreateRequest.Builder(token, assetTypeToken, "my updated asset");
// Build the Create Request
AssetCreateRequest updateRequest = builder.build();
// Update the Asset
Asset updatedAsset = client.updateAsset(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Asset

For deleting an existing `Asset` you need to call `deleteAsset` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the asset you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset
Asset deletedAsset = client.deleteAsset(tenantAuthentication, token);
```
