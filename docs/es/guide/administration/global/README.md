# :book: Global Configuration

This guide covers administration of global features associated with a SiteWhere
instance.

After successful login, the system administration page is displayed. This page supports
instance-level configuration such as adding instance users, adding/configuring tenants
and configuring global microservices.

<InlineImage src="/images/guide/administration/system-administration.png" caption="System Administration"/>

## Tenant Management

SiteWhere is a multitenant system which means that multiple isolated applications
may use the same SiteWhere instance simultaneously. Unlike many other platforms
where multiple tenants share the same database, SiteWhere tenants are completely
separated from each other both in persistence of their data and in the underlying
processing pipeline. SiteWhere tenants:

- Use separate databases and may use different database infrastructure on a per-tenant basis.
- Use separate Kafka processing queues so that in-flight information is not co-mingled.
- Use separate _tenant engines_ which are configured independently and may be started/stopped without affecting other tenants

Tenant management features may be accessed by clicking **:fa-layer-group: Manage Tenants**
in the toolbar of the global configuration settings.

### Adding a New Tenant

New tenants may be added by clicking the **:fa-plus:** symbol in the upper-right corner of
the tenant list screen

::: warning
This guide is under active development. Check back for updates.
:::
