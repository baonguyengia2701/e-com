import * as crypto from 'crypto';
export default class CryptoUtils {
  // Function to encrypt data using AES-256-CBC
  static encryptAES(data: string): string {
    // Generate a key using a secret string
    const key = crypto.createHash('sha256').update(process.env.SECRET_STRING).digest();

    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16);

    // Create a cipher object using the AES-256-CBC algorithm, the key, and the IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the data
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

    // Return the IV and the encrypted data, both as hexadecimal strings, joined by a colon
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  // Function to decrypt data using AES-256-CBC
  static decryptAES(token: string): string {
    // Generate a key using the same secret string
    const key = crypto.createHash('sha256').update(process.env.SECRET_STRING).digest();

    // Split the token into the IV and the encrypted data
    const [ivHex, encryptedHex] = token.split(':');

    // Convert the IV and encrypted data from hexadecimal strings to buffers
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');

    // Create a decipher object using the AES-256-CBC algorithm, the key, and the IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the data
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    // Return the decrypted data as a string
    return decrypted.toString();
  }
}
