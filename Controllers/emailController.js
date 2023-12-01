import nodemailer from "nodemailer";
import md5 from "md5";
import { Usuario } from "../Models/Usuario.js";
import { Troca } from "../Models/Troca.js";

async function main(nome, email, hash) {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "6036d666e027b0",
      pass: "22c3105b3c43db",
    },
  });

  const link = "http://localhost:3000/usuario/novasenha/" + hash;

  let mensa = "<h1>Vinny Loja de Computadores</h1>";
  mensa += `<h2>Usuário: ${nome}</h2>`;
  mensa +=
    "<p>Você solicitou a troca de senha da sua conta, aqui está o link</p>";
  mensa += "<p>Clique no link abaixo para realizar a troca</p>";
  mensa += `<a href="${link}">Alterar sua senha</a>`;
  mensa +=
    "<p>Se você não solicitou a troca de senha, desconsidere este email</p>";

  const info = await transport.sendMail({
    from: '"Peças de Computadores Vinny" <pecas@viniciusdev.com>',
    to: email,
    subject: "Solicitação de Troca de Senha",
    text: `Copie e cole o endereço ${link} para alterar`,
    html: mensa,
  });

  console.log("Message sent: %s", info.messageId);
}

export async function enviaEmail(req, res) {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario === null) {
      res.status(400).json({ msg: "Email não encontrado" });
    }
    const hash = md5(usuario.nome, email, Date.now());

    main(usuario.nome, email, hash);

    await Troca.create({ email, hash });

    res.status(200).json({ msg: "Email enviado com sucesso!" });
  } catch (error) {
    res.status(400).json({ msg: "Erro, informe o email" });
  }
}
