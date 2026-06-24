document.getElementById('formIngreso').addEventListener('submit', async (e) => {
    // 1. Evitar el comportamiento por defecto de recargar la página
    e.preventDefault(); 

    // 2. Elemento de feedback visual para el usuario médico
    const msgBox = document.getElementById('ing-msg');
    msgBox.textContent = "Procesando registro clínico en el sistema...";
    msgBox.className = "msg-box info";

    // 3. Capturar el valor del botón de radio seleccionado (Comité Oncológico)
    const seleccionadoComite = document.querySelector('input[name="ing-comite"]:checked');

    // 4. Construir el objeto JSON respetando exactamente la estructura del backend y Mongoose
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
        // 5. Detectar la URL dinámicamente según dónde estés ejecutando el sistema
        const urlServer = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api/pacientes' 
            : 'https://onrender.com';

        // 6. Realizar la petición asíncrona mediante Fetch API
        const response = await fetch(urlServer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteData)
        });

        const resultado = await response.json();

        // 7. Evaluar códigos de estado e informar al usuario médico
        if (response.ok) {
            msgBox.textContent = "✅ Ficha oncológica almacenada de forma segura en MongoDB Atlas.";
            msgBox.className = "msg-box success";
            document.getElementById('formIngreso').reset(); // Limpia los campos del formulario
        } else {
            // Captura los mensajes específicos de duplicados o campos vacíos enviados por el backend
            msgBox.textContent = `❌ Error: ${resultado.message || 'No se pudo guardar la información.'}`;
            msgBox.className = "msg-box error";
        }

    } catch (error) {
        console.error("Error en la conexión HTTP:", error);
        msgBox.textContent = "🚨 Error de red: Sin comunicación con el servidor médico central.";
        msgBox.className = "msg-box error";
    }
});
