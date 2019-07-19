# Java API - Area Type Management

This section contains the documentation and examples of the end point `areatypes` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Area Types

For searching `Area Types` you need to provide an instance of `AreaTypeSearchCriteria`  to the method 
`listAreaTypes` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of area types.

```java
AreaTypeSearchCriteria searchCriteria = new AreaTypeSearchCriteria(1, 100);
SearchResults<AreaType> results = client.listAreaTypes(tenantAuthentication, searchCriteria);
```

`AreaTypeSearchCriteria` defines the search criteria for quering `AreaType`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type        | Description                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setIncludeContainedAreaTypes | Boolean     | Indicates if contained area types are to be returned.          |
| setPageNumber                | Integer     | Get offset from beginning of dataset.                          |
| setPageSize                  | Integer     | Get number of records per page of data.                        |

## Retrieving an Area Type

To retrieve an `AreaType` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the AreaType
AreaType area = client.getAreaTypeByToken(token);
```

## Creating an Area Type

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

## Updating an existing Area Type

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
