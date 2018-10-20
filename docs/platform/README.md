# SiteWhere Platform

SiteWhere is an open source application enablement platform for building
both the infrastructure and applications that make up the Internet of Things.
The SiteWhere 2.0 platform introduces an entirely redesigned architecture based
on a modern microservices approach. It has been designed from the ground up for reliable,
high throughput, low latency processing and dynamic scalability using technologies
such as [Kubernetes](https://kubernetes.io/) and [Apache Kafka](https://kafka.apache.org/).
The intent is to continue to support most of the data model and APIs from
the 1.x platform, but to do so in a more modular fashion that embraces modern
development and deployment workflows.

## Microservices Approach

SiteWhere separates the many aspects of IoT processing into a pipeline of microservices,
each specializing in a single function. Functions include event ingestion, big-data
event persistence, device state management, large-scale command delivery, batch
operations, integration of device data with external systems, and much more. Many of
the microservices are arranged into a processing pipeline backed by Apache Kafka
for resilient, high-performance processing. Each microservice may be configured
separately and operates independently of the others. The microservices are deployed
on top of a Kubernetes infrastructure and designed to scale seamlessly as larger
processing loads are introduced.

## Administrative Application

SiteWhere provides an administrative application based on [Electron](https://electronjs.org/),
which allows SiteWhere instances to be easily administered from the convenience
of a desktop application. Use one of the available [Helm](https://helm.sh/)
[charts](https://github.com/sitewhere/sitewhere-recipes/tree/master/charts)
to bootstrap a SiteWhere instance on Kubernetes, then point the administrative application
to the instance to manage it. The new administrative application supports all of
the new SiteWhere 2.0 features and offers automated updates to streamline the
development process.

<InlineImage src="/images/platform/login.png" caption="Admnistrative Interface"/>
