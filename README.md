# SiteWhere Community Edition Documentation

This repository contains artifacts used to generate documentation for SiteWhere Community Edition.

## Build

In order to build the documentation you need to run the following command:

```console
npm install
npm run docs:build
```

To run it in developer mode, execute the following command:

```console
npm install
npm run docs:dev
```

Build OpenAPI Static Documentation

```console
cd docs/.vuepress/public/api2/
wget -O sitewhere-api.json http://localhost:8080/sitewhere/api/v2/api-docs
redoc-cli bundle sitewhere-api.json --options.theme.colors.primary.main=#dc0000 -t sitewhere-docs.hbs
mv redoc-static.html index.html
```

Access the documentation at this [url](http://localhost:8080/).
