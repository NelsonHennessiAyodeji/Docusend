const { createToken } = require("./jwt");

const attachCookiesToResponse = (res, officePayload) => {
    const token = createToken({payload: officePayload});

    const thirtyDays = 1000 * 60 * 60 * 24 * 30;

    res.cookie('officeToken', token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + thirtyDays),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
};

module.exports = attachCookiesToResponse;