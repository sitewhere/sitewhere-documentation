# Java API - Device Groups

<Seo/>

This section contains the documentation and examples of the end point `devicegroups` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Device Groups

For searching `DeviceGroup` you need to provide an instance of `DeviceGroupSearchCriteria` to the method
`listDeviceGroups` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of device groups.

```java
DeviceGroupSearchCriteria searchCriteria = new DeviceGroupSearchCriteria(1, 100);
SearchResults<DeviceGroup> results = client.listDeviceGroups(tenantAuthentication, searchCriteria);
```

`DeviceGroupSearchCriteria` defines the search criteria for quering `DeviceGroup`, the following table shows the properties, with
thier type and description, that can be set to filter the results.

| Property      | Type      | Description                             |
| :------------ | :-------- | :-------------------------------------- |
| getRole       | `String`  | Limits search by a given role.          |
| setPageNumber | `Integer` | Get offset from beginning of dataset.   |
| setPageSize   | `Integer` | Get number of records per page of data. |

## Retrieving an Device Group

To retrieve an `DeviceGroup` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
DeviceGroup deviceGroup = client.getDeviceGroupByToken(token);
```

## Creating an Device Group

For creating an `DeviceGroup` you need to call `createDeviceGroup` passing the `ITenantAuthentication` object and an
`DeviceGroupCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
String name = "test group";
DeviceGroupCreateRequest.Builder builder = new DeviceGroupCreateRequest.Builder(token, name);
builder.withRole("primary");
builder.withDescription("Some description");
// Build the Create Request
DeviceGroupCreateRequest createRequest = builder.build();
// Create the DeviceGroup
DeviceGroup createdDeviceGroup = client.createDeviceGroup(tenantAuthentication, createRequest);
```

## Updating an existing Device Group

For updating an `DeviceGroup` you need to call `updateDeviceGroup` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceGroup` and an `DeviceGroupCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
String name = "test group";
DeviceGroupCreateRequest.Builder builder = new DeviceGroupCreateRequest.Builder(token, name);
builder.withRole("primary");
builder.withDescription("Some updated description");
// Build the Create Request
DeviceGroupCreateRequest updateRequest = builder.build();
// Update the DeviceGroup
DeviceGroup updatedDeviceGroup = client.updateDeviceGroup(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device Group

For deleting an existing `DeviceGroup` you need to call `deleteDeviceGroup` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the device group you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceGroup
DeviceGroup deletedDeviceGroup = client.deleteDeviceGroup(tenantAuthentication, token);
```
