# SiteWhere Platform

SiteWhere is an open source application enablement platform for building
both the infrastructure and applications that make up the Internet of Things.
It covers many of the use cases required to manage large IoT
deployments and is built with a framework approach which facilitates the
addition of new concepts easily. The platform has been designed for reliable,
high-throughput, low-latency processing and dynamic scalability.

::: tip
SiteWhere 2.0 is a complete redesign of the SiteWhere 1.x architecture.
The platform introduces a modernized architecture based on microservices
which decouples the previous monolithic approach into cleanly separated
functional areas. SiteWhere 2.0 supports most of the data model concepts and APIs from the 1.x
platform, but does so in a modular fashion that embraces modern development
and deployment workflows.
:::

## Architectural Approach

SiteWhere separates the many aspects of IoT processing into microservices, each
specializing in a specific task. These include functionality such as event ingestion,
big-data event persistence, device state management, large-scale command delivery,
integration of device data with external systems, and much more. Each microservice
is a [Spring Boot](https://spring.io/projects/spring-boot) application
wrapped as a [Docker](https://www.docker.com/) container. The microservices self
assemble into a SiteWhere _instance_ which is orchestrated as a highly-available
distributed system. In addition, many of the microservices are arranged into a
processing pipeline backed by [Apache Kafka](https://kafka.apache.org/)
for resilient, high-performance stream processing. More information on the SiteWhere 2.0
microservice architecture may be found [here](./microservice-overview.md).

## Deployment Methodology

SiteWhere microservices are deployed and orchestrated using [Kubernetes](https://kubernetes.io/)
as the infrastructure platform. This allows for deployment to nearly any cloud service
(e.g. [Microsoft Azure](https://azure.microsoft.com/en-us/services/kubernetes-service/),
[AWS](https://aws.amazon.com/eks/), [Google Cloud](https://cloud.google.com/kubernetes-engine/),
[OpenShift](https://www.openshift.com/)) as well as the ability to deploy on-premise.
SiteWhere provides [Helm](https://helm.sh/) charts that hide the complexities of system
configuration, allowing an instance to be bootstrapped with a single command. For more
information about deploying a SiteWhere instance, check out the
[deployment guide](../deployment/).

## Administrative Application

SiteWhere provides an administrative application based on [Electron](https://electronjs.org/),
which allows SiteWhere instances to be easily administered from the convenience
of a desktop application. Use one of the available Helm [charts](https://github.com/sitewhere/sitewhere-recipes/tree/master/charts)
to bootstrap a SiteWhere instance on Kubernetes, then point the administrative application
to the instance to manage it. The new administrative application supports all of
the new SiteWhere 2.0 features and offers automated updates to streamline the
development process.

<InlineImage src="/images/platform/login.png" caption="Admnistrative Interface"/>
