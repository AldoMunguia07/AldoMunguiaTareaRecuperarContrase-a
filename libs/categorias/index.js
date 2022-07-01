const DaoObject = require("../../dao/mongodb/DaoObject");
module.exports = class Category {
    categoryDao = null;


    /*module.exports.getCategoryVersion = async () =>{
        return {
            entity: 'Categories',
            version: '1.0.0',
            description: 'CRUD de Categorias'
        }
    };*/
        constructor ( categoryDao = null) {
        if (!(categoryDao instanceof DaoObject)){
            throw new Error('An Instance of DAO Object is required');
        }
        this.categoryDao = categoryDao;
    }


    async init()
    {
        await this.categoryDao.init();
        this.categoryDao.setup();
    }





    //let categoriasMemStore = [];
    //let categoriasCurrentKey = 0;

    async addCategory ({
        categoria = 'NuevaCategoria',
        estado = 'ACT'
    })  {

        const result = await this.categoryDao.insertOne(
            {
                categoria,
                estado
            }
        );

        return {
            categoria, estado, id: result.lastID
          };
        /*categoriasCurrentKey++;
        const newCodigo = categoriasCurrentKey;
        const newCategoria = {
            codigo: newCodigo,
            categoria,
            estado
        }

        categoriasMemStore = categoriasMemStore.concat(newCategoria);
        return newCategoria;*/
    };

    async getCategories() {
        return this.categoryDao.getAll();
        //return categoriasMemStore;
    };





    async getCategoryByID({codigo})  {

        return this.categoryDao.getById({codigo});
        /*const selectedCategory = categoriasMemStore.find(
            obj => obj.codigo === codigo
        )

        return selectedCategory;*/
    };

    async updateCategory({codigo, categoria, estado}) {
       const result = await this.categoryDao.updateOne({codigo, categoria, estado});

       return {
           id: codigo,
           category: categoria,
           status: estado,
           modified: result.changes
       }
        /*let updatedCategpry = null;
        const newCategories = categoriasMemStore.map((objCategoria =>{
            if(objCategoria.codigo === codigo)
            {
                updatedCategpry = {...objCategoria, categoria, estado};
                return updatedCategpry;
            }

            return objCategoria;
        }))

        categoriasMemStore = newCategories;
        return updatedCategpry;*/
    };

    async deleteCategory ({codigo}) {
        const cateToDelete = await this.categoryDao.getById({codigo});
        const result = await this.categoryDao.deleteOne({codigo});

        return {
            ...cateToDelete,
            deleted: result.changes
        };
        /*let deletedCategory = null;
        const newCategories = categoriasMemStore.filter((objCategoria) => {
            if(objCategoria.codigo === codigo)
            {
                deletedCategory = objCategoria;
                return false;
            }

            return true;
        });
        categoriasMemStore = newCategories;
        return deletedCategory;*/
    };
}
