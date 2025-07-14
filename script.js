document.addEventListener('DOMContentLoaded', () => {
    const mallaContainer = document.getElementById('malla-container');
    let materias = []; // Aquí se cargarán las materias desde JSON

    // Cargar datos de las materias
    fetch('data/pensum.json')
        .then(response => response.json())
        .then(data => {
            materias = data;
            renderizarMalla();
        })
        .catch(error => console.error('Error cargando el pensum:', error));

    // Función para renderizar (dibujar) la malla
    function renderizarMalla() {
        mallaContainer.innerHTML = ''; // Limpiar el contenedor antes de redibujar

        materias.forEach(materia => {
            const materiaDiv = document.createElement('div');
            materiaDiv.classList.add('materia');
            materiaDiv.dataset.id = materia.id; // Para identificarla fácilmente
            materiaDiv.style.setProperty('--semestre', materia.semestre); // Establecer la variable CSS

            // Marcar como completada si ya lo está
            if (materia.completada) {
                materiaDiv.classList.add('completada');
            }

            // Verificar si la materia está disponible (prerrequisitos cumplidos)
            const disponible = verificarDisponibilidad(materia);
            if (!disponible && !materia.completada) { // Si no está disponible y no ha sido completada
                materiaDiv.classList.add('no-disponible');
            }

            // Contenido de la materia
            materiaDiv.innerHTML = `
                <h3>${materia.nombre}</h3>
                <p>Créditos: ${materia.creditos}</p>
                <p class="semestre">Cuatrimestre ${materia.semestre}</p>
                <div class="prerequisitos-tooltip">
                    ${materia.prerequisitos.length > 0 ?
                        `Prerrequisitos: ${materia.prerequisitos.map(pId => getNombreMateria(pId)).join(', ')}` :
                        'No tiene prerrequisitos'}
                </div>
            `;

            // Evento click para marcar/desmarcar
            materiaDiv.addEventListener('click', () => {
                if (materiaDiv.classList.contains('no-disponible') && !materia.completada) {
                    alert('¡No puedes cursar esta materia! Primero completa sus prerrequisitos.');
                    return;
                }

                materia.completada = !materia.completada; // Cambia el estado
                guardarProgreso(); // Guarda el progreso en localStorage
                renderizarMalla(); // Vuelve a dibujar para actualizar colores/estados
            });

            mallaContainer.appendChild(materiaDiv);
        });
    }

    // Función para verificar si una materia se puede cursar
    function verificarDisponibilidad(materia) {
        if (!materia.prerequisitos || materia.prerequisitos.length === 0) {
            return true; // No tiene prerrequisitos, siempre disponible
        }

        // Todos los prerrequisitos deben estar completados
        return materia.prerequisitos.every(prereqId => {
            const prereqMateria = materias.find(m => m.id === prereqId);
            return prereqMateria && prereqMateria.completada;
        });
    }

    // Obtener el nombre de una materia por su ID
    function getNombreMateria(id) {
        const materia = materias.find(m => m.id === id);
        return materia ? materia.nombre : 'Materia Desconocida';
    }

    // Guardar el progreso en el localStorage del navegador
    function guardarProgreso() {
        localStorage.setItem('mallaProgreso', JSON.stringify(materias.map(m => ({ id: m.id, completada: m.completada }))));
    }

    // Cargar el progreso desde el localStorage al iniciar
    function cargarProgreso() {
        const progresoGuardado = localStorage.getItem('mallaProgreso');
        if (progresoGuardado) {
            const progreso = JSON.parse(progresoGuardado);
            materias = materias.map(materia => {
                const estado = progreso.find(p => p.id === materia.id);
                return { ...materia, completada: estado ? estado.completada : false };
            });
        }
    }

    // Cargar progreso antes de la renderización inicial
    fetch('data/pensum.json')
        .then(response => response.json())
        .then(data => {
            materias = data;
            cargarProgreso(); // Cargar el progreso guardado
            renderizarMalla();
        })
        .catch(error => console.error('Error cargando el pensum:', error));
});
