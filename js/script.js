document.addEventListener('DOMContentLoaded', () => {
  const mallaContainer = document.getElementById('malla-curricular');
  let materias = [];

  function renderMalla() {
    mallaContainer.innerHTML = '';
    const porCuatrimestre = {};

    materias.forEach(m => {
      if (!porCuatrimestre[m.semestre]) porCuatrimestre[m.semestre] = [];
      porCuatrimestre[m.semestre].push(m);
    });

    Object.keys(porCuatrimestre).sort((a, b) => a - b).forEach(num => {
      const div = document.createElement('div');
      div.classList.add('cuatrimestre');
      div.innerHTML = `<h2>Cuatrimestre ${num}</h2>`;

      porCuatrimestre[num].forEach(materia => {
        const divMateria = document.createElement('div');
        divMateria.classList.add('materia');
        divMateria.dataset.id = materia.id;

        const disponible = verificarDisponibilidad(materia);

        if (materia.completada) {
          divMateria.classList.add('completada');
        } else if (!disponible) {
          divMateria.classList.add('no-disponible');
        }

        divMateria.innerHTML = `
          <strong>${materia.nombre}</strong><br/>
          Créditos: ${materia.creditos}
        `;

        divMateria.addEventListener('click', () => {
          if (!disponible && !materia.completada) {
            alert('Debes completar los prerrequisitos primero.');
            return;
          }
          materia.completada = !materia.completada;
          guardarProgreso();
          renderMalla();
        });

        div.appendChild(divMateria);
      });

      mallaContainer.appendChild(div);
    });
  }

  function verificarDisponibilidad(materia) {
    if (materia.completada) return true;
    if (!materia.prerequisitos || materia.prerequisitos.length === 0) return true;
    return materia.prerequisitos.every(prereqId => {
      const found = materias.find(m => m.id === prereqId);
      return found && found.completada;
    });
  }

  function guardarProgreso() {
    localStorage.setItem('mallaProgreso', JSON.stringify(materias.map(m => ({ id: m.id, completada: m.completada }))));
  }

  function cargarProgreso() {
    const saved = JSON.parse(localStorage.getItem('mallaProgreso'));
    if (saved) {
      materias = materias.map(m => {
        const estado = saved.find(s => s.id === m.id);
        return { ...m, completada: estado ? estado.completada : false };
      });
    }
  }

  document.getElementById('reiniciar').addEventListener('click', () => {
    if (confirm('¿Seguro que deseas reiniciar el progreso?')) {
      localStorage.removeItem('mallaProgreso');
      location.reload();
    }
  });

  fetch('data/pensum.json')
    .then(res => res.json())
    .then(data => {
      materias = data;
      cargarProgreso();
      renderMalla();
    })
    .catch(err => console.error('Error cargando JSON:', err));
});
