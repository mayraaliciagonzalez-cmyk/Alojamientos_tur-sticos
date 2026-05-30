// ── Referencias ───────────────────────────────────────────────────────────
const campos = {
	usuario:    document.getElementById("usuario"),
	comentario: document.getElementById("comentario"),
	email:      document.getElementById("email"),
	pass:       document.getElementById("pass"),
};

// ── Reglas de validación por campo ────────────────────────────────────────
const reglas = {
	usuario(v) {
		if (!v) return "El nombre de usuario es obligatorio.";
		if (v.length < 3) return "El nombre debe tener al menos 3 caracteres.";
		if (v.length > 30) return "El nombre no puede superar 30 caracteres.";
		return null;
	},
	comentario(v) {
		if (!v) return "El comentario es obligatorio.";
		if (v.length < 5) return "El comentario debe tener al menos 5 caracteres.";
		if (v.length > 500) return `Máximo 500 caracteres (llevas ${v.length}).`;
		return null;
	},
	email(v) {
		if (!v) return "El e-mail es obligatorio.";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
			return "Ingresa un e-mail válido (ej: nombre@dominio.com).";
		return null;
	},
	pass(v) {
		if (!v) return "La contraseña es obligatoria.";
		const faltan = [];
		if (v.length < 6)        faltan.push("mínimo 6 caracteres");
		if (!/[A-Z]/.test(v))    faltan.push("una mayúscula");
		if (!/[a-z]/.test(v))    faltan.push("una minúscula");
		if (!/[0-9]/.test(v))    faltan.push("un número");
		if (faltan.length) return `La contraseña necesita: ${faltan.join(", ")}.`;
		return null;
	},
};

// ── Mostrar / limpiar error inline por campo ──────────────────────────────
function mostrarError(campo, mensaje) {
	const linea = campo.closest(".linea");
	campo.classList.add("campo-error");
	campo.classList.remove("campo-ok");

	let hint = linea.querySelector(".campo-hint");
	if (!hint) {
		hint = document.createElement("span");
		hint.className = "campo-hint";
		linea.after(hint);          // insertarlo justo debajo de .linea
	}
	hint.textContent = "⚠ " + mensaje;
	hint.style.display = "block";
}

function limpiarError(campo) {
	const linea = campo.closest(".linea");
	campo.classList.remove("campo-error");
	campo.classList.add("campo-ok");

	const hint = linea.nextElementSibling;
	if (hint && hint.classList.contains("campo-hint")) {
		hint.style.display = "none";
	}
}

// ── Validar un campo individual ───────────────────────────────────────────
function validarCampo(nombre) {
	const campo = campos[nombre];
	const valor = campo.value.trim();
	const error = reglas[nombre](valor);
	if (error) {
		mostrarError(campo, error);
		return false;
	} else {
		limpiarError(campo);
		return true;
	}
}

// ── Escuchar eventos "input" para limpiar errores al escribir ─────────────
Object.keys(campos).forEach(nombre => {
	campos[nombre].addEventListener("input", () => {
		// Solo revalidar si el campo ya fue tocado (tiene clase de error o ok)
		const c = campos[nombre];
		if (c.classList.contains("campo-error") || c.classList.contains("campo-ok")) {
			validarCampo(nombre);
		}
	});
	// Al salir del campo (blur) validar siempre
	campos[nombre].addEventListener("blur", () => validarCampo(nombre));
});

// ── Envío del formulario ──────────────────────────────────────────────────
document.querySelector("form").addEventListener("submit", evaluar);

function evaluar(event) {
	event.preventDefault();

	// Forzar validación de todos los campos
	const resultados = Object.keys(campos).map(n => validarCampo(n));
	const todoOk = resultados.every(Boolean);

	if (!todoOk) {
		// Enfocar primer campo con error
		const primerError = Object.keys(campos).find(n =>
			campos[n].classList.contains("campo-error")
		);
		if (primerError) campos[primerError].focus();
	} else {
		mostrarExito();
		document.querySelector("form").reset();
		Object.values(campos).forEach(c => {
			c.classList.remove("campo-ok", "campo-error");
		});
		document.querySelectorAll(".campo-hint").forEach(h => h.style.display = "none");
	}
}

// ── Ojo: mostrar/ocultar contraseña ───────────────────────────────────────
document.querySelector(".ojo img").addEventListener("click", ver);

function ver() {
	const tipo = campos.pass.getAttribute("type");
	if (tipo === "password") {
		campos.pass.setAttribute("type", "text");
		document.querySelector(".ojo img").setAttribute("src", "img/ojoAbierto.png");
	} else {
		campos.pass.setAttribute("type", "password");
		document.querySelector(".ojo img").setAttribute("src", "img/ojoCerrado.png");
	}
}

// ── Modal de éxito con confetti ───────────────────────────────────────────
document.getElementById("exito-close").addEventListener("click", () => {
	document.getElementById("modal-exito").style.display = "none";
});
document.getElementById("modal-exito").addEventListener("click", e => {
	if (e.target === e.currentTarget) e.currentTarget.style.display = "none";
});

function mostrarExito() {
	const nombre = campos.usuario.value.trim() || "viajero";
	const modal = document.getElementById("modal-exito");
	modal.querySelector(".exito-nombre").textContent = nombre;
	modal.style.display = "flex";
	lanzarConfetti();
}

function lanzarConfetti() {
	const canvas = document.getElementById("confetti-canvas");
	const ctx    = canvas.getContext("2d");
	const box    = canvas.parentElement;
	canvas.width  = box.offsetWidth;
	canvas.height = box.offsetHeight;

	const colores = ["#e54c29","#f1c40f","#27ae60","#2980b9","#8e44ad","#e91e63","#00bcd4"];
	const piezas  = Array.from({ length: 130 }, () => ({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height - canvas.height,
		w: 8 + Math.random() * 8,
		h: 5 + Math.random() * 5,
		color: colores[Math.floor(Math.random() * colores.length)],
		speed: 2 + Math.random() * 3,
		angle: Math.random() * 2 * Math.PI,
		spin:  (Math.random() - 0.5) * 0.15,
		swing: (Math.random() - 0.5) * 2,
	}));

	let frame = 0;
	(function animar() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		piezas.forEach(p => {
			p.y += p.speed; p.x += p.swing; p.angle += p.spin;
			if (p.y > canvas.height) { p.y = -p.h; p.x = Math.random() * canvas.width; }
			ctx.save();
			ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
			ctx.rotate(p.angle);
			ctx.fillStyle = p.color;
			ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
			ctx.restore();
		});
		if (++frame < 200) requestAnimationFrame(animar);
		else ctx.clearRect(0, 0, canvas.width, canvas.height);
	})();
}

// ── Contador de caracteres en comentario ──────────────────────────────────
(function () {
	const campo   = document.getElementById("comentario");
	const counter = document.getElementById("char-counter");
	if (!campo || !counter) return;

	campo.addEventListener("input", () => {
		const len = campo.value.length;
		counter.textContent = `${len} / 500`;
		counter.className = "char-counter";
		if (len >= 480)      counter.classList.add("al-limite");
		else if (len >= 400) counter.classList.add("cerca");
	});
})();