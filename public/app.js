let pacienteId = null;

// ======================
// 🟢 INGRESO
// ======================
document.getElementById('formIngreso')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const msgBox = document.getElementById('ing-msg');

    const seleccionadoComite = document.querySelector('input[name="ing-comite"]:checked');

    const edadValue = document.getElementById('ing-edad')?.value;

    const pacienteData = {
        nombres:   document.getElementById('ing-nombres')?.value?.trim(),
        apellidos: document.getElementById('ing-apellidos')?.value?.trim(),
        rut: document.getElementById('ing-rut')?.value?.trim(),
        telefono: document.getElementById('ing-telefono')?.value?.trim() || "",
        correo:   document.getElementById('ing-correo')?.value?.trim() || "",
        edad: edadValue ? Number(edadValue) : null,
        ficha: document.getElementById('ing-ficha')?.value?.trim(),

        fechaNacimiento: document.getElementById('ing-fecha-nacimiento')?.value
            ? new Date(document.getElementById('ing-fecha-nacimiento').value)
            : null,

        fechaIngreso: document.getElementById('ing-fecha-ingreso')?.value
            ? new Date(document.getElementById('ing-fecha-ingreso').value)
            : new Date(),

        diagnostico: document.getElementById('ing-diagnostico')?.value?.trim(),

        cirugiasPrevias: document.getElementById('ing-cirugias')?.value?.trim() || "",
        biopsiasPrevias: document.getElementById('ing-biopsias')?.value?.trim() || "",
        qtRtPrevia: document.getElementById('ing-qt-rt')?.value?.trim() || "",

        presentadoComite: seleccionadoComite ? seleccionadoComite.value : "No",

        fechasEstudios: {
            tac: document.getElementById('ing-fecha-tac')?.value ? new Date(document.getElementById('ing-fecha-tac').value) : null,
            petCt: document.getElementById('ing-fecha-pet')?.value ? new Date(document.getElementById('ing-fecha-pet').value) : null,
            rnmCerebro: document.getElementById('ing-fecha-rnm')?.value ? new Date(document.getElementById('ing-fecha-rnm').value) : null
        },

        evaluaciones: {
            dlco: document.getElementById('ing-dlco')?.value || "Pendiente",
            espirometria: document.getElementById('ing-espirometria')?.value || "Pendiente",
            ecocardio: document.getElementById('ing-ecocardio')?.value || "Pendiente"
        },
examenes: {
    dlco: {
        fechaSolicitud: document.getElementById("ing-dlco-solicitud").value
                          ? new Date(document.getElementById("ing-dlco-solicitud").value) : null,
        fechaRealizado: document.getElementById("ing-dlco-realizado").value
                          ? new Date(document.getElementById("ing-dlco-realizado").value) : null,
    },
    espirometria: {
        fechaSolicitud: document.getElementById("ing-espirometria-solicitud").value
                          ? new Date(document.getElementById("ing-espirometria-solicitud").value) : null,
        fechaRealizado: document.getElementById("ing-espirometria-realizado").value
                          ? new Date(document.getElementById("ing-espirometria-realizado").value) : null,
    },
    ecocardio: {
        fechaSolicitud: document.getElementById("ing-ecocardio-solicitud").value
                          ? new Date(document.getElementById("ing-ecocardio-solicitud").value) : null,
        fechaRealizado: document.getElementById("ing-ecocardio-realizado").value
                          ? new Date(document.getElementById("ing-ecocardio-realizado").value) : null,
    },
especialidadPaseQx:{
        fechaSolicitud: document.getElementById("ing-pase-qx-solicitud").value
                          ? new Date(document.getElementById("ing-pase-qx-solicitud").value) : null,
        fechaRealizado: document.getElementById("ing-pase-qx-realizado").value
                          ? new Date(document.getElementById("ing-pase-qx-realizado").value) : null,


}


},
        
        otros: document.getElementById('ing-otros')?.value?.trim() || ""
    };

    try {
        const response = await fetch('/api/pacientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacienteData)
        });

        const resultado = await response.json();

        if (response.ok) {
            msgBox.className = "msg-box success";
            msgBox.textContent = "✅ Ficha registrada exitosamente.";
            document.getElementById('formIngreso').reset();
        } else {
            msgBox.className = "msg-box error";
            msgBox.textContent = resultado.message || "Error al registrar";
        }

    } catch (error) {
        console.error(error);
        msgBox.className = "msg-box error";
        msgBox.textContent = "❌ Error de conexión";
    }
});


// ─── Guardar edición ──────────────────────────────────────────────────────────
document.getElementById("formEditar")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!pacienteId) return showError("No hay paciente seleccionado");

    const msgBox = document.getElementById("edit-msg");
    const btn    = e.target.querySelector("button[type=submit]");

    const payload = {
        edad:            document.getElementById("edit-edad").value
                           ? Number(document.getElementById("edit-edad").value) : null,
        telefono: document.getElementById('edit-telefono').value.trim(),
        correo:   document.getElementById('edit-correo').value.trim(),             
        ficha:           document.getElementById("edit-ficha").value.trim(),
        diagnostico:     document.getElementById("edit-diagnostico").value.trim(),
        cirugiasPrevias: document.getElementById("edit-cirugiasPrevias").value.trim(),
        biopsiasPrevias: document.getElementById("edit-biopsiasPrevias").value.trim(),
        qtRtPrevia:      document.getElementById("edit-qtRtPrevia").value.trim(),
        presentadoComite: document.querySelector('input[name="edit-comite"]:checked')?.value ?? "No",
        especialidadPaseQx: document.getElementById("edit-pase-qx").value.trim() || null,
        otros:           document.getElementById("edit-otros").value.trim(),

        fechaNacimiento: document.getElementById("edit-fechaNacimiento").value
                           ? new Date(document.getElementById("edit-fechaNacimiento").value) : null,

        fechasEstudios: {
            tac:        document.getElementById("edit-fecha-tac").value
                          ? new Date(document.getElementById("edit-fecha-tac").value) : null,
            petCt:      document.getElementById("edit-fecha-pet").value
                          ? new Date(document.getElementById("edit-fecha-pet").value) : null,
            rnmCerebro: document.getElementById("edit-fecha-rnm").value
                          ? new Date(document.getElementById("edit-fecha-rnm").value) : null,
        },

        evaluaciones: {
            dlco:         document.getElementById("edit-dlco").value,
            espirometria: document.getElementById("edit-espirometria").value,
            ecocardio:    document.getElementById("edit-ecocardio").value,
        },
    };

    btn.disabled    = true;
    btn.textContent = "Guardando…";

    try {
        const res  = await fetch(`/api/pacientes/${pacienteId}`, {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al guardar");

        msgBox.className   = "msg-box success";
        msgBox.textContent = "✅ Cambios guardados correctamente.";
    } catch (err) {
        msgBox.className   = "msg-box error";
        msgBox.textContent = `❌ ${err.message}`;
    } finally {
        btn.disabled    = false;
        btn.textContent = "Guardar Cambios";
    }
});

function cargarPaciente(p) {
    pacienteId = p._id;
    clearResultados();

    // Bloqueados
    setValue("edit-nombres",   p.nombres   ?? "");
    setValue("edit-apellidos", p.apellidos ?? "");
    setValue("edit-rut",     p.rut,    true);

    // Editables simples
    setValue("edit-edad",            p.edad            ?? "");
    setValue("edit-telefono", p.telefono ?? "");
    setValue("edit-correo",   p.correo   ?? "");
    setValue("edit-ficha",           p.ficha           ?? "");
    setValue("edit-diagnostico",     p.diagnostico     ?? "");
    setValue("edit-cirugiasPrevias", p.cirugiasPrevias ?? "");
    setValue("edit-biopsiasPrevias", p.biopsiasPrevias ?? "");
    setValue("edit-qtRtPrevia",      p.qtRtPrevia      ?? "");
    setValue("edit-pase-qx",         p.especialidadPaseQx ?? "");
    setValue("edit-otros",           p.otros           ?? "");

    // Fechas
    setDate("edit-fechaNacimiento", p.fechaNacimiento);
    setDate("edit-fecha-tac",       p.fechasEstudios?.tac);
    setDate("edit-fecha-pet",       p.fechasEstudios?.petCt);
    setDate("edit-fecha-rnm",       p.fechasEstudios?.rnmCerebro);

    // Selects
    setSelect("edit-dlco",         p.evaluaciones?.dlco);
    setSelect("edit-espirometria", p.evaluaciones?.espirometria);
    setSelect("edit-ecocardio",    p.evaluaciones?.ecocardio);

    // Radio comité
    const comiteVal = p.presentadoComite ?? "No";
    const radio = document.querySelector(`input[name="edit-comite"][value="${comiteVal}"]`);
    if (radio) radio.checked = true;

    document.getElementById("formEditar").style.display = "block";
    document.getElementById('edit-fechaNacimiento').value = paciente.fechaNacimiento;
calcularEdadEditar(); // ← función separada para el form editar
}

// ─── Helpers de poblado ───────────────────────────────────────────────────────
function setValue(id, value, disabled = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value    = value;
    el.disabled = disabled;
}

function setDate(id, raw) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = raw ? new Date(raw).toISOString().split("T")[0] : "";
}

function setSelect(id, value) {
    const el = document.getElementById(id);
    if (!el || !value) return;
    el.value = value;
}

function calcularEdad() {
    const fechaNac = new Date(document.getElementById('ing-fecha-nacimiento').value);
    const hoy = new Date();  // ← esta está dentro de la función, no hay conflicto

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    document.getElementById('ing-edad').value = edad;
}

function cerrarSesion() {
    sessionStorage.removeItem('autenticado');
    window.location.replace('login.html');
}

// Limitar fechaRealizado a hoy como máximo
const fechaHoy = new Date().toISOString().split('T')[0]; // ← renombrado

[
    'ing-dlco-realizado',
    'ing-espirometria-realizado', 
    'ing-ecocardio-realizado',
    'ing-pase-qx-realizado',
    'edit-dlco-realizado',
    'edit-espirometria-realizado',
    'edit-ecocardio-realizado',
    'edit-pase-qx-realizado'
].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('max', fechaHoy); // ← actualizado
});