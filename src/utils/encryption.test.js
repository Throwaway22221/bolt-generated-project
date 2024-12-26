import { encryptData, decryptData } from './encryption';

        describe('Encryption Utilities', () => {
          it('should encrypt and decrypt data correctly', () => {
            const data = { message: 'This is a secret message', value: 42 };
            const encrypted = encryptData(data);
            expect(encrypted).not.toBe(JSON.stringify(data));

            const decrypted = decryptData(encrypted);
            expect(decrypted).toEqual(data);
          });

          it('should handle encryption errors gracefully', () => {
            const invalidData = undefined;
            expect(() => encryptData(invalidData)).not.toThrow();
          });

          it('should handle decryption errors gracefully', () => {
            const invalidCiphertext = 'invalid-ciphertext';
            expect(() => decryptData(invalidCiphertext)).toThrow();
          });
        });
