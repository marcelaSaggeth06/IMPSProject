const express = require('express');
const router = express.Router();
const queries = require('../repositories/MateriaRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos las materias
router.get('/',isLoggedIn,  async (request, response) => {
    try {
        const materias = await queries.obtenerTodasLasMaterias();
        response.render('materias/listado', { materias }); // Mostramos el listado de materias
    } catch (error) {
        console.error('Error al obtener las materias:', error);
        response.status(500).send('Error interno del servidor');
    }
});

// Endpoint que permite mostrar el formulario para agregar una nueva materia
router.get('/agregar', isLoggedIn, (request, response) => {
    response.render('materias/agregar'); // Renderizamos el formulario
});

// Endpoint para agregar una materia
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { materia } = request.body; // Obtén el nombre de la materia desde el formulario

    if (!materia || materia.trim() === '') {
        request.flash('error', 'El nombre de la materia es requerido');
        return response.redirect('/materias/agregar');
    }

    try {
        const resultado = await queries.agregarMateria(materia);
        if (resultado) {
            request.flash('success', 'Materia agregada con éxito');
        } else {
            request.flash('error', 'Error al agregar la materia');
        }
    } catch (error) {
        console.error('Error al agregar materia:', error);
        request.flash('error', 'Error interno al agregar la materia');
    }

    response.redirect('/materias');
});

// Endpoint que permite mostrar el formulario para actualizar una materia
router.get('/actualizar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;

    try {
        const materia = await queries.obtenerMateriaPorId(idmateria);
        if (materia) {
            response.render('materias/actualizar', { materia }); // Renderiza el formulario con la materia actual
        } else {
            request.flash('error', 'Materia no encontrada');
            response.redirect('/materias');
        }
    } catch (error) {
        console.error('Error al obtener la materia:', error);
        response.status(500).send('Error interno del servidor');
    }
});

// Endpoint para actualizar una materia
router.post('/actualizar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const { materia } = request.body;

    if (!materia || materia.trim() === '') {
        request.flash('error', 'El nombre de la materia es requerido');
        return response.redirect(`/materias/actualizar/${idmateria}`);
    }

    try {
        const resultado = await queries.actualizarMateria(idmateria, materia);
        if (resultado > 0) {
            request.flash('success', 'Materia actualizada con éxito');
        } else {
            request.flash('error', 'No se pudo actualizar la materia');
        }
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        request.flash('error', 'Error interno al actualizar la materia');
    }

    response.redirect('/materias');
});

// Endpoint que permite eliminar una materia
router.get('/eliminar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;

    try {
        const resultado = await queries.eliminarMateria(idmateria);
        if (resultado > 0) {
            request.flash('success', 'Materia eliminada con éxito');
        } else {
            request.flash('error', 'No se pudo eliminar la materia');
        }
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        request.flash('error', 'Error interno al eliminar la materia');
    }

    response.redirect('/materias');
});

module.exports = router;
