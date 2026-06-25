let pacienteId = null;

// ======================
// 🔍 BUSCAR
// ======================
document.getElementById("btnBuscar").addEventListener("click", async () => {

    const buscar = document.getElementById("buscar").value.trim();

    if (!buscar) return alert("Ingrese RUT o Nombre");

    const res = await fetch(`/api/pacientes/buscar?buscar=${encodeURIComponent(buscar)}`);
    const data = await res.json();

    if (!res.ok) {
        return alert(data.message);
    }

    pacienteId = data._id;

    document.getElementById("formEditar").style.display = "grid";

    // 🔒 IDENTIFICACIÓN (bloqueado)
    document.getElementById("edit-nombre").value = data.nombre;
    document.getElementById("edit-nombre").disabled = true;

    document.getElementById("edit-rut").value = data.rut;
    document.getElementById("edit-rut").disabled = true;

    // EDITABLE
    document.getElementById("edit-edad").value = data.edad || "";
    document.getElementById("edit-ficha").value = data.ficha || "";

    document.getElementById("edit-fechaNacimiento").value =
        data.fechaNacimiento ? data.fechaNacimiento.substring(0,10) : "";

    document.getElementById("edit-fechaIngreso").value =
        data.fechaIngreso ? data.fechaIngreso.substring(0,10) : "";

    document.getElementById("edit-diagnostico").value = data.diagnostico || "";

    document.getElementById("edit-cirugias").value = data.cirugiasPrevias || "";
    document.getElementById("edit-biopsias").value = data.biopsiasPrevias || "";
    document.getElementById("edit-qt-rt").value = data.qtRtPrevia || "";

    document.getElementById("edit-comite").value = data.presentadoComite || "No";

    document.getElementById("edit-tac").value = data.fechasEstudios?.tac?.substring(0,10) || "";
    document.getElementById("edit-pet").value = data.fechasEstudios?.petCt?.substring(0,10) || "";
    document.getElementById("edit-rnm").value = data.fechasEstudios?.rnmCerebro?.substring(0,10) || "";

    document.getElementById("edit-dlco").value = data.evaluaciones?.dlco || "Pendiente";
    document.getElementById("edit-espirometria").value = data.evaluaciones?.espirometria || "Pendiente";
    document.getElementById("edit-ecocardio").value = data.evaluaciones?.ecocardio || "Pendiente";

    document.getElementById("edit-paseqx").value = data.especialidadPaseQx || "";
    document.getElementById("edit-otros").value = data.otros || "";
});


// ======================
// 💾 GUARDAR
// ======================
document.getElementById("formEditar").addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!pacienteId) return alert("Primero busque un paciente");

    const payload = {

        edad: Number(document.getElementById("edit-edad").value),

        ficha: document.getElementById("edit-ficha").value,

        fechaNacimiento: document.getElementById("edit-fechaNacimiento").value,

        fechaIngreso: document.getElementById("edit-fechaIngreso").value,

        diagnostico: document.getElementById("edit-diagnostico").value,

        cirugiasPrevias: document.getElementById("edit-cirugias").value,

        biopsiasPrevias: document.getElementById("edit-biopsias").value,

        qtRtPrevia: document.getElementById("edit-qt-rt").value,

        presentadoComite: document.getElementById("edit-comite").value,

        fechasEstudios: {
            tac: document.getElementById("edit-tac").value,
            petCt: document.getElementById("edit-pet").value,
            rnmCerebro: document.getElementById("edit-rnm").value
        },

        evaluaciones: {
            dlco: document.getElementById("edit-dlco").value,
            espirometria: document.getElementById("edit-espirometria").value,
            ecocardio: document.getElementById("edit-ecocardio").value
        },

        especialidadPaseQx: document.getElementById("edit-paseqx").value,
        otros: document.getElementById("edit-otros").value
    };

    const res = await fetch(`/api/pacientes/${pacienteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
        alert("Paciente actualizado correctamente");
    } else {
        alert(result.message || "Error al actualizar");
    }
});