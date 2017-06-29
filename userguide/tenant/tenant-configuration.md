---
title: Tenant Configuration
layout: default
sidebar: sidebar.html
prevLink: userguide/global-configuration.html
prevTitle: Global Configuration
nextLink: userguide/tenant/device-communication.html
nextTitle: Tenant Device Communication
---

# {{page.title}}
Each tenant has its own configuration file which inherits from the global configuration
via Spring context inhertance. This allows globally defined beans to be accessed by the
individial tenant configurations. The Spring XML configuration file for a tenant is
located in **conf/sitewhere/tenants/xxx/sitewhere-tenant.xml** (where **xxx** is the 
tenant id). Each tenant has its own device data and configurable processing pipeline. 
The tenant configuration file uses Spring beans and a custom schema like the global 
configuration, but with a different schema targeted at tenant-specific features:

**NOTE: Tenant configuration changed in SiteWhere 1.5.0 to use a separate folder per tenant. Previous versions used a single file per tenant with all resources being shared.**

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context" xmlns:sw="http://www.sitewhere.com/schema/sitewhere/ce/tenant"
	xmlns:global="http://www.sitewhere.com/schema/sitewhere/ce"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
		http://www.springframework.org/schema/security http://www.springframework.org/schema/security/spring-security-3.0.xsd
		http://www.sitewhere.com/schema/sitewhere/ce http://www.sitewhere.org/schema/sitewhere/ce/1.3.0/sitewhere.xsd
		http://www.sitewhere.com/schema/sitewhere/ce/tenant http://www.sitewhere.org/schema/sitewhere/ce/1.3.0/sitewhere-tenant.xsd">
              
	<!-- Load property values for substitution -->
	<context:property-placeholder
		location="file:${catalina.home}/conf/sitewhere/${tenant.id}-tenant.properties"
		ignore-resource-not-found="true"/>
      
	<!-- ######################## -->
	<!-- # TENANT CONFIGURATION # -->
	<!-- ######################## -->
	<sw:tenant-configuration>
{% endhighlight %}

## Tenant Datastores
Tenant datastores extend the features of the global datastore with implementations 
of the tenant-specific object models. These include device management, asset management,
and schedule management. Users and tenants are managed at the global level.

**Tenant datastores must correspond to the type configured for the global datastore. It is not possible to use MongoDB as the global datastore and HBase for tenant datastores or vice-versa.**

### MongoDB Tenant Datastore
To use MongoDB as the tenant datastore, edit the tenant configuration **tenant-datastore** section
and use the **mongo-tenant-datastore** element as shown below:

{% highlight xml %}
<!-- ########################### -->
<!-- # DATASTORE CONFIGURATION # -->
<!-- ########################### -->
<sw:tenant-datastore>
		
	<!-- Default MongoDB Datastore -->
	<sw:mongo-tenant-datastore useBulkEventInserts="true" bulkInsertMaxChunkSize="1000"/>
		
	<!-- Improves performance by using Hazelcast for distributed caching -->
	<sw:hazelcast-cache/>
			
	<!-- Initializes data model with sample data if datastore is empty -->
	<sw:default-device-model-initializer/>
	<sw:default-asset-model-initializer/>
	<sw:default-schedule-model-initializer/>

</sw:tenant-datastore>
{% endhighlight %}

The following attributes may be specified for the **mongo-tenant-datastore** element.
      
| Attribute               | Required | Description                                      
|-------------------------|----------|--------------------------------------------------
| useBulkEventInserts     | optional | Indicates whether the bulk loading APIs should be used to increase event write performance. Defaults to *false*.                         
| bulkInsertMaxChunkSize  | optional | Specifies the max number of events to queue before sending a batch via the bulk APIs. Defaults to *1000*.

### MongoDB/InfluxDB Hybrid Tenant Datastore
This tenant datastore option uses MongoDB for device management data, but stores event data
in an [InfluxDB](https://influxdata.com/) time series database. Using this approach combines
the ease of use provided by MongoDB with the scalable time series processing that InfluxDB
is designed to provide. To use the hybrid MongoDB/InfluxDB option for the tenant datastore, 
edit the tenant configuration **tenant-datastore** section and use the 
**mongo-influxdb-tenant-datastore** element as shown below:

{% highlight xml %}
<!-- ########################### -->
<!-- # DATASTORE CONFIGURATION # -->
<!-- ########################### -->
<sw:tenant-datastore>
		
	<!-- Hybrid MongoDB/InfluxDB Datastore -->
	<sw:mongo-influxdb-tenant-datastore connectUrl="http://localhost:8086"
		logLevel="basic" enableBatch="true" batchChunkSize="1000" batchIntervalMs="100"/>
		
	<!-- Improves performance by using Hazelcast for distributed caching -->
	<sw:hazelcast-cache/>
			
	<!-- Initializes data model with sample data if datastore is empty -->
	<sw:default-device-model-initializer/>
	<sw:default-asset-model-initializer/>
	<sw:default-schedule-model-initializer/>

</sw:tenant-datastore>
{% endhighlight %}

The following attributes may be specified for the **mongo-influxdb-tenant-datastore** element.
      
| Attribute               | Required | Description                                      
|-------------------------|----------|--------------------------------------------------
| connectUrl              | optional | URL used to connect to the InfluxDB instance. Defaults to *http://localhost:8086*.
| username                | optional | Username used to connect to InfluxDB. Defaults to *root*.
| password                | optional | Password used to connect to InfluxDB. Defaults to *root*.
| database                | optional | Database name used to connect to InfluxDB. Defaults to *sitewhere*.
| retention               | optional | Retention period for SiteWhere events. Defaults to *default*.
| enableBatch             | optional | Enables batch delivery of events from SiteWhere to InfluxDB. Defaults to *true*.
| batchChunkSize          | optional | Maximum number of events to cache before flushing. Defaults to *2000*.
| batchIntervalMs         | optional | Maximum number of milliseconds to wait before flushing. Defaults to *100*.
| logLevel                | optional | Indicates the log level for InfluxDB operations. Choices are *none*, *basic*, *headers*, and *full*. Default is *none*                         

### HBase Tenant Datastore
To use HBase as the tenant datastore, edit the tenant configuration **tenant-datastore** section 
and use the **hbase-tenant-datastore** element as shown below:

{% highlight xml %}
<!-- ########################### -->
<!-- # DATASTORE CONFIGURATION # -->
<!-- ########################### -->
<sw:tenant-datastore>
		
	<!-- Default HBase Datastore -->
	<sw:hbase-tenant-datastore/>
		
	<!-- Improves performance by using Hazelcast for distributed caching -->
	<sw:hazelcast-cache/>
			
	<!-- Initializes data model with sample data if datastore is empty -->
	<sw:default-device-model-initializer/>
	<sw:default-asset-model-initializer/>
	<sw:default-schedule-model-initializer/>

</sw:tenant-datastore>
{% endhighlight %}

## Cache Providers
Many elements of the device data model do not change often and can benefit from a caching implementation.
SiteWhere offers a service provider interface 
[IDeviceManagementCacheProvider](http://docs.sitewhere.org/current/apidocs/com/sitewhere/spi/device/IDeviceManagementCacheProvider.html)
which may be implemented to provide caching capabilities that use an external cache provider.
Note that removing the cache will result in noticeably slower performance since the underlying
service provider implementations will load all data from the datastore.

### Hazelcast Cache Provider
SiteWhere offers a default device management cache implementation based on [Hazelcast](http://hazelcast.com/)
which can be configured as shown below:

{% highlight xml %}
<sw:tenant-datastore>
   
	<!-- Default MongoDB Datastore -->
	<sw:mongo-tenant-datastore useBulkEventInserts="true" bulkInsertMaxChunkSize="1000"/>

		<!-- Improves performance by using Hazelcast for distributed caching -->
		<sw:hazelcast-cache/>
{% endhighlight %}

The Hazelcast cache works well in standalone mode as well as in clustered environments since the cache
contents are synchronized across the Hazelcast cluster.

### Ehcache Cache Provider
SiteWhere offers a device management cache implementation based on [Ehcache](http://ehcache.org/)
which can be configured as shown below:

{% highlight xml %}
<sw:tenant-datastore>
   
	<!-- Default MongoDB Datastore -->
	<sw:mongo-tenant-datastore useBulkEventInserts="true" bulkInsertMaxChunkSize="1000"/>

		<!-- Improves performance by using EHCache to store device management entities -->
		<sw:ehcache-device-management-cache/>
{% endhighlight %}

The following attributes may be specified for the **ehcache-device-management-cache** element.
      
| Attribute                          | Required | Description                                      
|------------------------------------|----------|--------------------------------
| siteCacheMaxEntries                | optional | Max number of site entries in cache. performance.
| deviceSpecificationCacheMaxEntries | optional | Max number of specification entries in cache.
| deviceCacheMaxEntries              | optional | Max number of device entries in cache.
| deviceAssignmentCacheMaxEntries    | optional | Max number of assignment entries in cache.
| siteCacheTtl                       | optional | Time to live for site entries.
| deviceSpecificationCacheTtl        | optional | Time to live for specification entries.
| deviceCacheTtl                     | optional | Time to live for device entries.
| deviceAssignmentCacheTtl           | optional | Time to live for assignment entries.

**Note that the Ehcache implementation should not be used in clustered environments. There will be an instance of the cache on each SiteWhere instance and the caches will not be synchronized.**

## Device Communication
Each tenant may have its own requirements for device connectivity, so SiteWhere provides a capable
and extensible device communication subsystem that can be customized on a per-tenant basis. Data
can be ingested from many sources including MQTT topics, RabbitMQ queues via AMQP, WebSockets, direct
socket connections and many other options. Commands can be sent back to devices using command 
destinations including MQTT topics, Twilio SMS, and many other options. See the device communication 
[documentation](device-communication.html) for more
information.

## Event Processing
Each tenant may also have its own requirements for how device data is to be processed and integrated
with other technologies. The event processing subsystem allows aspects of inbound event processing to 
be customized including threading/queueing of inbound events and custom processing steps on inbound
data (e.g. event storage, registration, metrics, etc). It also allows customization of outbound
event processing (after events have been persisted) including threading/queueing and custom 
outbound processor logic (e.g. broadcasting via Hazelcast, integration with Azure EventHub, indexing
in Apache Solr, etc). See the event processing [documentation](event-processing.html) 
for more information.

## Asset Management
SiteWhere includes an asset management subsystem that provides a standardized way to reference assets from
many different sources. SiteWhere assets reference items in the real world including people (person assets),
places (location assets) and things (hardware assets). There is also a class of assets called device assets
that are hardware assets which can be used in device specifications. 

Assets are used to specify information about device specifications such as the name, photo, and properties 
that make the asset unique. They are also used in device assignments to indicate a physical object that is
associated with a device such as a person associated with a badge or the car associated with a tracking device.

Starting with SiteWhere 1.1.0, all assets are stored in the datastore by default. Previous versions required
them to be stored in XML files or external asset management systems. In the administrative console, new 
asset categories and assets can be added. When the system starts, each of the asset categories is loaded
as an asset module. Other assets can still be added via the filesystem or external sources as detailed below.

### Filesystem Asset Modules
Assets can be loaded from the filesystem using files containing XML data. For an example of the data
format take a look at the files in the **conf/sitewhere/assets/** directory. The available modules 
include **filesystem-device-asset-module**, **filesystem-hardware-asset-module**,
**filesystem-person-asset-module**, and **filesystem-location-asset-module**. Each module
must have a unique id. Filesystem asset modules load all assets at server startup, but can be reloaded
by calling the **refresh** method in the asset REST services.

{% highlight xml %}
<sw:asset-management>

	<sw:filesystem-device-asset-module filename="my-devices.xml" 
		moduleId="my-devices" moduleName="My Devices"/>

</sw:asset-management>
{% endhighlight %}
      
The following attributes may be specified for the filesystem asset module elements.
      
| Attribute                          | Required | Description                                      
|------------------------------------|----------|--------------------------------
| filename                           | optional | Name of XML file relative to the assets configuration directory.
| moduleId                           | optional | Unique module id.
| moduleName                         | optional | Name shown in use interface for module.

### WSO2 Identity Server Asset Module
SiteWhere can load and reference assets from [WSO2 Identity Server](http://wso2.com/products/identity-server/)
allowing asset data to be stored externally. WSO2 Identity Server allows information about people to be
stored in many formats including LDAP and many databases. It also allows data to be retrieved in many
common formats. SiteWhere uses SCIM to load the list of users from the server. The current implementation
loads all users at startup, so when adding users, the **refresh** method should be called in the asset REST
services to pick up the changes. An example WSO2 asset module configuration is shown below:

{% highlight xml %}
<sw:wso2-identity-asset-module moduleId="wso2" scimUsersUrl="https://wso2is:9443/wso2/scim/Users" 
	username="admin" password="admin" ignoreBadCertificate="true"/>
{% endhighlight %}
   
The following attributes may be specified for the **wso2-identity-asset-module** element.
      
| Attribute                        | Required | Description                                      
|----------------------------------|----------|--------------------------------
| scimUsersUrl                     | required | URL for accessing SCIM users list.
| username                         | required | Admin username for server authentication.
| password                         | required | Admin password for server authentication.
| ignoreBadCertificate             | required | Allows connection via SSL to the server even if the certificate is not valid. Only use this in development envionments.
