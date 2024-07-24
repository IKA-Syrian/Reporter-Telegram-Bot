module.exports = {
    apps: [
        {
            name: 'telegram-bot-api',
            script: '/usr/local/bin/telegram-bot-api', // Full path to the Telegram Bot API executable
            args: '--local --api-id=9715211 --api-hash=d7f31e5ba0ec7be4cb0c42278d61dd9f --http-port 3030',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            exec_interpreter: 'none', // Indicate that PM2 should not use Node.js to run the script
            out_file: './logs/out.log', // Standard output log file
            error_file: './logs/error.log', // Error log file
            log_date_format: 'YYYY-MM-DD HH:mm Z', // Log date format
            // env: {
            //   API_ID: "9715211",
            //   API_HASH: "d7f31e5ba0ec7be4cb0c42278d61dd9f",
            // },
            max_restarts: 10,
            restart_delay: 5000,
            wait_ready: true,
            listen_timeout: 5000,
            kill_timeout: 3000,
            exp_backoff_restart_delay: 100,
            min_uptime: 10000, // Minimum uptime before considering it a crash
        },
    ],
};
