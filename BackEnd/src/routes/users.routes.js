import { Router } from "express";
import { login,register } from "../controller/user.controller.js";
import {AsyncWrap} from "../util/AsyncWrap.js";
const router = Router();

router.route("/login").post(AsyncWrap(login));
router.route("/register").post(AsyncWrap(register));
router.route("/add_to_activity");
router.route("/get_all_activity");

export default router;