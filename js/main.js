const API_URL = 'http://www.raydelto.org/agenda.php';


const formContacto = document.getElementById('formContacto');
const listaContactos = document.getElementById('listaContactos');
const btnActualizar = document.getElementById('btnActualizar');
const mensajeEstado = document.getElementById('mensaje-estado');


obtenerContactos();


btnActualizar.addEventListener('click', obtenerContactos);

formContacto.addEventListener('submit', function(evento) {
    evento.preventDefault(); 
    
    
    const nuevoContacto = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value
    };

    guardarContacto(nuevoContacto);
});


function obtenerContactos() {
    listaContactos.innerHTML = '<li>Actualizando contactos...</li>';
    
    fetch(API_URL)
        .then(respuesta => respuesta.json())
        .then(datos => {
            listaContactos.innerHTML = ''; 
            
            if(datos && datos.length > 0) {
                
                datos.forEach(contacto => {
                    const item = document.createElement('li');
                    
                    const nombre = contacto.nombre || 'Sin nombre';
                    const apellido = contacto.apellido || 'Sin apellido';
                    const telefono = contacto.telefono || 'Sin teléfono';
                    
                    item.innerHTML = `<strong>${nombre} ${apellido}</strong>📞 ${telefono}`;
                    listaContactos.appendChild(item);
                });
            } else {
                listaContactos.innerHTML = '<li>No se encontraron contactos.</li>';
            }
        })
        .catch(error => {
            console.error('Error al obtener la agenda:', error);
            listaContactos.innerHTML = '<li style="color:red;">Error de conexión. No se pudo cargar la agenda.</li>';
        });
}


function guardarContacto(contacto) {
    mensajeEstado.style.color = '#fff';
    mensajeEstado.textContent = 'Enviando datos al servidor...';

    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(contacto)
    })
    .then(respuesta => {
        if(respuesta.ok) {
            mensajeEstado.style.color = '#a8ffca'; 
            mensajeEstado.textContent = '¡Contacto agregado con éxito!';
            formContacto.reset(); 
            
            
            obtenerContactos();
            
           
            setTimeout(() => {
                mensajeEstado.textContent = '';
            }, 3000);
        } else {
            throw new Error('El servidor rechazó la petición POST.');
        }
    })
    .catch(error => {
        console.error('Error al guardar el contacto:', error);
        mensajeEstado.style.color = '#ff9e9e'; // Rojo claro
        mensajeEstado.textContent = 'Error al intentar guardar el contacto.';
    });
}