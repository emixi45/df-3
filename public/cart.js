const precios = document.getElementsByClassName('precios') || ''
const final = document.getElementById('precioFinal') || ''
const botones = document.getElementsByClassName('eliminar') || ''
const botonEliminar = document.getElementById('botonEliminar') || ''

if(botonEliminar !== '') {
    botonEliminar.addEventListener('click', () => {
        const URL = `/carrito`
        const options = {
            method: 'DELETE'
        }
        fetch(URL, options)
            .then(dat => console.log(dat))
            .catch(err => console.log(err))
          
    })
}


for (const boton of botones) {
    boton.addEventListener('click', () => {
        const prod = boton.getAttribute('data-id')
        console.log(prod)
        const URL = `/carrito/${prod}`
        const options = {
            method: 'DELETE',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }
        fetch(URL, options)
            .then(dat => console.log(dat))
            .catch(err => console.log(err))
    })
}

const renderPrecio = () => {
    let precioFinal = 0
    for (const precio of precios) {
        precioFinal += Number(precio.innerHTML)
    }
    final.innerText = `$${precioFinal}`
}

renderPrecio()