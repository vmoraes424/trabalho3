import { Pecas } from "../Models/Pecas.js";
import { Log } from "../Models/Log.js";
import { Usuario } from "../Models/Usuario.js";

export async function pecaIndex(req, res) {
  try {
    const peca = await Pecas.findAll({
      include: Usuario,
    });
    res.status(200).json(peca);
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}

export async function pecaCreate(req, res) {
  const { nome, preco, usuario_id } = req.body;
  try {
    const peca = await Pecas.create({
      nome,
      preco,
      usuario_id,
    });
    res.status(200).json(peca);
    if (!nome || !preco || !usuario_id) {
      res.status(400).json("Erro, informe nome, preço e usuario_id");
    }
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}

export async function pecaDestroy(req, res) {
  const { id } = req.params;
  try {
    const peca = await Pecas.destroy({
      where: { id },
    });

    res.status(200).json({ msg: "Peça deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}

export async function pecaAlteraPreco(req, res) {
  const { id, novoPreco } = req.params;
  try {
    const peca = await Pecas.update(
      {
        preco: novoPreco,
      },
      {
        where: { id },
      }
    );
    await Log.create({
      descricao: "Peça atualizada com sucesso",
      complemento: `A peça com id ${id} foi atualizada`,
    });
    res
      .status(200)
      .json({
        msg: `Peça com id ${id} foi atualizada para o preço ${novoPreco}`,
      });
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}

export async function pecaSearch(req, res) {
  const { procura } = req.params;
  try {
    const peca = await Pecas.findOne({ where: { nome: procura } });
    console.log(peca);
    if (peca === null) {
      res.status(400).json({ msg: "Não encontrado" });
    }

    res.status(200).json(peca);
  } catch (error) {
    res.status(400).json({ msg: "Erro" });
  }
}
