module.exports = {
  apps: [{
    name: 'bagflip-backend',
    script: 'dist/index.js',
    cwd: '/var/www/bagflip/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/www/bagflip/backend/logs/error.log',
    out_file: '/var/www/bagflip/backend/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
