
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
##############################
Apache Zookeeper Configuration
##############################
`Apache ZooKeeper <https://zookeeper.apache.org/>`_ is used for centralized configuration
management in SiteWhere microservices. It supports storage of configuration data in a
high-performance, reliable tree structure and may be clustered to offer high availability
and reliability.

Zookeeper Connectivity
======================
All SiteWhere microservices rely on Zookeeper to provide configuration information
at runtime. The microservices use the following environment variables and default 
values for connecting to Zookeeper:

+----------------+--------------------------+---------------+
| Setting        | Environment Variable     | Default Value |
+================+==========================+===============+
| Zookeeper Host | sitewhere.zookeeper.host | localhost     |
+----------------+--------------------------+---------------+
| Zookeeper Port | sitewhere.zookeeper.port | 2181          |
+----------------+--------------------------+---------------+

.. note::  The Docker Compose configuration should pass a Zookeeper hostname that can be resolved
           on the Docker network that the microservices are attached to. Note that the Zookeeper
           environment variables must be passed for every microservice.

Zookeeper Tree Structure
========================
Once connected to Zookeeper, the instance management microservice is responsible
for creating the base of the instance Zookeeper tree based on the following 
variables and default values:

+-------------+-----------------------+---------------+
| Setting     | Environment Variable  | Default Value |
+=============+=======================+===============+
| Product Id  | sitewhere.product.id  | sitewhere     |
+-------------+-----------------------+---------------+
| Instance Id | sitewhere.instance.id | sitewhere1    |
+-------------+-----------------------+---------------+

For the default system values, the Zookeeper tree will be rooted at ``sitewhere/sitewhere1`` 
and all other instance configuration data will be located relative to that root. If 
multiple instances of SiteWhere are to be run concurrently using the same Zookeeper cluster, 
they should provide different values for ``sitewhere.instance.id`` so that the configuration data 
does not overlap. This can be accomplished by setting the ``sitewhere.instance.id`` 
environment variable via the Docker Compose configuration. 

.. note::  All of the microservices intended to run in the same instance should use the same 
           values for ``sitewhere.product.id`` and ``sitewhere.instance.id``.

Zookeeper Data Persistence
==========================
If using Zookeeper within a Docker Compose configuration, the Zookeeper data folder
should be mapped to a local volume so that it is not lost when the service is
stopped. The SiteWhere infrastructure recipes have a common shared data volume
that is used to store persistent data from all services such as Zookeeper,
Kafka, and various databases. The data volume may be deleted in order to start
with a "clean" system.
           