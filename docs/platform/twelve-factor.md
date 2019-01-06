<Seo/>
# SiteWhere as a Twelve-Factor App

In recent years, there has been a strong push to move from older methodologies
of delivering monolithic software to an approach that supports agile, portable,
cloud-capable applications that are easy to scale.

The [Heroku](https://www.heroku.com/)
team came up with a list of twelve factors that they considered important in moving
toward these goals. They released a [website](https://12factor.net/) that
describes the twelve factors in detail and gives examples of how to build, manage,
and deploy applications that conform to the approach. The sections below discuss
how SiteWhere's architecture and deployment process align with those of a
twelve-factor application.

## I. Codebase

**"One codebase tracked in revision control, many deploys"**

SiteWhere uses a [GitHub repository](https://github.com/sitewhere/sitewhere) for versioning
its source code. Each microservice is separated into its own Gradle submodule with common code
pushed into libraries that are included as artifacts in the Gradle build process.
The same codebase is used across all types of deployments.

## II. Dependencies

**"Explicitly declare and isolate dependencies"**

SiteWhere uses [Gradle](https://gradle.org/) for build management and packages each microservice
into its own submodule. The modules each contain a Gradle build script which clearly defines the
dependencies. There are no assumptions about tools being installed on the system
and no external libraries are directly packaged into the SiteWhere code base. In addition,
SiteWhere uses the [Spring Platform's](http://platform.spring.io/platform/)
Gradle plugin and BOM to assure that library versions used work together without issues.

## III. Config

**"Store config in the environment"**

SiteWhere manages system configuration by using a combination of environment variables and
externalized Apache Zookeeper storage. When microservices are started, many aspects of their
behavior may be controlled via environment variables injected by the Docker Compose
scripts used for orchestration.

## IV. Backing Services

**"Treat backing services as attached resources"**

All backing services such as databases, brokers, and cloud provider connections act as
attached resources that may be connected/disconnected by making changes an externalized
configuration. SiteWhere supports isolation of most configuration elements at the tenant
level while also allowing for some global configuration elements (still external to the
codebase) to be used to simplify large multitenant installations. Each system component
supports a full lifecycle that allows it to be intialized/started/stopped independently
of other aspects of the system so that changing configuration/attached resources for
one tenant does not affect the lifecycle of other running tenants.

## V. Build, release, run

**"Strictly separate build and run stages"**

In the **build** phase, the included Gradle build scripts are used to
compile and generate libraries for the modules. Once code for a release is
considered complete, the Gradle scripts may be used to **release** the code
by wrapping Docker images around the artifacts and pushing the resulting images
into Docker Hub. Independently of the build and release phases, Kubernetes
and Helm are used to **run** the microservices by orchestrating a distributed
system from the released images.

## VI. Processes

**"Execute the app as one or more stateless processes"**

SiteWhere microservices are completely stateless in that they do not store
any data locally except in cases of short-term caching. Any persistent data is stored
outside of the microservice in persistence services and only accessed via APIs which
remove direct dependencies on the storage mechanism. All system configuration is
stored in Zookeeper, which provides redundancy and high-availability. Configuration
data is pulled by the microservice when it is started and pushed to the microservice
if it is updated externally.

## VII. Port Binding

**"Export services via port binding"**

All services which require access via an exposed port do so by leveraging the
port binding services of Kubernetes. For instance, the Web/REST microservice
uses an embedded Tomcat container to serve the REST services and Swagger
interface. The port binding is handled by Helm/Kubernetes and is passed
into the underlying microservice via environment variables. In cases where
infrastructure services need to be aviailable on well-known ports, the Helm
chart deploys both the infrastructure service and the configuration of the
microservices that depend on it so that the system can self-assemble.

## VIII. Concurrency

**"Scale out via the process model"**

SiteWhere microservices are distrubuted as Docker images, each of which runs
within its own process and is stateless and able to be scaled to multiple
concurrent instances. Using Kubernetes/Helm, the number of instances of a
microservices may be scaled up indefinitely assuming that the underlying
cluster has available resources. As instances of microservices are added
and removed, the underlying connectivity management multiplexes data operations
across all available instances to assure the system scales with the updates.

## IX. Disposability

**"Maximize robustness with fast startup and graceful shutdown"**

The core microservices are designed to start quickly and die gracefully.
Startup time for a single microservice is generally a few seconds and
depends on various factors such as connecting to required resources. In
general, long-running tasks are run in the background as separate threads
to allow the services to be considered live as soon as possible. When
shutting down, all external connections and managed resources are released
in the correct order to make sure that everything shuts down cleanly.

## X. Dev/prod parity

**"Keep development, staging, and production as similar as possible"**

There should generally be little or no difference between local deployments
and production deployments in terms of system configuration. SiteWhere leverages
Kubernetes and Helm to make the deployment infrastructure and configuration
as straightforward as possible while still being flexible. Technologies
such as [Rook.io](https://rook.io/) allow local installations to use the
same technologies as large production deployments.

## XI. Logs

**"Treat logs as event streams"**

SiteWhere microservices use commodity Java logging frameworks, which write
output to the standard output and error streams. The streams are automatically
managed by Docker/Kubernetes and may be access via those APIs. In addition,
log output is made available on an Apache Kafka topic for external clients
that wish to process the log information in real-time.

## XII. Admin processes

**"Run admin/management tasks as one-off processes"**

Most administrative tasks for a SiteWhere instance are covered either by
the infrastructure components themselves or may be run from external microservices
that run inside the same environement as the instance.
