<Seo/>
# Architecture Guide

This guide covers core concepts of the SiteWhere 2.0 architecture and is intended
to provide an understanding of how the system works at a low level. While knowledge
of these concepts is not required for deploying and configuring a SiteWhere instance,
it does provide a basis for grasping how various parts of the system interact.

For information about the functionality provided by the individual microservices
and how to configure them, see the [microservice guides](../microservices/).

## Configuration Management

SiteWhere provides an externalized and highly-available configuration management
subsystem based on [Apache Zookeeper](https://zookeeper.apache.org/). Microservices
do not contain any locally persisted configuration information, but instead
connect to Zookeeper for their configuration when bootstrapping.

See the configuration management [guide](./configuration-management.md) for more information.
