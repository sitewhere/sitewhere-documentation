# Java API - Customer Management

This section contains the documentation and examples of the end point `customers` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Customers

For searching `Customer` you need to provide an instance of `CustomerSearchCriteria` to the method
`listCustomers` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of assets.

```java
CustomerSearchCriteria searchCriteria = new CustomerSearchCriteria(1, 100);
CustomerResponseFormat responseFormat = new CustomerResponseFormat();
SearchResults<Customer> results = client.listCustomers(tenantAuthentication, searchCriteria, responseFormat);
```

`CustomerSearchCriteria` defines the search criteria for quering `Customer`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setRootOnly            | Boolean     | Indicates if only root elements are to be returned.            |
| setCustomerTypeToken   | String      | Require that customers have the given customer type.           |
| SetParentCustomerToken | String      | Requires that customers have the given customer as a parent.   |
| setPageNumber          | Integer     | Get offset from beginning of dataset.                          |
| setPageSize            | Integer     | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `CustomerResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property               | Type        | Description                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeCustomerType | Boolean     | Indicates if customer type is to be returned.                  |

## Creating an Customer

For creating an `Customer` you need to call `createCustomer` passing the `ITenantAuthentication` object and an
`CustomerCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
String customerTypeToken = "construction";
String parentToken = "acme";
String name = "Test Customer";
CustomerCreateRequest.Builder builder = new CustomerCreateRequest.Builder(customerTypeToken, parentToken, token, name);
builder.withDescription("Some customer description");
// Build the Create Request
CustomerCreateRequest createRequest = builder.build();
// Create the Customer
Customer createdCustomer = client.createCustomer(tenantAuthentication, createRequest);
```

## Updating an existing Customer

For updating an `Customer` you need to call `updateCustomer` passing the `ITenantAuthentication` object,
the `token` of the existing `Customer` and an `CustomerCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
String customerTypeToken = "construction";
String parentToken = "acme";
String name = "Test Customer";
CustomerCreateRequest.Builder builder = new CustomerCreateRequest.Builder(customerTypeToken, parentToken, token, name);
builder.withDescription("Some updated customer description");
// Build the Create Request
CustomerCreateRequest updateRequest = builder.build();
// Update the Customer
Customer updatedCustomer = client.updateCustomer(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Customer

For deleting an existing `Customer` you need to call `deleteCustomer` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the asset you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Customer deletedCustomer = client.deleteCustomer(tenantAuthentication, token);
```

## Quering information associated to a Customer

### Quering Alerts associated to a Customer

The following example retrieves firts 100 `DeviceAlert`s associated with an `Customer`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceAlertWithAsset> alerts = client.listAlertsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Quering Assignments associated to a Customer

The following example retrieves firts 100 `DeviceAssignment`s associated with an `Customer`
from the last year, including the `Customer` information in the results.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
DeviceAssignmentSearchCriteria searchCriteria = new DeviceAssignmentSearchCriteria(1, 100);
DeviceAssignmentResponseFormat responseFormat = new DeviceAssignmentResponseFormat();
responseFormat.setIncludeCustomer(true);
SearchResults<MarshaledDeviceAssignment> assignments = 
  client.listDeviceAssignmentsForCustomer(tenantAuthentication, token, searchCriteria, responseFormat);
```

### Quering Command Invocations associated to a Customer

The following example retrieves firts 100 `DeviceCommandInvocation`s associated with an `Customer`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandInvocation> commandInvocations = 
  client.listCommandInvocationsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Quering Locations associated to a Customer

The following example retrieves firts 100 `DeviceLocationWithAsset`s associated with an `Customer`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceLocationWithAsset> locations = client
  .listLocationsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Quering Measurements associated to a Customer

The following example retrieves firts 100 `DeviceMeasurementWithAsset`s associated with an `Customer`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceMeasurementWithAsset> measurements = client
  .listMeasurementsForCustomer(tenantAuthentication, token, searchCriteria);
```

### Quering Command Responses associated to a Customer

The following example retrieves firts 100 `DeviceCommandResponseWithAsset`s associated with an `Customer`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 100, startDate, endDate);
SearchResults<DeviceCommandResponseWithAsset> commandResponses = client
  .listCommandResponsesForCustomer(tenantAuthentication, token, searchCriteria);
```

### Quering State Changes associated to a Customer

The following example retrieves firts 100 `DeviceStateChangeWithAsset`s associated with an `Customer`
from the last year.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer
Calendar cal = Calendar.getInstance();

cal.setTime(new Date());
cal.add(Calendar.YEAR, -1);

Date startDate = cal.getTime();
Date endDate = new Date();

DateRangeSearchCriteria searchCriteria = new DateRangeSearchCriteria(1, 10, startDate, endDate);
SearchResults<DeviceStateChangeWithAsset> stateChanges = client
  .listStateChangesForCustomer(tenantAuthentication, token, searchCriteria);
```

### Retrive Customer tree

The following example retrieves the tree structure of customers.

```java
List<TreeNode> tree = client.customerTree(tenantAuthentication);
```
