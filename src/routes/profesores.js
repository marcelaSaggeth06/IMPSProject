const express = require('express');
const router = express.Router();
const queries = require('../repositories/ProfesorRepository');
const { isLoggedIn } = require('../lib/auth');
// Endpoint para mostrar todos los profesores
router.get('/', isLoggedIn, async (request, response) => {
    const profesores = await queries.obtenerTodosLosProfesores();
    response.render('profesores/listado', {profesores}); // Mostramos el listado de profesores
});
router.get('/agregar',isLoggedIn,  async(request, response) => {
    response.render('profesores/agregar'); // Renderizamos el formulario
});
// Endpoint para agregar un profesor
router.post('/agregar', isLoggedIn, async(request, response) => {
    // Obtén los datos del profesor desde el formulario
    const { nombre } = request.body; 
    const { apellido } = request.body;
    const { fecha_nacimiento } = request.body;
    const { profesion } = request.body;
    const { genero } = request.body;
    const { email } = request.body;
    if (nombre && apellido && fecha_nacimiento && profesion && genero && email ) {
        const resultado = await queries.agregarProfesor(nombre, apellido, fecha_nacimiento, profesion, genero, email);
        if (resultado) {
           request.flash('success', 'Profesor agregado con éxito');
        } else {
            request.flash('error', 'Error al agregar el profesor');
        }
    } else {
        console.log('Todos los apartados son requeridos');
    }
    response.redirect('/profesores');
});
// Endpoint que permite mostrar el formulario para actualizar un nuevo profesor
router.get('/actualizar/:idprofesor', isLoggedIn, async(request, response) => {
    const { idprofesor } = request.params;
    const profesor = await queries.obtenerProfesorPorId(idprofesor); 
    if (profesor) {
        response.render('profesores/actualizar', { profesor }); // Enviar los datos del profesor
    } else {
        response.status(404).send('Profesor no encontrado');
    }
});
// Endpoint para actualizar un profesor
router.post('/actualizar/:idprofesor', isLoggedIn, async(request, response) => {
    const { idprofesor } = request.params;
    const { nombre } = request.body;
    const { apellido } = request.body;
    const { fecha_nacimiento } = request.body;
    const { profesion } = request.body;
    const { genero } = request.body;
    const { email } = request.body;
    const resultado = await queries.actualizarProfesor(idprofesor, nombre, apellido, fecha_nacimiento, profesion, genero, email);
    if(resultado > 0){
         request.flash('success', 'Actualizado con exito');
    }
    response.redirect('/profesores');
});
// Endpoint que permite eliminar un profesor
router.get('/eliminar/:idprofesor', isLoggedIn, async(request, response) => {
    const { idprofesor } = request.params; // Desestructuramos el objeto que nos mandan en la peticion y extraemos el idprofesor
    const resultado = await queries.eliminarProfesor(idprofesor);
    if(resultado > 0){
        request.flash('success', 'Eliminado con éxito');
    }
    response.redirect('/profesores');
});
module.exports = router;