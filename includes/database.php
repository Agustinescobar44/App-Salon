<?php

$db = mysqli_connect('localhost', 'root' ,'lautaro9','appsalon');

if(!$db){
    echo "Error de conexión";
}