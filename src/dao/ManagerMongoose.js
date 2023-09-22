import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

export class ManagerMongoose {
    constructor(nombreCollecion, schema) {
        const _schema = new mongoose.Schema(schema, {versionKey: false})
        _schema.plugin(mongoosePaginate)
        this.collection = mongoose.model(nombreCollecion, _schema);
    }
    
    //Guarda
    async guardar(registro) {
        return await this.collection.create(registro)
    }
    
    //Busca segun campo
    async obtenerSegunCampo({campo,valor}) {
        const criterio = {}
        criterio[campo] = valor
        const buscado = await this.collection.findOne(criterio).lean()
        if (!buscado) {
            throw new Error("no encontrado")
        } else {
            return buscado
        }

    }
}