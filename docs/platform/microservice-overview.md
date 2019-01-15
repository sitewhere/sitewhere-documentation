# Microservices Overview

<Seo/>

A SiteWhere instance is comprised of many microservices, each handling a
specific piece of functionality. Upon deployment, the microservices
are orchestrated into a distributed system on top of the Kubernetes
infrastucture. A Helm chart is used to configure the list of SiteWhere
microservices and other components which need to be started in order to
realize a given configuration. Once started, the microservices self-assemble
and then make themselves available for processing tasks.

<MicroservicesDiagram :base="$withBase('test')" uid="msdiagram"/>

## Microservice Structure

All SiteWhere microservices are based on a custom library defined in
the [sitewhere-microservice](https://github.com/sitewhere/sitewhere/tree/sitewhere-2.0.0/sitewhere-microservice)
module of the core SiteWhere repository. This library includes the common
code used for SiteWhere microservices including service lifecycle, configuration,
logging, service discovery, distributed tracing, and other cross-cutting concerns.

### Spring Boot Application

SiteWhere microservices are packaged as Spring Boot applications which use a common
base class [`MicroserviceApplication`](https://github.com/sitewhere/sitewhere/blob/sitewhere-2.0.0/sitewhere-microservice/src/main/java/com/sitewhere/microservice/MicroserviceApplication.java) that standardizes the service startup/shutdown
behavior. The application wraps an instance of a [`Microservice`](https://github.com/sitewhere/sitewhere/blob/sitewhere-2.0.0/sitewhere-microservice/src/main/java/com/sitewhere/microservice/Microservice.java) subclass
which implements much of the common behavior such as microservice lifecycle,
service discovery, common Kafka and gRPC services, as well as hooks for
the standard lifecycle behaviors. Microservice subclasses use the
various hooks to customize the lifecycle to add new functionality.

The SiteWhere microservice library uses Spring Boot environment settings
to configure various aspects of each microservice. The settings may be overridden
by injecting environment variables when deploying the microservices. The default
Helm chart for SiteWhere handles this transparently, but there may be cases
where the values need to be overridden manually. The table below covers the list of
standard instance-wide environment settings:

| Setting                           | Default        | Description                                                                   |
| :-------------------------------- | :------------- | :---------------------------------------------------------------------------- |
| sitewhere.product.id              | sitewhere      | Name of top-level node in Zookeeper tree                                      |
| sitewhere.instance.id             | sitewhere1     | Instance name used in Zookeeper and Kafka topic naming                        |
| sitewhere.instance.template.id    | default        | Template from instance management used to initialize system tenants and users |
| sitewhere.consul.host             | consul         | Hostname used to contact Consul for service discovery                         |
| sitewhere.consul.port             | 8080           | Port used to contact Consul for service discovery                             |
| sitewhere.zookeeper.host          | localhost      | Hostname used to contact Zookeeper for configuration                          |
| sitewhere.zookeeper.port          | 2181           | Port used to contact Zookeeper for configuration                              |
| sitewhere.kafka.bootstrap.servers | kafka:9092     | Kafka bootstrap servers list                                                  |
| sitewhere.filesystem.storage.root | /var/sitewhere | File system root for microservices that persist data locally for caching      |
| sitewhere.grpc.port               | 9000           | Port used to expose microservice-specific gRPC APIs                           |
| sitewhere.management.grpc.port    | 9001           | Port used to expose gRPC management interface                                 |
| sitewhere.tracer.server           | jaeger         | Hostname used for publishing distributed tracing output                       |
| sitewhere.log.metrics             | false          | Indicates whether metrics should be logged for microservice                   |
| sitewhere.k8s.pod.ip              | null           | Injected to let microservice know its Kubernetes pod IP                       |

### Base Docker Image

All SiteWhere microservices are built on top of the same base Docker image to
lower the runtime overhead of the images. The `openjdk:8-jre-alpine` image is
currently used due to its small footprint which includes the Java 8 runtime
needed to execute the applications. There are future plans to leverage features
of Java 9 to further reduce the image sizes and runtime requirements for
the microservices.

### System Resource Usage

SiteWhere currently uses around 20 microservices, so the underlying hardware should be
able to support running 20 concurrent Java processes, each with a footprint of around
500MB. The requirements are significant, though most modern desktop computers can easily
run a complete system. The SiteWhere Helm chart includes a `minimal` profile which
only loads the required microservices in order to lower the resource requirements.
However, the intent for SiteWhere 2.0 is to distribute the system components
across a cluster of machines, which lowers the hardware requirements
for a single node and increases fault-tolerance.

## Inter-Microservice Connectivity

Microservices do not operate in a vacuum and, as such, a high-performance RPC mechanism
is needed to allow the services to communicate. SiteWhere leverages [gRPC](https://grpc.io/)
for moving data between microservices and offers performant binary APIs to external consumers.
All API calls and data entities have been made available to gRPC via the Google
Protocol Buffers data format. Using gRPC rather than REST for communication can increase API
performance by more than 10x.

### API Demultiplexors

Connections between microservices are not always one-to-one. For instance, if a SiteWhere instance
has a single Web/REST microservice and three instances of the Device Management microservice, the
REST microservice should be able to demultiplex calls across all three Device Management instances
for scalability and fault tolerance. SiteWhere 2.0 introduces the concept of an API demulitplexor
which is able to introspect the current instance topology and add/remove connections to other
microservices dynamically. As the number of services is scaled up/down SiteWhere automatically
connects/disconnects the piping between them. All inter-microservice communication happens via
this mechanism.

### API Cache Support

Even with the high performance of gRPC, requesting commonly used data repeatedly across
the network connection has a significant cost. Master information for entites such as devices,
assignments, and assets is rarely updated and may be cached locally in the microservice
rather than incurring the cost of reading from the database. SiteWhere 2.0 uses a ehCache
to provide a local cache of a subset of master data. This cache is queried before
falling back to a remote gRPC request.

## Infrastructure Components

SiteWhere microservices make a few assumptions about the underlying infrastructure
that they are running on. At a minimum, instances of
[Apache ZooKeeper](https://zookeeper.apache.org/), [Apache Kafka](https://kafka.apache.org/) and
[Hashicorp Consul](https://www.consul.io/) must be available in order for the system
to function properly. By default, SiteWhere also produces distributed tracing data via the
[open tracing](http://opentracing.io/) standard for runtime performance analysis.
A server backend that supports the API may be configured to store and analyze the data.

## List of Core Microservices

For a list of the core microservices included with SiteWhere and detailed guides for each,
see the [microservice guides](/guide/microservices/) section.
