const mysql = require("mysql2");
const {promisify}= require("util");
const {database}= require("./key");
const {CONSTANTS}= require("../utils/utils");
 const pool = mysql.createPool(database);
 pool.getConnection((error,conexion)=>{
    if(error){
        switch(error.code){
            case CONSTANTS.PROTOCOL_CONNECTION_LOST:
                console.error('DATABASE CONNECTION WAS CLOSED')
                break;
                case CONSTANTS.ER_CON_COUNT_ERROR:
                console.error('DATABASE HAS TO MANY CONNECTIONS')
                break;
                case CONSTANTS.ECONNREFUSED:
                console.error('DATABASE CONNECTION WAS REFUSED')
                break;
                case CONSTANTS.ER_ACCESS_DENIED_ERROR:
                console.error('ACCESS DENIED FOR USER')
                break;
                default:
                console.error('ERROR DE DE LA BASE NO ENCONTRADO')
                break;
        }
    }
    if(conexion){
        console.log("conexion establecidad con la base de datos");
        conexion.release();
    }
    return;
 });
 pool.query= promisify(pool.query);
 module.exports=pool;