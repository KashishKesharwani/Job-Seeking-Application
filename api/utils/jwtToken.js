
export const sendToken = (user, statusCode, res, message) => {
    const authToken = user.getJWTToken(); // This generates the token
    const expireDays = Number(process.env.COOKIE_EXPIRE); // Ensure it's a number
    
    if (isNaN(expireDays) || expireDays <= 0) {
        throw new Error('COOKIE_EXPIRE must be a valid positive number');
    }

    const options = {
        expires: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000), // Set expiration in the future
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", authToken, options).json({
        success: true,
        user,
        message,
        authToken, // This sends the token in the response
    });
};
