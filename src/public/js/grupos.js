const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoRepository');
const estudiantesQuery = require('../repositories/EstudianteRepository');
const materiasQuery = require('../repositories/MateriaRepository');
const profesoresQuery = require('../repositories/ProfesorRepository');
// Endpoint para mostrar todos los grupos
router.get('/', async (request, response) => {
    const grupos = await queries.obtenerTodosLosGrupos();
    response.render('grupos/listado', {grupos}); // Mostramos el listado de grupos
});
// Endpoint que permite mostrar el formulario para agregar un nuevo grupo
router.get('/agregar', async(request, response) => {
    const materias = await materiasQuery.obtenerTodasLasMaterias(); // Obtener la lista de materias
    const profesores = await profesoresQuery.obtenerTodosLosProfesores(); // Obtener la lista de profesores
    response.render('grupos/agregar', { materias, profesores }); // Renderizamos el formulario con materias y profesores
});
// Endpoint para agregar un grupo
router.post('/agregar', async(request, response) => {
    // Obtén los datos del grupo desde el formulario
    const { num_grupo } = request.body; 
    const { anio } = request.body;
    const { ciclo } = request.body;
    const { idmateria } = request.body;
    const { idprofesor } = request.body;
    if (num_grupo && anio && ciclo && idmateria && idprofesor ) {
        const resultado = await queries.agregarGrupo(num_grupo, anio, ciclo, idmateria, idprofesor);
        if (resultado) {
            request.flash('success', 'Registro insertado con exito');
        } else {
            request.flash('error', 'Ocurrio un problema al guardar el registro');
        }
    } else {
        request.flash('error', 'Todos los campos del grupo son requeridos');
    }
    response.redirect('/grupos');
});
// Endpoint que permite mostrar el formulario para actualizar un nuevo grupo
router.get('/actualizar/:idgrupo', async(request, response) => {
    const { idgrupo } = request.params;
    const grupo = await queries.obtenerGrupoPorId(idgrupo); 
    const materias = await materiasQuery.obtenerTodasLasMaterias(); 
    const profesores = await profesoresQuery.obtenerTodosLosProfesores();
    if (grupo) {
        response.render('grupos/actualizar', { grupo , materias, profesores}); // Enviar los datos del grupo
    } else {
        response.status(404).send('Grupo no encontrado');
    }
});
// Endpoint para actualizar un grupo
router.post('/actualizar/:idgrupo', async(request, response) => {
    const { idgrupo } = request.params;
    const { num_grupo } = request.body;
    const { anio } = request.body;
    const { ciclo } = request.body;
    const { idmateria } = request.body;
    const { idprofesor } = request.body;
    const resultado = await queries.actualizarGrupo(idgrupo, num_grupo, anio, ciclo, idmateria, idprofesor);
    if(resultado > 0){
        request.flash('success', 'Registro actualizado con exito');
    } else {
        request.flash('error', 'Ocurrio un problema al actualizar el registro');
    }
    response.redirect('/grupos');
});
// Endpoint que permite eliminar un grupo
router.get('/eliminar/:idgrupo', async(request, response) => {
    const { idgrupo } = request.params; // Desestructuramos el objeto que nos mandan en la peticion y extraemos el idgrupo
    const resultado = await queries.eliminarGrupo(idgrupo);
    if(resultado > 0){
        request.flash('success', 'Eliminación correcta');
    }  else {
        request.flash('error', 'Error al eliminar');
    }
    response.redirect('/grupos');
});
// Enpoint que permite navegar a la pantalla para asignar un grupo
router.get('/asignargrupo/:idgrupo', async (request, response) => {
    const { idgrupo } = request.params;
    // Consultamos el listado de estudiantes disponible
    const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
    
    response.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
});
// Endpoint que permite asignar un grupo
router.post('/asignargrupo', async (request, response) => {
    const data = request.body;
    let resultado = null;
    const result = processDataFromForm(data);
    for (const tmp of result.grupo_estudiantes) {
        //const asignacion = [tmp.idgrupo, tmp.idestudiante];
        //const { idgrupo, idestudiante } = tmp;
        //const asignacionObj = {idgrupo, idestudiante};
        resultado = await queries.asignarGrupo(tmp);
    }
    if (resultado) {
        request.flash('success', 'Asignacion de grupo realizada con exito');
    } else {
        request.flash('error', 'Ocurrio un problema al realizar asignacion');
    }
    response.redirect('/grupos');
});
// Función para procesar los datos del formulario
function processDataFromForm(data) {
    const result = {
        grupo_estudiantes: []
    };
    for (const key in data) {
        if (key.startsWith('grupo_estudiantes[')) {
            const match = key.match(/\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const index = parseInt(match[1]);
                const property = match[2];
                if (!result.grupo_estudiantes[index]) {
                    result.grupo_estudiantes[index] = {};
                }
                result.grupo_estudiantes[index][property] = data[key];
                }
            } else {
                result[key] = data[key];
            }
        }
    return result;
}
module.exports = router;