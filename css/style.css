body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f7f6;
    color: #333;
    line-height: 1.6;
}

header {
    background-color: #2c3e50; /* Azul oscuro general */
    color: #fff;
    padding: 25px 0;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

header h1 {
    margin: 0;
    font-size: 2.8em;
    font-weight: 600;
}

header p {
    font-size: 1.2em;
    opacity: 0.9;
}

#malla-curricular {
    max-width: 1400px;
    margin: 30px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.08);

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 25px;
}

.cuatrimestre {
    flex: 0 0 calc(25% - 20px); /* 4 columnas */
    min-width: 300px;
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fcfcfc;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cuatrimestre h2 {
    font-size: 1.8em;
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 25px;
    text-align: center;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 15px;
    width: 100%;
}

.materias-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: center;
}

.materia {
    border: 1px solid;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    width: 200px;
    min-height: 120px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.2s ease, border-color 0.3s ease, opacity 0.3s;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff; /* Color de texto blanco para materias base y completadas */

    /* Colores base: un tono de verde agradable */
    --base-hue: 140; /* Tono verde */
    --base-saturation: 60%;
    --base-lightness: 45%; /* Claridad media */

    background-color: hsl(var(--base-hue), var(--base-saturation), var(--base-lightness));
    border-color: hsl(var(--base-hue), var(--base-saturation), calc(var(--base-lightness) - 8%)); /* Borde un poco más oscuro */
}

.materia:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.materia h3 {
    margin-top: 0;
    font-size: 1.3em;
    margin-bottom: 8px;
    line-height: 1.3;
}

.materia p {
    font-size: 0.95em;
    margin: 2px 0;
}

.materia .semestre {
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8em;
    margin-top: 10px;
}

/* ESTILOS PARA MATERIAS COMPLETADAS */
.materia.completada {
    /* Tonos de azul para completadas */
    --completed-hue: 220; /* Tono azul */
    --completed-saturation: 70%;
    --completed-lightness: 50%; /* Claridad media */

    background-color: hsl(var(--completed-hue), var(--completed-saturation), var(--completed-lightness));
    border-color: hsl(var(--completed-hue), var(--completed-saturation), calc(var(--completed-lightness) - 8%));
    text-decoration: none;
    opacity: 1;
    cursor: pointer;
}

.materia.completada::after {
    content: 'COMPLETADA';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg);
    font-size: 1.8em;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    white-space: nowrap;
    opacity: 0.7;
}

/* ESTILOS PARA MATERIAS NO DISPONIBLES (prerrequisitos no cumplidos) */
.materia.no-disponible {
    background-color: #e0e0e0; /* Gris claro para no disponibles */
    color: #666; /* Texto más oscuro para contraste */
    border-color: #d0d0d0;
    cursor: not-allowed;
    opacity: 0.7; /* Ligeramente transparente */
    filter: grayscale(80%); /* Muy desaturado */
    box-shadow: none;
    transform: none;
}
.materia.no-disponible:hover {
    transform: none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.08); /* Mantener una sombra mínima */
}


/* Tooltip para prerrequisitos */
.materia .prerequisitos-tooltip {
    visibility: hidden;
    width: 220px;
    background-color: #34495e;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 12px;
    position: absolute;
    z-index: 10;
    bottom: 105%;
    left: 50%;
    margin-left: -110px;
    opacity: 0;
    transition: opacity 0.3s, visibility 0.3s;
    font-size: 0.85em;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    white-space: normal;
}

.materia .prerequisitos-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #34495e transparent transparent transparent;
}

.materia:hover .prerequisitos-tooltip {
    visibility: visible;
    opacity: 1;
}

footer {
    text-align: center;
    padding: 25px;
    background-color: #2c3e50;
    color: #fff;
    font-size: 0.9em;
    margin-top: 50px;
    box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
}

/* Media Queries para responsividad (ajuste de columnas en pantallas pequeñas) */
@media (max-width: 1200px) {
    .cuatrimestre {
        flex: 0 0 calc(33.33% - 20px); /* 3 columnas */
    }
}

@media (max-width: 900px) {
    .cuatrimestre {
        flex: 0 0 calc(50% - 20px); /* 2 columnas */
    }
}

@media (max-width: 600px) {
    .cuatrimestre {
        flex: 0 0 calc(100% - 20px); /* 1 columna */
    }
    .materia {
        width: 80%; /* Hacer las materias más anchas en pantallas pequeñas */
    }
}
