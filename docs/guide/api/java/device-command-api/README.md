# Java API - Device Commands

<Seo/>

This section contains the documentation and examples of the end point `commands` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Device Commands

For searching `DeviceCommand` you need to provide an instance of `DeviceCommandSearchCriteria` to the method
`listDeviceCommands` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of assets.

```java
DeviceCommandSearchCriteria searchCriteria = new DeviceCommandSearchCriteria(1, 100);
SearchResults<DeviceCommand> results = client.listDeviceCommands(tenantAuthentication, searchCriteria);
```

`DeviceCommandSearchCriteria` defines the search criteria for quering `DeviceCommand`, the following table shows the properties, with
thier type and description, that can be set to filter the results.

| Property           | Type      | Description                             |
| :----------------- | :-------- | :-------------------------------------- |
| getDeviceTypeToken | `String`  | Limit results by device type id.        |
| setPageNumber      | `Integer` | Get offset from beginning of dataset.   |
| setPageSize        | `Integer` | Get number of records per page of data. |

## Creating an Device Command

For creating an `DeviceCommand` you need to call `createDeviceCommand` passing the `ITenantAuthentication` object and an
`DeviceCommandCreateRequest` build like in the folling example.

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

## Updating an existing Device Command

For updating an `DeviceCommand` you need to call `updateDeviceCommand` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceCommand` and an `DeviceCommandCreateRequest` build like in the folling example.

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

## Deleting an existing Device Command

For deleting an existing `DeviceCommand` you need to call `deleteDeviceCommand` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the asset you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceCommand
DeviceCommand deletedDeviceCommand = client.deleteDeviceCommand(tenantAuthentication, token);
```
