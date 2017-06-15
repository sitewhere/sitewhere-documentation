
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
############################
SiteWhere Installation Guide
############################

This guide will help you install SiteWhere, whether you want to download an image directly
from the SiteWhere downloads page, install an image via our public Docker repository, or
build the project from source code.

*********************
External Dependencies
*********************

In its default configuration, SiteWhere expects some external services to be configured
before the server is started. In particular, you need to have a database available to 
store device management and event data. The default tenant configuration also assumes
an external MQTT broker is available so that there is a channel for sending data into
the system.

Install MongoDB
===============

.. figure:: /_static/images/logos/mongodb.png
   :scale: 30%
   :alt: Device Management
   :align: right

`MongoDB <https://www.mongodb.com/>`_ is a popular NoSQL database that is easy to install
and delivers great performance for most SiteWhere installations. Based on the defult
tenant configuration, SiteWhere will attempt to connect to a local MongoDB instance when
the server bootstraps. MongoDB can be downloaded from the following link:

.. button::
   :text: Download MongoDB Community Edition
   :link: https://www.mongodb.com/download-center#community
   
After downloading MongoDB, follow the steps in the installation guide to install it on
your SiteWhere server:

.. button::
   :text: Install MongoDB Community Edition
   :link: https://docs.mongodb.com/manual/administration/install-community
   
SiteWhere assumes that MongoDB is running on *localhost* on the default port (27017). If that is not
the case, you will need to edit the :doc:`server configuration <../userguide/configuration/server>` file and update
the hostname, port, and any other attributes.

Install HiveMQ
==============
