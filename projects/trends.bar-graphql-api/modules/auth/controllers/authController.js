const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const globalConfig = require("../config_api.js");
const jsonWebToken = require("jsonwebtoken");
const userController = require("./userController");
const sessionController = require("../controllers/sessionController");

const JWT_EXPIRES_AFTER_HOURS = 6;

const jwtOptionsBase = {
  issuer: "ateventhorizon.com",
  algorithm: "HS384"
};

exports.verifyToken = async jwtToken => {
  return await jsonWebToken.verify(
    jwtToken,
    globalConfig.JWTSecret,
    jwtOptionsBase
  );
};

export const getUserFromTokenRaw = async token => {
  return await getUserFromToken(await exports.verifyToken(token));
};

export const getUserFromToken = async (jwtPayload) => {
  const sessionId = jwtPayload.sub;
  const session = await sessionController.getValidSessionById(sessionId);
  // console.log("Session:",session);
  if (session !== null) {
    let user = await userController.getUserByIdProject(
      session.userId,
      session.project
    );
    if (user === null) return null;

    user.roles = user.roles.map(v => v.toLowerCase());
    user.project = session.project;
    user.sessionId = sessionId;
    user.expires = jwtPayload.exp;
    user.hasToken = true;
    user.hasSession = true;
    return user;
  }

  return null;
};

exports.InitializeAuthentication = () => {

  const cookieExtractor = function (req) {
    // console.log("COOKIE EXTRACTOR");
    let token = null;
    if (req && req.signedCookies && req.signedCookies["eh_jwt"]) {
      token = req.signedCookies["eh_jwt"];
    }
    return token;
  };

  const authHeaderExtractor = function (req) {
    // console.log("AUTH HEADER EXTRACTOR");
    let token = null;
    if (
      req &&
      req.headers &&
      req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer ")
    ) {
      token = req.headers["authorization"].substr(7);
    }
    return token;
  };

  //
  //Configure jwt strategy
  //
  const jwtOptions = {
    ...jwtOptionsBase,
    jwtFromRequest: ExtractJwt.fromExtractors([
      cookieExtractor,
      authHeaderExtractor
    ]),
    secretOrKey: globalConfig.JWTSecret,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      const user = await getUserFromToken(jwtPayload);
      console.log("user from token ", user);
      user === null ? done(null, false, {message: "Invalid token/user"}) : done(null, user);
    })
  );

};

const createJwtToken = async (sessionId, issuedAt, expiresAt) => {
  const payload = {
    iat: issuedAt,
    exp: expiresAt,
    sub: sessionId
  };
  //console.log(globalConfig.JWTSecret);
  const jwt = await jsonWebToken.sign(
    payload,
    globalConfig.JWTSecret,
    jwtOptionsBase
  );

  return jwt;
};

exports.getToken = async (userId, project, ipAddress, userAgent) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 60 * 60 * JWT_EXPIRES_AFTER_HOURS;

  const session = await sessionController.createSession(
    userId,
    project,
    ipAddress,
    userAgent,
    issuedAt,
    expiresAt
  );
  const jwt = await createJwtToken(session.ids, issuedAt, expiresAt);

  return {
    session: session.ids,
    token: jwt,
    expires: expiresAt
  };
};

exports.authenticate = passport.authenticate(
  ["jwt"],
  {
    session: false
  }
);

