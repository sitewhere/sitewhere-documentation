
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
management microservice also manages updates to global instance settings such as shared 
database and connector configurations.

Microservice Dependencies
=========================
- **User Management** - Required in order to bootstrap default system users based on the 
  chosen instance template.
- **Tenant Management** - Required in order to bootstrap default system tenants based on
  the chosen instance template.

Configuration Schema
====================
`Instance Management Configuration XML Schema <http://sitewhere.io/schema/sitewhere/microservice/instance-management/current/instance-management.xsd>`_

Example Configuration
---------------------
.. literalinclude:: instance-management.xml
   :language: xml

Zookeeper Bootstrapping
=======================
The instance management microservice is responsible for connecting to Zookeeper and
creating the base tree where all other configuration data for the instance is stored.
For more information about connectivity to Zookeeper and how the base of the configuration 
tree is populated, see the `Apache Zookeper configuration guide <../zookeeper-configuration.html>`_.

Instance Templates
==================
An *instance template* is used to specify the scripts that will be executed to populate the 
default users and tenants for the instance. A list of instance templates is packaged as part 
of the Docker image for the instance management microservice. Each template has a JSON descriptor
that includes a unique id which may be passed if the instance is to be initialized by that 
template's scripts. Below is an example of the JSON descriptor:

.. literalinclude:: instance-template.json
   :language: json

Adding a Custom Instance Template
---------------------------------
Additional instance templates may be added by mounting them into the filesystem of the
instance management Docker image under the templates folder.

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
