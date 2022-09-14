const botones = document.getElementsByClassName('agregar')
for (const boton of botones) {
    boton.addEventListener('click', e => {
        e.preventDefault()
        const datos = {
            name: boton.getAttribute('data-name'),
            img: boton.getAttribute('data-img'),
            price: boton.getAttribute('data-price'),
            id: boton.getAttribute('data-id')
        }
        const URL = '/'
        const options = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }
        fetch(URL, options)
                .then(res => res.json)
                .then(dat => console.log(dat))
                .catch(err => console.log(err))
    })
}