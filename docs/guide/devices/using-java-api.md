# :book: Using SiteWhere Java API

<Seo/>

SiteWhere provides a Java API for accessing the REST API of SiteWhere. This guide shows how to use
SiteWhere Java API to interact with an instance of SiteWhere.

## Importing the Library

SiteWhere Java Client library is published on [Maven Central](https://search.maven.org/search?q=a:sitewhere-java-client)
for using dependency management tools, such as Apache Maven or Gradle.

If you are using [Apache Maven](https://maven.apache.org/), add the following dependency to your `pom.xml`.

```xml
<dependency>
    <groupId>com.sitewhere</groupId>
    <artifactId>sitewhere-java-client</artifactId>
    <version>2.1.x</version>
</dependency>
```

If you are using [Gradle](https://gradle.org/), add the following dependency to your `build.gradle`.

```groovy
implementation 'com.sitewhere:sitewhere-java-client:2.1.x'
```

## Creating a client instance

A new client with the default settings may be created as follows:

```java
ISiteWhereClient client = SiteWhereClient.newBuilder().build().initialize();
```

The default settings are:

| Attribute   | Value        |
|:------------|:-------------|
| Protocol    | HTTP         |
| Hostname    | localhost    |
| Port        | 80           |
| Username    | admin        |
| Password    | password     |

::: warning
Since SiteWhere 2.1.x the default `Port` number changed from 8080 to 80.
:::

Note that the `initialize()` method must be called before using the client. This sets
up the template and connects to the server to acquire a JWT.

To change the default connection settings use:

```java
SiteWhereClient client = SiteWhereClient.newBuilder().withConnectionTo("https", "myhost", 8081).build().initialize();
```

To connect as a different user user:

```java
SiteWhereClient client = SiteWhereClient.newBuilder().forUser("myuser", "mypassword").build().initialize();
```

## Interacting with SiteWhere Model

Once the client has been initialized, methods on it may be invoked to interact with the data
model on the remote SiteWhere instance. There are two types of calls, global calls and
tenant-specific calls.

### Global Calls

For global calls, no extra information is required in order to make the invocation.

#### Getting SiteWhere version information

To get the instance version information, invoke:

```java
Version version = client.getSiteWhereVersion();
```

#### Users API

##### Listing system user

```java
SearchResults<User> users = client.listUsers();
```

##### Creating a User

```java
// Create a UserCreateRequest
UserCreateRequest createRequest = new UserCreateRequest();
createRequest.setToken(token);
createRequest.setFirstName("John");
createRequest.setLastName("Doe");
createRequest.setStatus(AccountStatus.Active);
createRequest.setUsername("johndoe");
createRequest.setPassword("1234");

List<String> authorities = new ArrayList<String>();
authorities.add("GRP_SERVER");
createRequest.setAuthorities(authorities);

// Create the User
User createdUser = client.createUser(createRequest);
```

The following table show the autorities you can assign to a user

| Authority                   | Description                           |
|:----------------------------|:--------------------------------------|
| GRP_SERVER                  | Server administration                 |
| AUTH_VIEW_SERVER_INFO       | View global server information        |
| GRP_ACCESS                  | Remote access                         |
| AUTH_REST                   | REST services access                  |
| AUTH_ADMIN_CONSOLE          | Administrative console login          |
| GRP_USERS                   | Users                                 |
| AUTH_ADMINISTER_USERS       | Administer all users                  |
| AUTH_ADMINISTER_USER_SELF   | Administer own user profile           |
| GRP_TENANTS                 | Tenants                               |
| AUTH_ADMINISTER_TENANTS     | Administer all tenants                |
| AUTH_ADMINISTER_TENANT_SELF | Administer own tenant                 |
| GRP_SCHEDULES               | Schedules                             |
| AUTH_ADMINISTER_SCHEDULES   | Administer schedules                  |
| AUTH_SCHEDULE_COMMANDS      | Schedule batch or individial commands |
