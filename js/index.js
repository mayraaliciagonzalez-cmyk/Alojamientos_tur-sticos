window.onload=inicio

function inicio() {
	document.querySelector(".burger").onclick=burger;
    //agregar los videos con su estilos
    videos.forEach(valor=>
        document.querySelector(".bloque").insertAdjacentHTML
        ("beforeend",
            `<a href="${valor['enlace']}" tarjet='_blank'>
                <article>
                <div class="imagen">
                    <img src="img/${valor["imagen"]}">
                </div>
                <div class="titulo">
                    ${valor["titulo"]}                  
                </div>
                <div class="duracion">
                    ${valor["duracion"]}
                </div>
            </article></a>`)
        )
}

function burger(){
   let e=document.querySelector(".enlaces");
   let propiedades=window.getComputedStyle(e);  
   if (propiedades["display"]=="none"){
       // mostrar los enlaces
       e.classList.add("enlacesJS");
   } else {
       // ocultar los enlaces
       e.classList.remove("enlacesJS");
   }
}
