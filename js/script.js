document.addEventListener('DOMContentLoaded', () => {
  const mallaCurricularContainer = document.getElementById('malla-curricular');
  let materias = [];

  function renderizarMalla() {
    mallaCurricularContainer.innerHTML = '';
    const materiasPorCuatrimestre = {};

    materias.forEach(materia => {
      if (!materiasPorCuatrimestre[materia.semestre]) {
        materiasPorCuatrimestre[materia.semestre] = [];
      }
      materiasPorCuatrimestre[materia.semestre].push(materia);
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
            ${getRequisitosHtml(materia)}
          </div>
        `;

        materiaDiv.addEventListener('click', () => {
          if (materiaDiv.classList.contains('no-disponible') && !materia.completada) {
            alert('Debes completar los prerrequisitos y correquisitos antes.');
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

  function verificarDisponibilidad(materia) {
    if (materia.completada) return true;

    if (materia.prerequisitos && materia.prerequisitos.length > 0) {
      const todosCompletados = materia.prerequisitos.every(id => {
        const m = materias.find(mat => mat.id === id);
        return m && m.completada;
      });
      if (!todosCompletados) return false;
    }

    if (materia.correquisitos && materia.correquisitos.length > 0) {
      const todosValidos = materia.correquisitos.every(id => {
        const m = materias.find(mat => mat.id === id);
        return m && (m.completada || m.semestre <= materia.semestre);
      });
      if (!todosValidos) return false;
    }

    return true;
  }

  function getRequisitosHtml(materia) {
    let html = '';
    if (materia.prerequisitos?.length > 0) {
      const nombres = materia.prerequisitos.map(id => getNombreMateria(id));
      html += `<p>Prerrequisitos: ${nombres.join(', ')}</p>`;
    }
    if (materia.correquisitos?.length > 0) {
      const nombres = materia.correquisitos.map(id => getNombreMateria(id));
      html += `<p>Correquisitos: ${nombres.join(', ')}</p>`;
    }
    return html || 'Sin requisitos';
  }

  function getNombreMateria(id) {
    const m = materias.find(m => m.id === id);
    return m ? m.nombre : `ID: ${id}`;
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
      const p = progreso.find(pm => pm.id === m.id);
      return { ...m, completada: p ? p.completada : false };
    });
  }

  fetch('data/pensum.json')
    .then(res => res.json())
    .then(data => {
      materias = data;
      cargarProgreso();
      renderizarMalla();
    })
    .catch(err => console.error('Error al cargar pensum:', err));
});
