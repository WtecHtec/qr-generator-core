module.exports = {
    apps: [
      {
        name: 'qr-code-app-react',
        script: 'npm',
        args: 'run next:start',
        cwd: './',
        instances: 1, // 或者 'max' 使用所有CPU核心
        exec_mode: 'cluster', // 或者 'fork'
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          PORT: 3200
        },
        env_development: {
          NODE_ENV: 'development',
          PORT: 3001
        },
        log_file: './logs/combined.log',
        out_file: './logs/out.log',
        error_file: './logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        merge_logs: true
      }
    ]
  };