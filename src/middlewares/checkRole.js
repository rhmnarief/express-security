const { handleFail } = require('../utils/handleJSON');


const isAdmin = (req, res, next) => {
  const { role } = req.user
  try {
    if (role === 2) {
      next();
    } else {
      return res
        .status(401)
        .json(handleFail(null, { message: 'not admin' }));
    }
  } catch (err) {
    return res
      .status(404)
      .json(handleFail(err, { message: 'check role error' }));
  }
};

module.exports = { isAdmin };
