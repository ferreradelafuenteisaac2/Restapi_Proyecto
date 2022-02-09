"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getVehiculos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Vehiculos.aggregate([
                    {
                        $lookup: {
                            from: 'trabajadores',
                            localField: 'matricula',
                            foreignField: 'vehiculo',
                            as: "Asignacion"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        // Recibe un documento equipo en el body con los campos indicados aquí 
        this.postTrabajador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tipoT, DNI, nombre, apellidos, fechaNac, horasSem, salHora, especialidad, vehiculo } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                tipoT: tipoT,
                DNI: DNI,
                nombre: nombre,
                apellidos: apellidos,
                fechaNac: fechaNac,
                horasSem: horasSem,
                salHora: salHora,
                especialidad: especialidad,
                vehiculo: vehiculo
            };
            const oSchema = new schemas_1.Trabajadores(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        // Recibe un documento en el body con los campos indicados aquí
        this.postVehiculo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { matricula, numPlazas, fechaInicio, pagoTarjeta, trabajadores, tipoTren, estaciones, baño, numPlantas } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                matricula: matricula,
                numPlazas: numPlazas,
                fechaInicio: fechaInicio,
                pagoTarjeta: pagoTarjeta,
                trabajadores: trabajadores,
                tipoTren: tipoTren,
                estaciones: estaciones,
                baño: baño,
                numPlantas: numPlantas
            };
            const oSchema = new schemas_1.Vehiculos(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.getTrabajador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, apellidos } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const j = yield schemas_1.Trabajadores.findOne({
                    nombre: nombre,
                    apellidos: apellidos
                });
                res.json(j);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.updateVehiculo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { matricula } = req.params;
            const { tipoTransp, numPlazas, fechaInicio, conductores, trayecto, combustible, pagoT } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Vehiculos.findOneAndUpdate({
                matricula: matricula
            }, {
                tipoTransp: tipoTransp,
                numPlazas: numPlazas,
                fechaInicio: fechaInicio,
                conductores: conductores,
                trayecto: trayecto,
                combustible: combustible,
                pagoT: pagoT
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateTrabajador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { DNI } = req.params;
            const { tipoT, nombre, apellidos, fechaNac, horasSem, salHora, especialidad, vehiculo } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Vehiculos.findOneAndUpdate({
                DNI: DNI
            }, {
                tipoT: tipoT,
                nombre: nombre,
                apellidos: apellidos,
                fechaNac: fechaNac,
                horasSem: horasSem,
                salHora: salHora,
                especialidad: especialidad,
                vehiculo: vehiculo
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deleteTrabajador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { DNI } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Trabajadores.findOneAndDelete({ DNI: DNI })
                .then((doc) => {
                if (doc == null) {
                    res.send(`No encontrado`);
                }
                else {
                    res.send('Borrado correcto: ' + doc);
                }
            })
                .catch((err) => res.send('Error: ' + err));
            database_1.db.desconectarBD();
        });
        this.deleteVehiculo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { matricula } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Vehiculos.findOneAndDelete({ matricula: matricula })
                .then((doc) => {
                if (doc == null) {
                    res.send(`No encontrado`);
                }
                else {
                    res.send('Borrado correcto: ' + doc);
                }
            })
                .catch((err) => res.send('Error: ' + err));
            database_1.db.desconectarBD();
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/vehiculos', this.getVehiculos),
            this._router.post('/vehiculo', this.postVehiculo),
            this._router.post('/trabajador', this.postTrabajador),
            this._router.get('/trabajador/:nombre/:apellidos', this.getTrabajador),
            this._router.put('/vehiculo/:matricula', this.updateVehiculo),
            this._router.put('/trabajador/:DNI', this.updateTrabajador),
            this._router.delete('/deleteTrabajador/:DNI', this.deleteTrabajador),
            this._router.delete('/deleteVehiculo/:matricula', this.deleteVehiculo);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
