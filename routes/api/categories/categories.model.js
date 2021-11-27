var conn = require('../../../utils/dao');
var ObjectID = require('mongodb').ObjectId;
var _db;

class CategoriesModel {
    CategoriesColl = null;

    constructor(){
        this.initModel();
    }

    async initModel(){
        try{
            _db = await conn.getDB();
            this.CategoriesColl = await _db.collection("categories");
        }catch(ex){
            console.log(ex);
            process.exit(1);
        }
    }
    //Obtener las categorias activas
    async getCategories(){
        let filter = {"active" : true};
        let result = await this.CategoriesColl.find(filter);
        return result.toArray();
    }
    
    async getCategoryByName(name){
        let filter = {"name" : name};
        let result = await this.CategoriesColl.find(filter);
        return result.toArray();
    }

    
}

module.exports = CategoriesModel;