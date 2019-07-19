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
