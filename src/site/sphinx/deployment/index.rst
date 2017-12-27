
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
##########################
SiteWhere Deployment Guide
##########################

This guide will cover the SiteWhere 2.0 deployment process which has changed
significantly from the one used for SiteWhere 1.x. While previous versions
of SiteWhere were deployed as a single server node, the SiteWhere 2.0 
architecture is based on many microservices which are deployed to a
`Docker <https://www.docker.com/>`_ infrastructure.

System Requirements
===================
Because SiteWhere 2.0 uses a microservices architecture, the number of 
processes running concurrently has increased, which in turn requires 
more memory and processing power. The minimum hardware specifications
for a single machine running a SiteWhere instance is:

+----------------+-----------------+
| Memory         |  16GB RAM       |
+----------------+-----------------+
| CPU            |  2 CPUs         |
+----------------+-----------------+
| Hard Disk/SSD  |  80GB           |
+----------------+-----------------+

When distributing microservices across multiple machines using
`Docker Swarm <https://github.com/docker/swarm>`_ or other orchestration
technologies, the per-machine requirements can be lower since the load
is distributed.

Another consideration in deploying SiteWhere is whether the 
`Apache Kafka <https://kafka.apache.org/>`_ and 
`Apache ZooKeeper <https://zookeeper.apache.org/>`_ instances are running
in Docker or managed separately. In production environments, Kafka and
ZooKeeper clusters should be managed externally from the SiteWhere instance
using best practices defined by the individual technologies. The SiteWhere
team will release more information on preferred topologies as the 2.0
architecture nears general availability.

Installing Docker and Docker Compose
====================================
SiteWhere 2.0 uses Docker as the core deployment model since the technology
is supported in all major cloud environments in addition to being easy to
use for on-premise installations. For single-machine installations, Docker
Engine can be installed based on the process detailed in the link below:

.. button::
   :text: Install Docker Engine
   :link: https://docs.docker.com/engine/installation/

In Addition to Docker Engine, some form of orchestration engine should be installed
to allow for many Docker services to be deployed at once rather than manually 
deploying them individually. `Docker Compose <https://docs.docker.com/compose/install/>`_
provides a simple methodology for deploying many services at once, so it is the 
preferred deployment model for bootstrapping a local SiteWhere instance. Start by
downloading and installing Docker Compose as detailed below:

.. button::
   :text: Install Docker Compose
   :link: https://docs.docker.com/compose/install/

Using SiteWhere Recipes to Build an Instance
============================================
Since the architecture and system configuration for SiteWhere allow for many
different combinations of components for developing custom systems, the 
SiteWhere team provides a list of common recipes for common system configurations
that acts as a starting point for building instances. The repository for
SiteWhere 2.0 recipes can be accessed via the link below:

.. button::
   :text: SiteWhere Recipes Repository
   :link: https://github.com/sitewhere/sitewhere-recipes

Start by cloning the recipes repository to the machine where you have the 
Docker environment configured. The repository can be cloned with the following
command:

.. literalinclude:: clone-recipe-repository.txt
   :language: sh

Once the repository has been cloned, navigate into the **sitewhere-recipes/docker-compose**
subdirectory. This directory contains sample configurations for many common SiteWhere
deployment scenarios. As an example, navigate to the **simple-debug/sitewhere** subdirectory
then execute the following command which will start a SiteWhere instance based on the
configuration outlined in the **docker-compose.yml** file.

.. literalinclude:: docker-compose-up.txt
   :language: sh

Docker compose will begin launching the SiteWhere microservices and all of the dependencies
such as ZooKeeper, Kafka, and MongoDB. The log output is a combination of the output for all
of the individual microservices and supporting technologies.
