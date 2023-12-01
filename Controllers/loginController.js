import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Usuario } from "../Models/Usuario.js";
import * as dotenv from "dotenv";
import { Log } from "../Models/Log.js";
dotenv.config();

export async function loginIndex(req, res) {
  const { nome, email, senha, UltimoLog } = req.body;

  const MensaPadrao = "Erro...Senha Inválida";
  if (!email || !senha) {
    res.status(400).json("Erro, informe o email e senha");
    return;
  }
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario === null) {
      Log.create({
        descricao: "Tentativa de Login Inválido",
        complemento: `${email} tentou logar`,
      });
      res.status(400).json({ erro: "Erro... Esse email não existe" });
      return;
    }
    if (bcrypt.compareSync(senha, usuario.senha)) {
      const token = Jwt.sign(
        {
          usuario_logado_id: usuario.id,
          usuario_logado_nome: usuario.nome,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        msg:
          usuario.UltimoLog === null
            ? "Bem vindo!"
            : "Bem vindo de volta! Seu último acesso no sistema foi " +
              formataData(usuario.UltimoLog),
        token,
      });
      await Usuario.update({ UltimoLog: Date.now() }, { where: { email } });
      console.log(UltimoLog);
    } else {
      res.status(400).json({ erro: MensaPadrao });
      return;
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

function formataData(data) {
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const ano = data.getFullYear();

  const dataFormatada = `${dia}/${mes}/${ano}`;
  return dataFormatada;
}
