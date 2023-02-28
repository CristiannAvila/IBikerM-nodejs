function cambio(){
    var CA=1234;
    var CN=1234;
    if(document.form.ca.value==CA
        && document.form.cn.value==CN){
    swal.fire ({
        icon:'success',
        title: 'Cambio Exitoso',
        text: 'Su Contraseña se ha Actualizado Correctamente'
    });
} else{
    swal.fire({
        icon:'error',
        title: 'Cambio No Realizado',
        text: 'Revise sus Datos Ingresado e Intente Nuevamente'
    });
}
}