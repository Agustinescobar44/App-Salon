<?php

function obstenerServicios() :array{
    
    try {
        
        //importar una conexion
        require 'database.php';  //importamos la variable $db que creamos en la otra clase la cual conecta a la base de datos

        
        //escribir codigo sql
        $db->set_charset("utf8");
        $sql = "SELECT * FROM servicios"; //comando de mysql para ejecutar en la base de datos

        $consulta = mysqli_query($db,$sql); //se ejecuta el comando en la base de datos seleccionada ($base de datos, $comando)

        // arreglo vacio
        $servicios = [];

        
        $i = 0;
        // obtener los resultados
        // var_dump(mysqli_fetch_assoc($consulta)); //mysqli_fetch_all() convierte la consulta en un arreglo asociativo  //assoc solo trae el ultimo

        while($row = mysqli_fetch_assoc($consulta)){
            
            $servicios[$i]['id']= $row["id"]; //si solo dejo un corchete significa que me refiero al final del arreglo
            $servicios[$i]['precio']= $row['precio'];
            $servicios[$i]['nombre']= $row['nombre'];

            $i++;
        }
        
        return $servicios;
    }
    catch(Throwable $th){
        var_dump($th);
    }
}
obstenerServicios();

