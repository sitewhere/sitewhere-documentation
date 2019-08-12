# Java API - Device Events

<Seo/>

This section contains the documentation and examples of the end point `events` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Getting a Device Event by its Id

The following example shows how to get a `DeviceEvent` by its id.

```java
String id = "someDeviceEnventId";
DeviceEventWithAsset deviceEvent = client.getDeviceEventById(tenantAuthentication, id);
```

## Getting a Device Event by its Alternate Id

The following example shows how to get a `DeviceEvent` by its alternate id.

```java
String id = "someDeviceEnventId";
DeviceEventWithAsset deviceEvent = client.getDeviceEventByAlternateId(tenantAuthentication, id);
```
