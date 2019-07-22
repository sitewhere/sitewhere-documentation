# :book: Java API - Device Assignments

<Seo/>

This section contains the documentation and examples of the end point `assignments` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Device Assignments

For searching `DeviceAssignment` you need to provide an instance of `DeviceAssignmentSearchCriteria` to the method
`listDeviceAssignments` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of assets.

```java
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat format = new DeviceAssignmentResponseFormat();
SearchResults<MarshaledDeviceAssignment> results = client.listDeviceAssignments(tenantAuthentication, searchCriteria, responseFormat);
```

`DeviceAssignmentSearchCriteria` defines the search criteria for quering `DeviceAssignment`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property               | Type                           | Description                                                    |
|:-----------------------|:-------------------------------|:---------------------------------------------------------------|
| setAssignmentStatuses  | `List<DeviceAssignmentStatus>` | Limits search the given list of device assignment statuses.    |
| setDeviceAssignmentTokens          | `List<String>`                 | Limits search the given list of areas tokens.                  |
| setAssetTokens         | `List<String>`                 | Limits search the given list of asset tokens.                  |
| setCustomerTokens      | `List<String>`                 | Limits search the given list of customer tokens.               |
| setDeviceTokens        | `List<String>`                 | Limits search the given list of device tokens.                 |
| setDeviceTypeTokens    | `List<String>`                 | Limits search the given list of device type tokens.            |
| setPageNumber          | `Integer`                      | Get offset from beginning of dataset.                          |
| setPageSize            | `Integer`                      | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `DeviceAssignmentResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeDeviceAssignment         | `Boolean`   | Indicates if area is to be returned.                           |
| setIncludeAsset        | `Boolean`   | Indicates if asset is to be returned.                          |
| setIncludeCustomer     | `Boolean`   | Indicates if customer is to be returned.                       |
| setIncludeDevice       | `Boolean`   | Indicates if device is to be returned.                         |
| setIncludeDeviceType   | `Boolean`   | Indicates if device type is to be returned.                    |

## Creating an DeviceAssignment

For creating an `DeviceAssignment` you need to call `createDeviceAssignment` passing the `ITenantAuthentication` object and an
`DeviceAssignmentCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String deviceToken = "15737-UNO-7576364";
String customerToken = "acme";
String areaToken = "southeast";
String assetToken = "derek.adams@sitewhere.com";
DeviceAssignmentCreateRequest.Builder builder =
  new DeviceAssignmentCreateRequest.Builder(deviceToken, customerToken, areaToken, assetToken);
// Build the Create Request
DeviceAssignmentCreateRequest request = builder.build();
request.setToken(token);
// Create the DeviceAssignment
MarshaledDeviceAssignment createdDeviceAssignment = client.createDeviceAssignment(tenantAuthentication, createRequest);
```

## Updating an existing DeviceAssignment

For updating an `DeviceAssignment` you need to call `updateDeviceAssignment` passing the `ITenantAuthentication` object,
the `token` of the existing `DeviceAssignment` and an `DeviceAssignmentCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
String deviceToken = "15737-UNO-7576364";
String customerToken = "acme";
String areaToken = "southeast";
String assetToken = "derek.adams@sitewhere.com";
DeviceAssignmentCreateRequest.Builder builder =
  new DeviceAssignmentCreateRequest.Builder(deviceToken, customerToken, areaToken, assetToken);
// Build the Create Request
DeviceAssignmentCreateRequest request = builder.build();
request.setToken(token);
// Build the Create Request
DeviceAssignmentCreateRequest updateRequest = builder.build();
// Update the DeviceAssignment
MarshaledDeviceAssignment updatedDeviceAssignment = client.updateDeviceAssignment(tenantAuthentication, token, updateRequest);
```

## Deleting an existing DeviceAssignment

For deleting an existing `DeviceAssignment` you need to call `deleteDeviceAssignment` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the asset you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
MarshaledDeviceAssignment deletedDeviceAssignment = client.deleteDeviceAssignment(tenantAuthentication, token);
```

## Device Assignment associated API Calls

### Releasing an Assignment

The following examples releses an existing associated assignment.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
MarshaledDeviceAssignment releasedAssignment = client.releaseDeviceAssignment(tenantAuthentication, token);
```

### Marking Assignment as Missing

The following example marks an existing associated assignment as **missing**.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
MarshaledDeviceAssignment makedMissingAssignment = client.markMissingDeviceAssignment(tenantAuthentication, token);
```

### Quering Alerts associated to a Device Assignment

The following example retrieves firts 100 `DeviceAlert`s associated with an `DeviceAssignment`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceAlertWithAsset> alerts = client.listAlertsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Creating an Alert associated to a Device Assignment

The following example creates an `Alert` of level `error` for a `DeviceAssignment`, 
with `type` **engine.overheat**, and `message` **Engine Overheat**.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
DeviceAlertCreateRequest.Builder builder = new DeviceAlertCreateRequest.Builder("egine.overheat", "Engine Overheat");

DeviceAlertCreateRequest request = builder
  .error()
  .trackState()
  .build();

DeviceAlertWithAsset alert = client.createAlertForDeviceAssignment(tenantAuthentication, token, request);
```

### Quering Assignments associated to a Device Assignment

The following example retrieves firts 100 `DeviceAssignment`s associated with an `DeviceAssignment`
from the last year, including the `Customer` information in the results.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
responseFormat.setIncludeCustomer(true);
SearchResults<MarshaledDeviceAssignment> assignments = 
  client.listDeviceAssignmentsForDeviceAssignment(tenantAuthentication, token, searchCriteria, responseFormat);
```

### Quering Command Invocations associated to a Device Assignment

The following example retrieves firts 100 `DeviceCommandInvocation`s associated with an `DeviceAssignment`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandInvocation> commandInvocations = 
  client.listCommandInvocationsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Quering Locations associated to a Device Assignment

The following example retrieves firts 100 `DeviceLocationWithAsset`s associated with an `DeviceAssignment`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceLocationWithAsset> locations = client
  .listLocationsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Quering Measurements associated to a Device Assignment

The following example retrieves firts 100 `DeviceMeasurementWithAsset`s associated with an `DeviceAssignment`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceMeasurementWithAsset> measurements = client
  .listMeasurementsForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Quering Command Responses associated to a Device Assignment

The following example retrieves firts 100 `DeviceCommandResponseWithAsset`s associated with an `DeviceAssignment`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandResponseWithAsset> commandResponses = client
  .listCommandResponsesForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Quering State Changes associated to a Device Assignment

The following example retrieves firts 100 `DeviceStateChangeWithAsset`s associated with an `DeviceAssignment`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the DeviceAssignment
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 10, startDate, endDate);
SearchResults<DeviceStateChangeWithAsset> stateChanges = client
  .listStateChangesForDeviceAssignment(tenantAuthentication, token, searchCriteria);
```

### Retrive DeviceAssignment tree

The following example retrieves the tree structure of areas.

```java
List<TreeNode> tree = client.areaTree(tenantAuthentication);
```
