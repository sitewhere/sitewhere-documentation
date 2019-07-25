# :book: Java API - Devices

<Seo/>

This section contains the documentation and examples of the end point `devices` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Devices

For searching `Devices` you need to provide an instance of `DeviceSearchCriteria`  to the method 
`listDevices` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of device types.

```java
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceResponseFormat responseFormat = new DeviceResponseFormat();
SearchResults<Device> results = client.listDevices(tenantAuthentication, searchCriteria, responseFormat);
```

`DeviceSearchCriteria` defines the search criteria for quering `Device`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type        | Description                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setDeviceTypeToken           | `String`    | Filter by device type.                                         |
| setExcludeAssigned           | `boolean`   | Indicates whether assigned devices should be excluded.         |
| setStartDate                 | `Date`      | Get date range start.                                          |
| setEndDate                   | `Date`      | Get date range end.                                            |
| setPageNumber                | `Integer`   | Get offset from beginning of dataset.                          |
| setPageSize                  | `Integer`   | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `DeviceResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeDeviceType   | `Boolean`   | Indicates if device type information is included.              |
| setIncludeAssignment   | `Boolean`   | Indicates if assignment information is included.               |

## Retrieving an Device

To retrieve an `Device` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
Device device = client.getDeviceByToken(token);
```

## Creating an Device

For creating an `Device` you need to call `createDevice` passing the `ITenantAuthentication` object and an
`DeviceCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
String deviceType = "iphone6s";
DeviceCreateRequest.Builder builder = new DeviceCreateRequest.Builder(deviceType, token);
DeviceCreateRequest createRequest = builder.build();
// Create the Device
Device createdDevice = client.createDevice(tenantAuthentication, createRequest);
```

## Updating an existing Device

For updating an `Device` you need to call `updateDevice` passing the `ITenantAuthentication` object,
the `token` of the existing `Device` and an `DeviceCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
String deviceType = "iphone6s";
DeviceCreateRequest.Builder builder = new DeviceCreateRequest.Builder(deviceType, token);
DeviceCreateRequest updateRequest = builder.build();
// Update the Device
Device updatedDevice = client.updateDevice(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Device

For deleting an existing `Device` you need to call `deleteDevice` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the device type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
Device deletedDevice = client.deleteDevice(tenantAuthentication, token);
```

## Device associated API Calls

### Quering Assignments associated to a Device

The following example retrieves firts 100 `DeviceAssignment`s associated with a `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
SearchResults<MarshaledDeviceAssignment> assignments = client.listDeviceAssignmentsForDevice(
  tenantAuthentication, token, searchCriteria, responseFormat);
```

### Add Multiple Events for a Device

The following example shows how to create multiple events for a `Device` using a single API Call.

```java
String deviceToken = "60737-MT90-4178968";
DeviceEventBatch batch = new DeviceEventBatch();
batch.setDeviceToken(deviceToken);
batch.getLocations().add(new DeviceLocationCreateRequest.Builder(22.2, 33.3).build());
// Add other events to DeviceEventBatch
...
// Submit and create the Batch Response
DeviceEventBatchResponse response = 
  client.addMultipleEventsForDevice(tenantAuthentication, deviceToken, batch);
```

### Create a Device Mapping

The following example shows how to create a `DeviceElementMapping` for a `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
DeviceElementMapping request = new DeviceElementMapping();
request.setDeviceToken(token);
request.setDeviceElementSchemaPath("someschema");
MarshaledDevice device = client.createDeviceMappings(tenantAuthentication, token, request);
```

### Delete a Device Mapping

The following example shows how to delete a `DeviceElementMapping` for a `Device`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Device
MarshaledDevice device = client.deleteDeviceMappings(tenantAuthentication, token, "someschema");
```

### Listing Devices by Device Group

The following example shows how to list `Devices` that are associated to a `DeviceGroup`.

```java
String groupToken = "e137a55b-7c50-42f9-9dd7-c0c02e84b80e";
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceByGroupResponseFormat responseFormat = new DeviceByGroupResponseFormat();
SearchResults<Device> result = client.listDevicesByDeviceGroup(tenantAuthentication, groupToken,
  searchCriteria, responseFormat);
```

### Listing Devices by Device Group with a Role

The following example shows how to list `Devices` that are associated to a `DeviceGroup` with a `Role`.

```java
String role = "master";
DeviceSearchCriteria searchCriteria = new DeviceSearchCriteria(1, 100, null, null);
DeviceByGroupResponseFormat responseFormat = new DeviceByGroupResponseFormat();
SearchResults<Device> result = client.listDevicesByDeviceGroupWithRole(tenantAuthentication, role,
  searchCriteria, responseFormat);
```
