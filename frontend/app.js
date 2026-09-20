import { uploadDocument, fetchDocuments, addComment, API_BASE_URL } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const commentInput = document.getElementById('initial-comment');
    const uploadError = document.getElementById('upload-error');
    const documentList = document.getElementById('document-list');
    const listError = document.getElementById('list-error');
    const itemTemplate = document.getElementById('document-item-template');

    // Inicializar lista
    loadDocuments();

    // Evento de Upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        uploadError.classList.add('hidden');
        uploadError.textContent = '';

        const file = fileInput.files[0];
        const comment = commentInput.value;

        try {
            const submitBtn = uploadForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'A enviar...';

            await uploadDocument(file, comment);
            
            // Limpar formulário e recarregar lista
            uploadForm.reset();
            await loadDocuments();
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Fazer Upload';
        } catch (error) {
            uploadError.textContent = error.message;
            uploadError.classList.remove('hidden');
            const submitBtn = uploadForm.querySelector('button');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Fazer Upload';
        }
    });

    // Função para carregar a lista do servidor
    async function loadDocuments() {
        try {
            // Chamada à API real
            const docs = await fetchDocuments();
            renderDocumentList(docs);
        } catch (error) {
            listError.textContent = error.message;
            listError.classList.remove('hidden');
        }
    }

    // Função para renderizar a lista no DOM
    function renderDocumentList(documents) {
        documentList.innerHTML = '';
        documents.forEach(doc => {
            const clone = itemTemplate.content.cloneNode(true);
            const li = clone.querySelector('li');
            
            clone.querySelector('.document-name').textContent = doc.title || 'Sem título';
            
            // Botões de ação
            clone.querySelector('.btn-view').addEventListener('click', () => {
                window.open(`${API_BASE_URL}${doc.action}`, '_blank');
            });
            clone.querySelector('.btn-download').addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = `${API_BASE_URL}${doc.action}`;
                // O header Content-Disposition que o backend envia (se existir)
                // ou simplesmente abrir a aba para forçar o download. 
                // A maioria dos browsers vai descarregar automaticamente ficheiros não suportados
                a.download = doc.title || 'document';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });

            // Lógica de comentários
            const commentsContainer = clone.querySelector('.document-comments');
            const toggleBtn = clone.querySelector('.btn-toggle-comments');
            toggleBtn.addEventListener('click', () => {
                commentsContainer.classList.toggle('hidden');
            });

            const ulComments = clone.querySelector('.comment-list');
            if (doc.comments && Array.isArray(doc.comments)) {
                doc.comments.forEach(c => {
                    const liC = document.createElement('li');
                    liC.textContent = c.text || c;
                    ulComments.appendChild(liC);
                });
            }

            const commentForm = clone.querySelector('.comment-form');
            const commentError = clone.querySelector('.comment-error');
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                commentError.classList.add('hidden');
                const newCommentInput = commentForm.querySelector('.new-comment-input');
                const text = newCommentInput.value;
                
                try {
                    // Chamada à API real
                    const newComment = await addComment(doc.id, text);
                    
                    // Atualização visual
                    const liC = document.createElement('li');
                    liC.textContent = newComment.comment || text; // Pode depender de como a API devolve
                    ulComments.appendChild(liC);
                    newCommentInput.value = '';
                } catch(error) {
                    commentError.textContent = error.message;
                    commentError.classList.remove('hidden');
                }
            });

            documentList.appendChild(li);
        });
    }
});
