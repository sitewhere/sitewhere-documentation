
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
##########################
Apache Kafka Configuration
##########################
`Apache Kafka <https://kafka.apache.org/>`_ is used by SiteWhere to provide a
high-performance data processing pipeline between microservices. Kafka relies
on Apache Zookeeper for saving its state and is generally configured to share
the same Zookeeper instance used for storing SiteWhere configuration data.

Kafka Connectivity
==================
All SiteWhere microservices have some level of reliance on Kafka and must 
be configured to access a shared Kafka cluster. The microservices use the 
following environment variables and default values for connecting to Kafka:

+-------------------------+-----------------------------------+---------------+
| Setting                 | Environment Variable              | Default Value |
+=========================+===================================+===============+
| Kafka Bootstrap Servers | sitewhere.kafka.bootstrap.servers | kafka:9092    |
+-------------------------+-----------------------------------+---------------+

The information Kafka uses to connect to Zookeeper is configured in the Docker
Compose file service descriptor (or in the Kafka configuration if not running
Kafka within Docker).

Kafka Data Persistence
======================
If using Kafka within a Docker Compose configuration, the Kafka data folder
should be mapped to a local volume so that it is not lost when the service is
stopped. The SiteWhere infrastructure recipes have a common shared data volume
that is used to store persistent data from all services such as Zookeeper,
Kafka, and various databases. The data volume may be deleted in order to start
with a "clean" system.
