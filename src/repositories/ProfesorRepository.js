const pool = require('../config/databaseController');
module.exports = {
    // Consulta para obtener todos los profesores
    obtenerTodosLosProfesores: async() => {
        try {
            const result = await pool.query('SELECT * FROM profesores');
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al consultar la lista de profesores: ', error);
        }
    },
    // Obtener profesor por ID
    obtenerProfesorPorId: async(idprofesor) => {
        try {
            const result = await pool.query('SELECT * FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result[0]; // Devuelve la primera fila (el profesor encontrado)
        } catch (error) {
            console.error('Ocurrió un problema al obtener el profesor: ', error);
        }
    },
    // Agregar un nuevo profesor
    agregarProfesor: async(nombre, apellido, fecha_nacimiento, profesion, genero, email) => {
        try {
            const result = await pool.query('INSERT INTO profesores (nombre, apellido, fecha_nacimiento, profesion, genero, email) VALUES (?, ?, ?, ?, ?, ?)', [nombre, apellido, fecha_nacimiento, profesion, genero, email]);
            return result; // Retorna el ID del profesor insertado
        } catch (error) {
            console.error('Ocurrió un problema al agregar el profesor: ', error);
        }
    },
    // Actualizar un profesor
    actualizarProfesor: async(idestudiante, nombre, apellido, fecha_nacimiento, profesion, genero, email) => {
        try {
            const result = await pool.query('UPDATE profesores SET nombre = ?, apellido = ?, fecha_nacimiento = ?, profesion = ?, genero = ?, email = ? WHERE idprofesor = ?', [nombre, apellido, fecha_nacimiento, profesion, genero, email, idestudiante]);
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al actualizar el profesor: ', error);
        }
    },
    // Eliminar un profesor
    eliminarProfesor: async(idprofesor) => {
        try {
            const result = await pool.query('DELETE FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
}