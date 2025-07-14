document.addEventListener('DOMContentLoaded', () => {
  const mallaCurricularContainer = document.getElementById('malla-curricular');
  let materias = [];

  function renderizarMalla() {
    mallaCurricularContainer.innerHTML = '';

    const materiasPorCuatrimestre = {};
    materias.forEach(materia => {
      if (materia.semestre <= 2) { // Solo mostrar hasta el 2do cuatrimestre
        if (!materiasPorCuatrimestre[materia.semestre]) {
          materiasPorCuatrimestre[materia.semestre] = [];
        }
        materiasPorCuatrimestre[materia.semestre].push(materia);
      }
    });

    const cuatrimestresOrdenados = Object.keys(materiasPorCuatrimestre).sort((a, b) => a - b);

    cuatrimestresOrdenados.forEach(semestreNum => {
      const cuatrimestreDiv = document.createElement('div');
      cuatrimestreDiv.classList.add('cuatrimestre');
      cuatrimestreDiv.innerHTML = `<h2>Cuatrimestre ${semestreNum}</h2>`;

      const materiasGridDiv = document.createElement('div');
      materiasGridDiv.classList.add('materias-grid');

      materiasPorCuatrimestre[semestreNum].sort((a, b) => a.id.localeCompare(b.id)).forEach(materia => {
        const materiaDiv = document.createElement('div');
        materiaDiv.classList.add('materia');
        materiaDiv.dataset.id = materia.id;

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

  function getPrerequisitosCorrequisitosHtml(materia) {
    let html = '';
    if (materia.prerequisitos && materia.prerequisitos.length > 0) {
      const nombres = materia.prerequisitos.map(getNombreMateria);
      html += `<p>Prerrequisitos: ${nombres.join(', ')}</p>`;
    }
    if (materia.correquisitos && materia.correquisitos.length > 0) {
      const nombres = materia.correquisitos.map(getNombreMateria);
      html += `<p>Correquisitos: ${nombres.join(', ')}</p>`;
    }
    return html || 'No tiene prerrequisitos ni correquisitos.';
  }

  function verificarDisponibilidad(materia) {
    if (materia.completada) return true;

    if (materia.prerequisitos?.some(prereqId => {
      const prereq = materias.find(m => m.id === prereqId);
      return !prereq || !prereq.completada;
    })) return false;

    return true;
  }

  function getNombreMateria(id) {
    const materia = materias.find(m => m.id === id);
    return materia ? materia.nombre : `ID desconocido: ${id}`;
  }

  function guardarProgreso() {
    const progreso = materias.map(m => ({ id: m.id, completada: m.completada }));
    localStorage.setItem('mallaProgreso', JSON.stringify(progreso));
  }

  function cargarProgreso() {
    const guardado = localStorage.getItem('mallaProgreso');
    if (!guardado) return;

    const progreso = JSON.parse(guardado);
    materias = materias.map(m => {
      const estado = progreso.find(p => p.id === m.id);
      return { ...m, completada: estado ? estado.completada : false };
    });
  }

  fetch('data/pensum.json')
    .then(resp => {
      if (!resp.ok) throw new Error(`Error: ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      materias = data;
      cargarProgreso();
      renderizarMalla();
    })
    .catch(err => console.error('Error cargando pensum.json:', err));
});
