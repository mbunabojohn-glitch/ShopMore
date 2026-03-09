import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";

dotenv.config();

// Generate short-lived access token and long-lived refresh token for a user
const generateToken = (userId) => {
  const AccessToken = jwt.sign({ userId }, process.env.Access_Token, {
    expiresIn: "15m", // short lifespan for security
  });

  const RefreshToken = jwt.sign({ userId }, process.env.Refresh_Token, {
    expiresIn: "7d", // "7d" not "7days" — JWT only accepts shorthand
  });

  return { AccessToken, RefreshToken };
};

// Attach both tokens as secure HTTP-only cookies (not accessible via JS in browser)
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // prevents CSRF attacks
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// Middleware to protect private routes — verifies the access token before allowing access
const protectedRoute = async (req, res, next) => {
  try {
    // Read token from cookie (automatically sent by browser/Postman)
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token" });
    }

    // Verify token signature and expiry using our secret key
    const decoded = jwt.verify(accessToken, process.env.Access_Token);

    // Fetch the user from DB using the id stored inside the token
    const user = await User.findById(decoded.userId).select("-password"); // exclude password from result

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // attach user to request so controllers can access it via req.user
    next(); // pass control to the next middleware or controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token was valid but has expired — user needs to log in again
      return res.status(401).json({
          message: "Unauthorized - Access token expired, please login again",
        });
    }
    console.log("protectedRoute middleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token", error: error.message });
  }
};

// Middleware to restrict access to admin users only — must run after protectedRoute
const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // user is admin, allow through
  } else {
    return res.status(403).json({ message: "Access Denied - Admin Only" });
  }
};

export { generateToken, setCookies, protectedRoute, adminRoute };
