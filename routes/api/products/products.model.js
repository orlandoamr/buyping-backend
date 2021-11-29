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

    //Obtener productos de un usuario
    async getProductsByUser(id){
        let filter = {"user_id" : new ObjectID(id)};
        let result = await this.productsColl.find(filter);
        return result.toArray();
    }

    async getByFacet(page, itemsPerPage, userId){
        const filter = {};
        console.log(filter);

        let cursor = await this.productsColl.find({});
        let docsMatched = await cursor.count();
        cursor.skip((itemsPerPage * (page-1)));
        cursor.limit(itemsPerPage);

        let documents = await cursor.toArray();

        return {
            docsMatched,
            documents,
            page,
            itemsPerPage
        }

    }

    //Insertar nuevo producto
    async addProduct(name, description, price, quantity, status, userid, categoryid,imgurl){
        let newProduct =  {
            name,
            description,
            price,
            quantity,
            published : new Date(),
            status,
            active : true,
            imgurl,
            user_id : new ObjectID(userid),
            category_id : new ObjectID(categoryid)
        }

        let result = await this.productsColl.insertOne(newProduct);
        return result;
    }

    //Actualizar un producto
    async updateProduct(id, name, description, price, quantity, status, act, categoryid,imgurl){
        const filter = {"_id" : new ObjectID(id)};
        let active = (act == "true") ? true : false;
        const updateAction = {"$set" : {
            name,
            description,
            price,
            quantity,
            status,
            active ,
            imgurl,
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