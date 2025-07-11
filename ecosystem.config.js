module.exports = {
    apps: [
        {
            name: "API-RUPIAWALLET",
            script: "./dist/server.js",
            instances: 1,
            interpreter: "node",
            env: {
                NODE_ENV: "development"
            },
            watch: true,
            ignore_watch: ["node_modules", "logs", "dist/uploads"],
            error_file: "logs/error.log",
            out_file: "logs/out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss"
        }
    ]
};
