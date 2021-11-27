const { parse } = require('dotenv');
var express = require('express');
var router = express.Router();
var ProductsModel = require('./products.model.js');
var CategoriesModel = require('../categories/categories.model.js');
var Categories = new CategoriesModel();
var Products = new ProductsModel();

//Obtener todos los productos
router.get('/all', async(req, res, next)=>{
    try{
        const allProducts = await Products.getActiveProducts(); 
        return res.status(200).json({status : "OK", payload : allProducts});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status: "Error", payload : {msg : "Error al procesar la petición"}});
    }
});

//Obtener productos por categoría
router.get('/bycategory/:id', async(req, res, next)=>{
    try{
        const {id} = req.params; 
        const productsByCategory = await Products.getProductsByCategory(id); 
        return res.status(200).json({status : "OK", payload : productsByCategory});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status: "Error", payload : {msg : "Error al procesar la petición"}});
    }
});


//Agregar un nuevo producto
router.post('/new', async (req, res, next)=>{
    try{
        const {
            name,
            description,
            price,
            quantity,
            status,
            categoryid
        } = req.body;

        //Validaciones
        let result = await Products.addProduct(name, description, price,quantity, status, req.user._id, categoryid);
        return res.status(200).json({status : "OK", payload : {msg: "Producto agregando satisfactoriamente"}});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status : " Error", payload : {msg: "Error al presentar petición"}});
    }
});

//Actualizar un producto
router.put('/update/:id', async (req, res, next)=>{
    try{
        const {
            name,
            description,
            price,
            quantity,
            status,
            active,
            categoryid
        } = req.body;

        const {id} = req.params;

        let result = await Products.updateProduct(id, name, description, price, quantity, status, active, categoryid);
        return res.status(200).json({status : "OK", payload : {msg: "Producto actualizado satisfactoriamente"}});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status : " Error", payload : {msg: "Error al presentar petición"}});
    }
});

//Eliminar un producto
router.delete('/delete/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        let result = await Products.deleteProduct(id);
        return res.status(200).json({status : "OK", payload : {msg: "Producto eliminado satisfactoriamente"}});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status : " Error", payload : {msg: "Error al presentar petición"}});
    }
    
});

module.exports = router;