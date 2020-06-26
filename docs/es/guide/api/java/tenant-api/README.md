# Java API - Tenants

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `tenants` de la API de Java de SiteWhere.

## Listar Tenants

Utilice el siguiente ejemplo para listar los `tenant`.

```java
TenantSearchCriteria searchCriteria = new TenantSearchCriteria(0, 10);
SearchResults<Tenant> tenants = client.listTenants(searchCriteria);
```

## Crear un Tenant

El siguiente ejemplo muestra cómo crear un `tenant`.

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

El siguiente ejemplo muestra cómo actualizar un `tenant`.

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
