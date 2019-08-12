# Java API - Schedules

<Seo/>

This section contains the documentation and examples of the end point `schedules` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Schedules

For searching `Schedule` you need to provide an instance of `ScheduleSearchCriteria` and an instance of `ScheduleResponseFormat` to the method
`listSchedules` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of device groups.

```java
ScheduleSearchCriteria searchCriteria = new ScheduleSearchCriteria(1, 100);
ScheduleResponseFormat responseFormat = new ScheduleResponseFormat();
SearchResults<Schedule> results = client.listSchedules(tenantAuthentication, searchCriteria, responseFormat);
```

`ScheduleSearchCriteria` defines the search criteria for quering `Schedule`, the following table shows the properties, with
thier type and description, that can be set to filter the results.

| Property      | Type      | Description                             |
| :------------ | :-------- | :-------------------------------------- |
| setPageNumber | `Integer` | Get offset from beginning of dataset.   |
| setPageSize   | `Integer` | Get number of records per page of data. |

## Retrieving an Schedule

To retrieve an `Schedule` by its token use the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
Schedule schedule = client.getScheduleByToken(token);
```

## Creating an Schedule

For creating an `Schedule` you need to call `createSchedule` passing the `ITenantAuthentication` object and an
`ScheduleCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
String name = "test schedule";
ScheduleCreateRequest.Builder builder = new ScheduleCreateRequest.Builder(token, name);

builder.withStartDate(new Date());
builder.withSimpleSchedule(10000l, 1);
// Build the Create Request
ScheduleCreateRequest createRequest = builder.build();
// Create the Schedule
Schedule createdSchedule = client.createSchedule(tenantAuthentication, createRequest);
```

## Updating an existing Schedule

For updating an `Schedule` you need to call `updateSchedule` passing the `ITenantAuthentication` object,
the `token` of the existing `Schedule` and an `ScheduleCreateRequest` build like in the folling example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
String name = "test schedule";
ScheduleCreateRequest.Builder builder = new ScheduleCreateRequest.Builder(token, name);

builder.withStartDate(new Date());
builder.withSimpleSchedule(10000l, 2);
// Build the Create Request
ScheduleCreateRequest updateRequest = builder.build();
// Update the Schedule
Schedule updatedSchedule = client.updateSchedule(tenantAuthentication, token, updateRequest);
```

## Deleting an existing Schedule

For deleting an existing `Schedule` you need to call `deleteSchedule` method of `com.sitewhere.spi.ISiteWhereClient`
providing the `token` of the schedule you want to delete, like the following example.

```java
String token = "e2ce4ffe-2d9c-4103-b519-1e07c58a2886"; // GUID for the Schedule
Schedule deletedSchedule = client.deleteSchedule(tenantAuthentication, token);
```
