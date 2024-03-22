const handleSuccessMessage = (message = null) => {
    return {
        status: 'success',
        message,
    };
};
const handleSuccess = (data = null) => {
    return {
        status: 'success',
        data,
    };
};

const handleFail = (err = null, data = null) => {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return {
        status: 'fail',
        data,
    };
};

const handleError = (err = null) => {
    console.error(err);
    return {
        status: 'error',
        error: err,
        message: 'Oops! Something went wrong. Please try again later.',
    };
};

module.exports = {
    handleSuccess,
    handleFail,
    handleError,
    handleSuccessMessage
};
