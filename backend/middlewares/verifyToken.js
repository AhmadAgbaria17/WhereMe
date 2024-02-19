const jwt = require("jsonwebtoken");


// verify Token
function verifyToken(req,res,next){
  const authToken = req.headers.authorization;
  if(authToken) {
    const token = authToken.split(' ')[1]; //Bearer xxx.
    try{
      const decodedPayload = jwt.verify(token,process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    }catch (error){
      return res.status(401).send({msg:"Invalid token"});
    }

  }else{
    return res.status(401).send({message: "no token provided, access denied"})
  }
}
//Verift Token and Admin
function verifyTokenAndAdmin(req,res,next){
  verifyToken(req,res,()=>{
    if(req.user.isAdmin){
      next();
    }else{
      return res.status(403).json({ message:"not allowed, only Admin"});
    }
  })
}

//Verift Token and only user himself
function verifyTokenAndOnlyUser(req,res,next){
  verifyToken(req,res,()=>{
    if(req.user.id === req.params.id){
      next();
    }else{
      return res.status(403).json({ message:"not allowed, only User himself"});
    }
  });
}

//Verift Token and Authorization for the user himself and for the Admin
function verifyTokenAndAuthorization(req,res,next){
  verifyToken(req,res,()=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
      next();
    }else{
      return res.status(403).json({ message:"not allowed, only User himself or Admin"});
    }
  });
}

module.exports ={
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization
}