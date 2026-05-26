document.querySelector(".ojo img").addEventListener("click", ver);
document.querySelector("form").addEventListener("submit", evaluar);


function evaluar(event) {
	event.preventDefault();
	const usuario=document.querySelector("#usuario").value.trim();
	const email=document.querySelector("#email").value.trim().toLowerCase();
	const pass=document.querySelector("#pass").value.trim();
	const errores=[];

	if(usuario.length<3){
		errores.push("El nombre del usuario tiene que ser mayor a 2 dígitos")
	}
	const expre1=/^\S+@\S+\.\S+$/
	if (!expre1.test(email)){
		errores.push("El email es incorrecto")
	}
	if ((pass.length<6) || !/[a-z]/.test(pass) || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)){errores.push("El password es incorrecto. Mínimo 5 caracteres, 1 MAY, 1 Min, 1 numero ");
	}
	if (errores.length>0){
		//mostrar errores
		document.querySelector(".errores").innerHTML="";
		errores.map(error => document.querySelector(".errores").innerHTML+=`<div class="error">${error}</div>`);
	}	else {
		document.querySelector("form").submit();
	}
}


function ver() {
	let estado=document.querySelector("#pass").getAttribute("type");
	if(estado=="password"){
		document.querySelector("#pass").setAttribute("type","text");
		document.querySelector(".ojo img").setAttribute("src","img/ojoAbierto.png");
		} else{
			document.querySelector("#pass").setAttribute("type","password");
			document.querySelector(".ojo img").setAttribute("src","img/ojoCerrado.png");
	}
}
