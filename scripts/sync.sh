#! /bin/bash
echo "***************************************************************************************************************************************************************************************************************";
DIA=`date +"%d/%m/%Y"`
HORA=`date +"%H:%M"`
echo "Dia: $DIA Hora: $HORA"
echo "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
cd  /home/usuario/Escritorio/Cliente_PruebasConGit/PruebasConGitHub && 
estado=$(git status )

if ["$estado" = 'Ya está actualizado.']
then
echo "SIN ACTUALIZACIONES"
else
echo "$estado"
echo "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
/usr/local/bin/pm2 reload /home/usuario/Escritorio/Cliente_PruebasConGit/PruebasConGitHub/serv.js &&
/usr/local/bin/pm2 l
fi
echo "***************************************************************************************************************************************************************************************************************"


