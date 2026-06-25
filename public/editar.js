document.getElementById("btnBuscar").addEventListener("click", async () => {

    const valor = document.getElementById("buscar").value.trim();

    if (!valor) return alert("Ingrese RUT o nombre");

    const res = await fetch(`/api/pacientes/buscar?buscar=${encodeURIComponent(valor)}`);
    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    // 🔥 SI SOLO HAY 1 → abrir directo
    if (data.length === 1) {
        cargarPaciente(data[0]);
        return;
    }

    // 🔥 SI HAY VARIOS → mostrar lista
    mostrarResultados(data);
});

let pacienteId = null;

function cargarPaciente(p) {
    pacienteId = p._id;

    document.getElementById("formEditar").style.display = "block";

    // bloqueados (NO EDITABLES)
    document.getElementById("edit-nombre").value = p.nombre;
    document.getElementById("edit-rut").value = p.rut;

    document.getElementById("edit-nombre").disabled = true;
    document.getElementById("edit-rut").disabled = true;

    // editables
    document.getElementById("edit-edad").value = p.edad || "";
    document.getElementById("edit-ficha").value = p.ficha || "";
    document.getElementById("edit-diagnostico").value = p.diagnostico || "";

    document.getElementById("edit-fechaNacimiento").value =
        p.fechaNacimiento
            ? new Date(p.fechaNacimiento).toISOString().split("T")[0]
            : "";
}






function mostrarResultados(lista) {
    const cont = document.getElementById("resultados");
    cont.innerHTML = "";

    lista.forEach(p => {
        const div = document.createElement("div");

        const btn = document.createElement("button");
        btn.textContent = "Abrir";

        btn.addEventListener("click", () => {
            cargarPaciente(p);
        });

        div.innerHTML = `<b>${p.nombre}</b> - ${p.rut} `;
        div.appendChild(btn);

        cont.appendChild(div);
    });
}