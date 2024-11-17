const pool = require('../config/databaseController');
module.exports = {
    // Consulta para obtener todas las materias
    obtenerTodasLasMaterias: async() => {
        try {
            const result = await pool.query('SELECT * FROM materias');
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al consultar la lista de materias: ', error);
        }
    },
    // Obtener materia por ID
    obtenerMateriaPorId: async(idmateria) => {
        try {
            const result = await pool.query('SELECT * FROM materias WHERE idmateria = ?', [idmateria]);
            return result[0]; // Devuelve la primera fila (la materia encontrada)
        } catch (error) {
            console.error('Ocurrió un problema al obtener la materia: ', error);
        }
    },
    // Agregar una nueva materia
    agregarMateria: async(materia) => {
        try {
            // Llamamos al procedimiento almacenado, solo pasando el nombre de la materia
            const result = await pool.query('INSERT INTO materias(materia) VALUES (?)', [materia]);
            return result; // No necesitamos el insertId ya que el ID se genera automáticamente
        } catch (error) {
            console.error('Ocurrió un problema al agregar la materia: ', error);
        }
    },
    // Actualizar una materia
    actualizarMateria: async(idmateria, materia) => {
        try {
            const result = await pool.query('UPDATE materias SET materia = ? WHERE idmateria = ?', [materia, idmateria]);
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al actualizar la materia: ', error);
        }
    },
    // Eliminar una materia
    eliminarMateria: async(idmateria) => {
        try {
            const result = await pool.query('DELETE FROM materias WHERE idmateria = ?', [idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
}