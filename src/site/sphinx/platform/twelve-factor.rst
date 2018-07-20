
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
################################
SiteWhere as a Twelve-Factor App
################################
In recent years, there has been a strong push to move from older methodologies
of delivering monolithic software to an approach that supports agile, portable, 
cloud-capable applications that are easy to scale. 

The `Heroku <https://www.heroku.com/>`_ 
team came up with a list of twelve factors that they considered important in moving
toward these goals. They released a `website <https://12factor.net/>`_ that 
describes the twelve factors in detail and gives examples of how to build, manage,
and deploy applications that conform to the approach. The sections below discuss
how SiteWhere's architecture and deployment process align with those of a 
twelve-factor application.

I. Codebase
===========

**"One codebase tracked in revision control, many deploys"**

SiteWhere uses a `GitHub repository <https://github.com/sitewhere/sitewhere>`_ for versioning
its source code. Each microservice is separated into its own Gradle submodule with common code
pushed into libraries that are included as artifacts in the Gradle build process.
The same codebase is used across all types of deployments.

II. Dependencies
================

**"Explicitly declare and isolate dependencies"**

SiteWhere uses `Gradle <https://gradle.org/>`_ for build management and packages each microservice
into its own submodule. The modules each contain a Gradle build script which clearly defines the 
dependencies. There are no assumptions about tools being installed on the system 
and no external libraries are directly packaged into the SiteWhere code base. In addition, 
SiteWhere uses the `Spring Platform's <http://platform.spring.io/platform/>`_ 
Gradle plugin and BOM to assure that library versions used work together without issues.

III. Config
===========

**"Store config in the environment"**

SiteWhere manages system configuration by using a combination of environment variables and
externalized Apache Zookeeper storage. When microservices are started, many aspects of their
behavior may be controlled via environment variables injected by the Docker Compose
scripts used for orchestration.

IV. Backing Services
====================

**"Treat backing services as attached resources"**

All backing services such as databases, brokers, and cloud provider connections act as 
attached resources that may be connected/disconnected by making changes an externalized 
configuration. SiteWhere supports isolation of most configuration elements at the tenant
level while also allowing for some global configuration elements (still external to the 
codebase) to be used to simplify large multitenant installations. Each system component
supports a full lifecycle that allows it to be intialized/started/stopped independently
of other aspects of the system so that changing configuration/attached resources for
one tenant does not affect the lifecycle of other running tenants.

V. Build, release, run
======================

**"Strictly separate build and run stages"**


.. note::  **This document is still a work in progress**

