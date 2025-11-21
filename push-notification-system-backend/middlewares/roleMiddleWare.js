const AuthorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req?.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
      const rolesArray = [...roles];
      console.log("rolesArray in middleware"+rolesArray) 
      console.log ("user first role "+req.user?.roles[0])
      console.log ("user roles "+req.user?.roles)

      const result = req.user?.roles?.map(role => rolesArray.includes(role)).find(val => val === true);
      console.log("authorization result "+result)
      if (!result) {
          return res.status(401).json({ message: "Unauthorized" });
      }
        next();
    };
}

export default AuthorizeRole;