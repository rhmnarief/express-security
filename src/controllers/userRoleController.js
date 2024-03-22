const {
    UserRole,
    Sequelize: { ValidationError, Op },
} = require('../models');
const { ResourceNotFoundError, OtherError } = require('../utils/error');
const {
    handleSuccess,
    handleFail,
    handleError,
} = require('../utils/handleJSON');

module.exports.get = async (req, res) => {
    try {
        const userRole = await UserRole.findAll();
        return res.status(201).json(handleSuccess(userRole));
    }
    catch (err) {
        if (err instanceof ResourceNotFoundError) {
            return res.status(404).json(handleFail(null, { message: err.message }));
        }
        if (err instanceof OtherError) {
            return res.status(400).json(handleFail(null, { message: err.message }));
        }
        return res.status(500).json(handleError(err));
    }
}
module.exports.add = async (req, res) => {
    const { role_name } = req.body;
    try {
        var newRole;
        await sequelize.transaction(async (t) => {
            newRole = await UserRole.create(
                { role_name },
                { transaction: t }
            );
        });
        return res.status(201).json(handleSuccess(newRole));
    }
    catch (err) {
        if (err instanceof ResourceNotFoundError) {
            return res.status(404).json(handleFail(null, { message: err.message }));
        }
        if (err instanceof OtherError) {
            return res.status(400).json(handleFail(null, { message: err.message }));
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

module.exports.delete = async (req, res) => {
    const {id} = req.params;
    try {
        var detailTranscation;
        await sequelize.transaction(async (t) => {
            newRole = await UserRole.delete(
                { id },
                { transaction: t }
            );
            detailTranscation = t
        });
        return res.status(201).json(handleSuccess());
    }
    catch (err){
        if (err instanceof ResourceNotFoundError) {
            return res.status(404).json(handleFail(null, { message: err.message }));
        }
        if (err instanceof OtherError) {
            return res.status(400).json(handleFail(null, { message: err.message }));
        }
        return res.status(500).json(handleError(err));
    }
}
