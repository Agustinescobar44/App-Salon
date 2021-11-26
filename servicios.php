<?php

require 'includes/funciones.php';

$servicios = obstenerServicios();



echo json_encode($servicios, JSON_UNESCAPED_UNICODE); //transforma una tabla de una base de datos en un string que puede leer js
