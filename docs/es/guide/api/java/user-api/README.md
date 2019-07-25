# :book: Java API - Users

<Seo/>

Esta sección contiene la documentación y ejemplos del end point `users` de la API de Java de SiteWhere.

## Listar system user

El siguiente ejemplo muestra cómo listar los usuario del sistema.

```java
SearchResults<User> users = client.listUsers();
```

## Crear un User

El siguiente ejemplo muestra cómo crear un `user`.

```java
// Create a UserCreateRequest
UserCreateRequest createRequest = new UserCreateRequest();
createRequest.setToken("e2ce4ffe-2d9c-4103-b519-1e07c58a2886");
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

La siguiente tabla muestra las autoridades que se pueden asignar a un usuario.

| Authority                   | Descripción                           |
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

## Actualizar un  User

El siguiente ejemplo muestra cómo actualizar un `user`.

```java
// Create a UserCreateRequest
UserCreateRequest createRequest = new UserCreateRequest();
createRequest.setToken("e2ce4ffe-2d9c-4103-b519-1e07c58a2886");
createRequest.setFirstName("John");
createRequest.setLastName("Doe");
createRequest.setStatus(AccountStatus.Active);
createRequest.setUsername("johndoe");
createRequest.setPassword("1234");

List<String> authorities = new ArrayList<String>();
authorities.add("GRP_SERVER");
createRequest.setAuthorities(authorities);

// Update the User
User updatedUser = client.updateUser(createRequest);
```

## Barrar un User

El siguiente ejemplo muestra cómo borrar un `user`.

```java
User deletedUser = client.deleteUser("e2ce4ffe-2d9c-4103-b519-1e07c58a2886");
```

## Obtener las Autoridades de un usuario

El siguiente ejemplo muestra cómo obtener la lista de permisos para un `user`.

```java
SearchResults<GrantedAuthority> auths = client.listUserAuthorities("e2ce4ffe-2d9c-4103-b519-1e07c58a2886");
```
