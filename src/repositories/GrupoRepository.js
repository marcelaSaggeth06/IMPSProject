const pool = require('../config/databaseController');
module.exports = {
    // Consulta para obtener todos los grupos
    obtenerTodosLosGrupos: async() => {
        try {
            const result = await pool.query('SELECT * FROM grupos');
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al consultar la lista de grupos: ', error);
        }
    },
    // Obtener grupo por ID
    obtenerGrupoPorId: async(idgrupo) => {
        try {
            const result = await pool.query('SELECT * FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result[0]; // Devuelve la primera fila (el grupo encontrado)
        } catch (error) {
            console.error('Ocurrió un problema al obtener el grupo: ', error);
        }
    },
    // Agregar un nuevo grupo
    agregarGrupo: async(num_grupo, anio, ciclo, idmateria, idprofesor) => {
        try {
            const result = await pool.query('INSERT INTO grupos(num_grupo, anio, ciclo, idmateria, idprofesor) VALUES(?, ?, ?, ?, ?)', [num_grupo, anio, ciclo, idmateria, idprofesor]);
            return result; // Retorna el ID del grupo insertado
        } catch (error) {
            console.error('Ocurrió un problema al agregar el grupo: ', error);
        }
    },
    // Actualizar un grupo
    actualizarGrupo: async(idgrupo, num_grupo, anio, ciclo, idmateria, idprofesor) => {
        try {
            const result = await pool.query('UPDATE grupos SET num_grupo = ?, anio = ?, ciclo = ?, idmateria = ?, idprofesor = ? WHERE idgrupo = ?', [num_grupo, anio, ciclo, idmateria, idprofesor, idgrupo]);
            return result.affectedRows;
        } catch (error) {
            console.error('Ocurrio un problema al actualizar el grupo: ', error);
        }
    },
   // Asignar grupo
    asignarGrupo: async(asignacion) => {
        try {
            const result = await pool.query("INSERT INTO grupo_estudiantes SET ? ", asignacion);
            console.log('resultado: ', result)
            return result.affectedRows;
        } catch (error) {
            console.log('Ocurrio un problema al asignar el grupo', error);
        }
    },
     // Eliminar un grupo
     eliminarGrupo: async(idgrupo) => {
        try {
            const result = await pool.query('DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
}