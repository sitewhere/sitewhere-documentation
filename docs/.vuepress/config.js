var pkginfo = require("../../package.json");

module.exports = {
  title: "SiteWhere",
  description:
    "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation",
  head: [
    ["link", { rel: "icon", href: "/images/favicon.ico" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.6.3/css/all.css",
        integrity:
          "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/",
        crossorigin: "anonymous"
      }
    ]
  ],
  dest: "dist",
  base: "/docs/" + pkginfo.version + "/",
  ga: "UA-122806506-1",
  locales: {
    "/": {
      lang: "en-US",
      title: "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation",
      description:
        "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation"
    },
    "/es/": {
      lang: "es",
      title: "Documentación SiteWhere CE " + pkginfo.version.toUpperCase(),
      description:
        "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation"
    }
  },
  markdown: {
    config: md => {
      md.use(require("markdown-it-fontawesome"));
    }
  },
  themeConfig: {
    logo: "/images/logo.svg",
    sidebar: {
      "/platform/": [
        "",
        "architecture",
        "object-model",
        "device-management",
        "asset-management",
        "event-management",
        "microservice-overview",
        "twelve-factor"
      ],
      "/guide/architecture/": ["configuration-management"],
      "/guide/deployment/": ["", "common-issues", "backup-restore"],
      "/guide/administration/": ["", "global/", "tenant/"],
      "/guide/devices/": ["sending-data", "android", "kura"],
      "/guide/api/java/": [
        "",
        "system-api/",
        "user-api/",
        "tenant-api/",
        "area-api/",
        "area-type-api/",
        "asset-api/",
        "asset-type-api/",
        "batch-operations-api/",
        "assignment-api/",
        "command-invocations-api/",
        "customer-api/",
        "customer-type-api/",
        "device-api/",
        "assignment-api/",
        "device-command-api/",
        "device-event-api/",
        "device-group-api/",
        "device-state-api/",
        "device-status-api/",
        "device-type-api/",
        "schedule-api/",
        "scheduled-job-api/",
        "zone-api/"
      ],
      "/guide/api/javascript/": [""],
      "/guide/api/": ["java/", "javascript/"],
      "/guide/microservices/": [
        "asset-management/",
        "batch-operations/",
        "command-delivery/",
        "device-management/",
        "device-registration/",
        "device-state/",
        "event-management/",
        "event-search/",
        "event-sources/",
        "inbound-processing/",
        "instance-management/",
        "label-generation/",
        "outbound-connectors/",
        "rule-processing/",
        "schedule-management/",
        "streaming-media/",
        "tenant-management/",
        "user-management/",
        "web-rest/"
      ],
      "/guide/": [
        "architecture/",
        "deployment/",
        "administration/",
        "devices/",
        "microservices/",
        "api/"
      ],
      "/deployment/": [""],
      "/development/": [""]
    },
    locales: {
      "/": {
        label: "English",
        selectText: "Languages",
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",
        nav: [
          { text: "Platform", link: "/platform/" },
          { text: "Installation", link: "/deployment/" },
          {
            text: "User Guides",
            items: [
              {
                text: "Architecture Guide",
                link: "/guide/architecture/"
              },
              { text: "Deployment Guide", link: "/guide/deployment/" },
              {
                text: "System Administration Guide",
                link: "/guide/administration/"
              },
              {
                text: "Device Interaction Guides",
                link: "/guide/devices/"
              },
              {
                text: "Microservice Guides",
                link: "/guide/microservices/"
              },
              {
                text: "API Guides",
                link: "/guide/api/"
              }
            ]
          },
          { text: "Development", link: "/development/" }
        ]
      },
      "/es/": {
        label: "Español",
        selectText: "Idiomas",
        editLinkText: "Edita esta página en GitHub",
        lastUpdated: "Última actualización",
        nav: [
          { text: "Plataforma", link: "/es/platform/" },
          { text: "Instalación", link: "/es/deployment/" },
          {
            text: "Guías del usuario",
            items: [
              {
                text: "Guía de Arquitectura",
                link: "/es/guide/architecture/"
              },
              {
                text: "Guía de Despliegue",
                link: "/es/guide/deployment/"
              },
              {
                text: "Guía de Administración del Sistema",
                link: "/es/guide/administration/"
              },
              {
                text: "Guías de Integración con Dispositivos",
                link: "/es/guide/devices/"
              },
              {
                text: "Guía de Microservicios",
                link: "/es/guide/microservices/"
              },
              {
                text: "Guías de APIs",
                link: "/es/guide/api/"
              }
            ]
          },
          { text: "Desarrollo", link: "/es/development/" }
        ],
        sidebar: {
          "/es/platform/": [
            "",
            "architecture",
            "objectmodel",
            "features",
            "microservice-overview",
            "twelve-factor"
          ],
          "/es/guide/architecture/": ["configuration-management"],
          "/es/guide/deployment/": ["", "common-issues", "backup-restore"],
          "/es/guide/administration/": ["", "global/", "tenant/"],
          "/es/guide/devices/": ["sending-data", "android", "kura"],
          "/es/guide/api/java/": [
            "",
            "system-api/",
            "user-api/",
            "tenant-api/",
            "area-api/",
            "area-type-api/",
            "asset-api/",
            "asset-type-api/",
            "batch-operations-api/",
            "assignment-api/",
            "command-invocations-api/",
            "customer-api/",
            "customer-type-api/",
            "device-api/",
            "assignment-api/",
            "device-command-api/",
            "device-event-api/",
            "device-group-api/",
            "device-state-api/",
            "device-status-api/",
            "device-type-api/",
            "schedule-api/",
            "scheduled-job-api/",
            "zone-api/"
          ],
          "/es/guide/api/javascript/": [""],
          "/es/guide/api/": ["java/", "javascript/"],
          "/es/guide/microservices/": [
            "asset-management",
            "batch-operations",
            "command-delivery",
            "device-management",
            "device-registration",
            "device-state",
            "event-management",
            "event-search",
            "event-sources",
            "inbound-processing",
            "instance-management",
            "label-generation",
            "outbound-connectors",
            "rule-processing",
            "schedule-management",
            "streaming-media",
            "tenant-management",
            "user-management",
            "web-rest"
          ],
          "/es/guide/": [
            "architecture/",
            "deployment/",
            "administration/",
            "devices/",
            "microservices/",
            "api/"
          ],
          "/es/deployment/": [""],
          "/es/development/": [""]
        }
      }
    },
    repo: "sitewhere/sitewhere-documentation",
    docsDir: "docs",
    docsBranch: "sitewhere-" + pkginfo.version,
    editLinks: true,
    editLinkText: "Help us improve this page!"
  },
  chainWebpack(config) {
    config.resolve.alias.set("vue", "vue/dist/vue.common.js");
  }
};
