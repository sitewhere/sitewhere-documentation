==============================
SiteWhere Server Configuration
==============================

When a SiteWhere server starts, it bootstraps using an XML configuration file
which contains settings for various aspects such as the database location. Note
that these settings are for the server as a whole and not the same ones used
to configure individual tenants. Most users rarely (if ever) update the base server 
configuration. The server configuration file is located in the SiteWhere home
directory in the **conf** folder and is named **sitewhere-server.xml**. Below 
is an example of the XML content.

.. literalinclude:: sitewhere-server.xml
   :language: xml
   
This is text after the xml.