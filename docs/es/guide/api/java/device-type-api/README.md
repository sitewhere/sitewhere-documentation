# :book: Java API - Device Types

<Seo/>

This section contains the documentation and examples of the end point `devicetypes` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Device Types

For searching `Device Types` you need to provide an instance of `DeviceTypeSearchCriteria`  to the method 
`listDeviceTypes` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of device types.

```java
DeviceTypeSearchCriteria searchCriteria = new DeviceTypeSearchCriteria(1, 100);
DeviceTypeResponseFormat responseFormat = new DeviceTypeResponseFormat();
SearchResults<DeviceType> results = client.listDeviceTypes(tenantAuthentication, searchCriteria, responseFormat);
```

`DeviceTypeSearchCriteria` defines the search criteria for quering `DeviceType`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type        | Description                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | `Integer`   | Get offset from beginning of dataset.                          |
| setPageSize                  | `Integer`   | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `DeviceTypeResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeAsset        | `Boolean`   | Indicates if asset is included.                                |

## Retrieving an Device Type

To retrieve an `DeviceType` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceType
DeviceType device = client.getDeviceTypeByToken(token);
```

## Creating an Device Type

For creating an `DeviceType` you need to call `createDeviceType` passing the `ITenantAuthentication` object and an
`DeviceTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
String name = "test type";
DeviceTypeCreateRequest.Builder builder = new DeviceTypeCreateRequest.Builder(token, name);
builder.withDescription("Some description");
DeviceTypeCreateRequest createRequest = builder.build();
// Create the Device Type
DeviceType createdDeviceType = client.createDeviceType(tenantAuthentication, createRequest);
```

## Updating an existing Device Type

For updating an `DeviceType` you need to call `updateDeviceType` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceType` and an `DeviceTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
String name = "test group";
DeviceTypeCreateRequest.Builder builder = new DeviceTypeCreateRequest.Builder(token, name);
builder.withDescription("Some updated description");
DeviceTypeCreateRequest updateRequest = builder.build();
// Update the Device Type
DeviceType updatedDevice = client.updateDeviceType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device Type

For deleting an existing `DeviceType` you need to call `deleteDeviceType` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the device type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device Type
DeviceType deletedDeviceType = client.deleteDeviceType(tenantAuthentication, token);
```
