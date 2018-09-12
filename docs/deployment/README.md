# SiteWhere Deployment Guide

This guide covers the SiteWhere 2.0 deployment process which has changed
significantly from the one used for SiteWhere 1.x. While previous versions
of SiteWhere were deployed as a single server node, the SiteWhere 2.0
architecture is based on many microservices which are deployed into a
[Docker](https://www.docker.com/) infrastructure.

## System Requirements

Because SiteWhere 2.0 uses a microservices architecture, the number of
processes running concurrently has increased, which in turn requires
more memory and processing power. The minimum hardware specifications
for a single machine running a SiteWhere instance is:

| Resource      | Min Value |
| ------------- | --------- |
| Memory        | 16GB RAM  |
| CPU           | 2 CPUs    |
| Hard Disk/SSD | 80GB      |

When distributing microservices across multiple machines using
[Docker Swarm](https://github.com/docker/swarm) or other orchestration
technologies, the per-machine requirements can be lower since the load
is distributed.

Another consideration in deploying SiteWhere is whether the
[Apache Kafka](https://kafka.apache.org/) and
[Apache ZooKeeper](https://zookeeper.apache.org/) instances are running
in Docker or managed separately. In production environments, Kafka and
ZooKeeper clusters should be managed externally from the SiteWhere instance
using best practices defined by the individual technologies. The SiteWhere
team will release more information on preferred topologies as the 2.0
architecture nears general availability.

## Installing Docker and Docker Compose

SiteWhere 2.0 uses Docker as the core deployment model since the technology
is supported in all major cloud environments in addition to being easy to
use for on-premise installations. For single-machine installations, Docker
Engine can be installed based on the process detailed in the link below:

[Install Docker Engine](https://docs.docker.com/engine/installation/)

### Install Docker Compose

In Addition to Docker Engine, some form of orchestration engine should be installed
to allow for many Docker services to be deployed at once rather than manually
deploying them individually. In production deployments, SiteWhere 2.0 will leverage
the new [stack](https://docs.docker.com/engine/reference/commandline/stack_deploy/)
support in Docker Swarm to launch the system. For a local installation, it is often easier to use
[Docker Compose](https://docs.docker.com/compose/install/) which provides a simple
methodology for deploying many services at once while aggregating logs to the console
for easier debugging. Start by downloading and installing Docker Compose as detailed below:

[Install Docker Compose](https://docs.docker.com/compose/install/)

### Enable Swarm Mode

Some aspects of the deployment process require features such as overlay networks that are
only available in Docker Swarm. Since Swarm is included in the Docker Engine, it can
be enabled and used in single-machine local deployments without the need for building
more complex topologies. Enable Swarm mode using the following command:

```sh
docker swarm init
```

## Using SiteWhere Recipes to Build an Instance

Since the architecture and system configuration for SiteWhere allow for many
different combinations of components for developing custom systems, the
SiteWhere team provides a list of _recipes_ for common system configurations
that act as a starting point for building instances. The repository for
SiteWhere 2.0 recipes can be accessed via the link below:

[SiteWhere Recipes Repository](https://github.com/sitewhere/sitewhere-recipes)

### Clone the Recipes Repository

Open a terminal and start by cloning the recipes repository to the machine
where you have the Docker environment configured. The repository can be cloned
with the following command:

```sh
git clone https://github.com/sitewhere/sitewhere-recipes.git
```

Once the repository has been cloned, navigate into the **sitewhere-recipes/docker-compose**
subdirectory. This directory contains sample configurations for many common SiteWhere
deployment scenarios.

### Start Infrastructure Services

To better emulate a production environment, separate recipes are provided for
infrastructure services such as Apache ZooKeeper, Kafka, MQTT brokers, databases, and
other non-SiteWhere components. To start the infrastructure containers, navigate to the
**sitewhere-recipes/docker-compose/infrastructure_default** subdirectory (or one of the other
recipes depending on which components should be loaded). Execute the following command which
will start the infrastructure based on the configuration outlined in the
**docker-compose.yml** file.

```sh
docker-compose up
```

### Start SiteWhere Microservices

In a separate terminal, navigate to the **sitewhere-recipes/docker-compose/default**
subdirectory. This recipe contains all of the SiteWhere microservices and expects
other infrastructure services to already be running. As with the infrastructure recipe,
run the following command to start SiteWhere:

```sh
docker-compose up
```

Docker compose will begin launching the SiteWhere microservices. The log output is a
combination of the output for all of the individual microservices and supporting technologies.

### System Log Output

The log output for SiteWhere 2.x is significantly different than 1.x due to the
distributed nature of the system and the fact that every microservice runs in a
separate Java process. The microservices can start in any order and use Apache ZooKeeper
as a central point for coordination. In many cases, there are dependencies between
microservices such as the need for bootstrapping system data or providing access to
parts of the data model. Log messages such as **Waiting for tenant management API to become available**
are common during the bootstrapping process. For more detailed information about the
system startup process, see the [startup and bootstrap](../guide/README.md) document.
