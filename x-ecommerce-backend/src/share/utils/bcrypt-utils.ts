import * as bcrypt from 'bcrypt';

class BcryptUtils {
  static async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(data, saltRounds);
    return hashed.toString();
  }

  static async comparehash(value: string = '', valueHashed: string = ''): Promise<boolean> {
    return bcrypt.compare(value, valueHashed);
  }

  static validateHashedContent(content: string, hashedContent: string): boolean {
    return bcrypt.compareSync(content, hashedContent);
  }
}

export default BcryptUtils;
