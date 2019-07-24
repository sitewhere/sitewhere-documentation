# :book: Java API - Customers

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `customers` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Busqueda de Customers

For searching `Customer` you need to provide an instance of `CustomerSearchCriteria` to the method
`listCustomers` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere
REST API to list the first page of 100 results of assets.

```java
CustomerSearchCriteria searchCriteria = new CustomerSearchCriteria(1, 100);
CustomerResponseFormat responseFormat = new CustomerResponseFormat();
SearchResults<Customer> results = client.listCustomers(tenantAuthentication, searchCriteria, responseFormat);
```

El objeto `CustomerSearchCriteria` define los criterios de búsqueda para un `Customer`, la siguiente tabla
muestra las propiedades, con su tipo y desdcripción, que pueden ser usadas para filtar los resultados.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setRootOnly            | `Boolean`   | Indicates if only root elements are to be returned.            |
| setCustomerTypeToken   | `String`    | Require that customers have the given customer type.           |
| SetParentCustomerToken | `String`    | Requires that customers have the given customer as a parent.   |
| setPageNumber          | `Integer`   | Indicar el número de pagina del dataset.                       |
| setPageSize            | `Integer`   | Indicar el número de registros por página.                     |

Además se puede controlar que información es retornada en los resultados proveyendo una instancia de
`CustomerResponseFormat`. La siguiente tabla muestra las propiedades que pueden ser establecidas para controlar
el formato del resultado de la respuesta.

| Propiedad              | Tipo        | Descripción                                                    |
|:-----------------------|:------------|:---------------------------------------------------------------|
| setIncludeCustomerType | `Boolean`   | Indicates if customer type is to be returned.                  |

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

## Actualizar un existing Customer

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
