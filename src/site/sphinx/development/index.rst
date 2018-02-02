
.. image:: /_static/images/sitewhere-with-tagline.png
   :scale: 70%
   :alt: SiteWhere
   :align: center
   
----
   
###########################
SiteWhere Development Guide
###########################

This guide provides information intended for developers interested
in building SiteWhere components from source code. It provides details
about downloading the source code, installing the required build tools, 
then building Docker images that can be used to deploy an instance.

Accessing Source Code on GitHub
===============================
The source code for SiteWhere is available on `GitHub <https://github.com/>`_ 
at the following location:

.. button::
   :text: SiteWhere Core Repository
   :link: https://github.com/sitewhere/sitewhere
   
The repository includes source code as well as issue tracking and other
aspects of the development ecosystem.
   
Branch Structure for Repository
-------------------------------
Source code checked in to the *master* branch is always from the
latest released version of SiteWhere. Each release is tagged and may be 
accessed by downloading an archive from the 
`releases <https://github.com/sitewhere/sitewhere/releases>`_ page or
by cloning the repository and checking out the branch corresponding to 
the release. The branch for the upcoming SiteWhere 2.0 release is available 
at the location below:

.. button::
   :text: SiteWhere 2.0.EA1 Branch
   :link: https://github.com/sitewhere/sitewhere/tree/sitewhere-2.0.ea1
   
New functionality is always developed in a separate branch and is
eventually merged to *master* as part of the release cycle.

Pulling Source Code From GitHub
-------------------------------
In order to work with the code, it will need to be cloned from GitHub onto 
your local machine. The following link covers a few options for installing
a Git client for accesing the repository:

.. button::
   :text: Install a Git Client
   :link: https://help.github.com/articles/set-up-git/

With a Git client installed, start by cloning the SiteWhere core repository. 
If using the command line client you can execute the following
commands to clone the repository and change to the current branch:

.. literalinclude:: clone-repository.txt
   :language: sh

The result of the commands should look similar to the output below:

.. image:: /_static/images/development/git-command-line-clone.png

Building from Source
====================
SiteWhere includes build scripts that make it easy to build deployable 
artifacts from the source code. Before building the code, there are a couple
of tools that must be installed.

Install Java 8
--------------
All of the core source code is written in Java, so a Java compiler is required.
Recent versions of SiteWhere use features of Java 8, so the JDK or JRE must
be 1.8 or above.

.. button::
   :text: Download and Install Java
   :link: http://www.oracle.com/technetwork/java/javase/downloads/index.html
   
Once installed, the version can be verified as shown below:

.. image:: /_static/images/development/java-version-check.png

Install Docker Engine
---------------------
SiteWhere 2.0 uses Docker as the core deployment model, so the deployment
artifacts from the build process are Docker images. In order to have a local
repository and APIs available for the build scripts to interact with, install
a local copy of Docker Engine as explained below:

.. button::
   :text: Install Docker Engine
   :link: https://docs.docker.com/engine/installation/
   
Verify that Docker Engine has been installed successfully by running the command
below:

.. image:: /_static/images/development/docker-engine-version.png

Configure the Docker daemon is to listen on TCP port 2375. This is the default API
port, but most installations do not enable the port by default. An example of the
required update for Ubuntu 16.04 can be found 
`here <https://www.ivankrizsan.se/2016/05/18/enabling-docker-remote-api-on-ubuntu-16-04/>`_.

Execute Gradle Build Script
---------------------------
The root folder of the source code contains a `Gradle <https://gradle.org/>`_ build
script (*build.gradle*) that compiles the Java code, packages it into Docker images, then pushes
the images to a Docker repository. By default, the Gradle script will attempt to
push the images to a repository running on *localhost*. Information for another
repository can be added as an override by adding the following lines the
*gradle.properties* (or *~/.gradle* on Unix) file in your default user directory:

.. literalinclude:: gradle-docker-repo-props.txt
   :language: properties

SiteWhere includes Gradle `Wrapper <https://docs.gradle.org/current/userguide/gradle_wrapper.html>`_
artifacts, so that there is no need to install Gradle independently. To build all of the core 
libraries, package the microservices into Docker images and push them into your local 
repository, execute the following command.

.. literalinclude:: build-docker-images.txt
   :language: sh
   
The first time the build executes will take significantly longer since Gradle 
must download all of the dependencies and cache them for later use. When 
the build script completes, execute the following command to view the 
list of Docker images which should now include images for all of the 
SiteWhere microservices:

.. image:: /_static/images/development/docker-image-list.png

Next Steps
==========
Now that Docker images have been generated for the microservices, follow the steps in the
deployment guide to use SiteWhere recipes that assemble the microservices into a working
instance.



