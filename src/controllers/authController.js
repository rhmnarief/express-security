const cookie = require('cookie');
const {
  User,
  sequelize,
  Sequelize: { UniqueConstraintError, ValidationError },
} = require('../models');
const bcrypt = require('bcrypt');
const { createToken, JWT_MAX_AGE } = require('../utils/jwt');
const COOKIE_OPTIONS = require('../utils/COOKIE_OPTIONS');
const { ResourceNotFoundError, OtherError } = require('../utils/error');
const {
  handleSuccess,
  handleFail,
  handleError,
  handleSuccessMessage
} = require('../utils/handleJSON');

module.exports.signup_post = async (req, res) => {
  const { email, password, role_id, name } = req.body;
  try {
    const createdUser = await sequelize.transaction(async (t) => {
      await User.create(
        { email, password, role_id, name },
        { transaction: t }
      )
    });

    return res.status(201).json(handleSuccessMessage('Register succesful'));

  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      const { path } = err.errors[0];
      let message;

      if (path === 'email') message = 'email has already been taken';
      return res.status(400).json(handleFail(err, { [path]: message }));
    }

    if (err instanceof ValidationError) {
      const data = {};
      err.errors.forEach(({ path, message }) => {
        data[path] = message;
      });
      return res.status(400).json(handleFail(err, data));
    }

    return res.status(500).json(handleError(err));
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email: email?.toLowerCase() || '' },
    });

    if (!user) throw new ResourceNotFoundError('invalid email and password');

    const isAuthenticated = await user.isPasswordValid(password);
    if (!isAuthenticated) throw new OtherError('invalid email and password');

    user.last_logged_in = new Date();
    await user.save();

    var token;
    const setCookie = await cookie.serialize('token', token = createToken({ id: user.id, role: user.role_id }), {
      ...COOKIE_OPTIONS,
      maxAge: JWT_MAX_AGE,
    })

    res.setHeader(
      'Set-Cookie',
      setCookie
    );

    res.status(200).json(handleSuccessMessage('Login succesful'));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return res.status(401).json(handleFail(null, { message: err.message }));
    }

    if (err instanceof OtherError) {
      return res.status(401).json(handleFail(null, { message: err.message }));
    }

    const error = handleError(err);
    res.status(500).json(error);
  }
};

module.exports.logout_post = (req, res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', { ...COOKIE_OPTIONS, maxAge: 1 })
  );
  res.status(200).json(handleSuccessMessage('Logout successful'));
};

module.exports.crypt = async (req, res) => {
  const { plaintext } = req.body;
  const saltRounds = 10
  try {
    const generateSalt = await bcrypt.genSalt(saltRounds)
    const result = await bcrypt.hash(plaintext, generateSalt)

    res.status(200).json(handleSuccess(result));
  } catch (err) {
    const error = handleError(err);
    res.status(500).json(error);
  }
}