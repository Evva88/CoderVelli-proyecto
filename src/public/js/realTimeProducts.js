const socketClient = io();

socketClient.on("envioDeProductos", (obj)=>{
    updateProductList(obj);
});


function updateProductList(products){
    let div = document.getElementById("list-products");
    let productos = " ";

    products.forEach((product) => {
        productos+= `<article>
                     <div class="card mb-3">
                     <div class="imgBx">
                     <img src="${product.img}" width="150"/>
                     </div>
                     <div class="contentBx">
                     <h2>${product.nombre}</h2>
                     <div class="color">
                     <h3>$${product.precio}</h3>
                     </div>
                     <a href="#">Comprar ahora</a>
                     </div>
                     </div>
                     </article>`;
        
    });
    div.innerHTML= productos;
}


let form =document.getElementById("formProduct");
form.addEventListener("submit", (evt)=>{
    evt.preventDefault();

    let nombre = form.elements.nombre.value;
    let detalle = form.elements.detalle.value;
    let stock = form.elements.stock.value;
    let img = form.elements.img.value;
    let categoria = form.elements.categoria.value;
    let precio = form.elements.precio.value;
    let code = form.elements.code.value;
    
    socketClient.emit("addProduct", {
        nombre,
        detalle,
        stock,
        img,
        categoria,
        precio,
        code,
    });
    
    form.reset();

});


document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleted =deleteidinput.value;
    socketClient.emit("deleteProduct", deleted);
    deleteidinput.value = "";
  });

const eliminarProducto = () =>{
    const idProd = document.getElementById("id-prod").value;
    socketClient.emit("eliminarProducto", idProd);
}

const btnEliminarProd = document.getElementById("btnEliminarProducto");
btnEliminarProd.onclick = eliminarProducto();

