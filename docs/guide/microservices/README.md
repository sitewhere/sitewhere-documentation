<Seo/>
# Microservice Guides

Below is a list of the core SiteWhere microservices. Each service handles
a specific area of system functionality and is independent of other microservices in terms of
runtime processing, data storage and configuration. Some microservices do, however, have
dependencies on the APIs offered by other services and can not run in isolation. Below is a
high-level overview of the individual services along with links to more detailed
explanations of each service.

[[toc]]

## Global Microservices

Global microservices are used for managing aspects of a SiteWhere instance that
are not configurable at the tenant level.

### Instance Management

The instance management microservice is used to bootstrap a SiteWhere instance with
the initial Zookeeper configuration structure required by the other microservices.
All other microservices wait for the Zookeeper data to be initialized before
starting, so the instance management microservice must be present in an uninitialized
SiteWhere instance or all other microservices will fail to start.

See the [guide](instance-management.md) for more details.

### Tenant Management

The global tenant management microservice provides the core APIs and data persistence for
managing system tenants. It is initially used by the instance management microservice
to bootstrap the system with base tenants. Afterward, it is called by the Web/REST
microservice to allow the list of system tenants to be managed.

See the [guide](tenant-management.md) for more details.

### User Management

The global user management microservice provides the core APIs and data persistence used
to manage system users. It is initially used by the instance management microservice
to bootstrap the system with base users. Afterward, it is called by the Web/REST
microservice to allow the list of users to be managed.

See the [guide](user-management.md) for more details.

### Web/REST

The global Web/REST microservice includes an embedded Tomcat container which
provides infrastructure for all of the core REST services including Swagger user
interfaces. This microservice is usually connected to all other microservices in the
system so that API calls may be delegated to the microservices that implement
the functionality. For instance, querying for a device via the REST APIs
results in a gRPC request (potentially cached) to the appropriate
device management tenant engine on one of the device management microservices.

See the [guide](web-rest.md) for more details.

## Multitenant Microservices

Multitenant microservices can contain many separate tenant engines which may be
configured separately and started/stopped independently of each other.

### Asset Management

The multitenant asset management microservice provides the core APIs and data persistence
for managing assets for each tenant in a SiteWhere instance. The asset model is initially
populated based on the scripts included in the tenant template used when creating the tenant.
For instance, the "Construction" template populates assets such as heavy equipment, storage
trailers, and various types of tracking devices. If using the "Empty" template, no asset
management data will be populated.

See the [guide](asset-management.md) for more details.

### Batch Operations

The multitenant batch operations microservice provides the core APIs and data persistence
for managing batch operations for each tenant in a SiteWhere instance. The batch operations
model is empty upon tenant initialization, but may be populated by invoking APIs that
produce batch operations (such as batch command invocations).

See the [guide](batch-operations.md) for more details.

### Command Delivery

The multitenant command delivery microservice ingests data from the Kafka topic containing
pre-processed events and, for command invocations, handles command processing. This includes
using configured routing constraints and command destinations that indicate how the command
is to be encoded, which transport is to be used, and where the command is to be delivered.

See the [guide](command-delivery.md) for more details.

### Device Management

The multitenant device management microservice provides the core APIs and data persistence
for managing the device model (customers, areas, device types, devices, etc.) for each tenant
in a SiteWhere instance. The device model is initially populated based on the scripts included
in the tenant template used when creating the tenant. For instance, the "Construction" template
will populate the data model with devices appropriate for a construction site. If using the
"Empty" template, no device management data will be populated.

See the [guide](device-management.md) for more details.

### Device State

The multitenant device state microservice ingests data from the Kafka topic containing
pre-processed events and uses the event data to update device state. The device state
model persists the most recent location, measurements, and alerts for each device as
well as information about when the last interaction with the device occurred.

See the [guide](device-state.md) for more details.

### Device Registration

The multitenant device registration microservice ingests data from a Kafka topic
populated by the inbound processing microservice and acts on events where the device token
indicates a device that is not currently registered in the system. Each tenant engine has
a device registration manager which may be configured to indicate how unregistered
devices are to be treated. The device registration manager processes each inbound
event and can potentially register the device automatically before adding the event
to a re-processing topic to have it processed by the inbound processing microservice.

See the [guide](device-registration.md) for more details.

### Event Management

The multitenant event management microservice provides the core APIs and data persistence
for managing device events (locations, measurements, alerts, command invocations, etc) for
each tenant in a SiteWhere instance. The device event model is initially populated based on
the scripts included in the tenant template used when creating the tenant. For instance, the
"Construction" template populates example location, measurement and alert data relevant to
machines at a construction site. If using the "Empty" template, no event management data
will be populated.

See the [guide](event-management.md) for more details.

### Event Search

The multitenant event search microservice provides an API for searching external data sources
that contain SiteWhere event information in a non-standard format. For instance, when events
are indexed into Apache Solr via an outbound connector, there may be a need to query Solr directly
to do complex faceted queries that can not be generically supported via the SiteWhere APIs. The
tenant engines for this microservice may be configured to proxy queries to the underlying service
and return the results to the Web/REST microservice for use by external clients.

See the [guide](event-search.md) for more details.

### Event Sources

The multitenant event sources microservice hosts tenant engines that may be configured
to ingest data from many types of data producers. Some examples include consuming data
from MQTT topics, CoAP requests, direct TCP/IP socket connections, WebSockets, REST calls
via push or pull models, and many other potential sources. After events are ingested,
they are decoded into a standardized data model and pushed to a tenant-specific Kafka
topic for further processing. Kafka topics are also registered for events that can not
be parsed or are detected as duplicates by deduplication processing.

See the [guide](event-sources.md) for more details.

### Inbound Processing

The multitenant inbound processing microservice ingests data that was produced by the
event sources microservice (after decoding and deduplication has completed). This microservice
validates the inbound data by interacting with the device management microservice to
verify that the inbound event relates to a registered device. The inbound payload is enriched
with device/assignment data so the information may be used by subsequent processing steps
without the need to look it up again. If the device is not registered, the payload is
passed to the device registration microservice for additional processing. If the device becomes
registered as a result, the event is pushed onto a re-processing topic so that it may be
processed again with the newly registered device.

See the [guide](inbound-processing.md) for more details.

### Label Generation

The multitenant label generation microservice responds to API requests for label resources such
as QR codes, bar codes, or custom device labels. Each tenant engine has a symbol generation
manager that may be customized to generate specific types of output unique to the tenant.

See the [guide](label-generation.md) for more details.

### Outbound Connectors

The multitenant outbound connectors microservice ingests data from the Kafka topic containing
pre-processed events and allows the event data to be forwarded to other integration points
asynchronously. Each outbound connector is a Kafka consumer that has its own pointer into
the events topic, so the system is not blocked by connectors that occasionally process at
slower rates than the rest of the system. Connectors are available for common use cases such
as forwarding events to a well-known MQTT topic or indexing events in Apache Solr.

See the [guide](outbound-connectors.md) for more details.

### Rule Processing

The multitenant rule processing microservice ingests data from the Kafka topic containing
pre-processed events and applies conditional logic to further process the events. Tenant engines
can use embedded complex event processing (WSO2 Siddhi) to detect patterns in the event
stream and fire new events as the result.

See the [guide](rule-processing.md) for more details.

### Schedule Management

The multitenant schedule management microservice provides the core APIs and data persistence
for managing schedules for each tenant in a SiteWhere instance. The schedule model is initially
populated based on the scripts included in the tenant template used when creating the tenant.
Most tenant templates include a few example schedules. If using the "Empty" template, no schedule
management data will be populated.

See the [guide](schedule-management.md) for more details.

### Streaming Media

The multitenant streaming media microservice is intended to allow streaming storage of binary
data such as audio and video streams. This feature is under development.

See the [guide](streaming-media.md) for more details.
