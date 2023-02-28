module.exports={
    frontendUrl: 'http://localhost:3001',
    jwtConfig:{
        secret:"uwehuoiFIuUIguBzugUZ34654DS65AD4QW8d64dfsd6f8e",
        algorithms:["HS256"]
    },
    passwordConfig:{
        salt:"ddasds489w89ewf4A6S164d5dag4586h4z87i9zu",
        iterations:1000,
        keylen:64,
        digest:"sha512"
    },
    allowedFrontendOrigin: 'http://localhost:3001',
}