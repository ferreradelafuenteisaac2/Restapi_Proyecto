import { Schema, model } from 'mongoose'


const VehiculoSchema = new Schema({
   matricula: String,
   numPlazas: Number,
   fechaInicio: Date,
   pagoTarjeta: Boolean,
   trabajadores: Array,
   tipoTren: String,
   estaciones: Array,
   baño: Boolean,
   numPlantas: Number
},{
    collection: 'vehiculos'
})




const TrabajadorSchema = new Schema({
    DNI: String,
    nombre: String,
    apellidos: String,
    fechaNac: Date,
    salHora: Number,
    cargo: String,
    especialidad: Array,
    ubicacion: String,
    licencias: Array,
    incidencias: Array
},{
    collection: 'trabajadores'
})



export const Vehiculos = model('vehiculos', VehiculoSchema  )
export const Trabajadores = model('trabajador', TrabajadorSchema  )
