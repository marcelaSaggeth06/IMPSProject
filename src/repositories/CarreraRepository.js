const pool = require('../config/databaseController');
module.exports = {
    // Consulta para obtener todas las carreras
    obtenerTodasLasCarreras: async() => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al consultar la lista de carreras: ', error);
        }
    },
    // Obtener carrera por ID
    obtenerCarreraPorId: async(idcarrera) => {
        try {
            const result = await pool.query('SELECT * FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result[0]; // Devuelve la primera fila (la carrera encontrada)
        } catch (error) {
            console.error('Ocurrió un problema al obtener la carrera: ', error);
        }
    },
    // Agregar una nueva carrera
    agregarCarrera: async(carrera) => {
        try {
            // Llamamos al procedimiento almacenado, solo pasando el nombre de la carrera
            const result = await pool.query('CALL insertarCarrera(?)', [carrera]);
            return result; // No necesitamos el insertId ya que el ID se genera automáticamente
        } catch (error) {
            console.error('Ocurrió un problema al agregar la carrera: ', error);
        }
    },
    // Actualizar una carrera
    actualizarCarrera: async(idcarrera, carrera) => {
        try {
            const result = await pool.query('UPDATE carreras SET carrera = ? WHERE idcarrera = ?', [carrera, idcarrera]);
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al actualizar la carrera: ', error);
        }
    },
    // Eliminar una carrera
    eliminarCarrera: async(idcarrera) => {
        try {
            const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
}