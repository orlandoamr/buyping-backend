const { parse } = require('dotenv');
var express = require('express');
var router = express.Router();
var CategoriesModel = require('../categories/categories.model.js');
var Categories = new CategoriesModel();

router.get('/all', async(req, res, next)=>{
    try{
        const allCategories = await Categories.getCategories(); 
        return res.status(200).json({status : "OK", payload : allCategories});
    }catch(ex){
        console.log(ex);
        return res.status(500).json({status: "Error", payload : {msg : "Error al procesar la petición"}});
    }
});

module.exports = router;