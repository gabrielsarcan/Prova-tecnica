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
    if (comment) formData.append('comment', comment);

    const response = await fetch('http://localhost:3000/documents', {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Erro ao fazer upload do ficheiro');
    }
    return response.json();
}

export async function fetchDocuments() {
    const response = await fetch('http://localhost:3000/documents');
    if (!response.ok) {
        throw new Error('Erro ao buscar documentos');
    }
    return response.json();
}

export async function addComment(documentId, comment) {
    if (!comment || comment.trim() === '') {
        throw new Error('O comentário não pode estar vazio');
    }
    const response = await fetch(`http://localhost:3000/documents/${documentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
    });
    if (!response.ok) {
        throw new Error('Erro ao adicionar comentário');
    }
    return response.json();
}
