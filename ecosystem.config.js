module.exports = {
  apps: [
    {
      name: "backend",
      script: "npm",
      args: "start",
      env: {
        PORT: 3001
      }
    }
  ]
}