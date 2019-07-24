# :book: Java API - Asset Types

<Seo/>

This section contains the documentation and examples of the end point `assettypes` of SiteWhere Java API.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Asset Types

Para buscar resultados de `AssetType` se necesita una instancia de `AssetTypeSearchCriteria`,
la cual será pasada al método `listAssetTypes` de `com.sitewhere.spi.ISiteWhereClient`. El siguiente ejemplo muestra
como consultar la API REST de SiteWhere para listar la primer página con 100 resultados de `AssetType`.

```java
AssetTypeSearchCriteria searchCriteria = new AssetTypeSearchCriteria(1, 100);
SearchResults<AssetType> results = client.listAssetTypes(tenantAuthentication, searchCriteria);
```

`AssetTypeSearchCriteria` defines the search criteria for quering `AssetType`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type        | Description                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | `Integer`   | Get offset from beginning of dataset.                          |
| setPageSize                  | `Integer`   | Get number of records per page of data.                        |

## Crear un Asset Type

For creating an `AssetType` you need to call `createAssetType` passing the `ITenantAuthentication` object and an
`AssetTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset Type
AssetTypeCreateRequest.Builder builder = new  AssetTypeCreateRequest.Builder(token, "my asset type");
builder.withDescription("Some description");
AssetTypeCreateRequest createRequest = builder.build();
// Create the Asset Type
AssetType createdAssetType = client.createAssetType(tenantAuthentication, createRequest);
```

## Actualizar un existing Asset Type

For updating an `AssetType` you need to call `updateAssetType` passing the `ITenantAuthentication` object,
the `token` of the existing `AssetType` and an `AssetTypeCreateRequest` build like in the folling example.

```java
AssetTypeCreateRequest.Builder builder = new  AssetTypeCreateRequest.Builder(token, "my asset type");
builder.withDescription("Some description");
AssetTypeCreateRequest updateRequest = builder.build();
// Update the Asset Type
AssetType updatedAsset = client.updateAssetType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Asset Type

For deleting an existing `AssetType` you need to call `deleteAssetType` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the asset type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset Type
AssetType deletedAssetType = client.deleteAssetType(tenantAuthentication, token);
```
