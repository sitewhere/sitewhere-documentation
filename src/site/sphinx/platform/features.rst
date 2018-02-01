
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
#########################
New Platform 2.0 Features
#########################
Beyond the core architectural changes, the SiteWhere 2.0 platform introduces
a number of new features intended to make it easier to use while improving
security and streamlining the system management workflow.

Centralized Configuration Management
====================================
In SiteWhere 1.x, most of the configuration was done at the tenant level with
no concept of system-wide settings. With the introduction of the concept of
a SiteWhere instance in 2.x, many settings can now be configured at a global
level and referenced by tenants, allowing for centralized management.

Persistence Configurations
--------------------------
Configuration settings for data persistence are now available at the instance level,
allowing database details to be specified globally and reused in tenants. The 
tenants can reference the configurations by id and are automatically updated
if changes are made globally. There is still the option of configuring database
settings locally for tenants if global configuration is not needed. The
microservices architecture also allows persistence settings to be controlled 
at a finer level (e.g. different databases for tenant device management and
asset management) if desired.

.. image:: /_static/images/platform/persistence-configurations.png

Variable Replacement in Datastore Configuration
-----------------------------------------------
When configuring database connectivity settings such as hostname and database
name, SiteWhere now allows for the use of variable substitution in names, 
allowing for per-tenant settings that are derived from a global expression.
For instance, this supports the existing approach of using a database per
tenant when configuring MongoDB, but also supports other approaches such as
having a separate MongoDB instance for each tenant by using variable substitution
in the hostname.

The user interface also now directly supports the mapping of system environment
variables to override configuration settings. Using this approach, the microservice
can be configured externally (in the Docker compose file) to pass variables to
configure SiteWhere components.

.. image:: /_static/images/platform/db-variable-substitution.png

InfluxDB Improvements
---------------------
The 1.x implementation of InfluxDB for event management did not fully support
multitenancy. In the 2.0 platform, InfluxDB may be configured globally using
variable substitution so that each tenant has its own InfluxDB database. The
updates also include an upgrade to the latest version of the InfluxDB Java
client to support that latest bug fixes and performance improvements.

Improved Administrative User Interface
======================================
SiteWhere 2.0 features a new administrative user interface based on
`Vue <https://vuejs.org/>`_ along with `Vuetify <https://vuetifyjs.com/>`_ 
for a look that is more consistent with Google `Material Design <https://material.io/>`_
guidelines. The interface is built in a component-oriented fashion for a
more efficient development workflow. The longer-term plan is to release 
reusable component libraries so that SiteWhere UI/API components can easily
be used in other Vue projects.

.. image:: /_static/images/platform/vue-user-interface.png

Tenant Management Workflow Improvements
---------------------------------------
A common complaint with the 1.x user interface was the non-intuitive workflow
for managing tenants. SiteWhere 2.0 moves tenant management and other aspects 
of global configuration to the landing page after login. Tenants may be easily
added and configured without the need to log out of the application as before.
The new approach also fixes issues with being unable to reconfigure tenants that
failed to start.

.. image:: /_static/images/platform/tenant-management.png

Security
========
Security features added

JSON Web Token
--------------
All REST APIs now use JWT rather than basic auth.

Updated Security Headers
------------------------
Both tenant id and auth token now used.

Data Model
==========
Core data model has been made more consistent.

New Id Management Structure
---------------------------
Core objects now have a UUID in addition to user-facing ids so that device hardware
ids, assignment tokens, etc can be updated without breaking linked data such as events.