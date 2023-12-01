import { Router } from "express";
import {
  UsuarioCreate,
  UsuarioIndex,
  logIndex,
  usuarioTrocaSenha,
} from "./Controllers/usuarioControllers.js";
import { loginIndex } from "./Controllers/loginController.js";
import {
  pecaAlteraPreco,
  pecaCreate,
  pecaDestroy,
  pecaIndex,
  pecaSearch,
} from "./Controllers/pecaController.js";
import { verificaLogin } from "./Middlewares/VerificaLogin.js";
import { enviaEmail } from "./Controllers/emailController.js";

const router = Router();

router.get("/usuario", UsuarioIndex);
router.post("/usuario", UsuarioCreate);
router.post("/usuario/trocasenha/", enviaEmail);
router.patch("/usuario/novasenha/:hash", usuarioTrocaSenha);

router.get("/pecas", verificaLogin, pecaIndex);
router.post("/pecas", verificaLogin, pecaCreate);
router.delete("/pecas/:id", verificaLogin, pecaDestroy);
router.patch("/pecas/:id/:novoPreco", verificaLogin, pecaAlteraPreco);
router.get("/pecas/:procura", verificaLogin, pecaSearch);

router.get("/login", loginIndex);

router.get("/log", logIndex);

export default router;
