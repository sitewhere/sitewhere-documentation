# :book: Configuration Management

<Seo/>

The SiteWhere 2.0 architecture provides an externalized and highly-available configuration
management subsystem based on [Apache Zookeeper](https://zookeeper.apache.org/). Rather than
storing configuration information locally, SiteWhere microservices connect to Zookeeper
and query for the configuration that applies to them.

## Zookeeper Infrastructure

TODO: Review
The SiteWhere [Helm chart](https://github.com/sitewhere/sitewhere-k8s/tree/sitewhere-k8s-0.2.0/charts)
includes a [template](https://github.com/sitewhere/sitewhere-k8s/blob/sitewhere-2.0.1/charts/sitewhere/templates/Zookeeper.yaml)
which is used to configure the Zookeeper components the system relies on. As part of the
list of core infrastructure services required by SiteWhere, the Zookeeper pods must have
been successfully deployed before any SiteWhere micrsoservices are allowed to start.
