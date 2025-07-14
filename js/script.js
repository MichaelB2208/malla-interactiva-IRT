document.addEventListener('DOMContentLoaded', () => {
    const mallaCurricularContainer = document.getElementById('malla-curricular');
    let materias = []; // Aquí se cargarán las materias desde JSON

    // Función para renderizar (dibujar) la malla
    function renderizarMalla() {
        mallaCurricularContainer.innerHTML = ''; // Limpiar el contenedor antes de redibujar

        // Agrupar materias por cuatrimestre
        const materiasPorCuatrimestre = {};
        materias.forEach(materia => {
            if (!materiasPorCuatrimestre[materia.semestre]) {
                materiasPorCuatrimestre[materia.semestre] = [];
            }
            materiasPorCuatrimestre[materia.semestre].push(materia);
        });

        // Ordenar los cuatrimestres numéricamente
        const cuatrimestresOrdenados = Object.keys(materiasPorCuatrimestre).sort((a, b) => a - b);

        cuatrimestresOrdenados.forEach(semestreNum => {
            const cuatrimestreDiv = document.createElement('div');
            cuatrimestreDiv.classList.add('cuatrimestre');
            cuatrimestreDiv.innerHTML = `<h2>Cuatrimestre ${semestreNum}</h2>`;

            const materiasGridDiv = document.createElement('div');
            materiasGridDiv.classList.add('materias-grid');

            // Ordenar las materias dentro de cada cuatrimestre por ID (opcional, para consistencia)
            materiasPorCuatrimestre[semestreNum].sort((a, b) => a.id.localeCompare(b.id)).forEach(materia => {
                const materiaDiv = document.createElement('div');
                materiaDiv.classList.add('materia');
                materiaDiv.dataset.id = materia.id;
                materiaDiv.style.setProperty('--semestre', materia.semestre); // Establecer la variable CSS

                // Marcar como completada si ya lo está
                if (materia.completada) {
                    materiaDiv.classList.add('completada');
                }

                // Verificar disponibilidad (prerrequisitos y correquisitos)
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
                        ${getPrerequisitosCorrequisitosHtml(materia)}
                    </div>
                `;

                // Evento click para marcar/desmarcar
                materiaDiv.addEventListener('click', () => {
                    // Si la materia no está disponible y no está completada, alertar
                    if (materiaDiv.classList.contains('no-disponible') && !materia.completada) {
                        alert('¡No puedes cursar esta materia! Primero completa sus prerrequisitos y correquisitos.');
                        return;
                    }

                    materia.completada = !materia.completada; // Cambia el estado
                    guardarProgreso(); // Guarda el progreso en localStorage
                    renderizarMalla(); // Vuelve a dibujar para actualizar colores/estados
                });

                materiasGridDiv.appendChild(materiaDiv);
            });

            cuatrimestreDiv.appendChild(materiasGridDiv);
            mallaCurricularContainer.appendChild(cuatrimestreDiv);
        });
    }

    // Función auxiliar para generar el HTML del tooltip
    function getPrerequisitosCorrequisitosHtml(materia) {
        let html = '';
        if (materia.prerequisitos && materia.prerequisitos.length > 0) {
            html += `<p>Prerrequisitos: ${materia.prerequisitos.map(pId => getNombreMateria(pId)).join(', ')}</p>`;
        }
        if (materia.correquisitos && materia.correquisitos.length > 0) {
            html += `<p>Correquisitos: ${materia.correquisitos.map(cId => getNombreMateria(cId)).join(', ')}</p>`;
        }
        if (html === '') {
            html = 'No tiene prerrequisitos ni correquisitos.';
        }
        return html;
    }


    // Función para verificar si una materia se puede cursar
    function verificarDisponibilidad(materia) {
        // Verificar prerrequisitos
        if (materia.prerequisitos && materia.prerequisitos.length > 0) {
            const todosPrereqCompletados = materia.prerequisitos.every(prereqId => {
                const prereqMateria = materias.find(m => m.id === prereqId);
                return prereqMateria && prereqMateria.completada;
            });
            if (!todosPrereqCompletados) {
                return false;
            }
        }

        // Para correquisitos, la lógica es más compleja y depende de si deben cursarse simultáneamente o ya completados.
        // En este modelo, si los prerrequisitos se cumplen, la materia se considera "disponible" para poder seleccionarla.
        // Los correquisitos son más informativos o para validación al momento de "inscribirse" en un sistema real,
        // no tanto para bloquear la visualización en una malla interactiva simple como esta.
        // Si necesitas una lógica de bloqueo estricta para correquisitos, házmelo saber.
        return true; // Si no tiene prerrequisitos que bloqueen, o si los tiene y están completados
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

    // Cargar datos de las materias y progreso al iniciar
    fetch('data/pensum.json')
        .then(response => response.json())
        .then(data => {
            materias = data;
            cargarProgreso(); // Cargar el progreso guardado
            renderizarMalla();
        })
        .catch(error => console.error('Error cargando el pensum:', error));
});
