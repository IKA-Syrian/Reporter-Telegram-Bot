module.exports = {
    apps: [
        {
            name: "Balqees Frontend",
            script: "serve",
            env: {
                PM2_SERVE_PATH: "frontend/dist/", // Use the current folder
                PM2_SERVE_PORT: 5001, // Default port is 8080
            },
        },
    ],
};