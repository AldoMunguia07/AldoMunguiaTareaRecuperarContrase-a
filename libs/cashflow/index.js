const DaoObject = require("../../dao/mongodb/DaoObject");
module.exports = class CashFlow {
    cashFlowDao = null;



        constructor ( cashFlowDao = null) {
        if (!(cashFlowDao instanceof DaoObject)){
            throw new Error('An Instance of DAO Object is required');
        }
        this.cashFlowDao = cashFlowDao;
    }


    async init()
    {
        await this.cashFlowDao.init();
        this.cashFlowDao.setup();
    }



    async addCashFlow ({
        description = 'New CashFlow',
        date = new Date().toISOString(),
        type = 'INCOME',
        category = 'Salary',
         amount = 0,
         userId = ''
    })  {

        const result = await this.cashFlowDao.insertOne(
            {
                description,
                date,
                type,
                category,
                amount,
                userId
            }
        );

        return {
            description,
            date,
            type,
            category,
            amount,
            result
          };
    };

    async getCashFlows(userId) {
        return this.cashFlowDao.getAll(userId);
        //return categoriasMemStore;
    };

    async getPagedCashFlows(userId, page=1, limit=20) {
        return this.cashFlowDao.getAllPaged({userId, page, pageLimit:limit});
        //return categoriasMemStore;
    };


    async getCashFlowGroupedByType(userId) {
        return this.cashFlowDao.getGroupByType({userId});
    }



    async getCashFlowByID({codigo})  {

        return this.cashFlowDao.getById({codigo});

    };



    async deleteCashFlow ({codigo}) {
        const cashToDelete = await this.cashFlowDao.getById({codigo});
        const result = await this.cashFlowDao.deleteOne({codigo});

        return {
            ...cashToDelete,
            deleted: result.changes
        };

    };
}
