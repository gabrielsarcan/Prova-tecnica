import { validateFile, addComment } from './api.js';

describe('API Logic Tests', () => {
    describe('validateFile', () => {
        it('should throw an error if file is missing', () => {
            expect(() => validateFile(null)).toThrow('Nenhum ficheiro selecionado');
        });

        it('should throw an error if file size is greater than 5MB', () => {
            const largeFile = { size: 6 * 1024 * 1024 }; // 6MB
            expect(() => validateFile(largeFile)).toThrow('O ficheiro excede o tamanho máximo de 5MB');
        });

        it('should return true for a valid file', () => {
            const validFile = { size: 2 * 1024 * 1024 }; // 2MB
            expect(validateFile(validFile)).toBe(true);
        });
    });
});
