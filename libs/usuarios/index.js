const DaoObject = require("../../dao/mongodb/DaoObject");
const bcrypt = require('bcryptjs');
module.exports = class Usuario {
    usuarioDao = null;


        constructor ( usuarioDao = null) {
        if (!(usuarioDao instanceof DaoObject)){
            throw new Error('An Instance of DAO Object is required');
        }
        this.usuarioDao = usuarioDao;
    }


    async init()
    {
        await this.usuarioDao.init();
        this.usuarioDao.setup();
    }


    async addUsuario ({
        nombreCompleto = "", email = "", estado = "", avatar = "", password = "", fechaIngreso = ""
    })  {

        const result = await this.usuarioDao.insertOne(
            {
                nombreCompleto,
                email,
                estado,
                avatar,
                password: bcrypt.hashSync(password),
                fechaIngreso
            }
        );

        return {
            nombreCompleto, email, estado, avatar, password, fechaIngreso, id: result.lastID
          };

    };

    async getUsuarios() {
        return this.usuarioDao.getAll();

    };



    async getUsuarioByID({codigo})  {

        return this.usuarioDao.getById({codigo});

    };

    async getUsuarioByEmail({email})  {

        return this.usuarioDao.getByEmail({email});

    };

    async getUsuarioByToken({token})  {

        return this.usuarioDao.getByToken({token});

    };

    comparePasswords(rawPassword, dbPassword)
  {
    return bcrypt.compareSync(rawPassword, dbPassword)
  };

    async updateUsuario({codigo, nombreCompleto,
        email,
        estado,
        avatar,
        password,
        fechaIngreso}) {
       const result = await this.usuarioDao.updateOne({codigo, nombreCompleto,
        email,
        estado,
        avatar,
        password: bcrypt.hashSync(password),
        fechaIngreso});

       return {
           codigo: codigo,
           nombreCompleto: nombreCompleto,
            email: email,
            estado: estado,
            avatar: avatar,
            password: password,
            fechaIngreso: fechaIngreso,
           modified: result.changes
       }

    };

    async UpdateToken({codigo, token}) {
        const result = await this.usuarioDao.UpdateOneToken({codigo, token});

        return {
            codigo: codigo,
            token: token,
            modified: result.changes
        }

     };

     async UpdatePassword({codigo, password}) {
        const result = await this.usuarioDao.updateOnePasword({codigo, password: bcrypt.hashSync(password),});

        return {
            codigo: codigo,
            password: bcrypt.hashSync(password),
            modified: result.changes
        }

     };


    async deleteUsuario({codigo}) {
        const userToDelete = await this.usuarioDao.getById({codigo});
        const result = await this.usuarioDao.deleteOne({codigo});

        return {
            ...userToDelete,
            deleted: result.changes
        };
    };
}
