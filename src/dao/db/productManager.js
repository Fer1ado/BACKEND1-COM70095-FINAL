import { productModel } from "../models/product.model.js";
import productMany from "../../Json/init-products-data.js"

class ProductDAO {

    constructor() {
          (this.mockObject = {   
          "title": "string",
          "description": "string",
          "price": 123,
          "thumbnail": ["string1","string2","string3"],
          "code": "string",
          "stock": 123,
          "status": "boolean"})
      }
   
    async getProducts(limit,page,query,sort) {
        
        return await productModel.find().limit(limit);
    }

    async getProductById(id) {
        try{
        const product = await productModel.findById({_id: id});
        return {status: "success", message:`encontramos el siguiente producto con con ID: ${id}`, product }
        } catch(err){
            return{status: "failed", message: err.message}
        }
        
    }

    async addMany() {

        try {
            const products = await productModel.insertMany(productMany);
            return {status: "success", message: "La base de datos ya tendría que estar cargada", products}
        } catch (err) {
            return {status: 'failed', message: err.message}
        }
    }


    async addProduct(productData) {
        // Chqueo que no esten faltando propiedades en el producto a agregar a la DB
        const integrity = productData.hasOwnProperty("title")&&("description" in productData)&&("price" in productData)&&("thumbnail" in productData)&&("stock" in productData)&&("code" in productData)&&("status" in productData)
        const prod = await productModel.findOne({ code: productData.code });
        
        console.log(prod)

        try{
           
            if (!integrity){
                console.log("Información erroena o incompleta")
                return {status: "failed", message: "INFORMACIÓN ERRONEA O INCOMPLETA: EL POSTEO DEBE TENER EL SIGUIENTE FORMATO", objetoEjemplo: this.mockObject}
            }
            if (check) {
                console.log("Producto Incompleto");
                return{status: "failed", message: "PRODUCTO INCOMPLETO, FALTAN RELLENAR CAMPOS"}
            }
            if (prod) {
                console.log("Producto ya agregado");
                return{status: "failed", message: "PRODUCTO YA AGREGADO"}
            }
            else{
                const newProduct = await productModel.create(productData);
                return {status: "success", message:"producto creado con exito", newProduct  }
            }

        }catch(err){
            return {status: 'failed', message: err.message}
        }
    }

    async updateProduct(id, updateData) {
        const item = await this.getProductById(id)
        const orig = item.product._doc
        const newprod = {...orig, ...updateData}
        const origkeys = Object.keys(orig)
        
        //Chequeo que las propiedades que llegan para editar existan en el producto a ser editado
        let error = ""
        let chequeo = false
                const prop = () => {for ( let info in updateData) {
                console.log(info)
                if (origkeys.includes(info)){
                    console.log(`${info} esta incluido`)
                    chequeo = true
                } else {
                    console.log(`${item} no esta incluido`)
                    chequeo = false
                    error = info
                    return
                }
            }
        }
        prop()
    


        try{
            if(!chequeo){
                console.log("Faltan propiedades en el objeto")
                return {status: "failed", message: "LOS CAMPOS SON EDITABLES EN PRODUCTO HACEN REFERENCIA A ALGUNO DE LOS SIGUIENTES ATRIBUTOS:", objetoEjemplo: this.mockObject, error: `la clave: "${error}" no es un campo editable` }
            }
            else{
                const edit = await productModel.findByIdAndUpdate(id, updateData, { new: true });
                return {status: "success", message:"producto editado con exito", productoActualizado: edit }
            }
      
        }catch(err){
            return {status: "failed", message: err.message}
        }
    }

    async deleteProduct(id) {
        try{
            const erase = await productModel.findByIdAndDelete(id);
            return {status: "success", message:"producto eliminado con exito", erase  }        
        }catch(err){
            return {status: "failed", message: err.message}
        }
    }
}

export const MongoProductManager = new ProductDAO();