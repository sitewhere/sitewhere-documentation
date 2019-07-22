# :book: SiteWhere Development Guide

<Seo/>

This guide provides information intended for developers interested
in building SiteWhere components from source code. It provides details
about downloading the source code, installing the required build tools,
then building Docker images that can be used to deploy an instance.

## Accessing Source Code on GitHub

The source code for SiteWhere is available on [GitHub](https://github.com/)
at the following location:

[SiteWhere Core Repository](https://github.com/sitewhere/sitewhere)

The repository includes source code as well as issue tracking and other
aspects of the development ecosystem.

### Branch Structure for Repository

Source code checked in to the _master_ branch is always from the
latest released version of SiteWhere. Each release is tagged and may be
accessed by downloading an archive from the
[releases](https://github.com/sitewhere/sitewhere/releases) page or
by cloning the repository and checking out the branch corresponding to
the release. The branch for the upcoming SiteWhere 2.0 release is available
at the location below:

[SiteWhere 2.1.0 Branch](https://github.com/sitewhere/sitewhere/tree/sitewhere-2.1.0)

New functionality is always developed in a separate branch and is
eventually merged to _master_ as part of the release cycle.

### Pulling Source Code From GitHub

In order to work with the code, it will need to be cloned from GitHub onto
your local machine. The following link covers a few options for installing
a Git client for accesing the repository:

[Install a Git Client](https://help.github.com/articles/set-up-git/)

With a Git client installed, start by cloning the SiteWhere core repository.
If using the command line client you can execute the following
commands to clone the repository and change to the current branch:

```bash
git clone https://github.com/sitewhere/sitewhere.git
cd sitewhere
git checkout --force sitewhere-2.1.0
```

The result of the commands should look similar to the output below:

<InlineImage src="/images/development/git-command-line-clone.png" caption="Git Command Line Clone"/>

### Building from Source

SiteWhere includes build scripts that make it easy to build deployable
artifacts from the source code. Before building the code, there are a couple
of tools that must be installed.

### Install Java 8

All of the core source code is written in Java, so a Java compiler is required.
Recent versions of SiteWhere use features of Java 8, so the JDK or JRE must
be 1.8 or above.

[Download and Install Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

Once installed, the version can be verified as shown below:

<InlineImage src="/images/development/java-version-check.png" caption="Java Version Check"/>

### Install Docker Engine

SiteWhere 2.0 uses Docker as the core deployment model, so the deployment
artifacts from the build process are Docker images. In order to have a local
repository and APIs available for the build scripts to interact with, install
a local copy of Docker Engine as explained below:

[Install Docker Engine](https://docs.docker.com/engine/installation/)

Verify that Docker Engine has been installed successfully by running the command
below:

<InlineImage src="/images/development/docker-engine-version.png" caption="Docker Engine Version"/>

Configure the Docker daemon is to listen on TCP port 2375. This is the default API
port, but most installations do not enable the port by default. An example of the
required update for Ubuntu 16.04 can be found
[here](https://www.ivankrizsan.se/2016/05/18/enabling-docker-remote-api-on-ubuntu-16-04/).

### Execute Gradle Build Script

The root folder of the source code contains a [Gradle](https://gradle.org/) build
script (_build.gradle_) that compiles the Java code, packages it into Docker images, then pushes
the images to a Docker repository. By default, the Gradle script will attempt to
push the images to a repository running on _localhost_. Information for another
repository can be added as an override by adding the following lines the
_gradle.properties_ (or _~/.gradle_ on Unix) file in your default user directory:

```properties
dockerProtocol=tcp
dockerHostname=192.168.171.100
dockerPort=2375
dockerRepository=docker.io
registryUsername=(your docker username)
registryPassword=(your docker password)
registryEmail=(your docker email address)
```

SiteWhere includes Gradle [Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
artifacts, so that there is no need to install Gradle independently. To build all of the core
libraries, package the microservices into Docker images and push them into your local
repository, execute the following command.

```bash
gradlew clean dockerImage
```

The first time the build executes will take significantly longer since Gradle
must download all of the dependencies and cache them for later use. When
the build script completes, execute the following command to view the
list of Docker images which should now include images for all of the
SiteWhere microservices:

<InlineImage src="/images/development/docker-image-list.png" caption="Docker Image List"/>

### Creating Debug Images

In addition to the standard microservice images, the Gradle build may be parameterized
to generate debug images which expose a port for remote Java debugging. In order to
generate debug images, execute the following command:

```bash
gradlew clean dockerImage -Pdebug
```

The debug images use a version identifier prefixed with _debug-_ to prevent confusing
them with non-debug images. Note that there is a separate SiteWhere recipe for running
the debug Docker images since the debug port for each microservice must be remapped
to a different port. Using the debug images allows you to connect from a remote debugger
(such as the one in Eclipse) and set breakpoints in the running microservices.

Read [this](./debug.md) to connect a debugger to SiteWhere.

## Next Steps

Now that Docker images have been generated for the microservices, follow the steps in the
deployment guide to use SiteWhere recipes that assemble the microservices into a working
instance.
