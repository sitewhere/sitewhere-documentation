# Java API - Area Management

This section contains the documentation and examples of the end point `areas` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching Areas

For searching `Area` you need to provide an instance of `AreaSearchCriteria` and an instance of `AreaResponseFormat` to the method 
`listAreas` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of areas.

```java
AreaSearchCriteria searchCriteria = new AreaSearchCriteria(1, 100);
AreaResponseFormat responseFormat = new AreaResponseFormat();
SearchResults<Area> results = client.listAreas(tenantAuthentication, searchCriteria, responseFormat);
```

`AreaSearchCriteria` defines the search criteria for quering `Area`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setRootOnly            | Boolean     | Indicates if only root elements are to be returned.            |
| setAreaTypeToken       | String      | Only match areas of the given type.                            |
| setParentAreaToken     | String      | Requires that areas have the given area as a parent.           |
| setPageNumber          | Integer     | Get offset from beginning of dataset.                          |
| setPageSize            | Integer     | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `AreaResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeAreaType     | Boolean     | Indicates if included area types are to be returned.           |
| setIncludeAssignments  | Boolean     | Indicates if assignments are to be returned.                   |
| setIncludeZones        | Boolean     | Indicates if zones are to be returned.                         |

## Creating an Area

For creating an `Area` you need to call `createArea` passing the `ITenantAuthentication` object and an
`AreaCreateRequest` build like in the folling example.

```java
String areaTypeToken = "construction";                 // Token of the area type
String parentToken = "southeast";                      // Token of the parent area
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
AreaCreateRequest.Builder builder = new AreaCreateRequest.Builder(areaTypeToken, parentToken, token, "my area");
builder.withDescription("Some area");
// Build the Create Request
AreaCreateRequest createRequest = builder.build();
// Create the Area
Area createdArea = client.createArea(tenantAuthentication, createRequest);
```

## Updating an existing Area

For updating an `Area` you need to call `updateArea` passing the `ITenantAuthentication` object,
the `token` of the existing `Area` and an `AreaCreateRequest` build like in the folling example.

```java
String areaTypeToken = "construction";                 // Token of the area type
String parentToken = "southeast";                      // Token of the parent area
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
AreaCreateRequest.Builder builder = new AreaCreateRequest.Builder(areaTypeToken, parentToken, token, "my area");
builder.withDescription("Some updated description");
// Build the Create Request
AreaCreateRequest updateRequest = builder.build();
// Update the Area
Area updatedArea = client.updateAreaType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Area

For deleting an existing `Area` you need to call `deleteArea` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the area you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Area deletedArea = client.deleteAreaType(tenantAuthentication, token);
```

## Quering information associated to an Area

### Quering Alerts associated to an Area

The following example retrieves firts 100 `DeviceAlert`s associated with an `Area`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceAlertWithAsset> alerts = client.listAlertsForArea(tenantAuthentication, token, searchCriteria);
```

### Quering Assignments associated to an Area

The following example retrieves firts 100 `DeviceAssignment`s associated with an `Area`
from the last year, including the `Customer` information in the results.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
responseFormat.setIncludeCustomer(true);
SearchResults<MarshaledDeviceAssignment> assignments = 
  client.listDeviceAssignmentsForArea(tenantAuthentication, token, searchCriteria, responseFormat);
```

### Quering Command Invocations associated to an Area

The following example retrieves firts 100 `DeviceCommandInvocation`s associated with an `Area`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandInvocation> commandInvocations = 
  client.listCommandInvocationsForArea(tenantAuthentication, token, searchCriteria);
```

### Quering Locations associated to an Area

The following example retrieves firts 100 `DeviceLocationWithAsset`s associated with an `Area`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceLocationWithAsset> locations = client
  .listLocationsForArea(tenantAuthentication, token, searchCriteria);
```

### Quering Measurements associated to an Area

The following example retrieves firts 100 `DeviceMeasurementWithAsset`s associated with an `Area`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceMeasurementWithAsset> measurements = client
  .listMeasurementsForArea(tenantAuthentication, token, searchCriteria);
```

### Quering Command Responses associated to an Area

The following example retrieves firts 100 `DeviceCommandResponseWithAsset`s associated with an `Area`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandResponseWithAsset> commandResponses = client
  .listCommandResponsesForArea(tenantAuthentication, token, searchCriteria);
```

### Quering State Changes associated to an Area

The following example retrieves firts 100 `DeviceStateChangeWithAsset`s associated with an `Area`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 10, startDate, endDate);
SearchResults<DeviceStateChangeWithAsset> stateChanges = client
  .listStateChangesForArea(tenantAuthentication, token, searchCriteria);
```

### Retrive Area tree

The following example retrieves the tree structure of areas.

```java
List<TreeNode> tree = getClient().areaTree(tenantAuthentication);
```

## Searching Area Types

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

## Creating an Area Type

For creating an `AreaType` you need to call `createAreaType` passing the `ITenantAuthentication` object and an
`AreaTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Area Type
AreaTypeCreateRequest.Builder builder = new  AreaTypeCreateRequest.Builder(token, "my area type");
builder.withDescription("Some description");
AreaTypeCreateRequest createRequest = builder.build();
// Create the Area Type
AreaType createdAreaType = client.createAreaType(tenantAuthentication, createRequest);
```

## Updating an existing Area Type

For updating an `AreaType` you need to call `updateAreaType` passing the `ITenantAuthentication` object,
the `token` of the existing `AreaType` and an `AreaTypeCreateRequest` build like in the folling example.

```java
AreaTypeCreateRequest.Builder builder = new  AreaTypeCreateRequest.Builder(token, "my area type");
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
