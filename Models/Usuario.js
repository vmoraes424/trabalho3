import bcrypt from "bcrypt"
import { DataTypes } from "sequelize";
import { sequelize } from "../databases/conecta.js";

export const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING(200),
        allowNull: false,

    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    UltimoLog:{
        type:DataTypes.DATE()
    
    }
},{
    timestamps:true
})

Usuario.beforeCreate(usuario => {
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(usuario.senha, salt)
    usuario.senha = hash
})
Usuario.beforeUpdate(usuario => {
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(usuario.senha, salt)
    usuario.senha = hash
})