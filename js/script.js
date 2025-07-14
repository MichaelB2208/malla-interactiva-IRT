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
            const prereqMateria = materias.find(m => m.id === prereqId)document.addEventListener('DOMContentLoaded', () => {
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

        // Verificar correquisitos (solo si no está ya completada, un correquisito se puede cursar al mismo tiempo)
        if (materia.correquisitos && materia.correquisitos.length > 0 && !materia.completada) {
            const correquisitosCumplidos = materia.correquisitos.every(correqId => {
                const correqMateria = materias.find(m => m.id === correqId);
                // Un correquisito se cumple si está completado O si NO está completado pero la materia actual tampoco lo está
                // Es decir, ambos pueden ser seleccionados si ninguno de los dos está completado todavía
                // Simplificación: Para que sea "disponible" si tiene correquisito, el correquisito no debe estar marcado como "no disponible" por sus propios prerrequisitos.
                // Esta lógica puede ser compleja. Para este caso, solo verificaremos que los correquisitos no sean "prerrequisitos" de sí mismos.
                // La implementación actual ya permite cursar ambos si los prerrequisitos se cumplen.
                // Si quieres una validación más estricta de correquisitos que deben ser cursados "simultáneamente" o ya completados,
                // necesitarías una lógica más avanzada que gestione un "estado de inscripción" no solo "completado".
                // Por ahora, asumiremos que si sus prerrequisitos están OK, se puede seleccionar.
                return correqMateria && (correqMateria.completada || !correqMateria.completada && !correqMateria.prerequisitos.some(p => { // Solo para evitar un bucle de correquisito-prerrequisito
                    const pM = materias.find(x => x.id === p);
                    return pM && !pM.completada;
                }));
            });
            // Si el correquisito aún no está completado, pero es seleccionable, la materia es disponible.
            // La lógica actual de "no-disponible" ya la maneja bien con los prerrequisitos.
            // Para correquisitos, es más un aviso que un bloqueo.
            // Para simplificar, si no hay prerequisitos que bloqueen, la marcamos como disponible.
            // Si quieres que el correquisito sea un bloqueo similar a un prerrequisito, deberías modificar aquí.
            return true; // Si llegamos aquí, los prerrequisitos están bien. Los correquisitos no bloquean la disponibilidad en este modelo.
        }

        return true; // Si no tiene prerrequisitos ni correquisitos, siempre disponible
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
