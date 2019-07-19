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
