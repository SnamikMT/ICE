import { IceKey } from 'node-ice';
import * as fs from 'fs';

// Функция для дешифрации данных
function decryptData(data: Uint8Array, key: Uint8Array): Uint8Array {
    const iceKey = new IceKey(1);
    iceKey.set(key);
    
    const decryptedData = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 8) {
        const block = data.slice(i, i + 8);
        const decryptedBlock = new Uint8Array(8);
        iceKey.decrypt(block, decryptedBlock);
        decryptedData.set(decryptedBlock, i);
    }
    return decryptedData;
}

// Считываем данные из файла с зашифрованными данными
const encryptedDataString = fs.readFileSync('encrypted.txt', 'utf8').trim();
const encryptedData = new Uint8Array(encryptedDataString.split(', ').map(byte => parseInt(byte, 16)));

// Генерируем ключ
const key = new Uint8Array([0x12, 0x23, 0x34, 0x45, 0x56, 0x67, 0x78, 0x89]);

// Дешифруем данные
const decryptedData = decryptData(encryptedData, key);
const decryptedText = String.fromCharCode.apply(null, decryptedData);
console.log("Decrypted text:", decryptedText);
