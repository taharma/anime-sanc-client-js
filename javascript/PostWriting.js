document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.getElementById("article-title");
    const contentElement = document.getElementById("editor-content");
    const submitButton = document.getElementById("submit-post");
    const previewButton = document.getElementById("preview-post");
    const saveDraftButton = document.getElementById("save-draft");
    const postPreview = document.getElementById("post-preview");
    const defaultTitleText = "記事タイトル";
    const defaultEditorText = 'ここに記事の内容を入力してください...';

    // Toast UI Editor 초기화
    const editor = new toastui.Editor({
        el: contentElement,
        height: '400px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        initialValue: defaultEditorText,
        autofocus: false
    });

    let isTitleFocused = false;

    function initializeTitle() {
        if (titleElement.textContent.trim() === '') {
            titleElement.textContent = defaultTitleText;
            titleElement.style.color = '#888';
        }
    }

    titleElement.addEventListener("focus", function() {
        if (!isTitleFocused) {
            isTitleFocused = true;
            if (titleElement.textContent === defaultTitleText) {
                titleElement.textContent = '';
                titleElement.style.color = '#000';
            }
        }
    });

    titleElement.addEventListener("blur", function() {
        if (isTitleFocused) {
            isTitleFocused = false;
            if (titleElement.textContent.trim() === '') {
                titleElement.textContent = defaultTitleText;
                titleElement.style.color = '#888';
            }
        }
    });

    // 게시글 등록 버튼 클릭 시 API로 전송
    submitButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim();
        const content = editor.getMarkdown().trim();

        // 필수 필드가 비어 있는지 확인
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        // 게시글 등록 API로 데이터 전송
        fetch('http://localhost:9000/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content,
                categoryId: 1 // 필요 시 categoryId 변경
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || '서버 오류');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('投稿成功:', data);
            alert('投稿が正常に完了しました！');
        })
        .catch(error => {
            console.error('投稿失敗:', error);
            alert(`投稿に失敗しました: ${error.message}`);
        });
    });

    // 미리보기 버튼 클릭 시 미리보기 영역에 내용 표시
    previewButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim();
        const content = editor.getMarkdown().trim();

        if (!title || !content) {
            alert('제목과 내용을 입력해 주세요.');
            return;
        }

        postPreview.innerHTML = `
            <h1>${title}</h1>
            <div>${editor.getHTML()}</div>
        `;
    });

    // 임시 저장 버튼 클릭 시 로컬 스토리지에 저장
    saveDraftButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim();
        const content = editor.getMarkdown().trim();

        if (!title || !content) {
            alert('제목과 내용을 입력해 주세요.');
            return;
        }

        localStorage.setItem('draftTitle', title);
        localStorage.setItem('draftContent', content);
        alert('下書きが保存されました！');
    });

    initializeTitle();
});
