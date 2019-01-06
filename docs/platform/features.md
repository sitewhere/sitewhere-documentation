<Seo/>
# New Features

Beyond the core architectural changes, the SiteWhere 2.0 platform introduces
a number of new features intended to make the system easier to use while improving
security and streamlining common tasks.

## Separate Configuration of Global Services

Upon administrative login, the landing page now shows global system functionality
rather than skipping directly to tenant configuration. This allows aspects such as
the configuration of global microservices, users and tenants to be handled
separately.

<InlineImage src="/images/platform/tenant-management.png" caption="Tenant Management"/>

## Tenant Configuration and Data Templates

When creating a new system tenant, there are now separate templates for
the tenant configuration and the default data loaded into the configuration.
This allows common configurations for infrastructure without forcing a
preloaded dataset for the configuration. Configuration templates are
available for saving device events to MongoDB, InfluxDB, and Apache Cassandra.
Data templates are available for the standard _construction_ dataset, as well
as the _air traffic_ dataset, and _empty_ which doesn't load any data.

## Centralized Configuration Management

With the introduction of the concept of a SiteWhere instance in 2.x,
many settings can now be configured at a global level and referenced by
tenants, allowing for centralized management.

### Persistence Configurations

Configuration settings for data persistence are now available at the instance level,
allowing database details to be specified globally and reused in tenants. The
tenants can reference the configurations by id and are automatically updated
if changes are made globally. There is still the option of configuring database
settings locally for tenants if global configuration is not needed. The
microservices architecture also allows persistence settings to be controlled
at a finer level (e.g. different databases for tenant device management and
asset management) if desired.

<InlineImage src="/images/platform/persistence-configurations.png" caption="Persistence Configuration"/>

### Variable Replacement in Datastore Configuration

When configuring database connectivity settings such as hostname and database
name, SiteWhere now allows for the use of variable substitution in names,
allowing for per-tenant settings that are derived from a global expression.
For instance, this supports the existing approach of using a database per
tenant when configuring MongoDB, but also supports other approaches such as
having a separate MongoDB instance for each tenant by using variable substitution
in the hostname.

The user interface also now directly supports the mapping of system environment
variables to override configuration settings. Using this approach, the microservice
can be configured externally (e.g. via Helm chart) to pass variables to configure
SiteWhere components.

<InlineImage src="/images/platform/db-variable-substitution.png" caption="Variable Sustitution"/>

### InfluxDB Improvements

The 1.x implementation of InfluxDB for event management did not fully support
multitenancy. In the 2.0 platform, InfluxDB may be configured globally using
variable substitution so that each tenant has its own InfluxDB database. The
updates also include an upgrade to the latest version of the InfluxDB Java
client to support that latest bug fixes and performance improvements.

## Improved Administrative User Interface

SiteWhere 2.0 features a new administrative user interface based on
[Vue](https://vuejs.org/) along with [Vuetify](https://vuetifyjs.com/)
for a look that is more consistent with Google [Material Design](https://material.io/)
guidelines. The interface is built in a component-oriented fashion for a
more efficient development workflow. The longer-term plan is to release
reusable component libraries so that SiteWhere UI/API components can easily
be used in other Vue projects.

<InlineImage src="/images/platform/vue-user-interface.png" caption="Vue User Interface"/>

## Improved Scripting Support

Many aspects of the SiteWhere platform leverage pluggable scripts to support
customization of processing behaviors. SiteWhere 2.0 provides comprehensive
support for scripting and adds many new script management features. A library
of custom scripts can be quickly developed directly from within the SiteWhere
administrative application and shared across the entire distributed system
without any manual intervention.

### Script Storage and Metadata

Scripts are now stored in the central ZooKeeper tree, which allows for a
publish/subscribe strategy where nodes can listen for script updates they
are interested in. In addition to the script content, a metadata structure
has been added so that other aspects such as a human-readable name, description,
script language, and other attributes may be captured. New APIs have been added,
allowing scripts to be managed remotely without the need for direct interactions
with ZooKeeper.

### Script Versioning

In addition to the core metadata for a script, the system now tracks versioning
information for scripts as updates are made over time. New versions can be added
via the APIs, then activated so that they are broadcast to dependent microservices.
The new versioning mechanism allows scripts to be rolled back to previous versions
if an update causes issues.

### Scripting User Interface

The admistrative user interface now fully supports script management. Both metadata
and content for new scripts can be added via the user interface, which supports
syntax highlighting and many other features. New script versions may be added from
scratch or by cloning existing scripts and modifying them via the user interface.

<InlineImage src="/images/platform/scripting-ui.png" caption="Scripting User Interface"/>

## Data Model

The SiteWhere 2.0 data model adds a number of new concepts which improve the
ability to model common use cases. In addition, some of the existing entities
from the previous framework have been renamed and/or reorganized based on
observations of real-world use.

### Customers and Customer Types

Customer entities allow for a hierarchical representation of device ownership
and help to organize devices into logical groupings. Any number of devices
may be assigned to a customer and customer assignments may change over time
(with retained assignment history). Telemetry data acquired from devices
may be queried based on the customer that was assigned at the time the
data was received.

Customers are defined relative to the concept of a "customer type", which
allows customers to be organized by cross-cutting concerns.

### Areas and Area Types

Area entities allow for a hierarchical representation of devices by location.
Areas include geospatial information such as a bounding polygon that defines
the border of the area. Devices may be assigned to areas, allowing the system
to handle tasks such as monitoring entry/exit from an area. Telemetry data
acquired from devices may be queried based on area assigned when the data
was received.

Areas are defined relative to the concept of an "area type", which allows
areas to be organized by cross-cutting concerns.

### Device Types

The concept of "device specifications" from the previous framework has been
re-introduced as "device types" in SiteWhere 2.0. Device types contain
information about a class of devices including commands that can be issued
and custom status indicators.

### Assets and Asset Types

SiteWhere 2.0 expands the asset model from the previous framework to include
both assets and asset types. Asset types contain metadata about a class of
assets. Assets are unique instances of an asset type.

### New Id Management Structure

A common complaint with the SiteWhere 1.x data model was that the unique ids for
objects (e.g. hardware id for a device) could not be changed after initial creation.
In 2.0, all core objects now have a UUID in addition to user-facing ids so that
user-facing identifiers may be changed without violating data integrity. With the
update, device hardware ids, assignment tokens, etc may be updated without breaking
referential integrity.

## Security Improvements

System security is always a high priority for SiteWhere and the 2.0 release contains
a number of updates that bolster the existing infrastructure.

### JSON Web Token

The SiteWhere REST APIs have moved from HTTP basic authentication to using
[JWT](https://jwt.io/introduction/) to provide identity information. A separate
REST API is now available that allows an application/user to obtain a time-limited
token based on their system credentials. All REST calls must now contain the JWT to
provide authentication information. The JWT is passed from the REST gateway into
the microservices that satisfy the requests so that all nested calls have user
context information. As such, any direct access via gRPC channels must also provide
a valid JWT.

### Updated Security Headers

SiteWhere 2.0 requires three headers to be passed with each REST call. The JWT
header is required for user authentication. Another header contains the token for
the tenant the operation applies to. A third header contains an authentication
token specific to the tenant which verifies access to the tenant information
independently of the user authentication. Changing the authentication token on a
regular basis may be used as a strategy for preventing unauthorized devices
from registering with the system.
