import { Router } from "express";
import { createVatValidationController } from "../controllers/VatValidationController.js";
import { Configuration } from "../models/Configuration.js";

const createExpressRouter = (configuration: Configuration) => {
  const expressRouter = Router({
    caseSensitive: true,
    strict: true,
  });
    const validateVatController = createVatValidationController(configuration);
  expressRouter.post('/', validateVatController);
  expressRouter.get('/',validateVatController);
  return expressRouter
}  

export default createExpressRouter;
