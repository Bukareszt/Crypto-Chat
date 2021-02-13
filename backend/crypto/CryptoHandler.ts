import crypto from "crypto";
import qrcode from "qrcode";

export interface IKeysFromCrypto {
  publicKey: string;
  privateKey: string;
}
export interface IQRKeysFromCrypto {
  publicKey: string;
  privateKey: string;
}

export class CryptoHandler {
  public static async generateQrCodeWithKeys(): Promise<IQRKeysFromCrypto> {
    try {
      const keys: IKeysFromCrypto = this.generateKeys();
      const privateQrKey = await this.generateQrCodesFromKey(keys.privateKey);
      const qrKeysObject: IQRKeysFromCrypto = {
        publicKey: keys.publicKey,
        privateKey: privateQrKey,
      };
      return qrKeysObject;
    } catch (err) {
      throw err;
    }
  }

  private static generateKeys() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 1000,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    const asynchronicKeys: IKeysFromCrypto = {
      privateKey: privateKey,
      publicKey: publicKey,
    };

    return asynchronicKeys;
  }

  private static generateQrCodesFromKey(key: string) {
    return qrcode.toDataURL(key).catch((err) => {
      throw err;
    });
  }
}
