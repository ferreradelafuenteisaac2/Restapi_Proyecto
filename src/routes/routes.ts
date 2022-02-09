import {Request, Response, Router } from 'express'
import { Vehiculos, Trabajadores } from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getVehiculos = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Vehiculos.aggregate([
                {
                    $lookup: {
                        from: 'trabajadores',
                        localField: 'matricula',
                        foreignField: 'vehiculo',
                        as: "Asignacion"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    // Recibe un documento equipo en el body con los campos indicados aquí 
    private postTrabajador = async (req: Request, res: Response) => {
        const { tipoT, DNI, nombre, apellidos, fechaNac, horasSem, salHora, especialidad, vehiculo } = req.body
        await db.conectarBD()
        const dSchema={
            tipoT: tipoT,
            DNI: DNI,
            nombre: nombre,
            apellidos: apellidos,
            fechaNac: fechaNac,
            horasSem: horasSem,
            salHora: salHora,
            especialidad: especialidad,
            vehiculo: vehiculo
        }
        const oSchema = new Trabajadores(dSchema)
        await oSchema.save()
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    // Recibe un documento en el body con los campos indicados aquí
    private postVehiculo = async (req: Request, res: Response) => {
        const { matricula, numPlazas, fechaInicio, pagoTarjeta,
                trabajadores, tipoTren, estaciones, baño, numPlantas } = req.body
        await db.conectarBD()
        const dSchema={
            matricula: matricula,
            numPlazas: numPlazas,
            fechaInicio: fechaInicio,
            pagoTarjeta: pagoTarjeta,
            trabajadores: trabajadores,
            tipoTren: tipoTren,
            estaciones: estaciones,
            baño: baño,
            numPlantas: numPlantas
        }
        const oSchema = new Vehiculos(dSchema)
        await oSchema.save()
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    

    private getTrabajador = async (req:Request, res: Response) => {
        const { nombre, apellidos } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const j = await Trabajadores.findOne({
                nombre: nombre,
                apellidos: apellidos
            })
            res.json(j)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private updateVehiculo = async (req: Request, res: Response) => {
        const { matricula } = req.params
        const {  tipoTransp, numPlazas, fechaInicio, conductores, trayecto,
                combustible, pagoT } = req.body
        await db.conectarBD()
        await Vehiculos.findOneAndUpdate({
            matricula: matricula
        },{
            tipoTransp: tipoTransp,
            numPlazas: numPlazas,
            fechaInicio: fechaInicio,
            conductores: conductores,
            trayecto: trayecto,
            combustible: combustible,
            pagoT: pagoT
        },{
            new: true, // para retornar el documento después de que se haya aplicado la modificación
            runValidators:true
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateTrabajador = async (req: Request, res: Response) => {
        const {DNI} =req.params
        const {  tipoT, nombre, apellidos, fechaNac, horasSem, salHora, especialidad, vehiculo } = req.body
        await db.conectarBD()
        await Vehiculos.findOneAndUpdate({
            DNI: DNI
        },{
            tipoT: tipoT,
            nombre: nombre,
            apellidos: apellidos,
            fechaNac: fechaNac,
            horasSem: horasSem,
            salHora: salHora,
            especialidad: especialidad,
            vehiculo: vehiculo
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }


    private deleteTrabajador = async (req: Request, res: Response) => {
        const { DNI } = req.params
        await db.conectarBD()
        await Trabajadores.findOneAndDelete(
                { DNI: DNI}
            )
            .then( (doc: any) => {
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
            })
            .catch( (err: any) => res.send('Error: '+ err)) 
        db.desconectarBD()
    }

    private deleteVehiculo = async (req: Request, res: Response) => {
        const { matricula } = req.params
        await db.conectarBD()
        await Vehiculos.findOneAndDelete(
                { matricula: matricula}
            )
            .then( (doc: any) => {
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
            })
            .catch( (err: any) => res.send('Error: '+ err)) 
        db.desconectarBD()
    }
   

    misRutas(){
        this._router.get('/vehiculos', this.getVehiculos),
        this._router.post('/vehiculo', this.postVehiculo), 
        this._router.post('/trabajador', this.postTrabajador),
        this._router.get('/trabajador/:nombre/:apellidos', this.getTrabajador),
        this._router.put('/vehiculo/:matricula', this.updateVehiculo),
        this._router.put('/trabajador/:DNI', this.updateTrabajador),
        this._router.delete('/deleteTrabajador/:DNI', this.deleteTrabajador),
        this._router.delete('/deleteVehiculo/:matricula', this.deleteVehiculo)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router