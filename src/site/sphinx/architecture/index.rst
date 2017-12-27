
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
######################
SiteWhere Architecture
######################

SiteWhere has been designed from the ground up to take advantage of the latest
technologies in order to scale efficiently to the loads expected in large IoT
projects. Rather than using a monolithic architecture, SiteWhere embraces
a completely distributed approach using microservices to allow scaling at the
component level so that the system may be tailored to the customer
use case. The system is built with a framework approach using clearly defined
APIs so that new technologies can easily be integrated as the IoT ecosystem
evolves. The remainder of this guide covers the core technologies used by 
SiteWhere and how they fit together to build a comprehensive system.

Microservices
=============
SiteWhere 2.0 introduces a much different architectural approach than was used
in the 1.x platform. While the core APIs are mostly unchanged, the system implementation
has moved from a monolithic approach to one based on microservices. This approach
provides a number of advantages over the previous architecture.

Separation of Concerns
----------------------
Each microservice is a completely self-contained entity that has its
own unique configuration schema, internal components, data persistence,
and interactions with the event processing pipeline. SiteWhere microservices
are built on top of a custom microservice framework and run as separate
`Spring Boot <https://projects.spring.io/spring-boot/>`_ processes, each
contained in its own `Docker <https://www.docker.com/>`_ image.

Separating the system logic into microservices allows the interactions
between various areas of the system to be more clearly defined. This
transition has already resulted in a more understandable and maintainable
system and should continue to pay dividends as more features are added.

Scale What You Need. Leave Out What You Don't
---------------------------------------------
The 2.0 architecture allows individual functional areas of the system to be scaled
independently or left out completely. In use cases where REST processing tends to
be a bottleneck, multiple REST services can be run concurrently to handle the load.
Conversely, services such as presence management may not be needed and can be left
out so that processing power can be dedicated to other aspects of the system.

Global vs. Multitenant Microservices
------------------------------------
SiteWhere implements two types of microservices.

Instance Management
===================
The 2.0 architecture introduces the concept of a SiteWhere *instance*, which
allows the distributed system to act as a cohesive unit with some aspects
addressed at the global level. All of the microservices for a single SiteWhere
instance must be running on the same Docker infrastucture, though the system
can be spread across tens or hundreds of machines using technologies such as
`Docker Swarm <https://github.com/docker/swarm>`_ or `Kubernetes <https://kubernetes.io/>`_.

Configuration Management with Apache ZooKeeper
==============================================
SiteWhere 2.0 has moved system configuration from the filesystem into
`Apache ZooKeeper <https://zookeeper.apache.org/>`_ to allow for a centralized,
coordinated approach to configuration management. ZooKeeper contains a
hierarchical structure which represents the configuration for a SiteWhere instance
and all of the microservices that are used to realize it.

Each microservice has a direct connection to ZooKeeper and uses the
hierarchy to determine information such as the instance it belongs to
and the configuration it should use. Microservices listen for changes to
the configuration data and react dynamically to updates. No configuration
is stored locally within the microservice, which prevents problems with
keeping services in sync as system configuration is updated.

Event Processing with Apache Kafka
==================================
SiteWhere microservices are connected using Apache Kafka.

Inter-Microservice Communication with GRPC
==========================================
Microservices communicate directly with each other via high-performance GRPC pipes.

Common Data Model and APIs
==========================
SiteWhere provides a common object model for IoT entities such as devices and 
events.

GRPC Model and Services
-----------------------

Data Persistence Abstraction
============================
Data can be persisted into multiple backends.