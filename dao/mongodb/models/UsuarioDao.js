const { db } = require("../Connection");
const DaoObject = require("../DaoObject")

module.exports = class CategoryDao extends DaoObject{
    constructor(db = null){
        console.log('CategoryDao db: ', db);
        super(db, 'usuarios');
      }


    async setup(){
        if(process.env.MONGODB_SETUP){
            //TODO: Agregar indices
            const indexExists = await this.collection.indexExists('email_1');

          if(!indexExists)
          {
            await this.collection.createIndex({'email':1}, {unique:true})
          }
        }
    }

    getAll() {
        return this.find();
      }

      getById({codigo}) {

        return this.findById(codigo);
      }

      getByEmail({email}) {

        return this.findOne({email});
      }



    insertOne({nombreCompleto, email, estado, avatar, password})
    {
        return super.insertOne({nombreCompleto, email, estado, avatar, password, created: new Date().toISOString()});
    }

    updateOne({codigo, nombreCompleto, email, estado, avatar, password})
    {
        const updateCommand = {
            '$set': {
                nombreCompleto,
                email,
                estado,
                avatar,
                password,
                updated: new Date().toISOString()
            }
        };
        return super.updateOne(codigo, updateCommand);
    }

    deleteOne({codigo})
    {
        return super.removeOne(codigo)
    }



}