const bcrypt = require('bcrypt');
// <- con la salt separada del hash ->
// const hashPassword = async (pw) => {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(pw, salt);
//     console.log(salt);
//     console.log(hash);
// }
// <- con la salt junto al hash ->
const hashPassword = async (pw) => {
    const hash = await bcrypt.hash(pw, 12);
    console.log(hash);
}

const login = async(pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if (result) {
        console.log("LOGGED YOU IN! SUCCESSFUL MATCH!")
    } else {
        console.log("Password Incorrect!")
    }
}

// hashPassword('monkey');
login('monkey', '$2b$12$zAwA70p1B923Ds5.b/alT.awuanNQp5Y/TeYffQHY9tOCh4ocNrMu');