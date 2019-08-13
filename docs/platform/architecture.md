# System Architecture

<Seo/>

SiteWhere has been designed from the ground up to take advantage of the latest
technologies in order to scale efficiently to the loads expected in large IoT
projects. Rather than using a monolithic architecture, SiteWhere embraces
a completely distributed architecture using [Kubernetes](https://kubernetes.io/)
as the infrastructure and a variety of microservices to build out the system.
This approach allows customization and scaling at a fine-grained level
so that the system may be tailored to many potential IoT use cases. SiteWhere
is built with a framework approach using clearly defined APIs so that new
technologies may easily be integrated as the IoT ecosystem evolves.

## Microservice Approach

Rather than using a monolithic approach, SiteWhere is based on many microservices
running as a distributed system. Each microservice is a completely self-contained
entity that has its own configuration schema, internal components, data persistence,
and interactions with the event processing pipeline. SiteWhere microservices
are built on top of a custom microservice framework and run as separate
[Spring Boot](https://projects.spring.io/spring-boot/) processes, each
contained in its own [Docker](https://www.docker.com/) image.

### Separation of Concerns

Separating the system logic into microservices allows the interactions
between various areas of the system to be more clearly defined. Each microservice
serves a singular functional purpose and handles all aspects of that
functionality. Other microservices which need to access the functionality
contained in external services do so via clearly defined APIs.

### Scale What You Need. Leave Out What You Don't

The microservice architecture allows individual functional areas of the system to be scaled
independently or left out completely. In use cases where REST processing tends to
be a bottleneck, multiple REST microservices can be run concurrently to handle the load.
Conversely, services such as presence management that may not be required can be left
out so that processing power can be dedicated to other aspects of the system.

## Kubernetes Orchestration

SiteWhere relies on Kubernetes for service orchestration, leveraging the
wealth of existing infrastructure and proven methodologies it provides.
This allows SiteWhere to run on almost all existing cloud platforms as
well as on-premise installations. To simplify installation and configuration,
[Helm](https://helm.sh/) is used to provide standard templates for various
deployment scenarios. Helm [charts](https://github.com/sitewhere/sitewhere-recipes/tree/master/charts)
are provided to supply both the microservices and the dependencies needed to
run a complete SiteWhere deployment. Infrastructure components include
technologies such as Apache Zookeeper and Kafka, highly available databases such
as MongoDB, InfluxDB, and Cassandra, and other supporting technologies
such as MQTT brokers.

## Core Technologies

When deploying SiteWhere, the combination of the infrastructure required to
run the system and the microservices that handle the processing are referred
to as a SiteWhere _instance_. The assumption is that all infrastructure and
microservices for an instance run on the same Kubernetes cluster, though the
system may be spread across tens or hundreds of machines to distribute the processing
load.

Rather than reinventing the wheel, SiteWhere uses a number of proven technologies
as part of the infrastructure for its microservice architecture. The following
technologies address cross-cutting concerns which are common to all of the
system microservices.

### Service Mesh with Istio

SiteWhere leverages [Istio](https://istio.io/) to provide a service mesh for
the system microservices. This allows the platform to be scaled dynamically while
also providing a great deal of control over how data is routed. Istio allows
modern methods such as canary testing and fault injection to be used to
provide a more robust and fault-tolerant system. It also allows for detailed
monitoring and tracing of the data flowing between microservices.

### Centralized Configuration Management with Apache ZooKeeper

SiteWhere configuration is stored in [Apache ZooKeeper](https://zookeeper.apache.org/)
to allow for a scalable, externalized approach to configuration management. ZooKeeper
contains a hierarchical structure which represents the configuration for one or more
SiteWhere instances and all of the microservices that are used to realize them. The
configuration is replicated for high availabilty.

Each microservice has a direct connection to ZooKeeper and uses the hierarchy to
determine its configuration at runtime. Microservices listen for changes to the
configuration data and react dynamically to updates. No configuration
is stored locally within the microservice, which prevents problems with
keeping services in sync as system configuration is updated.

### Distributed Storage with Rook.io

Many system components such as Zookeeper, Kafka, and various
databases require access to persistent storage which is available to all
nodes in the Kubernetes cluster. This provides resilience in cases where
a Kubernetes node fails and pods are scheduled on other nodes to restore
the system to a running state. SiteWhere uses [Rook.io](https://rook.io/)
to provide a consistent approach to scalable storage. Rook supplies distributed,
replicated block storage that is resilient to hardware failures while
still offering good performance characteristics. As storage and throughput
needs increase over time, new storage devices can be made available
dynamically. The underlying [Ceph](https://ceph.com/) architecture
used by Rook.io can handle _exobytes_ of data while allowing data
to be resilient to failures at the node, rack, or even datacenter level.

## Event Data Processing Pipeline

SiteWhere coordinates device event processing by arranging microservices into
a pipeline with each microservice managing a specific stage of the process.
This approach allows events to be processed incrementally while also allowing
the processing load to be spread across hardware and scaled at a more fine-grained level.

The event processing pipeline uses [Apache Kafka](https://kafka.apache.org/)
to provide a resilient, high-performance mechanism for moving device event data
between the microservices that make up the pipeline. Microservices plug in
at key points in the event processing pipeline, reading data from well-known inbound
topics, processing data, then sending data to well-known outbound topics.
External entites that are interested in data at any point in the pipeline
can act as consumers of the SiteWhere topics to consume the data as it moves
through the system.

### Fully Asynchronous Pipeline Processing

The SiteWhere event processing pipeline leverages Kafka's messaging constructs to allow
device event data to be processed asynchronously. If a microservice shuts down and no other
replicas are available to process the load, the data will be queued until a replica starts
and begins processing again. This acts as a guarantee against data loss as data is always
backed by Kafka's high-performance storage. SiteWhere microservices leverage Kafka's consumer
groups concept to distribute load across multiple consumers and scale processing accordingly.

Using Kafka also has other advantages that are leveraged by SiteWhere. Since all data in
the distributed log is stored on disk, it is possible to "replay" the event stream based
on previously gathered data. This is extremely valuable for aspects such as debugging
processing logic or load testing the system.

## API Connectivity Between Microservices

While device event data generally flows in a pipeline from microservice to microservice on
Kafka topics, there are also API operations that need to occur in real time between the
microservices. For instance, device management and event management functions are contained in
their own microservices, but are required by many other components of the system. Many of the
SiteWhere microservices offer APIs which may be accessed by other microservices to
support aspects such as storing persistent data or initiating microservice-specific
services.

### Using gRPC for a Performance Boost

Rather than using REST services based on HTTP 1.x, which tend to have significant
connection overhead, SiteWhere uses [gRPC](https://grpc.io/) to establish a long-lived
connection between microservices that need to communicate with each other. Since gRPC uses
persistent HTTP2 connections, the overhead for interactions is greatly reduced, allowing
for decoupling without a significant performance penalty. Istio also allows the gRPC
connections to be multiplexed across multiple replicas of a microservice to scale
processing and offer redundancy.

The entire SiteWhere data model has been captured in
[Google Protocol Buffers](https://developers.google.com/protocol-buffers/) format so that
it can be used within GRPC services. All of the SiteWhere APIs are exposed directly as
gRPC services as well, allowing for high-performance, low-latency access to all API
functions. The REST APIs are still made available via the Web/REST microservice (acting
as an API gateway), but they use the gRPC APIs underneath to provide a consistent approach
to accessing data.

## Multitenancy

SiteWhere is designed for large-scale IoT projects which may involve many system tenants
sharing a single SiteWhere instance. A key differentiator for SiteWhere compared to most
IoT platforms is that each tenant runs in isolation from other tenants. By default, tenants
do not share database resources or pipeline processing and have a completely separate
configuration lifecycles. With this approach, each tenant may use its own database
technologies, external integrations, and other configuration options. Parts of the tenant's
processing pipeline may be reconfigured/restarted without causing an interruption to
other tenants.

### Data Privacy

An important consequence of the way SiteWhere handles multitenancy is that each tenant's
data is separated from the data of other tenants. Most platforms that offer multitenancy
store data for all tenants in shared tables, differentiated only by a tenant id. The shared
approach opens up the possibility of one tenant's data corrupting another, which is not
an acceptable risk in many IoT deployments. In addition, each tenant has its own processing
pipelines, so in-flight data is never co-mingled.

Having dedicated resources for tenants can be expensive in terms of memory and processing
resources, so SiteWhere also offers the concept of _customers_ within each tenant. Customers
allow data to be differentiated within a tenant, but without having a separate dedicated
database and pipelines. In cases where colocated data is acceptable, the tenant can have
any number of customers, which share the same database and processing pipeline. This allows
the best of both worlds in terms of security and scalability.
