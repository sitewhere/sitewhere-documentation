# :book: Java API - Device States

<Seo/>

This section contains the documentation and examples of the end point `devicestates` of SiteWhere Java API.

This examples assume that you get your tenant authentication either by

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.defaultTenant();
```

or by using other that the `default` tenant.

```java
ITenantAuthentication tenantAuthentication = SiteWhereClient.forTenant("token", "auth");
```

## Searching for Device States

For searching `DeviceState` you need to provide an instance of `DeviceStateSearchCriteria` and an instance of `DeviceStateResponseFormat` to the method 
`listDeviceStates` of `com.sitewhere.spi.ISiteWhereClient`. The example below shows how you can query SiteWhere REST API to list the first
page of 100 results of device groups.

```java
DeviceStateSearchCriteria searchCriteria = new DeviceStateSearchCriteria(1, 100);
SearchResults<DeviceState> results = client.listDeviceStates(tenantAuthentication, searchCriteria);
```

`DeviceStateSearchCriteria` defines the search criteria for quering `DeviceState`, the following table shows the properties, with 
thier type and description, that can be set to filter the results.

| Property                     | Type           | Description                                                                         |
|:-----------------------------|:---------------|:------------------------------------------------------------------------------------|
| setLastInteractionDateBefore | `Date`         | If set, will limit results to those with a last interaction date before this value. |
| setDeviceTypeTokens          | `List<String>` | List of device types to be included in results.                                     |
| setCustomerTokens            | `List<String>` | List of customers to be included in results.                                        |
| setAreaTokens                | `List<String>` | List of areas to be included in results.                                            |
| setAssetTokens               | `List<String>` | List of assets to be included in results.                                           |
| setPageNumber                | `Integer`      | Get offset from beginning of dataset.                                               |
| setPageSize                  | `Integer`      | Get number of records per page of data.                                             |

Also you can control what information is return in the results by providing an instance of `DeviceStateResponseFormat`.
The following table shows the properties that can be set to control the result format of the response.

| Property                   | Type      | Description                                                    |
|:---------------------------|:----------|:---------------------------------------------------------------|
| setIncludeArea             | `Boolean` | Indicates if area is included.                                 |
| setIncludeAsset            | `Boolean` | Indicates if asset is included.                                |
| setIncludeCustomer         | `Boolean` | Indicates if customer is included.                             |
| setIncludeDevice           | `Boolean` | Indicates if device is included.                               |
| setIncludeDeviceAssignment | `Boolean` | Indicates if device assignment is included.                    |
| setIncludeDeviceType       | `Boolean` | Indicates if device type is included.                          |
| setIncludeEventDetails     | `Boolean` | Indicates if event details is included.                        |
