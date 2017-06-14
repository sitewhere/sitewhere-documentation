
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
=========================================
SiteWhere Community Edition Documentation
=========================================

SiteWhere Community Edition is an open source IoT Application Enablement Platform. It
provides a highly-configurable system that facilitates the ingestion, storage, processing,
and integration of device data for one or more system tenants. SiteWhere also provides
software development kits and agents for many of the most popular device technologies
to allow them to interact and be controlled by the server.

The following guides are available to help with installing, configuring, and using SiteWhere:

.. toctree::
   :maxdepth: 2

   installation/index
   userguide/index

Key Features
============
SiteWhere provides most of the features needed to enable building powerful IoT applications,
speeding time-to-market and allowing the application developer to focus on the domain-specific
details of the application being built. SiteWhere provides:

On Premise or in the Cloud
--------------------------

.. figure:: /_static/images/logos/docker.png
   :scale: 30%
   :alt: Docker
   :align: right

SiteWhere provides a highly-scalable server platform that can be deployed both on-premise and 
in the cloud depending on needs of the application. Docker images are provided for each release
so that containers can be deployed in any Docker-compatible cloud provider (Amazon EC2, Azure, etc.)

First-class Multitenancy Support
--------------------------------

.. figure:: /_static/images/icons/people.png
   :scale: 30%
   :alt: Multitenancy
   :align: right

SiteWhere was built with multitenancy in mind. A SiteWhere server can support any number of tenants, 
each with its own processing pipeline and independent data storage. Tenant data is never mixed with 
that of other tenants and each tenant can be configured and managed independently.

Comprehensive Device Management
-------------------------------

.. figure:: /_static/images/devices/waspmote.png
   :scale: 30%
   :alt: Device Management
   :align: right

SiteWhere offers a complete device management solution that supports storage of millions of devices and their
associated event data. Provision devices automatically via a number of standard protocols, or register them
manually (individually or in batch) via the SiteWhere REST services. SiteWhere stores information about the
latest state of the device as well as historical information for events related to the device.

High-performance Big Data Storage
---------------------------------

.. figure:: /_static/images/logos/mongodb.png
   :scale: 30%
   :alt: Device Management
   :align: right

SiteWhere integrates with some of the leading NoSQL database products including MongoDB, 
InfluxDB, and Apache HBase to support high-performance device event storage. Device management
and event data can be separated to take advantage of modern time series storage engines. 
Ingested data can be accessed via the SiteWhere REST services for use in IoT applications or
pushed to other platforms for analysis using the many external integrations provided.

  