import EErrors from "../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Causa no especificada",
      });
      break;
    case EErrors.INVALID_CREDENTIALS:
      res.status(401).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Credenciales inválidas",
      });
      break;
    case EErrors.USER_NOT_FOUND:
      res.status(404).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Usuario no encontrado",
      });
      break;
    case EErrors.PRODUCT_UNAVAILABLE:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Productos no disponibles",
        unavailableProducts: error.unavailableProducts || [],
      });
      break;
    case EErrors.INVALID_TOTAL_AMOUNT:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Monto total inválido",
      });
      break;
    case EErrors.UNAUTHENTICATED_USER:
      res.status(401).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Usuario no autenticado",
      });
      break;
    case EErrors.CART_NOT_FOUND:
      res.status(404).json({
        status: "error",
        error: error.name,
        cause: error.cause || "El carrito no existe",
      });
      break;
    case EErrors.MISSING_FIELDS:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause || "Campos requeridos faltantes",
      });
      break;
    case EErrors.PRODUCT_EXISTS:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause || "El código de producto ya existe",
      });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unhandled error" });
      break;
  }
};