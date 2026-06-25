let pacienteId = null;

// ==============================
// BUSCAR PACIENTE
// ==============================
document.getElementById("btnBuscar").addEventListener("click", async () => {

    const buscar = document.getElementById("buscar").value.trim();

    if (!buscar) {
        alert("Ingrese un nombre o RUT");
        return;
    }

    try {

        const response = await fetch(`/api/pacientes/buscar?buscar=${encodeURIComponent(buscar)}`);

        const paciente = await response.json();

        if (!response.ok) {
            alert(paciente.message);
            return;
        }

        pacienteId = paciente._id;

        document.getElementById("formEditar").style.display = "block";

        // NO EDITABLES
        document.getElementById("edit-nombre").value = paciente.nombre;
        document.getElementById("edit-rut").value = paciente.rut;

        // EDITABLES
        document.getElementById("edit-edad").value = paciente.edad || "";

        document.getElementById("edit-ficha").value = paciente.ficha || "";

        document.getElementById("edit-fechaNacimiento").value =
            paciente.fechaNacimiento
            ? paciente.fechaNacimiento.substring(0,10)
            : "";

        document.getElementById("edit-diagnostico").value =
            paciente.diagnostico || "";

    }

    catch(error){

        console.error(error);

        alert("Error buscando paciente");

    }

});


// ==============================
// GUARDAR CAMBIOS
// ==============================
document.getElementById("formEditar").addEventListener("submit", async(e)=>{

    e.preventDefault();

    if(!pacienteId){

        alert("Primero busque un paciente");

        return;

    }

    const datos={

        edad:Number(document.getElementById("edit-edad").value),

        ficha:document.getElementById("edit-ficha").value,

        fechaNacimiento:document.getElementById("edit-fechaNacimiento").value,

        diagnostico:document.getElementById("edit-diagnostico").value

    };

    try{

        const response=await fetch(`/api/pacientes/${pacienteId}`,{

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(datos)

        });

        const resultado=await response.json();

        if(response.ok){

            alert("Paciente actualizado correctamente");

        }

        else{

            alert(resultado.message);

        }

    }

    catch(error){

        console.error(error);

        alert("Error de conexión");

    }

});