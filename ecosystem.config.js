module.exports = {
  apps : [
    {
      name: 'Ecommerce',
      script: './app.js',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      time:true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      env_staging:{
        NODE_ENV: 'staging'
      }
    }
  ],
};


// sudo pm2 start ecosystem.config.js

// sudo pm2 start ecosystem.config.js --env production
// sudo pm2 stop ecosystem.config.js --env production
// sudo pm2 reload ecosystem.config.js --env production

// sudo NODE_ENV=production pm2 reload all