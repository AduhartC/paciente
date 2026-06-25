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
        nombre: document.getElementById('ing-nombre')?.value?.trim(),
        rut: document.getElementById('ing-rut')?.value?.trim(),
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

        especialidadPaseQx: document.getElementById('ing-pase-qx')?.value?.trim() || null,
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

  const msgBox = document.getElementById("edit-msg"); // agrega este div en tu HTML
  const btn    = e.target.querySelector("button[type=submit]");

  const payload = {
    edad:            document.getElementById("edit-edad")?.value
                       ? Number(document.getElementById("edit-edad").value)
                       : null,
    ficha:           document.getElementById("edit-ficha")?.value?.trim()        || "",
    diagnostico:     document.getElementById("edit-diagnostico")?.value?.trim()  || "",
    fechaNacimiento: document.getElementById("edit-fechaNacimiento")?.value
                       ? new Date(document.getElementById("edit-fechaNacimiento").value)
                       : null,
  };

  btn.disabled    = true;
  btn.textContent = "Guardando…";

  try {
    const res  = await fetch(`/api/pacientes/${pacienteId}`, {
      method:  "PUT",
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
    btn.textContent = "Guardar";
  }
});