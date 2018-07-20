
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
################################
Instance Management Microservice
################################
The instance management microservice is used to bootstrap a SiteWhere instance and is
required to be present when starting an uninitialized SiteWhere instance. The instance
management microservice does not currently provide any services other than system
bootstrapping, so it may be left out of instances that have already been configured.

Microservice Dependencies
=========================
- **User Management** - Required in order to bootstrap default system users based on the 
  chosen instance template.
- **Tenant Management** - Required in order to bootstrap default system tenants based on
  the chosen instance template.

Zookeeper Bootstrapping
=======================
The instance management microservice is responsible for connecting to Zookeeper and
creating the base tree where all other configuration data for the instance is stored.

Zookeeper Connectivity
----------------------
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

Zookeeper Tree Settings
-----------------------
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

Instance Templates
==================
An *instance template* is used to specify the scripts that will be exceuted to populate the 
default users and tenants for the instance. A list of instance templates is packaged as part 
of the Docker image for the instance management microservice. Each template has a JSON descriptor
that includes a unique id which may be passed if the instance is to be initialized by that 
template's scripts. 

Changing the Instance Template
------------------------------
The following environment variable is used to indicate which template
will be used for initialization:

+----------------------+--------------------------------+---------------+
| Setting              | Environment Variable           | Default Value |
+======================+================================+===============+
| Instance Template Id | sitewhere.instance.template.id | default       |
+----------------------+--------------------------------+---------------+

.. note::  The ``default`` template that is packaged in the Docker image loads the default ``admin`` and
           ``noadmin`` users normally expected in a new system along with a default tenant based on
           the ``mongo`` tenant template and ``construction`` dataset.

Instance Data Boostrapping
--------------------------
If no ``bootstrapped`` marker is found in the ``state`` subfolder of Zookeeper for 
the instance, the instance management microservice will attempt to use the instance 
template to bootstrap the user and tenant data. It waits for the user and tenant 
management microservices to start before running the scripts which push data via 
the respective APIs. 

Once the initialization scripts have run, the instance is considered to be initialized and
a ``bootstrapped`` marker is pushed to Zookeeper to prevent re-running the scripts every
time the instance starts. Removing the marker will cause the instance template data to be
loaded over the existing data, which may cause problems with duplicate key exceptions.

After initialization, instance management does not serve any other role in the system
and may be shut down to conserve resources.
