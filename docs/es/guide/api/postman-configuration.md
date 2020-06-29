# Usando Colección de Postman

## Instalar Colección de Postman
Para instalar la Colección de Postman, primero se debe instalar la aplicación Postman para Windows, Mac o Chrome. Se puede descargar la aplicación desde [Postman Apps](https://www.getpostman.com/apps).

A continuación, se puede instalar la colección haciendo clic en el botón Run in Postman.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/78d8f4507adfab6ed0d8)



##  Entorno de Postman
Un entorno es un conjunto de variables que puede usarse en las solicitudes de Postman. Se puede usar entornos para agrupar conjuntos de valores relacionados y administrar el acceso a los datos compartidos de Postman.

Debe crear un entorno de Postman para utilizar la colección importada. Para crear ver [Create Environment](https://learning.postman.com/docs/postman/variables-and-environments/managing-environments/#creating-environments).

Dicho entorno debe tener definidas las siguientes variables. Para agregar variables ver [Add environment variables](https://learning.postman.com/docs/postman/variables-and-environments/managing-environments/#adding-environment-variables).

Variable     |  Ejemplo
------------ | --------------------------------
baseUrl      |   http://server:port/sitewhere/api 
tokenBaseUrl |   http://server:port/sitewhere
user         |   admin
tenant       |   default
tenantAuth   |   sitewhere1234567890
token        |

 ## Seguridad
 Para realizar una solicitud primeramente se debe obtener un token JWT para autorizar y autenticar al usuario para que éste pueda realizar peticiones. Para ello la colección posee una carpeta Autorizacion con un método llamado JWT.  
 Este método utiliza una autorización del tipo Basic, que requiere usuario y contraseña, esta contraseña se debe ingresar en la sección Autorización del método en Postman, en cambio el usuario se obtiene de la variable de entorno.  
 Este método utiliza las siguientes variables
 
Variable     |  Ejemplo
------------ | -------------------------------- 
tokenBaseUrl |   http://server:port/sitewhere
user         |   admin
token        |

La variable tokenBaseUrl es donde se encuentra corriendo su instancia de Sitewhere REST API.  
La variable user es configurada en la seguridad de Sitewhere.   
La variable token es obtenida y asignada automáticamente luego de una petición exitosa.

La siguiente imagen es un ejemplo de obtención de un token válido.

<InlineImage src="/images/postman/JWT_Request.png" caption="JWT Request"/>

Si la respuesta es exitosa en la sección test la variable _token_ es asignada, mediante el siguiente script

```javascript
if(pm.response.code === 200) {
    var data= pm.response.headers.one('x-sitewhere-jwt').value;
    pm.environment.set("token", data);
}
```
### Encabezados de solicitud de tenant
Cuando se peticiona a un servicio de tenant en particular, se debe agregar dos encabezados adicionales a la solicitud. Para ello se utilizan las siguientes variables de entorno:

Variable     |  Ejemplo
------------ | ---------------------
tenant       |   default
tenantAuth   |   sitewhere1234567890

En la colección de Postman, si edita la colección, consulte esto en la pestaña Pre-Request Script.

<InlineImage src="/images/postman/edit_collection.png" caption="Edit Collection"/>
   
Este script asigna los valores a las variables de entorno y se hereda para todas las solicitudes de la colección, indicando la autenticación y el tenant sobre el que se realiza la petición.

```javascript
pm.request.headers.add({key: 'X-SiteWhere-Tenant-Id', value: pm.environment.get('tenant') }); 
pm.request.headers.add({key: 'X-SiteWhere-Tenant-Auth', value: pm.environment.get('tenantAuth') });
let tokenStr = 'Bearer '+ pm.environment.get('token'); 
pm.request.headers.add({key: 'Authorization', value: tokenStr}); 
```
