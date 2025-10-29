const AuthorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req?.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
      const rolesArray = [...roles];
      const result = req.user?.roles?.map(role => rolesArray.includes(role)).find(val => val === true);
      if (!result) {
          return res.status(401).json({ message: "Unauthorized" });
      }
        next();
    };
}

export default AuthorizeRole;