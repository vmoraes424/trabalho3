import express from "express";
import { sequelize } from "./databases/conecta.js";
import { Usuario } from "./Models/Usuario.js";
import router from "./routes.js";
import { Log } from "./Models/Log.js";
import { Troca } from "./Models/Troca.js";
import { Pecas } from "./Models/Pecas.js";

const app = express();
app.use(express.json());

const port = 3000;
app.use(router);

app.get("/", (req, res) => {
  res.send("Sistema de Cadastro de Peças de Computador");
});

async function conecta_db() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com Banco de Dados realizada com Sucesso");
    await Usuario.sync();
    await Pecas.sync();
    await Log.sync();
    await Troca.sync();
  } catch (error) {
    console.error("Erro ao conectar o banco de dados:", error);
  }
}
conecta_db();

app.listen(port, () => {
  console.log(`API Rodando na Porta: ${port}`);
});
