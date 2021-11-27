var conn = require('../../../utils/dao');
var ObjectID = require('mongodb').ObjectId;

var _db;

class ProductsModel {
    productsColl = null;

    constructor(){
        this.initModel();
    }

    async initModel(){
        try{
            _db = await conn.getDB();
            this.productsColl = await _db.collection("products");
        }catch(ex){
            console.log(ex);
            process.exit(1);
        }
    }

    //Obtener todos los productos activos
    async getActiveProducts(){
        let filter = {active:true}
        let products = this.productsColl.find(filter);
        return products.toArray();
    }

    //Obtener productos por categoria
    async getProductsByCategory(id){
        let filter = {"category_id" : new ObjectID(id)}
        let result = await this.productsColl.find(filter);
        return result.toArray();
    }

    

    //Insertar nuevo producto
    async addProduct(name, description, price, quantity, status, userid, categoryid){
        let newProduct =  {
            name,
            description,
            price,
            quantity,
            published : new Date(),
            status,
            active : true,
            user_id : new ObjectID(userid),
            category_id : new ObjectID(categoryid)
        }

        let result = await this.productsColl.insertOne(newProduct);
        return result;
    }

    //Actualizar un producto
    async updateProduct(id, name, description, price, quantity, status, act, categoryid){
        const filter = {"_id" : new ObjectID(id)};
        let active = (act == "true") ? true : false;
        const updateAction = {"$set" : {
            name,
            description,
            price,
            quantity,
            status,
            active ,
            category_id : categoryid}};
        let result = await this.productsColl.updateOne(filter, updateAction); 
        return result;
    }

    //Eliminar un producto
    async deleteProduct(id){
        const filter = {"_id" : new ObjectID(id)};
        let result = await this.productsColl.deleteOne(filter);

        return result;
    }
}

module.exports = ProductsModel;