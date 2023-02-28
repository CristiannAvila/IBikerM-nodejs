function confi(){
    var CA="jd75450@gmail.com";
    if(document.form.ca.value==CA){
    swal.fire ({
        icon:'success',
        title: 'Confirmación Correcta',
        text: 'Su Correo se ha Confirmado Correctamente'
    });
} else{
    swal.fire({
        icon:'error',
        title: 'Confirmación Invalida',
        text: 'Ingrese su Correo Electronico Nuevamente e Intente'
    });
}
}