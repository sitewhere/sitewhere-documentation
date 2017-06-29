---
title: Developer Guide
layout: default
sidebar: combined-sidebar.html
includeNavigation: false
---

# Developer Guide
This manual covers the steps necessary for a developer to get started working with the 
SiteWhere source code. It addresses topics such as setting up a development environment, 
downloading SiteWhere source code, and building SiteWhere artifacts.

## Install Development Environment
Most of the core SiteWhere source code is written in [Java](http://www.oracle.com/technetwork/java/index.html) 
and made available on on the SiteWhere [GitHub page](https://github.com/sitewhere). The easiest 
path to get up and running is to use a development environment that has integrated support for the Git version 
control system. This guide assumes that you will be using the Eclipse IDE. SiteWhere was developed with Eclipse 
and the repositories contain artifacts that make it simple to load the source into Eclipse.

## Download Eclipse
First, you will need to download and install a version of Eclipse that supports Java development. Open the 
following link and choose a version for your platform.

> [Eclipse IDE for Java Developers](http://www.eclipse.org/downloads/packages/eclipse-ide-java-developers/mars1)
	
Follow the installation instructions for Eclipse and start the IDE.

## Install eGit Plugin
Once Eclipse is installed, you will need to install a plugin to allow it to interact with the SiteWhere Git 
repository. The following steps will guide you though locating and installing the plugin.

1. In the Eclipse menu, choose **Help > Install New Software**.
2. In the **Work with:** dropdown, choose the Eclipse version you are using to view the plugins available.
3. Open the **Collaboration** category and choose **Eclipse EGit** and **Eclipse EGit Mylyn GitHub Feature**.
4. Continue clicking **Next** and accept the license agreement, then click **Finish**.
5. Restart Eclipse when prompted to complete the installation.
6. Click **Window > Preferences** to open the preferences editor, then choose **Team > Git** to open the EGit plugin preferences.
7. Note the **Default repository folder** setting. This is where your git repositories will be created. 
   You can change the location if the default value isn\'t acceptable.

## Import SiteWhere Respository
All of the core SiteWhere Java code is kept in a single GitHub repository. Previously, each module had its
own repository, but they have since been combined. 

### Get Project from GitHub
The next step is to import the SiteWhere source code into your Eclipse development environment. The 
following steps will create a local copy of the SiteWhere repository for you:

1. Click **File > Import** in the Eclipse menu.
2. Choose **Git > Projects from Git** then click Next.
3. Choose **GitHub** as the repository source.
4. Type **sitewhere** in the search box and click Search.
5. Choose **sitewhere/sitewhere** from the list, then keep clicking **Next** until the
   end of the wizard and click **Finish**.
    
Once the repository has been loaded into Eclipse, it will automatically be compiled. The compilation will 
result in errors due to missing library dependencies. In order to load the required libraries onto your local 
machine, you will need to install Apache Maven.
 
## Install Gradle and Build Projects
SiteWhere uses [Gradle](http://gradle.org/) to build project artifacts. The SiteWhere repository includes
the [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) so there is no need
to install extra tools to build the artifacts. To build the web archive (WAR) file, run the following
in the project root folder:

{% highlight bash %}
gradlew clean war
{% endhighlight %}
	
The Gradle build will clean any existing build artifacts, download all of the dependencies, and compile all
of the projects individually. The final result from the build process is a web archive (WAR) file in the 
**sitewhere-web/build/libs** directory. The filename can be renamed to **sitewhere.war** and copied into
the SiteWhere **webapps** folder.

To build a completely functional server (as you would find on the SiteWhere [downloads](http://www.sitewhere.org/downloads/)
page), execute one of the following commands:

For a Windows installation run:

{% highlight bash %}
gradlew clean serverZip
{% endhighlight %}

For a Linux/Max installation run:

{% highlight bash %}
gradlew clean serverTar
{% endhighlight %}

The installable artifacts can be found in the **build/distributions** folder.
