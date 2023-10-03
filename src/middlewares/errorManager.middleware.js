import EErros from "../utils/Errors.js";
import logger from "../utils/logger.js";

export default (err, req, res, next) => {
    logger.error(err.cause);
    switch (err.code) {
        case EErros.INVALID_TYPE:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case EErros.ROUTING_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break
        case EErros.DATABASE_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break

        default:
            res.status(500).send({ status: "error", error: "Internal Server Error" });
            break;
    }
};