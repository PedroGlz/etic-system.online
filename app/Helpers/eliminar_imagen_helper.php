<?php
/**
  * Este archivo es para uso de la aplicacion etic.
*/

if (! function_exists('eliminar_imagen')) {
    /**
     * Funcion global para eliminar imagenes
     */
    function eliminar_imagen(string $ruta_img){
      if(file_exists(ROOTPATH."public/etic/".$ruta_img) && is_file(ROOTPATH."public/etic/".$ruta_img)){
        unlink("etic/".$ruta_img);
      }
      
      return;
    }
}