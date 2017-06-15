
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
before the server is started. In particular, you need to have Java installed and a 
database available to store device management and event data. The default tenant 
configuration also assumes an external MQTT broker is available so that there is a 
channel for sending data into the system.

Install Java 8
==============

.. figure:: /_static/images/logos/java.png
   :scale: 30%
   :alt: MongoDB
   :align: right

The SiteWhere server is written in 100% `Java <https://www.oracle.com/java>`_ code
and makes use of features only available in Java 8 or above. Download a Java development kit
and follow the installation instructions to make the executable available on your system. SiteWhere
is routinely tested with multiple flavors of Java, so the Oracle version is not required.

.. button::
   :text: Oracle Java 8 Downloads
   :link: http://www.oracle.com/technetwork/java/javase/downloads/index.html
   
Verify that Java has been installed properly by opening a command prompt and entering:

.. code-block:: text

   java -version

If installed properly, the version information should be returned:

.. code-block:: text

   java version "1.8.0_131"
   Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
   Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)

Install MongoDB
===============

.. figure:: /_static/images/logos/mongodb.png
   :scale: 30%
   :alt: MongoDB
   :align: right

`MongoDB <https://www.mongodb.com/>`_ is a popular NoSQL database that is easy to install
and delivers great performance for most SiteWhere installations. Based on the default
tenant configuration, SiteWhere will attempt to connect to a local MongoDB instance when
the server bootstraps. MongoDB can be downloaded from the following link:

.. button::
   :text: MongoDB Community Edition Downloads
   :link: https://www.mongodb.com/download-center#community
   :icon: download
   
After downloading MongoDB, follow the steps in the installation guide to install it on
your SiteWhere server:

.. button::
   :text: MongoDB Community Edition Installation
   :link: https://docs.mongodb.com/manual/administration/install-community
   :icon: book
   
SiteWhere assumes that MongoDB is running on *localhost* on the default port (27017). If that is not
the case, you will need to edit the :doc:`server configuration <../userguide/configuration/server>` file and update
the hostname, port, and any other attributes.

Install HiveMQ
==============

.. figure:: /_static/images/logos/hivemq.png
   :scale: 30%
   :alt: HiveMQ
   :align: right

`HiveMQ <http://www.hivemq.com/>`_ is a popular MQTT broker that is already in use by many
organizations implementing IoT applications. The MQTT broker acts as a bi-directional channel
connecting SiteWhere to devices so that event data can be captured and commands can be sent to 
the devices. HiveMQ can be downloaded from the following link:

.. button::
   :text: HiveMQ Evaluation Downloads
   :link: http://www.hivemq.com/downloads/
   :icon: download
   
After downloading HiveMQ, follow their *Getting Started* guide to install and configure
it for your system.

.. button::
   :text: HiveMQ Getting Started Guide
   :link: http://www.hivemq.com/resources/getting-started/
   :icon: book
  
SiteWhere does not have direct dependencies on HiveMQ, but rather uses established
generic MQTT clients to connect to the brokers. Any broker that implements the MQTT protocol
should be compatible with SiteWhere.
 
.. note:: The SiteWhere device event emulator generates MQTT traffic over WebSocket, so
   you will need to configure the broker to accept connections on both TCP and WebSocket transports
   to use the emulator. An example of such a configuration for HiveMQ is included below: 

.. literalinclude:: hivemq.xml
   :language: xml

*****************************************
Install a Packaged SiteWhere Distribution
*****************************************

The SiteWhere team strives to release new versions of the platform every 4-6 weeks, with each
version made available as a group packaged distributions that can be downloaded directly from
the SiteWhere website. 

Download SiteWhere Distribution
===============================

The latest version (currently |version|) as well as a number of previous versions can be accessed 
via the SiteWhere downloads page. There are bundles available for both Windows and Unix variants, 
so make sure to download the correct version for your operating system.

.. button::
   :text: SiteWhere Downloads
   :link: http://www.sitewhere.org/downloads/
   
Each release is accompanied by release notes that indicate new features, updates, and bug fixes
that were addressed.

Install SiteWhere Distribution
==============================

A SiteWhere distribution is a compressed archive in *zip* format (Windows) or *tar* format (Unix).
After downloading the archive appropriate for your operating system, unzip (or untar) the archive
into a folder on your machine. 

.. note:: The top-level folder **sitewhere-server-x.xx.x** is considered the *SiteWhere Home* folder
   and is available within a running SiteWhere instance via the **sitewhere.home** environment variable.

Assuming that the external dependencies outlined above have been installed, the SiteWhere server can
be started by opening a command prompt to the *bin* folder and executing either *startup.bat* or 
*startup.sh* depending on your operating system.

.. code-block:: text

   sitewhere/bin> ./startup.sh

Server output will be shown in the console and also stored in the *logs/sitewhere.log* file.

**************************
Run SiteWhere Using Docker
**************************

