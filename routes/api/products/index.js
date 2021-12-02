const { parse } = require('dotenv');
var express = require('express');
var router = express.Router();
var ProductsModel = require('./products.model.js');
var CategoriesModel = require('../categories/categories.model.js');
var Categories = new CategoriesModel();
var Products = new ProductsModel();
var img = "";
const multer = require('multer');

//Definir la ruta de alamacenamiento de las imágenes
const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, './public/images/products');
  },

  //add back the extension
  filename: function (request, file, callback) {
      img = Date.now().toString() + file.originalname;
    callback(null, img);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

//Obtener todos los productos
router.get('/all', async(req, res, next)=>{
    try{
        let allProducts = await Products.getActiveProducts();
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

//Obtener productos del usuario logeado
router.get('/byloggeduser', async(req, res, next)=>{
    try{
        const productsByUser = await Products.getProductsByUser(req.user._id); 
        console.log(req.user._id);
        return res.status(200).json({status : "OK", payload : productsByUser});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status: "Error", payload : {msg : "Error al procesar la petición"}});
    }
});

//Obtener productos por secciones
router.get('/facet/:page/:items', async(req, res, next) =>{
    try{
        let {page, items} = req.params;
        page = parseInt(page) || 1;
        items = parseInt(items) || 10;

        const products = await Products.getByFacet(page, items);
        
        return res.status(200).json({status : "OK", payload : {"msg" : products}});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({ msg: "Error al procesar petición" });
      }
  });

//Agregar un nuevo producto
router.post('/new',upload.single('image'), async (req, res, next)=>{
    try{
        
        const {
            name,
            description,
            price,
            quantity,
            status,
            categoryid,
            contact
        } = req.body;

        console.log(req.body);
        let imgurl = "http://localhost:3000/images/products/" + img;
        //Validaciones
        let result = await Products.addProduct(name, description, price,quantity, status, req.user._id, categoryid, imgurl, contact);
        return res.status(200).json({status : "OK", payload : {msg: "Producto agregando satisfactoriamente"}});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status : " Error", payload : {msg: "Error al presentar petición"}});
    }
});

//Actualizar un producto
router.put('/update/:id',upload.single('image'), async (req, res, next)=>{
    try{
        const {
            name,
            description,
            price,
            quantity,
            status,
            active,
            contact,
            categoryid
        } = req.body;

        const {id} = req.params;
        let imgurl = "http://localhost:3000/public/images/products/" + img;
        let result = await Products.updateProduct(id, name, description, price, quantity, status, active, categoryid, imgurl, contact);
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