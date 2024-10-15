const jwt = require("jsonwebtoken");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibm9tZSI6ImpvdGEiLCJlbWFpbCI6IjFAMSIsInN0YXR1cyI6IkFUSVZPIiwicGVyZmlsIjp7Im5vbWUiOiJhZG1pbiIsInJvdHVsbyI6IkFkbWluaXN0cmFkb3IifSwiaWF0IjoxNzI4ODM4NTUxLCJleHAiOjE3Mjg5MjQ5NTF9.oq9PtLmbuoXhoWgJmyHONW1l-XkdT6rrkgz9M1IGQbo"
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

