import jwt from "jsonwebtoken";

const secret = 'test';

const auth = async (req, res, next) => {
  try {
   
    let token = req.headers.authorization
    const isCustomAuth = token.length < 500;
    
    if(isCustomAuth) {
      token = token.slice(7, token.length).trimLeft()
    }
    let decodedData = jwt.verify(token, secret)
    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;