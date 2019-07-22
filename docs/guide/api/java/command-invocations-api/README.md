# :book: Java API - Command Invocation

<Seo/>

This section contains the documentation and examples of the end point `invocations` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Getting a Command Invocation by Id

The following example shows how to get a `DeviceCommandInvacation` by its Id

```java
String id = "someCommandInvocationId"; // Id of the command invocation
DeviceCommandInvocation commandInvocation = client.getDeviceCommandInvocation(tenantAuthentication, id);
```

## Getting a Command Invocation Summary by Id

The following example shows how to get a `DeviceCommandInvocationSummary` by its Id

```java
String id = "someCommandInvocationId"; // Id of the command invocation
DeviceCommandInvocationSummary commandInvocationSummary = client.getDeviceCommandInvocationSummary(tenantAuthentication, id);
```

## Listing Responses for Command Invocation

The following example shows how to list the `DeviceCommandResponse` for a `DeviceCommandInvacation`.

```java
String id = "someCommandInvocationId"; // Id of the command invocation
SearchResults<DeviceCommandResponse> results = client.listCommandResponsesForCommandInvocation(tenantAuthentication, id);
```
