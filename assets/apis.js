// peticion con fetch
let divProductos = document.getElementById("productos");

fetch("https://hp-api.herokuapp.com/api/characters/students")
.then((resp) => resp.json())
.then( (data) => {
    for (let personaje of data){
        let nuevoProducto = document.createElement("div");
        nuevoProducto.innerHTML =`<div id="" class="card" style="width: 18rem;">
        <img class="card-img-top" src="${personaje.image}">
        <div class="card-body">
          <h5 class="card.tittle">${personaje.name}</h5>
          <p class="">${personaje.gender}</p>
          <p class="">${personaje.house}</p>
          <p class="">${personaje.ac}</p>
        </div>
        </div>`
        divProductos.appendChild(nuevoProducto)
    }
})