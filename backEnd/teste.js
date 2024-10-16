const jwt = require("jsonwebtoken");
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5vbWUiOiJnIiwiZW1haWwiOiJnIiwic3RhdHVzIjoiQVRJVk8iLCJwZXJmaWwiOnsibm9tZSI6ImFkbWluIiwicm90dWxvIjoiQWRtaW5pc3RyYWRvciJ9LCJpYXQiOjE3MjkwNDM4MzYsImV4cCI6MTcyOTEzMDIzNn0.VJRoOtspINdald04SlQKo0oqCMewSArLmMPN_a9knwU'
const key = "123456789"


 function verificarToken() {
    try {
        const decoded = jwt.verify(token, key);
        console.log(decoded);
        
        // return decoded;
    } catch (error) {
        throw err
    }
}

verificarToken()

