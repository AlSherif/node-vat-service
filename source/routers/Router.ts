import { Router } from "express";
import { validateVatController } from "../controllers/VatValidationController.js";

const expressRouter: Router = Router({
    caseSensitive: true,
    strict: true,
  });
  expressRouter.all('/', validateVatController)
export default expressRouter;
