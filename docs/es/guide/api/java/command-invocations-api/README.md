# :book: Java API - Command Invocations

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `invocations` de la API de Java de SiteWhere.

Este ejemplo asume que usted obtiene su autenticación del *tenant* ya sea por

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

o por la utilización del tenant `default`.

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
