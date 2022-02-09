"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trabajadores = exports.Vehiculos = void 0;
const mongoose_1 = require("mongoose");
const VehiculoSchema = new mongoose_1.Schema({
    matricula: String,
    numPlazas: Number,
    fechaInicio: Date,
    pagoTarjeta: Boolean,
    trabajadores: Array,
    tipoTren: String,
    estaciones: Array,
    baño: Boolean,
    numPlantas: Number
}, {
    collection: 'vehiculos'
});
const TrabajadorSchema = new mongoose_1.Schema({
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
}, {
    collection: 'trabajadores'
});
exports.Vehiculos = (0, mongoose_1.model)('vehiculos', VehiculoSchema);
exports.Trabajadores = (0, mongoose_1.model)('trabajador', TrabajadorSchema);
