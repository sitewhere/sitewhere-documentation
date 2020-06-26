# Java API - Tenants

<Seo/>

This section contains the documentation and examples of the end point `tenants` of SiteWhere Java API.

## Listing Tenants

```java
TenantSearchCriteria searchCriteria = new TenantSearchCriteria(0, 10);
SearchResults<Tenant> tenants = client.listTenants(searchCriteria);
```

## Creating a Tenant

```java
String name = "test tenant";
String authenticationToken = "tenant01";
String logoUrl = "https://s3.amazonaws.com/sitewhere-demo/broken-link.png";
String tenantTemplateId = "mongodb";
String datasetTemplateId = "construction";
TenantCreateRequest.Builder builder = new TenantCreateRequest.Builder(token, name, authenticationToken, logoUrl, tenantTemplateId,
  datasetTemplateId);

builder.withAuthorizedUserId("admin");

// Create a TenantCreateRequest
TenantCreateRequest createRequest = builder.build();
// Create the Tenant
Tenant createdTenant = client.createTenant(createRequest);
```

## Updating a Tenant

```java
// Create a TenantCreateRequest
String name = "test tenant";
String authenticationToken = "tenant01";
String logoUrl = "https://s3.amazonaws.com/sitewhere-demo/broken-link.png";
String tenantTemplateId = null;
String datasetTemplateId = null;
TenantCreateRequest.Builder builder = new TenantCreateRequest.Builder(token, name, authenticationToken, logoUrl, tenantTemplateId,
  datasetTemplateId);
builder.withAuthorizedUserId("admin");
// Create a TenantCreateRequest
TenantCreateRequest updateRequest = builder.build();
// Update the Tenant
Tenant updatedTenant = client.updateTenant(updateRequest);
```

## Deleting a Tenant

```java
Tenant deletedTenant = client.deleteTenant("e2ce4ffe-2d9c-4103-b519-1e07c58a2886");
```
