var pkginfo = require("../../package.json");

module.exports = {
  title: "SiteWhere",
  description:
    "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation",
  dest: "dist",
  base: "/docs/" + pkginfo.version + "/",
  locales: {
    "/": {
      lang: "en-US",
      title: "SiteWhere",
      description:
        "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation"
    },
    "/es/": {
      lang: "es",
      title: "SiteWhere",
      description:
        "SiteWhere CE " + pkginfo.version.toUpperCase() + " Documentation"
    }
  },
  themeConfig: {
    logo: "/images/logo.svg",
    sidebar: {
      "/platform/": [
        "",
        "architecture",
        "features",
        "microservice-overview",
        "twelve-factor"
      ],

      "/guide/": [
        "",
        "zookeeper-configuration",
        "kafka-configuration",
        "microservices/instance-management"
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
          { text: "User Guide", link: "/guide/" },
          { text: "Deployment", link: "/deployment/" },
          { text: "Development", link: "/development/" },
          { text: "GitHub", link: "https://github.com/sitewhere/sitewhere" }
        ]
      },
      "/es/": {
        label: "Español",
        selectText: "Idiomas",
        editLinkText: "Edita esta página en GitHub",
        lastUpdated: "Última actualización",
        nav: [
          { text: "Plataforma", link: "/es/platform/" },
          { text: "Guía del usuario", link: "/es/guide/" },
          { text: "Despliegue", link: "/es/deployment/" },
          { text: "Desarrollo", link: "/es/development/" },
          { text: "GitHub", link: "https://github.com/sitewhere/sitewhere" }
        ],
        sidebar: {
          "/es/platform/": [
            "",
            "architecture",
            "features",
            "microservice-overview",
            "twelve-factor"
          ],
          "/es/guide/": [
            "",
            "zookeeper-configuration",
            "kafka-configuration",
            "microservices/instance-management"
          ],
          "/es/deployment/": [""],
          "/es/development/": [""]
        }
      }
    }
  },
  chainWebpack(config) {
    config.resolve.alias.set("vue", "vue/dist/vue.common.js");
  }
};
