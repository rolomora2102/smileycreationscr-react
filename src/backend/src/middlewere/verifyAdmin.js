// backend/middleware/verifyAdmin.js
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const CognitoConfig = require("../config/cognitoConfig");

const verifier = CognitoJwtVerifier.create({
  userPoolId: CognitoConfig.UserPoolId,
  clientId: CognitoConfig.ClientId,
  tokenUse: "id",
});

const verifyAdmin = async (req, res, next) => {
  try {
    // if (process.env.NODE_ENV === 'development') {
    //   // En entorno de desarrollo, permite acceso directo
    //   req.user = { isAdmin: true };
    //   return next();
    // }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    // Verificar el token en producción
    const payload = await verifier.verify(token);
    console.log("Token verificado, payload:", payload);

    req.user = payload;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token no válido" });
  }
};

module.exports = verifyAdmin;
