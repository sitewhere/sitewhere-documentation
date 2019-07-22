# Java API - Batch Operations

This section contains the documentation and examples of the end point `batch` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Batch Operations

For searching `BatchOperation` you need to provide an instance of `BatchOperationSearchCriteria` to the method 
`listBatchOperations` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of batch operation.

```java
BatchOperationSearchCriteria searchCriteria = new BatchOperationSearchCriteria(1, 100);
SearchResults<BatchOperation> batchOperations = client.listBatchOperations(tenantAuthentication, searchCriteria);
```

## Retrieving a Batch Operations

To retrieve an `AreaType` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Batch Operation
BatchOperation batchOperation = client().getBatchOperationByToken(tenantAuthentication, token);
```

## Creating a Batch Operation

For creating an `BatchOperation` you need to call `createBatchCommandInvocation` passing the `ITenantAuthentication` object and an
`BatchCommandInvocationRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Batch Operation
BatchCommandInvocationRequest request = BatchCommandInvocationRequest.newBuilder()
  .withToken(token)
  .withCommandToken("ping")
  .addDeviceToken("15737-UNO-7576364")
  .parameter("host", "localhost")
  .build();
  
BatchOperation batchOperation = client.createBatchCommandInvocation(tenantAuthentication, request);
```

## Listing the elements of a Batch Operation

For listing the elements of a batch operation, you need to call `listBatchOperationElements` passing the 
`ITenantAuthentication` object and the token of the `BatchOperation`.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Batch Operation
SearchResults<BatchElement> batchElements = client.listBatchOperationElements(tenantAuthentication, token);
```
