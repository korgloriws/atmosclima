/**
 * PM2 — Atmos Clima
 * Porta 3030 (livre entre os demais projetos da VPS)
 *
 * Uso:
 *   npm ci
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'atmosclima',
      cwd: '/opt/atmosclima',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '3030',
        BASE_PATH: '/',
        DATA_DIR: '/opt/atmosclima/data',
        NODE_OPTIONS: '--experimental-sqlite',
        // Troque em produção se quiser:
        // ADMIN_PASSWORD: 'sua-senha-forte',
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: false,
    },
  ],
};
