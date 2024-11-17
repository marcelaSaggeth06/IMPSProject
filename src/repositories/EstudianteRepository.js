const pool = require('../config/databaseController');

module.exports={
    obtenerTodosLosEstudiantes: async()=>{
        try {
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        } catch (error) {
            console.log('Ocurrio un problema al consultar la lista de estudiantes: ',error)
        }
    },
    eliminarEstudiante: async(idestudiante) => { 
        try{ 
          const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]); 
          return result.affectedRows > 0; 
        }catch(error){ 
          console.error('Error al eliminar el registro', error); 
        } 
    } ,  // Obtener estudiante por ID
    obtenerEstudiantePorId: async(idestudiante) => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result[0]; // Devuelve la primera fila (el estudiante encontrado)
        } catch (error) {
            console.error('Ocurrió un problema al obtener el estudiante: ', error);
        }
    },
    // Agregar un nuevo estudiante
    agregarEstudiante: async(nombre, apellido, email, idcarrera, usuario) => {
        try {
            const result = await pool.query('CALL insertarEstudiante (?, ?, ?, ?, ?)',
                 [nombre, apellido, email, idcarrera, usuario]);
            return result; // Retorna el ID del estudiante insertado
        } catch (error) {
            console.error('Ocurrió un problema al agregar el estudiante: ', error);
        }
    },
    // Actualizar un estudiante
    actualizarEstudiante: async(idestudiante, nombre, apellido, email, idcarrera, usuario) => {
        try {
            const result = await pool.query('UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, idcarrera = ?, usuario = ? WHERE idestudiante = ?', [nombre, apellido, email, idcarrera, usuario, idestudiante]);
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al actualizar el estudiante: ', error);
        }
    }
}