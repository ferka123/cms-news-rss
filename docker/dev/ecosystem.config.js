module.exports = {
  apps: [
    {
      name: "web",
      instances: 1,
      cwd: "/app",
      script: "npm run web-dev",
    },
    {
      name: "importer",
      instances: 1,
      cwd: "/app",
      script: "npm run importer-dev",
    },
  ],
};
