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
  server 127.0.0.1:4001;
  server 127.0.0.1:4000;
}

server {
    listen 0.0.0.0:80;
    root /srv/site;
    location = /api{
    return 302 /api/;
    }
    location / {
    try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
    }
}
```

sudo nano /etc/nginx/sites-enabled/default

sudo iptables -A INPUT -s 77.124.29.221 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -d 77.124.29.221 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
