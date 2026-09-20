// ⚠️ ATENÇÃO: Para rodar no Render, mude esta variável para o link do seu backend no Render!
// Exemplo: export const API_BASE_URL = 'https://seu-backend.onrender.com';
export const API_BASE_URL = 'https://prova-tecnica-1.onrender.com';

export function validateFile(file) {
    if (!file) {
        throw new Error('Nenhum ficheiro selecionado');
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('O ficheiro excede o tamanho máximo de 5MB');
    }
    return true;
}

export async function uploadDocument(file, comment) {
    validateFile(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name); // O backend exige um título
    if (comment) formData.append('description', comment); // O backend usa "description"

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Erro ao fazer upload do ficheiro');
    }
    return response.json();
}

export async function fetchDocuments() {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
        throw new Error('Erro ao buscar documentos');
    }
    return response.json();
}

export async function addComment(documentId, comment) {
    if (!comment || comment.trim() === '') {
        throw new Error('O comentário não pode estar vazio');
    }
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
    });
    if (!response.ok) {
        throw new Error('Erro ao adicionar comentário');
    }
    return response.json();
}
