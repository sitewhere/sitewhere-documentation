# Guía de Administración del Sistema

<Seo/>

Esta guía cubre la instalación y el uso de la aplicación de administración de instancias de SiteWhere, diseñada 
para la configuración de instancias y la administración de datos de inquilinos.

## Tecnologías Utilizadas

La aplicación administrativa se crea utilizando las siguientes tecnologías.:

- [Vue.js](https://vuejs.org/) - Framework Progresivo en JavaScript para Front-end.
- [Vuetify.js](https://vuetifyjs.com) - Framework con estética Material Design para Vue.js
- [Electron](https://electronjs.org/) - Aplicación web de paquetes como aplicación instalable con acceso a recursos específicos del sistema operativo.

## Instalación

Las últimas versiones de la aplicación administrativa siempre están disponibles en la página de GitHub 
[releases](https://github.com/sitewhere/sitewhere-admin-ui/releases) del repositorio de código. Después 
de descargar y ejecutar el instalador para su sistema operativo, la aplicación administrativa SiteWhere 
está lista para usar.

## Login

La página inicial que se muestra al abrir la aplicación es la página de inicio de sesión del sistema. Para 
iniciar sesión en la aplicación, una instancia de SiteWhere debe estar disponible para conectarse. Se puede 
usar una sola instalación de la aplicación administrativa para conectarse a cualquier número de instancias 
remotas de SiteWhere cambiando la información de conexión debajo del nombre de usuario y contraseña.

Elija el protocolo, el nombre de host y el puerto de la instancia (los valores predeterminados funcionarán 
para una instancia local con la configuración predeterminada). Si usa una instancia con los datos de usuario 
predeterminados, un usuario con derechos administrativos estará disponible con las siguientes credenciales:

| Usuario  | Password   |
| :------- | :--------- |
| `admin`  | `password` |

<InlineImage src="/images/guide/administration/login.png" caption="Administrative Login"/>

## Configuración de Conexiones

Desde la página de login podemos editar la configuración de las conexiones a instancias de SiteWhere haciendo clic 
en en el lápiz a la derecha de la conexión seleccionada. Una vez abierto el popup `Edit Remote Connection Settings` 
en la parte superior se listan las conexiones disponibles, las cuales se pueden borrar o seleccionar la conexión 
por defecto. En la parte inferior es posible agregar una nueva conexión indicando el nombre de la misma, como también 
protocolo HTTP, nombre del servidor y puerto, para agregar presionar el botón `+`. 

<InlineImage src="/images/guide/administration/connection-settings.png" caption="Connection Settings" />
