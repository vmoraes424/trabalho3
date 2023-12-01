import { Pecas } from "../Models/Pecas.js";
import { Usuario } from "../Models/Usuario.js";
import { Troca } from "../Models/Troca.js";
import { Log } from "../Models/Log.js";
import bcrypt from "bcrypt";

export async function UsuarioIndex(req, res) {
  try {
    const usuario = await Usuario.findAll({
      include: Pecas,
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}
export async function logIndex(req, res) {
  try {
    const log = await Log.findAll();
    res.status(200).json(log);
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}

function validaSenha(senha) {
  const mensa = [];
  if (senha.length < 8) {
    mensa.push("Erro no caracteres da senha, deve ter 8");
  }
  let pequenas = 0;
  let grandes = 0;
  let numeros = 0;
  let simbolos = 0;

  for (const letra of senha) {
    if (/[a-z]/.test(letra)) {
      pequenas++;
    } else if (/[A-Z]/.test(letra)) {
      grandes++;
    } else if (/[0-9]/.test(letra)) {
      numeros++;
    } else {
      simbolos++;
    }
  }

  if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 8) {
    mensa.push("Senha deve ter Maiusculo, Minusculo, Numeros e Símbolos");
  }
  return mensa;
}

export async function UsuarioCreate(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json("Erro, informe nome, email e senha");
    return;
  }
  const mensagem = validaSenha(senha);
  if (mensagem.length > 0) {
    res.status(400).json({ erro: mensagem.join(", ") });
    return;
  }

  const AchaEmail = await Usuario.findOne({ where: { email } });
  if (AchaEmail) {
    res.status(400).json({ erro: "Erro, este email já foi cadastrado" });
    return;
  }

  try {
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error("Erro durante a criação do usuário:", error);
    res.status(400).json({ msg: "Erro durante a criação do usuário." });
  }
}

export async function usuarioTrocaSenha(req, res) {
  const { email, novasenha } = req.body;
  const { hash } = req.params;
  const troca = await Troca.findOne({ where: { email, hash } });

  if (!email || !novasenha) {
    res.status(400).json("Erro... Informe email e novasenha do usuário");
    return;
  }

  if (troca === null) {
    res.status(400).json({ msg: "Erro, não encontrado" });
    return;
  }

  const mensagem = validaSenha(novasenha);

  if (mensagem.length > 0) {
    res.status(400).json({ erro: mensagem.join(", ") });
    return;
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario && bcrypt.compareSync(novasenha, usuario.senha)) {
      res
        .status(400)
        .json({ msg: "Erro, a nova senha não pode ser igual à senha antiga" });
      return;
    }

    await Usuario.update(
      { senha: novasenha },
      { where: { email }, individualHooks: true }
    );

    res.status(200).json({ msg: "Senha alterada com sucesso" });

    await Log.create({
      descricao: "Troca de senha",
      complemento: `Nova senha para o email ${email}`,
    });
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}
