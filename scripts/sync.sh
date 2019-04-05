#! /bin/bash
echo "***************************************************************************************************************************************************************************************************************";


DIA=`date +"%d/%m/%Y"`
HORA=`date +"%H:%M"`
echo "Dia: $DIA Hora: $HORA"
echo "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
cd  /home/usuario/Escritorio/Cliente_PruebasConGit/PruebasConGitHub && 

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

echo $LOCAL
echo $REMOTE
echo $BASE
echo $UPSTREAM
if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi
echo "***************************************************************************************************************************************************************************************************************"


