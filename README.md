# strongly-swagular-starter

starter for strongly js & angular

## Get starter

* run ```npm i``` to install all dependencies
* run ```start:server``` to run the server
* run ```start:client``` to run the client (you have to start the server first)
* login with admin@admin.com 123456

## serve on nginx

```
upstream app_nodejs {
  server 127.0.0.1:4000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /srv/site;
    server_name tador.net www.tador.net;
    
    location = /api{
         return 302 /api/;
    }
    
    location ~* \.io {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy false;

      proxy_pass http://localhost:4001;
      proxy_redirect off;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }


    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
    }
}
```

https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/

sudo apt-get update
sudo apt-get install certbot
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d app.tador.net
sudo nano /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
sudo ufw allow 443

sudo iptables -A INPUT -s 77.126.15.90 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -d 77.126.15.90 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
