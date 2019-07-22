# :book: Java API - Customer Type Management

<Seo/>

This section contains the documentation and examples of the end point `customertypes` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Customer Types

For searching `Customer Types` you need to provide an instance of `CustomerTypeSearchCriteria`  to the method 
`listCustomerTypes` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to 
list the first page of 100 results of customer types.

```java
CustomerTypeSearchCriteria searchCriteria = new CustomerTypeSearchCriteria(1, 100);
CustomerTypeResponseFormat responseFormat = new CustomerTypeResponseFormat();
SearchResults<CustomerType> results = client.listCustomerTypes(tenantAuthentication, searchCriteria, responseFormat);
```

`CustomerTypeSearchCriteria` defines the search criteria for quering `CustomerType`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type        | Description                                                    |
|:-----------------------------|:------------|:---------------------------------------------------------------|
| setPageNumber                | `Integer`   | Get offset from beginning of dataset.                          |
| setPageSize                  | `Integer`   | Get number of records per page of data.                        |

Also you can control what information is return in the results by providing an instance of `CustomerResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property                         | Type        | Description                                                    |
|:---------------------------------|:------------|:---------------------------------------------------------------|
| setIncludeContainedCustomerTypes | `Boolean`   | Indicates if contained customer types are to be returned.      |

## Creating an Customer Type

For creating an `CustomerType` you need to call `createCustomerType` passing the `ITenantAuthentication` object and an
`CustomerTypeCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer Type
CustomerTypeCreateRequest.Builder builder = new  CustomerTypeCreateRequest.Builder(token, "my customer type");
builder.withDescription("Some description");
CustomerTypeCreateRequest createRequest = builder.build();
// Create the Customer Type
CustomerType createdCustomerType = client.createCustomerType(tenantAuthentication, createRequest);
```

## Updating an existing Customer Type

For updating an `CustomerType` you need to call `updateCustomerType` passing the `ITenantAuthentication` object,
the `token` of the existing `CustomerType` and an `CustomerTypeCreateRequest` build like in the folling example.

```java
CustomerTypeCreateRequest.Builder builder = new  CustomerTypeCreateRequest.Builder(token, "my customer type");
builder.withDescription("Some description");
CustomerTypeCreateRequest updateRequest = builder.build();
// Update the Customer Type
CustomerType updatedCustomer = client.updateCustomerType(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Customer Type

For deleting an existing `CustomerType` you need to call `deleteCustomerType` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the customer type you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Customer Type
CustomerType deletedCustomerType = client.deleteCustomerType(tenantAuthentication, token);
```
