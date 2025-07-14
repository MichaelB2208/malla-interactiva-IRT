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
                materiaDiv.style.setProperty('--semestre', materia.semestre); // Establecer la variable CSS para colores dinámicos

                // Verificar disponibilidad y aplicar clases
                const disponible = verificarDisponibilidad(materia);

                if (materia.completada) {
                    materiaDiv.classList.add('completada');
                } else if (!disponible) {
                    materiaDiv.classList.add('no-disponible');
                }
                // Si está disponible y no completada, no se añade ninguna clase especial (usa el color base)


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
                    // Si la materia no está disponible y no está completada, no permitir marcar
                    if (materiaDiv.classList.contains('no-disponible') && !materia.completada) {
                        alert('¡Debes completar los prerrequisitos y correquisitos antes de cursar esta materia!');
                        return; // Salir de la función sin hacer cambios
                    }

                    materia.completada = !materia.completada; // Cambia el estado
                    guardarProgreso(); // Guarda el progreso en localStorage
                    renderizarMalla(); // Vuelve a dibujar para actualizar colores/estados de todas las materias
                });

                materiasGridDiv.appendChild(materiaDiv);
            });

            cuatrimestreDiv.appendChild(materiasGridDiv);
            mallaCurricularContainer.appendChild(cuatrimestreDiv);
        });
    }

    // Función auxiliar para generar el HTML del tooltip de prerrequisitos/correquisitos
    function getPrerequisitosCorrequisitosHtml(materia) {
        let html = '';
        if (materia.prerequisitos && materia.prerequisitos.length > 0) {
            const prerequisitosNombres = materia.prerequisitos.map(pId => getNombreMateria(pId));
            html += `<p>Prerrequisitos: ${prerequisitosNombres.join(', ')}</p>`;
        }
        if (materia.correquisitos && materia.correquisitos.length > 0) {
            const correquisitosNombres = materia.correquisitos.map(cId => getNombreMateria(cId));
            html += `<p>Correquisitos: ${correquisitosNombres.join(', ')}</p>`;
        }
        if (html === '') {
            html = 'No tiene prerrequisitos ni correquisitos.';
        }
        return html;
    }


    // Función para verificar si una materia se puede cursar (todos los prerrequisitos están completados)
    function verificarDisponibilidad(materia) {
        // Una materia ya completada se considera disponible para "desmarcar"
        if (materia.completada) {
            return true;
        }

        // Verificar prerrequisitos
        if (materia.prerequisitos && materia.prerequisitos.length > 0) {
            const todosPrereqCompletados = materia.prerequisitos.every(prereqId => {
                const prereqMateria = materias.find(m => m.id === prereqId);
                // Si el prerrequisito no existe o no está completado, la materia no está disponible
                return prereqMateria && prereqMateria.completada;
            });
            if (!todosPrereqCompletados) {
                return false;
            }
        }

        // Verificar correquisitos: Para simplificar, asumimos que los correquisitos no bloquean la *visibilidad*
        // sino la acción de "cursar". Pero podemos ajustarlo si necesitas que también bloqueen la disponibilidad visual.
        // Si no tiene prerrequisitos que bloqueen, o si los tiene y están completados, la materia está disponible
        return true;
    }


    // Obtener el nombre de una materia por su ID
    function getNombreMateria(id) {
        const materia = materias.find(m => m.id === id);
        return materia ? materia.nombre : `Materia ID: ${id} (Desconocida)`;
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
                // Si no se encuentra un estado guardado, por defecto es false (no completada)
                return { ...materia, completada: estado ? estado.completada : false };
            });
        }
    }

    // Cargar datos de las materias y progreso al iniciar
    fetch('data/pensum.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            materias = data;
            cargarProgreso(); // Cargar el progreso guardado
            renderizarMalla(); // Dibujar la malla inicial
        })
        .catch(error => console.error('Error cargando el pensum:', error));
});
