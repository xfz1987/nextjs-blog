import { hash, compare } from 'bcryptjs';

export async function hashPassword(password) {
	const hashedPassword = await hash(password, 12);
	return hashedPassword;
}

/**
 * compare the password and hashedPasswrod
 * @param {*} password 明文
 * @param {*} hashedPassword
 * @returns
 */
export async function verifyPassword(password, hashedPassword) {
	const isValid = await compare(password, hashedPassword);
	return isValid;
}
