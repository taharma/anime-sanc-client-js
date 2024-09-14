document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.getElementById("article-title");
    const previewButton = document.getElementById("preview-post");
    const saveDraftButton = document.getElementById("save-draft");
    const postPreview = document.getElementById("post-preview");
    const form = document.getElementById("article-form");
    const defaultTitleText = "記事タイトル";
    const defaultEditorPlaceholder = 'ここに記事の内容を入力してください...';

    // 선택된 카테고리 ID를 저장할 변수
    let selectedCategoryId = null;

    // Toast UI Editor 초기화
    const editor = new toastui.Editor({
        el: document.querySelector('#toast-editor'),
        height: '400px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: '',
        placeholder: defaultEditorPlaceholder
    });

    // 사이드바 카테고리 클릭 이벤트 처리
    document.querySelectorAll('.category-menu a').forEach(categoryLink => {
        categoryLink.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCategoryId = this.getAttribute('data-category-id');
            console.log('Selected Category ID:', selectedCategoryId);
            document.querySelectorAll('.category-menu a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
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
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = titleElement.textContent.trim();
        const content = editor.getHTML().trim();

        console.log('Title:', title);
        console.log('Content:', content);

        if (!title || !content || content === defaultEditorPlaceholder || selectedCategoryId === null) {
            alert('タイトル、内容、およびカテゴリは必須です。');
            console.log('Title, content, or category is missing.');
            return;
        }



        console.log('memberId:'+ localStorage.getItem("memberId"));
        console.log('memberId:'+ localStorage.getItem("memberId"));
      
        

        const requestData = JSON.stringify({
            title: title,
            contents: content,
            categoryId: selectedCategoryId, // 선택된 카테고리 ID
            memberId : localStorage.getItem("memberId")
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
            console.error('Error:', error);
            alert('エラーが発生しました。');
        }
    });

    previewButton.addEventListener('click', function() {
        const previewContent = editor.getHTML();
        postPreview.innerHTML = previewContent;
    });

    saveDraftButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim();
        const content = editor.getHTML().trim();
        console.log('Saving draft with title:', title);
        console.log('Saving draft with content:', content);
    });

    initializeTitle();
});
