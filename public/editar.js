// ─── Estado ───────────────────────────────────────────────────────────────────
let pacienteId = null;

// ─── Buscar ───────────────────────────────────────────────────────────────────
document.getElementById("btnBuscar").addEventListener("click", handleBuscar);
document.getElementById("buscar").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleBuscar();
});

async function handleBuscar() {
    const valor = document.getElementById("buscar").value.trim();
    if (!valor) return alert("Ingrese RUT o nombre");

    try {
        const res  = await fetch(`/api/pacientes/buscar?buscar=${encodeURIComponent(valor)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al buscar");
        if (data.length === 0) return alert("No se encontraron resultados");

        data.length === 1 ? cargarPaciente(data[0]) : mostrarResultados(data);
    } catch (err) {
        alert(err.message);
    }
}

// ─── Cargar paciente en formulario ────────────────────────────────────────────
function cargarPaciente(p) {
    pacienteId = p._id;

    document.getElementById("resultados").innerHTML = "";

    setValue("edit-nombre", p.nombre, true);
    setValue("edit-rut",    p.rut,    true);

    setValue("edit-edad",            p.edad            ?? "");
    setValue("edit-ficha",           p.ficha           ?? "");
    setValue("edit-diagnostico",     p.diagnostico     ?? "");
    setValue("edit-cirugiasPrevias", p.cirugiasPrevias ?? "");
    setValue("edit-biopsiasPrevias", p.biopsiasPrevias ?? "");
    setValue("edit-qtRtPrevia",      p.qtRtPrevia      ?? "");
    setValue("edit-pase-qx",         p.especialidadPaseQx ?? "");
    setValue("edit-otros",           p.otros           ?? "");

    setDate("edit-fechaNacimiento", p.fechaNacimiento);
    setDate("edit-fecha-tac",       p.fechasEstudios?.tac);
    setDate("edit-fecha-pet",       p.fechasEstudios?.petCt);
    setDate("edit-fecha-rnm",       p.fechasEstudios?.rnmCerebro);

    setSelect("edit-dlco",         p.evaluaciones?.dlco);
    setSelect("edit-espirometria", p.evaluaciones?.espirometria);
    setSelect("edit-ecocardio",    p.evaluaciones?.ecocardio);

    const radio = document.querySelector(
        `input[name="edit-comite"][value="${p.presentadoComite ?? "No"}"]`
    );
    if (radio) radio.checked = true;

    document.getElementById("formEditar").style.display = "block";
    document.getElementById("edit-msg").textContent = "";
}

// ─── Guardar cambios ──────────────────────────────────────────────────────────
document.getElementById("formEditar").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!pacienteId) return alert("No hay paciente seleccionado");

    const msgBox = document.getElementById("edit-msg");
    const btn    = e.target.querySelector("button[type=submit]");

    const payload = {
        edad:            document.getElementById("edit-edad").value
                           ? Number(document.getElementById("edit-edad").value) : null,
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

// ─── Mostrar lista de resultados ──────────────────────────────────────────────
function mostrarResultados(lista) {
    const cont = document.getElementById("resultados");
    cont.innerHTML = "";

    const fragment = document.createDocumentFragment();
    lista.forEach((p) => {
        const div  = document.createElement("div");
        const info = document.createElement("span");
        info.innerHTML = `<b>${p.nombre}</b> — ${p.rut}`;

        const btn = document.createElement("button");
        btn.textContent = "Abrir";
        btn.addEventListener("click", () => cargarPaciente(p));

        div.append(info, btn);
        fragment.appendChild(div);
    });
    cont.appendChild(fragment);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
