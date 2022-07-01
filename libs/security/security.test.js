const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const singJwt = require('./index');

describe('Testing JWT Token Generation', ()=>{
    let env;

    beforeAll(() => {
        env = process.env;
        process.env = {
            ...env,
            JWT_SECRET: "CR7_ES_MAS_QUE_MESSI",
            JWT_AGE_SECONDS: 1000
        }

    }),

    afterAll(() => {
        process.env = {...env};
    });

    test('Creando JWT', () =>{
        const jwt = singJwt({Prueba: 'Prueba', temp: 'Temp Data'});
        console.log(jwt);
        expect(jwt).toBeDefined();
    })
});