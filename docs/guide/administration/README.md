# :book: System Administration Guide

<Seo/>

This guide covers installation and use of the SiteWhere instance administration
application which is designed for instance configuration and tenant data
management.

## Technologies Used

The administrative application is built using the following technologies:

- [Vue.js](https://vuejs.org/) - Reactive JavaScript front-end framework.
- [Vuetify.js](https://vuetifyjs.com) - Comprehensive Material Design framework for Vue.js
- [Electron](https://electronjs.org/) - Packages web application as installable application with access to OS-specific resources.

## Installation

The latest versions of the administrative application are always available on the
GitHub [releases](https://github.com/sitewhere/sitewhere-admin-ui/releases) page
of the code repository. After downloading and running the installer for your operating
system, the SiteWhere administrative application is ready to use.

## Login

The initial page shown upon opening the application is the system login page. In order
to log in to the application, a SiteWhere instance must be available to connect to. A
single installation of the administrative application may be used to connect to any number
of remote SiteWhere instances by changing the connection information beneath the
username and password.

Choose the protocol, hostname and port of the instance (the defaults will work
for a local instance with default settings). If using an instance populated with the
default user data, a user with administrative rights will be available using the
following credentials:

| Username | Password   |
| :------- | :--------- |
| `admin`  | `password` |

<InlineImage src="/images/guide/administration/login.png" caption="Administrative Login"/>
