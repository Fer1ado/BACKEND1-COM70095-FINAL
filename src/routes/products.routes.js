import { MongoProductManager } from "../Controller/db/productManager.js";
import { Router } from "express";
import { productModel } from "../Controller/models/product.model.js";

const prodRoute = Router();


//pedido de productos por ID
prodRoute.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  res.send(await MongoProductManager.getProductById(pid))
});

// Busqueda de Products con paginate y filtro
prodRoute.get("/", async (req,res)=>{
  const { limit = 3 , page = 1, filter = true, sort = "1" } = req.query;
  const response = await MongoProductManager.getProducts(limit,page,filter,sort)

  try{
        if(response.status === "success"){
          res.status(200).send(response)
        } if(response.status === "failed"){
          res.status(406).send(response)   
        } 
  } catch(error){
        res.status(500).send(error)
  }
})


//Subida de productos
prodRoute.post("/", async (req, res) => {
  const response = await MongoProductManager.addProduct(req.body)

    if(response.status === "success"){
      res.status(201).send(response)
    } if(response.status === "failed"){
      res.status(406).send(response)   
    } else{res.status(500).send(response)
    }
});

prodRoute.post("/many", async (req, res) => {
  const response = await MongoProductManager.addMany(req.body)
  res.status(200).send(response)   
});

//editado de producto
prodRoute.put("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await MongoProductManager.updateProduct(id, req.body)

  if(response.status === "success"){
    res.status(201).send(response)
  } if(response.status === "failed"){
    res.status(406).send(response)   
  } else{res.status(500).send(response)
  }

});

//borrado de producto
prodRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await MongoProductManager.deleteProduct(id)
  
  if(response.status === "success"){
    res.status(200).send(response)
  } if(response.status === "failed"){
    res.status(400).send(response)
  } else {res.status(500).send(response)}

});

export default prodRoute;
