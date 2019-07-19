# Java API - Asset Management

This section contains the documentation and examples of the end point `assets` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching Assets

For searching `Asset` you need to provide an instance of `AssetSearchCriteria` to the method 
`listAssets` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of assets.

```java
AssetSearchCriteria searchCriteria = new AssetSearchCriteria(1, 100);
SearchResults<Asset> results = client.listAssets(tenantAuthentication, searchCriteria, responseFormat);
```

`AssetSearchCriteria` defines the search criteria for quering `Asset`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| getAssetTypeToken      | String      | Only match assets of the given type.                           |
| getIncludeAssetType    | Boolean     | Indicates if asset type are to be returned.                    |
| setPageNumber          | Integer     | Get offset from beginning of dataset.                          |
| setPageSize            | Integer     | Get number of records per page of data.                        |

## Creating an Asset

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

## Updating an existing Asset

For updating an `Asset` you need to call `updateAsset` passing the `ITenantAuthentication` object,
the `token` of the existing `Asset` and an `AssetCreateRequest` build like in the folling example.

```java
String assetTypeToken = "cat320EL";                // Token of the asset type
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset
AssetCreateRequest.Builder builder = new AssetCreateRequest.Builder(token, assetTypeToken, "my updated asset");
// Build the Create Request
AssetCreateRequest updateRequest = builder.build();
// Update the Asset
Asset updatedAsset = client.updateAssetType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Asset

For deleting an existing `Asset` you need to call `deleteAsset` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the asset you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Asset
Asset deletedAsset = client.deleteAssetType(tenantAuthentication, token);
```

## Searching Asset Types

For searching `Asset Types` you need to provide an instance of `AssetTypeSearchCriteria`  to the method 
`listAssetTypes` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of asset types.

```java
AssetTypeSearchCriteria searchCriteria = new AssetTypeSearchCriteria(1, 100);
SearchResults<AssetType> results = client.listAssetTypes(tenantAuthentication, searchCriteria);
```

`AssetTypeSearchCriteria` defines the search criteria for quering `AssetType`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type        | Description                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | Integer     | Get offset from beginning of dataset.                          |
| setPageSize                  | Integer     | Get number of records per page of data.                        |

## Creating an Asset Type

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

## Updating an existing Asset Type

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
