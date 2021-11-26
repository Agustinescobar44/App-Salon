
let pagina= 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();

});


function iniciarApp() {
    mostrarServicios();

    //Resalta el Div actual segun el tab que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprueba la pagina actual para mostrar o ocultar la paginacion
    botonesPaginador();

    // Muestra el mensaje de la cita o el mensaje de error 
    mostrarResumen();

    // Almacena el nombre d ela cita en el objeto
    nombreCita();

    //Alamacena la fecha de la cita en el objeto
    fechaCita();

    //deshabilitar dias pasados
    deshalitarFechaAnterior();

    // Almacenar la hora de la cita
    horaCita();
}

function mostrarSeccion() {

    //Eliminar mostrar-seccion de la seleccion anterior
    const seccionAnterior =  document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
   

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion')

    //Eliminar la clase de actual en el tabs
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }


    // Resalta el Tab Actual

    const tabActual = document.querySelector(`[data-paso="${pagina}"]`);
    tabActual.classList.add('actual')

}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button')

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            // Lamar la funcion de mostrar seccion
            botonesPaginador();
        })
    });
}

function paginaSiguiente() {
    const paginaNext = document.querySelector('#siguiente');
    paginaNext.addEventListener('click',  () =>{
        
            pagina++;
            botonesPaginador();

    });
}

function paginaAnterior() {
    const paginaPre = document.querySelector('#anterior');
    paginaPre.addEventListener('click',  () =>{
            pagina--;
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaPre = document.querySelector('#anterior');
    const paginaNext = document.querySelector('#siguiente');
    
    if (pagina==1) {
        paginaPre.classList.add('ocultar')
    }else{
        paginaPre.classList.remove('ocultar')
    }
    if (pagina ==3) {
        paginaNext.classList.add('ocultar')
        
        mostrarResumen(); //estamos en la pagina 3, mostra resumen 
    }else{
        paginaNext.classList.remove('ocultar')
    }
    mostrarSeccion();

}
async function mostrarServicios() {
    
    try {
        const url = '../../servicios.json'; 
        const resultado = await fetch(url); //con fetch le decimos a js que es un js y lo convierta en un array
        const db = await resultado.json();

        //console.log(db);

        const { servicios } = db;

        servicios.forEach(servicio => {
            const {id , nombre , precio} = servicio;


            //DOM Scripting 

            //generar nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio')

            //generar el preico del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //generar div contenedor del servicio

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio')
            servicioDiv.dataset.idServicio = id;
            
            // Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio; //onclick es un event handle a diferenfcia del event listener

            //un event listener se crea sobre ocntenido ya existenente mientras que un event handler se crea al momento de crear un nuevo elemento con codigo de js


            //inyectar precio y nombre al div del servicio

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //inyectarlo en el html

            document.querySelector('#servicios').appendChild(servicioDiv);
        });


    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    //forzar que el elemento al cual le damos click sea el div
    if(e.target.tagName == 'P'){
        elemento= e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);


        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');


        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio:elemento.lastElementChild.textContent,
        }

        // console.log(servicioObj);

        agregarServicio(servicioObj);

    }

}

function eliminarServicio(id) {
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);

    // console.log(cita);
}

function agregarServicio(servicioObjeto) {
    const {servicios} =  cita;

    cita.servicios = [...servicios, servicioObjeto]; //este codigo copia el contenido de servicio objeto a servicios y lo agrega a cita.servicios

    // console.log(cita);
}

function mostrarResumen() {
    //destructuring
    const {nombre,hora,fecha,servicios} = cita;

    //seleccionar resumen
    const resumen = document.querySelector('.paso-resumen');

    //limpia el html previo
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);  //mas rapidoq ue innerhtml
    }

    //validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios,hora,fecha o nombre'

        noServicios.classList.add('invalidar-cita')
        //agregar a resumen div
        resumen.appendChild(noServicios);

        return
    }

    //mostrar el resumen


    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de cita';

    //se crea el nombre
    const nombreCita =document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}` //la diferencia entre text content y innerhtml es que inner va a tratar a las etiquetas html mientras que textcontent va a asumir que todo es una string 
    //se crea la fecha
    const fechaCita =document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`
    //hora de la cita
    const horaCita =document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`


    //creo el conteneodr para los servicios
    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios')

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';

    serviciosCita.appendChild(headingServicios);

    let totalAPagar=0;
    //iterar sobre el arrelgo de servicios
    servicios.forEach(servicio => {


        const {nombre,precio} = servicio;
        //se crea el contenedor 
        const contendorServicio = document.createElement('DIV');
        contendorServicio.classList.add('contenedor-servicio')
        //se crea el nombre
        const textoServicio= document.createElement('P');
        textoServicio.textContent =nombre;
        //se crea el precio
        const precioServicio= document.createElement('P');
        precioServicio.textContent =precio;
        precioServicio.classList.add('precio')

        const precioSeparado = precio.split(' ') 

        totalAPagar+=parseInt(precioSeparado[1]);

        // Agregar el nombre y el precio al div
        contendorServicio.appendChild(textoServicio);
        contendorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contendorServicio);
    });
    //crear el elemento para el total
    const total =document.createElement('P')
    total.textContent = `El total a pagar es: $ ${totalAPagar}`;
    total.classList.add('total');

    //agrego el resumen al html
    resumen.appendChild(headingCita);
    resumen.appendChild(nombreCita);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(serviciosCita);
    resumen.appendChild(total);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input' ,e => {
        const nombreTexto= e.target.value.trim(); //elimina los espacio al principio y al final tambien estan trimStart() y trimEnd()
        // Validacion de que nombre texto debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido' , 'error')
        }else{

            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;

            // console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje , tipo) {


    //si hay una alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }


    const alerta = document.createElement('DIV');
    alerta.textContent= mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar la alerta despues de 3 segundos 
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

function fechaCita() {
    const fecha = document.querySelector('#fecha');
    fecha.addEventListener('input', e =>{
        // console.log(e.target.value)

        const dia = new Date(e.target.value).getUTCDay(); //se almacena el dia en un valor numero donde domingo es 0 en adelante

        if([0,6].includes(dia)){  //se pone un arreglo los dias para poner mas de uno y ver si no se abren esos dias 
            e.preventDefault();
            fecha.value=''
            mostrarAlerta('No se abren los fines de semana ', 'error')
        }
        else{
            cita.fecha = fecha.value;
            // console.log(cita);
        }


    })
}

function deshalitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year  = fechaAhora.getFullYear();
    let dia = fechaAhora.getDate() +1;
    let mes = fechaAhora.getMonth() + 1;

    if (mes<10) {
        mes= `0${mes}`
    }
    if (dia<10) {
        dia = `0${dia}`
    }


    const  fechaADeshabilitar= `${year}-${mes}-${dia}`;

    // console.log(fechaADeshabilitar);

    inputFecha.min = fechaADeshabilitar;
    // console.log(inputFecha);
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e =>{

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0]<10 || hora[0] >19) {
            mostrarAlerta('Hora no valida' , 'error')
            setTimeout(() => {
               inputHora= '';
            }, 3000);
        }else{
            cita.hora=horaCita;
        }
    })
}