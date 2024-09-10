document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.getElementById("article-title");
    const previewButton = document.getElementById("preview-post");
    const saveDraftButton = document.getElementById("save-draft");
    const postPreview = document.getElementById("post-preview");
    const form = document.getElementById("article-form");
    const defaultTitleText = "記事タイトル";
    const defaultEditorPlaceholder = 'ここに記事の内容を入力してください...';

    // Toast UI Editor 초기화
    const editor = new toastui.Editor({
        el: document.querySelector('#toast-editor'),
        height: '400px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: '',
        placeholder: defaultEditorPlaceholder
    });

    function initializeTitle() {
        if (titleElement.textContent.trim() === '') {
            titleElement.textContent = defaultTitleText;
            titleElement.style.color = '#888';
        }
    }

    titleElement.addEventListener("focus", function() {
        if (titleElement.textContent === defaultTitleText) {
            titleElement.textContent = '';
            titleElement.style.color = '#000';
        }
    });

    titleElement.addEventListener("blur", function() {
        if (titleElement.textContent.trim() === '') {
            titleElement.textContent = defaultTitleText;
            titleElement.style.color = '#888';
        }
    })

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = titleElement.textContent.trim();
        const content = editor.getHTML().trim();

        console.log('Title:', title);
        console.log('Content:', content);

        if (!title || !content || content === defaultEditorPlaceholder) {
            alert('タイトルと内容は必須です。');
            console.log('Title and content is missing.');
            return;
        }

        const requestData = JSON.stringify({
            title: title,
            contents: content,
            categoryId: 1
        });
        console.log('Request Data:', requestData);

        try {
            const response = await fetch('http://localhost:9000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error Data:', errorData);
                throw new Error(errorData[0].defaultMessage || 'サーバーエラー');
            }

            const data = await response.json();
            console.log('投稿成功:', data);
            alert('投稿が正常に完了しました！');
        } catch (error) {
            console.error('投稿失敗:', error);
            alert(`投稿に失敗しました: ${error.message}`);
        }
    });

    previewButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim();
        const content = editor.getHTML().trim();
        
        console.log('Preview Content:', content); // 콘텐츠 확인

        if (!title || content === defaultEditorPlaceholder || content === '') {
            alert('タイトルと内容を入力してください。');
            return;
        }

        postPreview.innerHTML = `
            <h1>${title}</h1>
            <div>${content}</div>
        `;
    });

    saveDraftButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim();
        const content = editor.getHTML().trim();

        console.log('Draft Content:', content); // 콘텐츠 확인

        if (!title || content === defaultEditorPlaceholder || content === '') {
            alert('タイトルと内容を入力してください。');
            return;
        }

        localStorage.setItem('draftTitle', title);
        localStorage.setItem('draftContent', content);
        alert('下書きが保存されました！');
    });

    initializeTitle();
});