const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

Connection = require('./Connection');

require('dotenv').config();
describe('Probando Connection con MongoDB', ()=>{
    beforeAll( async()=>{
        return true;
      });
    test('Probando Conexion a DB', async ()=>{
        const db = await Connection.getDB();
        expect(db).toBeDefined();
    });

    test('Probando Conexion a DB cacheada', async () => {
        const db = await Connection.getDB();
        expect(db).toBeDefined();
      });




});