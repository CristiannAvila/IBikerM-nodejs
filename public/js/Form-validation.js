window.addEventListener('load', ()=> {
    const form = document.querySelector('#formulario')
    const nombre = document.getElementById('nombre')
	const apellido = document.getElementById('apellido')
	const numeroDocumento = document.getElementById('numeroDocumento')
	const telefono = document.getElementById('telefono')
    const correo = document.getElementById('correo')
    const password = document.getElementById('password')

    form.addEventListener('submit', (e) => {
        validaCampos()
        
    })
    
    const validaCampos = ()=> {
        //capturar los valores ingresados por el usuario
        const nombreValor = nombre.value.trim()
		const apellidoValor = apellido.value.trim()
		const numeroDocumentoValor = numeroDocumento.value.trim()
		const telefonoValor = telefono.value.trim()
        const correoValor = correo.value.trim()
        const passwordValor = password.value.trim()
     
        //validando campo usuario
        //(!usuarioValor) ? console.log('CAMPO VACIO') : console.log(usuarioValor)
        if(!nombreValor){
            //console.log('CAMPO VACIO')
            setErrorFor(nombre, 'Campo vacío')
        }else{
            setSuccessFor(nombre)
        }
		if(!apellidoValor){
            //console.log('CAMPO VACIO')
            setErrorFor(apellido, 'Campo vacío')
        }else{
            setSuccessFor(apellido)
        }
		const nd = /^\d{6,10}$/
		if(!numeroDocumentoValor){
            //console.log('CAMPO VACIO')
            setErrorFor(numeroDocumento, 'Campo vacío')
        }else if(!numeroDocumentoValor.match(nd)){
            //console.log('CAMPO VACIO')
            setErrorFor(numeroDocumento, 'Solo puede contener números, minimo 6 digitos o máximo 10 dígitos')
        }else{
            setSuccessFor(numeroDocumento)
        }
		const tl = /^\d{7,10}$/
		if(!telefonoValor){
            //console.log('CAMPO VACIO')
            setErrorFor(telefono, 'Campo vacío')
        }else if(!telefonoValor.match(tl)){
            //console.log('CAMPO VACIO')
            setErrorFor(telefono, 'Solo puede contener números, minimo 7 digitos o máximo 10 dígitos')
        }else {
            setSuccessFor(telefono)
        }
        //validando campo email
        if(!correoValor){
            setErrorFor(correo, 'Campo vacío')            
        }else if(!validaEmail(correoValor)) {
            setErrorFor(correo, 'El e-mail no es válido')
        }else {
            setSuccessFor(correo)
        }
         //validando campo password
         const er = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,18}$/          
         if(!passwordValor) {
             setErrorFor(password, 'Campo vacío')
         } else if (passwordValor.length < 8) {             
             setErrorFor(password, 'Debe tener 8 caracteres cómo mínimo.')
         } else if (!passwordValor.match(er)) {
             setErrorFor(password, 'Debe tener al menos una may., una min. y un núm.')
         } else {
            setSuccessFor(password)
         }

    }

    function setErrorFor(input, message) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        formControl.className = 'form-control error';
        small.innerText = message;
    }
    function setSuccessFor(input) {
        const formControl = input.parentElement;
        formControl.className = 'form-control success';
    }

    const validaEmail = (correo) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(correo);        
    }

})