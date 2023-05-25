import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401);
    throw new Error("You are not authenticated");
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      res.status(403);
      throw new Error("Invalid token");
    }
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
