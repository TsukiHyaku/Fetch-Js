btnFinalizarCompra.addEventListener("click",  ()=> {endCompra()})
function endCompra(){
    // confirmar compra
    Swal.fire({
        title: 'en serio quiere realizar la compra?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'si, si quiero',
        denyButtonText: `no, no quiero`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('compra realizada!', '', 'success')
          // resetear array de carrito
          //   resetear arrat y localeStorage
          productosEnCarrito = [];
          localStorage.removeItem("productosEnCarrito")
        


        } else if (result.isDenied) {
          Swal.fire('compra cancelada', '', 'info')
        }
      })
}