document.addEventListener('DOMContentLoaded', () => {
  const mallaCurricularContainer = document.getElementById('malla-curricular');
  let materias = [];

  // Función para transformar el JSON original en array plano con formato esperado
  function transformarData(dataOriginal) {
    const materiasArray = [];
    let semestreCount = 1;

    for (const cuatrimestre in dataOriginal) {
      const materiasEnCuatri = dataOriginal[cuatrimestre];
      materiasEnCuatri.forEach(materia => {
        materiasArray.push({
          id: materia.id,
          nombre: materia.nombre,
          creditos: materia.creditos,
          semestre: semestreCount,
          prerequisitos: materia.prerrequisitos === 'N/A' ? [] : materia.prerrequisitos.split(',').map(x => x.trim()),
          correquisitos: materia.correquisitos === 'N/A' ? [] : materia.correquisitos.split(',').map(x => x.trim()),
          completada: false
        });
      });
      semestreCount++;
    }

    return materiasArray;
  }

  // Función para renderizar la malla curricular
  function renderizarMalla() {
    mallaCurricularContainer.innerHTML = ''; // Limpiar contenedor

    // Agrupar materias por semestre
    const materiasPorCuatrimestre = {};
    materias.forEach(materia => {
      if (!materiasPorCuatrimestre[materia.semestre]) {
        materiasPorCuatrimestre[materia.semestre] = [];
      }
      materiasPorCuatrimestre[materia.semestre].push(materia);
    });

    // Ordenar semestres numéricamente
    const cuatrimestresOrdenados = Object.keys(materiasPorCuatrimestre).sort((a, b) => a - b);

    cuatrimestresOrdenados.forEach(semestreNum => {
      const cuatrimestreDiv = document.createElement('div');
      cuatrimestreDiv.classList.add('cuatrimestre');
      cuatrimestreDiv.innerHTML = `<h2>Cuatrimestre ${semestreNum}</h2>`;

      const materiasGridDiv = document.createElement('div');
      materiasGridDiv.classList.add('materias-grid');

      // Ordenar materias por ID dentro del cuatrimestre
      materiasPorCuatrimestre[semestreNum].sort((a, b) => a.id.localeCompare(b.id)).forEach(materia => {
        const materiaDiv = document.createElement('div');
        materiaDiv.classList.add('materia');
        materiaDiv.dataset.id = materia.id;
        materiaDiv.style.setProperty('--semestre', materia.semestre);

        // Verificar disponibilidad y aplicar clases
        const disponible = verificarDisponibilidad(materia);

        if (materia.completada) {
          materiaDiv.classList.add('completada');
        } else if (!disponible) {
          materiaDiv.classList.add('no-disponible');
        }

        materiaDiv.innerHTML = `
          <h3>${materia.nombre}</h3>
          <p>Créditos: ${materia.creditos}</p>
          <p class="semestre">Cuatrimestre ${materia.semestre}</p>
          <div class="prerequisitos-tooltip">
            ${getPrerequisitosCorrequisitosHtml(materia)}
          </div>
        `;

        // Click para marcar/desmarcar completada
        materiaDiv.addEventListener('click', () => {
          if (materiaDiv.classList.contains('no-disponible') && !materia.completada) {
            alert('¡Debes completar los prerrequisitos y correquisitos antes de cursar esta materia!');
            return;
          }

          materia.completada = !materia.completada;
          guardarProgreso();
          renderizarMalla();
        });

        materiasGridDiv.appendChild(materiaDiv);
      });

      cuatrimestreDiv.appendChild(materiasGridDiv);
      mallaCurricularContainer.appendChild(cuatrimestreDiv);
    });
  }

  // Genera HTML para tooltip de prerrequisitos y correquisitos
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

  // Verifica si una materia es disponible para cursar
  function verificarDisponibilidad(materia) {
    if (materia.completada) return true;

    if (materia.prerequisitos && materia.prerequisitos.length > 0) {
      const todosPrereqCompletados = materia.prerequisitos.every(prereqId => {
        const prereqMateria = materias.find(m => m.id === prereqId);
        return prereqMateria && prereqMateria.completada;
      });
      if (!todosPrereqCompletados) return false;
    }

    // Aquí asumimos que correquisitos no bloquean visibilidad ni clic
    return true;
  }

  // Obtiene nombre de materia por ID
  function getNombreMateria(id) {
    const materia = materias.find(m => m.id === id);
    return materia ? materia.nombre : `Materia ID: ${id} (Desconocida)`;
  }

  // Guarda progreso en localStorage
  function guardarProgreso() {
    localStorage.setItem('mallaProgreso', JSON.stringify(materias.map(m => ({ id: m.id, completada: m.completada }))));
  }

  // Carga progreso de localStorage
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

  // Carga JSON y arranca la app
  fetch('data/pensum.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      materias = transformarData(data);
      cargarProgreso();
      renderizarMalla();
    })
    .catch(error => console.error('Error cargando el pensum:', error));
});
