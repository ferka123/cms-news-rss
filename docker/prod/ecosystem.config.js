module.exports = {
  apps: [
    {
      name: "web",
      instances: 1,
      cwd: "/app",
      script: ".next/standalone/server.js",
    },
    {
      name: "importer",
      instances: 1,
      cwd: "/app",
      script: "npm run importer-start",
    },
  ],
};
