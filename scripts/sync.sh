#! /bin/bash
 /usr/local/bin/pm2 stop /home/usuario/Escritorio/Cliente_PruebasConGit/PruebasConGitHub/serv.js
 cd  /home/usuario/Escritorio/Cliente_PruebasConGit/PruebasConGitHub && git pull
 /usr/local/bin/pm2 start /home/usuario/Escritorio/Cliente_PruebasConGit/PruebasConGitHub/serv.js


