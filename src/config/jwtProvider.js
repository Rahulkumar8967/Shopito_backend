const jwt = require('jsonwebtoken');


const SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU3ZmRmNG"; 

const generateToken = (userId) => {
   
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '48h' });
    return token;
};

const getUserIdFromToken = (token) => {
    try {
      
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken.userId;
    } catch (error) {
        
        throw new Error('Invalid or expired token');
    }
};

module.exports = { generateToken, getUserIdFromToken };
