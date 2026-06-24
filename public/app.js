document.getElementById('formIngreso').addEventListener('submit', async (e) => {
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
        // DETECCIÓN DINÁMICA: Detecta si estás probando en tu PC o en la nube de Render
        const urlServer = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api/pacientes' 
            : 'https://onrender.com'; // URL Real Corregida

        const response = await fetch(urlServer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteData)
        });

        const resultado = await response.json();


        if (response.ok) {
            msgBox.textContent = `✅ ¡Operación Exitosa! La ficha oncológica del paciente ${pacienteData.nombre} ha sido registrada correctamente en MongoDB Atlas.`;
            msgBox.className = "msg-box success";
            document.getElementById('formIngreso').reset();
            
            setTimeout(() => {
                msgBox.style.display = "none";
            }, 7000);
        } else {
            msgBox.textContent = `❌ Error de Validación: ${resultado.message || 'No se pudo procesar el alta.'}`;
            msgBox.className = "msg-box error";
        }

    } catch (error) {
        console.error("Error de red detectado:", error);
        msgBox.textContent = "🚨 Error del Sistema: No se pudo establecer comunicación con el servidor central de RedSalud. Verifique su conexión.";
        msgBox.className = "msg-box error";
    }
});
