class producto {
    constructor (id, marca, tipo, precio, imagen){
        this.id = id
        this.marca = marca
        this.tipo = tipo
        this.precio = precio
        this.imagen = imagen
    }
    verData(){
        console.log(`el suplemento es ${this.tipo}, de la marca ${this.marca} y su precio es ${this.precio}.`)
    }
}



let tienda = [];
const cargarCatalogo = async() => {
    const response = await fetch("productos.json")
    const data = await response.json();
    //console.log(data);
    
    for(let elemento of data){
        let elementoNuevo = new producto( elemento.id, elemento.marca, elemento.tipo, elemento.precio, elemento.imagen)
        tienda.push(elementoNuevo)
    }
    localStorage.setItem("tienda", JSON.stringify(tienda))
    verProductos(tienda)
}

const checkStorage = () => {
    if(localStorage.getItem("tienda") === null) {
        console.log('cargar catalogo')
        cargarCatalogo()
    } else {
        console.log('traer del storage')
        tienda = JSON.parse(localStorage.getItem("tienda"))
        verProductos(tienda)
    }
}

let productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [] //CON OPERADOR OR



//FUNCION PARA VER LOS PRODUCTOS
function verProductos (array){
    console.log('mostrando productos')
    let divProductos = document.getElementById("productos")
    divProductos.innerHTML = ''
    array.forEach(producto => { 
        const {id, marca, tipo, precio, imagen} = producto //DESESTRUCTURACION
        let nuevoProducto = document.createElement("div")
        nuevoProducto.innerHTML =   
                            `<div id="${id}" class="card" style="width: 16rem;">
                                <img class="card-img-top imgTienda" style="height: 16rem;" src="./assets/${imagen}" alt="${tipo} de ${marca}">
                                <div class="card-body text-center">
                                    <h4 class="card-title">${tipo}</h4>
                                    <p>Marca: ${marca}</p>
                                    <p class="">Precio: $${precio}</p>
                                    <button id=btnCompra${id} class="btn btn-success btnComprar">Agregar al carrito</button>
                                </div>
                            </div>`
        divProductos.append(nuevoProducto)

        //BOTON PARA AGREGAR EL PRODUCTO AL CARRITO
        let btnCompra = document.getElementById(`btnCompra${id}`)
        btnCompra.addEventListener("click", ()=>{
            agregarAlCarrito(producto, "nuevo")

            //SWEETALERT
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                icon: 'success',
                title: 'Producto agregado al carrito'
                })
        })
    })
}

checkStorage()

//BOTON PARA VER CATALOGO
let btnMostrar = document.getElementById("btnMostrar")
btnMostrar.addEventListener("click", ()=> {
    let divLoader = document.getElementById("loader")
    divLoader.innerHTML = `<strong>CARGANDO PRODUCTOS</strong>`
    setTimeout(() =>{
        divLoader.innerHTML = ''
        verProductos(tienda) 
    },2000)
})

//FUNCION AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(productos){
    productosEnCarrito.push(productos)
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
}

//DOM CARRITO
let btnCarrito = document.getElementById("btnCarrito")
let modalBody = document.getElementById("modalBody")
let btnFinalizarCompra = document.getElementById("btnFinalizarCompra")
let pSumaCarrito = document.getElementById('pSumaCarrito')

function cargarProductosCarrito(array){
    modalBody.innerHTML = ""
    array.forEach((produ) => {
        let produEnCarrito = document.createElement("div")
        produEnCarrito.innerHTML +=  `<div class="card border-primary mb-3 cardCarrito" id ="productoCarrito${produ.id}" style="max-width: 200px;">
                                <div class=d-flex>
                                    <img class="card-img-top" src="assets/${produ.imagen}" alt="${produ.tipo}">
                                
                                    <div class="card-body ms-3">
                                        <h4 class="card-title">${produ.tipo}</h4>
                                        <p class="card-text">${produ.marca}</p> 
                                        <p class="card-text">$${produ.precio}</p> 
                                        <button id="btnEliminar${produ.id}" class="btn btn-danger" ><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>    
                            </div>`
        modalBody.append(produEnCarrito)

                            //ELIMINAR PRODUCTO DEL CARRITO
                            let btnEliminar = document.getElementById(`btnEliminar${produ.id}`)
                            let id = produ.id
                            
                            btnEliminar.addEventListener("click", ()=>{
                                let productosIndex = productosEnCarrito.findIndex(element => element.id == id)
                                productosEnCarrito.splice(productosIndex, 1)
                                localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito))
                                cargarProductosCarrito(productosEnCarrito)
                            })
                            
                            //SPREAD - AGREGA ESTADO DEL PRODUCTO "EN CARRITO"
                            const produAgregados = productosEnCarrito.find(e => e.id == id)
                            const agregProdu = {...produAgregados, estado: `En Carrito`}
                            console.log(agregProdu)
        })
    compraTotal(array)
}

//BOTON BORRAR TODO DEL CARRITO
let btnEliminarTodo = document.getElementById("clearAll")
btnEliminarTodo.addEventListener("click", ()=>{
    productosEnCarrito = []
    localStorage.removeItem("productosEnCarrito")
    cargarProductosCarrito(productosEnCarrito)
    pSumaCarrito.innerHTML = ""
    pSumaCarrito.innerHTML = "<p>NO HAY PRODUCTOS EN EL CARRITO</p>"
})


//BOTON INGRESO AL CARRITO
btnCarrito.addEventListener("click", ()=>{
    let productosStorage = JSON.parse(localStorage.getItem("productosEnCarrito"))
    if (productosStorage) {
        productosEnCarrito = productosStorage
        cargarProductosCarrito(productosEnCarrito)
    }else{
        pSumaCarrito.innerHTML = "<p>NO HAY PRODUCTOS EN EL CARRITO</p>"
    }
})

//FUNCION SUMAR TOTAL CARRITO
function compraTotal(array){
    let acumulador = 0

    acumulador = array.reduce((acumulador, produ)=>{
        return acumulador + produ.precio
    },0)
    //CON OPERADOR TERNARIO
    acumulador == 0 ? pSumaCarrito.innerHTML = "<p>NO HAY PRODUCTOS EN EL CARRITO</p>" : pSumaCarrito.innerHTML = `EL TOTAL DE SU COMPRA ES $${acumulador}`
}




//FUNCION PARA AGREGAR PRODUCTOS AL CATALOGO
function crearProducto(array){
    let inputMarca = document.getElementById("inputMarca")
    let inputTipo = document.getElementById("inputTipo")
    let inputPrecio = document.getElementById("inputPrecio")
    let nuevoProd = new producto(array.length+1, inputMarca.value, inputTipo.value, inputPrecio.value, "interrogacion.jpg")
    array.push(nuevoProd)
    localStorage.setItem("tienda", JSON.stringify(array))
    inputMarca.value = ""
    inputTipo.value = ""
    inputPrecio.value = ""
    verProductos(array)
}

let btnGuardar = document.getElementById("btnAgregar")
btnGuardar.addEventListener("click", ()=>{
    crearProducto(tienda)
})


//FUNCION OCULTAR PRODUCTOS
function ocultarProductos(){
    divProductos.innerHTML = ""
}

let btnOcultar = document.getElementById("btnOcultar")
btnOcultar.addEventListener("click", ()=>{
    ocultarProductos()
})

//FUNCION PARA BUSQUEDA DE PRODUCTOS
let h2Busqueda = document.getElementById("h2Busqueda")
function busquedaFiltrada (){
        let buscarProducto = document.getElementById("inputBuscar")
        let busqueda = tienda.filter((producto)=> producto.marca.toLowerCase().includes(buscarProducto.value.toLowerCase())
        || producto.tipo.toLowerCase().includes(buscarProducto.value.toLowerCase()) ) //CON OPERADOR OR
        if(busqueda.length == 0){
            h2Busqueda.innerHTML = "SU PRODUCTO NO FUE ENCONTRADO, REVISE NUETRO CATALOGO..."
            verProductos(tienda)
        }else{
            for(let productosEncotrados of busqueda){
                h2Busqueda.innerHTML = ""
                verProductos(busqueda)
            }
        }
    }

    btnBuscar = document.getElementById("btnBuscar")
    btnBuscar.addEventListener("click", ()=>{
        busquedaFiltrada(tienda)
    })
