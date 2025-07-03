@echo off

ssh root@212.85.19.3 "cd .. && cd home && cd tecnomaub-api-rupiawallet && cd htdocs && cd api-rupiawallet.tecnomaub.site && git pull && npm install --force && npx tsc && pm2 restart API-RUPIAWALLET && pm2 save"