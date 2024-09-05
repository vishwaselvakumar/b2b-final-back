exports.adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  };
  
  exports.superAdminOrAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Super Admins or Admins only' });
    }
    next();
  };
  
  exports.userOnly = (req, res, next) => {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied: Users only' });
    }
    next();
  };
  