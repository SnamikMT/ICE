import { IceKey } from 'node-ice';
import * as fs from 'fs';

// Функция для шифрования данных
function encryptData(data: Uint8Array, key: Uint8Array): Uint8Array {
    const iceKey = new IceKey(1);
    iceKey.set(key);
    
    const encryptedData = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 8) {
        const block = data.slice(i, i + 8);
        const encryptedBlock = new Uint8Array(8);
        iceKey.encrypt(block, encryptedBlock);
        encryptedData.set(encryptedBlock.slice(0, block.length), i);
    }
    return encryptedData;
}

// Функция для дешифрования данных
function decryptData(data: Uint8Array, key: Uint8Array): Uint8Array {
    const iceKey = new IceKey(1);
    iceKey.set(key);
    
    const decryptedData = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i += 8) {
        const block = data.slice(i, i + 8);
        const decryptedBlock = new Uint8Array(8);
        iceKey.decrypt(block, decryptedBlock);
        decryptedData.set(decryptedBlock.slice(0, block.length), i);
    }
    return decryptedData;
}

// Считываем данные из входного файла
const inputFile = 'input.txt';
const inputData = fs.readFileSync(inputFile);

// Генерируем ключ
const key = new Uint8Array([0x12, 0x23, 0x34, 0x45, 0x56, 0x67, 0x78, 0x89]);

// Шифруем данные
const encryptedData = encryptData(inputData, key);
console.log('Encrypted data:', encryptedData);
fs.writeFileSync('encrypted.txt', encryptedData);
console.log('Encrypted data written to encrypted.txt');

function writeHexDataToFile(data: Uint8Array, filename: string): void {
    // Преобразуем массив байтов в строку в шестнадцатеричном формате
    const hexString = Array.from(data).map(byte => byte.toString(16).padStart(2, '0')).join(', ');

    // Записываем данные в файл
    fs.writeFileSync(filename, hexString);
}

// Считываем данные из файла с зашифрованными данными
const encryptedDataa = new Uint8Array(encryptedData);

// Записываем зашифрованные данные в файл в шестнадцатеричном формате
writeHexDataToFile(encryptedDataa, 'encrypted.txt');
console.log('Encrypted data written to encrypted.txt');

// Дешифруем данные
const decryptedData = decryptData(encryptedData, key);
const decryptedText = String.fromCharCode.apply(null, decryptedData);
console.log('Decrypted data:', decryptedData);
console.log('Decrypted text:', decryptedText);
fs.writeFileSync('decrypted.txt', decryptedData);
console.log('Decrypted data written to decrypted.txt');
