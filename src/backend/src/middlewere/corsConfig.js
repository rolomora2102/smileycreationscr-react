const corsConfig = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://smileycreationscr.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  
  // Manejo de preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
};

module.exports = corsConfig;
