document.getElementById('formIngreso').addEventListener('submit', async (e) => {
    console.log('ENTRO AL SUBMIT');
    e.preventDefault();

    const msgBox = document.getElementById('ing-msg');
    msgBox.style.display = "block";
    msgBox.textContent = "⌛ Procesando y resguardando ficha clínica en la red médica...";
    msgBox.className = "msg-box info";

    const seleccionadoComite = document.querySelector('input[name="ing-comite"]:checked');

    const pacienteData = {
        nombre: document.getElementById('ing-nombre').value.trim(),
        rut: document.getElementById('ing-rut').value.trim(),
        edad: parseInt(document.getElementById('ing-edad').value, 10),
        ficha: document.getElementById('ing-ficha').value.trim(),
        fechaNacimiento: document.getElementById('ing-fecha-nacimiento').value,
        fechaIngreso: document.getElementById('ing-fecha-ingreso').value,
        diagnostico: document.getElementById('ing-diagnostico').value.trim(),
        cirugiasPrevias: document.getElementById('ing-cirugias').value.trim(),
        biopsiasPrevias: document.getElementById('ing-biopsias').value.trim(),
        qtRtPrevia: document.getElementById('ing-qt-rt').value.trim(),
        presentadoComite: seleccionadoComite ? seleccionadoComite.value : "No",
        fechasEstudios: {
            tac: document.getElementById('ing-fecha-tac').value || null,
            petCt: document.getElementById('ing-fecha-pet').value || null,
            rnmCerebro: document.getElementById('ing-fecha-rnm').value || null
        },
        evaluaciones: {
            dlco: document.getElementById('ing-dlco').value,
            espirometria: document.getElementById('ing-espirometria').value,
            ecocardio: document.getElementById('ing-ecocardio').value
        },
        especialidadPaseQx: document.getElementById('ing-pase-qx').value.trim() || null,
        otros: document.getElementById('ing-otros').value.trim()
    };

    try {
        const response = await fetch('/api/pacientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteData)
        });

        const resultado = await response.json();

        if (response.ok) {
            msgBox.className = "msg-box success";
            msgBox.textContent = "✅ Ficha registrada exitosamente.";

            console.log(resultado);

            document.getElementById('formIngreso').reset();
        } else {
            msgBox.className = "msg-box error";
            msgBox.textContent = `❌ ${resultado.error || 'Error al registrar la ficha.'}`;

            console.error(resultado);
        }

    } catch (error) {
        console.error(error);

        msgBox.className = "msg-box error";
        msgBox.textContent = "❌ No fue posible conectar con el servidor.";
    }
});