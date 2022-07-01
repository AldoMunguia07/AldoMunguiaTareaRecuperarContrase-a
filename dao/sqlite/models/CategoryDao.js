const { db } = require("../Connection");
const DaoObject = require("../DaoObject")

module.exports = class CategoryDao extends DaoObject{
    constructor(db = null){
        console.log('CategoryDao db: ', db);
        super(db);
      }


    setup(){
        if(process.env.SQLITE_SETUP){
            const createStatement = 'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, status TEXT);'
            this.conn.run(createStatement);
        }
    }


    insertOne({categoria, estado}){
        const sqlstr = 'INSERT INTO categories (category, status) values (?, ?);';
        const sqlparamArr = [categoria, estado];
        return this.run(sqlstr, sqlparamArr)
    }

     getAll(){
        return this.all('SELECT * FROM categories;', []);
    }

    getById({codigo}){
        const sqlstr = 'SELECT * FROM categories WHERE id = ?';
        const sqlParamArr = [codigo];

        return this.get(sqlstr, sqlParamArr);
    }

    updateOne({codigo, categoria, estado})
    {
        const sqlstr = 'UPDATE categories SET category = ?, status = ? WHERE id = ?';
        const sqlParamArr = [categoria, estado, codigo];
        return this.run(sqlstr, sqlParamArr);
    }

    deleteOne({codigo})
    {
        const sqlstr = 'DELETE FROM categories WHERE id = ?';
        const sqlParamArr = [codigo];
        return this.run(sqlstr, sqlParamArr);
    }

}