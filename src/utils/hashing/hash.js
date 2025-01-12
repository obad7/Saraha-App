import bcrypt from "bcrypt";

export const hash = ({ plainText, saltRounds = process.env.SALT_ROUNDS }) => {
    return bcrypt.hashSync(plainText, Number(saltRounds));
};

export const compare = ({ plainText, hash }) => {
    return bcrypt.compareSync(plainText, hash);
};