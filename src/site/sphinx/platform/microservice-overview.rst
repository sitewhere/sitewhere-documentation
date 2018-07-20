
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
######################
Microservices Overview
######################
The transition from a monilithic architecture to one based on microservices is
a key feature of the SiteWhere 2.0 architecture. Each microservice handles a 
specific subset of functionality that is clearly defined and delineated from
the work done by other microservices. This allows parts of the system to be scaled
independently while allowing some pieces to be left out completely if not used. The 
microservices approach also decouples the code so that it is easier to understand
and manage from a development perspective. The diagram below shows the microservices
and the general flow of data between them:

Infrastructure Components
=========================
SiteWhere microservices make a few assumptions about the underlying infrastructure
that they are running on. At a minimum, instances of Apache ZooKeeper 
and Apache Kafka must be available in order for the system to function properly. 
By default, SiteWhere also produces distributed tracing data via the 
`open tracing <http://opentracing.io/>`_ standard for runtime performance analysis. 
A server backend that supports the API may be configured to store and analyze the data.

Infrastructure Recipes
----------------------
When launching from Docker Compose or Swarm, there are 
`recipes <https://github.com/sitewhere/sitewhere-recipes>`_ available that 
may be used to provide the expected infrastructure components. The recipes include 
the required components such as ZooKeeper and Kafka as well as other supporting components
such as `Jaeger <https://github.com/jaegertracing/jaeger>`_ for tracing support 
and `ZooNavigator <https://github.com/elkozmon/zoonavigator>`_ for introspecting
the ZooKeeper store.

Production Deployments
----------------------
In a production scenario, ZooKeeper and Kafka should be configured outside 
of Docker and properly scaled to account for fault tolerance and availability. 
The SiteWhere team will offer more details about best practices as we approach 
the 2.0 GA release.

Microservice Deployment Model
=============================
Each microservice is packaged as a Spring Boot application and deployed as an
independent Docker image. Since each microservice runs in a separate Docker container,
each accounts for a separate Java process as opposed to all services running within 
the same process in 1.x.

System Resource Usage
---------------------
SiteWhere 2.0 currently uses around 20 microservices, so the underlying hardware should be 
able to support running 20 concurrent Java processes, each with a footprint of around
750MB. As such, the hardware requirements for 2.0 are higher than 1.x, though most
modern desktop computers can easily run a complete system. The intent for SiteWhere 2.0
is to make use of orchestration engines such as Docker Swarm to distribute the microservices
across a cluster of machines, which lowers the hardware requirements for a single node.
In the end, though SiteWhere 2.0 has a larger footprint, the architecture supports
much more scalable systems that can leverage large clusters of hardware and scale dynamically.

Inter-Microservice Connectivity
===============================
Microservices do not operate in a vacuum and, as such, a high-performance RPC mechanism
is needed to allow the services to communicate. SiteWhere leverages `gRPC <https://grpc.io/>`_
for moving data between microservices and offering performant binary APIs to external consumers. 
All API calls and data entities have been made available to gRPC via the Google
Protocol Buffers data format. Using gRPC rather than REST for communication can increase API
performance by more than 10x.

API Demultiplexors
------------------
Connections between microservices are not always one-to-one. For instance, if a SiteWhere instance
has a single Web/REST microservice and three instances of the Device Management microservice, the
REST microservice should be able to demultiplex calls across all three Device Management instances
for scalability and fault tolerance. SiteWhere 2.0 introduces the concept of an API demulitplexor 
which is able to introspect the current instance topology and add/remove connections to other 
microservices dynamically. As the number of services is scaled up/down SiteWhere automatically 
connects/disconnects the piping between them. All inter-microservice communication happens via 
this mechanism.

Distributed Cache Support
=========================
Even with the high performance of gRPC, requesting commonly used data repeatedly across
the network connection has a significant cost. Master information for entites such as devices,
assignments, and assets is rarely updated and may be cached within an in-memory data grid
rather than incurring the cost of reading from the database. SiteWhere 2.0 uses a Hazelcast in-memory
grid to provide a distributed cache of a subset of master data. This cache is queried before
falling back to a database request.

List of Core Microservices
==========================
Below is a list of the core microservices included in SiteWhere 2.0. Each service handles
a specific area of system functionality and is independent of other microservices in terms of
runtime processing, data storage and configuration. Some microservices do, however, have
dependencies on the APIs offered by other services and can not run in isolation. Below is a 
high-level overview of the individual services along with links to more detailed
explanations of each service.

Instance Management
-------------------
The instance management microservice is used to bootstrap a SiteWhere instance with
the initial Zookeeper configuration structure required by the other microservices.
All other microservices wait for the Zookeeper data to be initialized before 
starting, so the instance management microservice must be present in an uninitialized
SiteWhere instance or all other microservices will fail to start.

See the instance management `guide <../userguide/microservices/instance-management.html>`_ 
for more details.

User Management
---------------
The global user management microservice provides the core APIs and data persistence used
to manage system users. It is initially used by the instance management microservice
to bootstrap the system with base users. Afterward, it is called by the Web/REST
microservice to allow the list of users to be managed.

Tenant Management
-----------------
The global tenant management microservice provides the core APIs and data persistence for
managing system tenants. It is initially used by the instance management microservice
to bootstrap the system with base tenants. Afterward, it is called by the Web/REST 
microservice to allow the list of system tenants to be managed.

When a tenant is added/updated/deleted, the tenant data is pushed to a Kafka topic
so that other interested listeners can act on the update. By default, a listener is
registered to boostrap newly created tenants by adding the expected tenant configuration
hierarchy in ZooKeeper. This process includes copying the per-microservice XML configuration
files from the tenant template into ZooKeeper, then executing the list of initialization
scripts included with the template. Once this process is complete, the tenant configuration
is marked as boostrapped so that other microservices can react to the added tenant. For 
instance, the device management microservice will notice that a new tenant has been configured
and will wait for the bootstrapped indicator, then will load the device-management.xml 
configuration file to initialize a new device management tenant engine for the added tenant.
Any time that files within a tenant are changed, the changes are broadcast to tenant engines
running on all other microservices so they can react to the changes. In the previous example,
if multiple device management microservices are running (scale > 1), each microservice will
detect the updates and reload the tenant engines to reflect the updates.

Web/REST
--------
The global Web/REST microservice includes a Tomcat container that hosts the administrative web 
application and provides infrastructure for all of the core REST services (including Swagger 
user interfaces). This microservice is usually connected to all other microservices in the 
system so that API calls may be delegated to the microservices that implement 
the functionality. For instance, querying for a device via the REST APIs
results in a gRPC request (potentially cached via Hazelcast) to the appropriate 
device management tenant engine on one of the device management microservices.

There may be cases where the microservice required to complete a request is not available.
In this case, a *ServiceNotAvailable* exception is thrown and passed back as an error to
the user/application that made the request. Using this approach, areas of the system may
be shut down to conserve resources while not affecting the functionality if the system as
a whole. Callers to the REST services should be prepared to handle cases where the 
subsystem they are calling may be shut down.

Device Management
-----------------
The multitenant device management microservice provides the core APIs and data persistence
for managing the device model (sites, specifications, devices, groups, etc.) for each tenant
in a SiteWhere instance. The device model is initially populated based on the scripts included
in the tenant template used when creating the tenant. For instance, the "Construction" template
will populate the data model with devices appropriate for a construction site. If using the
"Empty" template, no device management data will be populated.

Event Management
----------------
The multitenant event management microservice provides the core APIs and data persistence
for managing device events (locations, measurements, alerts, command invocations, etc) for 
each tenant in a SiteWhere instance. The device event model is initially populated based on 
the scripts included in the tenant template used when creating the tenant. For instance, the
"Construction" template populates example location, measurement and alert data relevant to
machines at a construction site. If using the "Empty" template, no event management data 
will be populated.

Asset Management
----------------
The multitenant asset management microservice provides the core APIs and data persistence
for managing assets for each tenant in a SiteWhere instance. The asset model is initially 
populated based on the scripts included in the tenant template used when creating the tenant. 
For instance, the "Construction" template populates assets such as heavy equipment, storage
trailers, and various types of tracking devices. If using the "Empty" template, no asset 
management data will be populated.

Schedule Management
-------------------
The multitenant schedule management microservice provides the core APIs and data persistence
for managing schedules for each tenant in a SiteWhere instance. The schedule model is initially 
populated based on the scripts included in the tenant template used when creating the tenant. 
Most tenant templates include a few example schedules. If using the "Empty" template, no schedule 
management data will be populated.

Batch Operations
----------------
The multitenant batch operations microservice provides the core APIs and data persistence
for managing batch operations for each tenant in a SiteWhere instance. The batch operations
model is empty upon tenant initialization, but may be populated by invoking APIs that
produce batch operations (such as batch command invocations).

Each batch operations tenant engine also contains a batch operation manager that may
be configured to process batch operations that are created via the APIs. The batch operation
manager will turn the batch request into many smaller operations to achieve the batch goal.

**For the 2.0.ea1 release, the batch operation manager is disabled due to refactoring of 
the original 1.x version to use the new Kafka pipeline as well as managing batch operation
managers running on scaled microservices where contention may be an issue.**

Event Sources
-------------
The multitenant event sources microservice hosts tenant engines that may be configured
to ingest data from many types of data producers. Some examples include consuming data
from MQTT topics, CoAP requests, direct TCP/IP socket connections, WebSockets, REST calls
via push or pull models, and many other potential sources. After events are ingested, 
they are decoded into a standardized data model and pushed to a tenant-specific Kafka
topic for further processing. Kafka topics are also registered for events that can not
be parsed or are detected as duplicates by deduplication processing.

Inbound Processing
------------------
The multitenant inbound processing microservice ingests data that was produced by the
event sources microservice (after decoding and deduplication has completed). This microservice
validates the inbound data by interacting with the device management microservice to 
verify that the inbound event relates to a registered device. The inbound payload is enriched
with device/assignment data so the information may be used by subsequent processing steps
without the need to look it up again. If the device is not registered, the payload is 
passed to the device registration microservice for additional processing. If the device becomes
registered as a result, the event is pushed onto a re-processing topic so that it may be 
processed again with the newly registered device.

Once the inbound event has been enriched, it is forwarded to the event management 
microservice for persistence. The persisted event is eventually (asynchronously) returned
to inbound processing where it is added to a topic for pre-processed events that may
in turn be consumed by other microservices such a rule processing and outbound 
connectors.

Device Registration
-------------------
The multitenant device registration microservice ingests data from a Kafka topic
populated by the inbound processing microservice when events reference a hardware id
for a device that is not currently registered in the system. Each tenant engine has
a device registration manager which may be configured to indicate how unregistered
devices are to be treated. The device registration manager processes each inbound
event and can potentially register the device automatically before adding the event
to a re-processing topic to have it processed by the inbound processing microservice.

Events that do not result in auto-registration of a device are pushed to a "dead letter"
topic in Kafka so that they can be tracked or processed out-of-band by external processors.

**This microservice is not fully implemented in 2.0.ea1 and will undergo a number of updates
before general availability. In the short term, new device auto-registration is turned off.**

Rule Processing
---------------
The multitenant rule processing microservice ingests data from the Kafka topic containing 
pre-processed events and applies conditional logic to further process the events. Tenant engines
can use embedded complex event processing (WSO2 Siddhi) to detect patterns in the event 
stream and fire new events as the result.

**This microservice is not fully implemented in 2.0.ea1 and will undergo a number of updates
before general availability. The Siddhi engine is being updated to the latest version which
changes the dependencies and APIs, so there will be some migration work involved. There are 
also plans for more out-of-the-box rule processing options before GA is released**

Command Delivery
----------------
The multitenant command delivery microservice ingests data from the Kafka topic containing 
pre-processed events and, for command invocations, handles command processing. This includes
using configured routing constraints and command destinations that indicate how the command
is to be encoded, which transport is to be used, and where the command is to be delivered.

**This microservice is not fully implemented in 2.0.ea1 and will undergo a number of updates
before general availability. In the short term, command delivery is turned off.**

Outbound Connectors
-------------------
The multitenant outbound connectors microservice ingests data from the Kafka topic containing 
pre-processed events and allows the event data to be forwarded to other integration points
asynchronously. Each outbound connector is a Kafka consumer that has its own pointer into
the events topic, so the system is not blocked by connectors that occasionally process at
slower rates than the rest of the system. Connectors are available for common use cases such
as forwarding events to a well-known MQTT topic or indexing events in Apache Solr.

**This microservice is implemented in 2.0.ea1 but some of the connectors have not been converted yet
and are not shown in the tenant configuration panel or have bugs. Upon general availablility, 
all SiteWhere 1.x connectors (and potentially a few new ones) will be available.**

Presence Management
-------------------
The multitenant presence management microservice ingests data from the Kafka topic containing 
pre-processed events and uses the event data to update device presence state. Each tenant engine
has a device presence manager that is responsible for determining when devices are no longer 
present and firing state change events that can be used to trigger actions based on a device
becoming present or not present.

**This microservice is not fully implemented in 2.0.ea1.**

Event Search
------------
The multitenant event search microservice provides an API for searching external data sources
that contain SiteWhere event information in a non-standard format. For instance, when events
are indexed into Apache Solr via an outbound connector, there may be a need to query Solr directly
to do complex faceted queries that can not be generically supported via the SiteWhere APIs. The
tenant engines for this microservice may be configured to proxy queries to the underlying service
and return the results to the Web/REST microservice for use by external clients.

**This microservice is not fully implemented in 2.0.ea1.**

Streaming Media
---------------
The multitenant streaming media microservice is intended to allow streaming storage of binary
data such as audio and video streams. Some basic APIs for streaming were available in SiteWhere 1.x,
but were not documented or considered production quality. SiteWhere 2.0 will formalize the
streaming media APIs, though integration with various encoding/decoding technologies may
extend beyond the 2.0 GA release cycle.

**This microservice is not fully implemented in 2.0.ea1.**

Label Generation
----------------
The multitenant label generation microservice responds to API requests for label resources such
as QR codes, bar codes, or custom device labels. Each tenant engine has a symbol generation
manager that may be customized to generate specific types of output unique to the tenant.

**This microservice is not fully implemented in 2.0.ea1.**
