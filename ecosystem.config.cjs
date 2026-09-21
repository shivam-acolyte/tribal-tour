module.exports = {
  apps: [
    {
      name: "tribal-tour",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: "max", // Or specify number of CPU cores e.g. 2
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
