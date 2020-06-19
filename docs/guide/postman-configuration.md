# Postman Configuration

## Install Postman Collection
To install the Postman Collection, you must first install the Postman App for Windows, Mac, or Chrome. You can download any of these from [Postman Apps](https://www.getpostman.com/apps).

Next, install the Collection by clicking on the relevant Run in Postman button.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/78d8f4507adfab6ed0d8)



##  Postman Environment
An environment is a set of variables you can use in your Postman requests. You can use environments to group related sets of values together and manage access to shared Postman data.

To use the imported collection, you must create a Postman Environment. See [Create Environment](https://learning.postman.com/docs/postman/variables-and-environments/managing-environments/#creating-environments).

This environment must have defined the following variables. See [Add environment variables](https://learning.postman.com/docs/postman/variables-and-environments/managing-environments/#adding-environment-variables).

Variable     |  Sample Value
------------ | --------------------------------
baseUrl      |   http://server:port/sitewhere/api 
tokenBaseUrl |   http://server:port/sitewhere
user         |   admin
tenant       |   default
tenantAuth   |   sitewhere1234567890
token        |

 ## Security
 To make a request, you must first obtain a JWT token to authorize and authenticate the user, so that he can make requests. For this, the collection has an Authorization folder with a method called JWT.  
 This method uses an authorization of the Basic type, which requires username and password, this password must be entered in the Method authorization section in Postman, instead the username is obtained from the environment variable user.  
 This method uses the following variables
 
Variable     |  Sample Value
------------ | -------------------------------- 
tokenBaseUrl |   http://server:port/sitewhere
user         |   admin
token        |

The tokenBaseUrl variable is where your Sitewhere REST API instance is running.  
The user variable is configured in Sitewhere security.  
The token variable is automatically obtained and assigned after a successful request.

The following image is a request example of obtaining a valid token

<InlineImage src="/images/postman/JWT_Request.png" caption="JWT Request"/>

If the answer is successful in the test section the _token_ variable is assigned, using the following script

```javascript
if(pm.response.code === 200) {
    var data= pm.response.headers.one('x-sitewhere-jwt').value;
    pm.environment.set("token", data);
}
```
### Tenant Request Headers
When you request a particular tenant service, you need to add two additional headers to your Request. For that you use the following environment variables:

Variable     |  Sample Value
------------ | ---------------------
tenant       |   default
tenantAuth   |   sitewhere1234567890

In the postman collection if you edit the collection, you will see this in Pre-Request Script Tab.

<InlineImage src="/images/postman/edit_collection.png" caption="Edit Collection"/>
   
This script assigns the values ​​to the environment variables and is inherited for all the requests in the collection, indicating the authentication and the tenant on which the request is made.

```javascript
pm.request.headers.add({key: 'X-SiteWhere-Tenant-Id', value: pm.environment.get('tenant') }); 
pm.request.headers.add({key: 'X-SiteWhere-Tenant-Auth', value: pm.environment.get('tenantAuth') });
let tokenStr = 'Bearer '+ pm.environment.get('token'); 
pm.request.headers.add({key: 'Authorization', value: tokenStr}); 
```
