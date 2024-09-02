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

    // 게시글 등록 버튼 클릭 시 제목과 내용 표시
    submitButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim() || '無題';
        const content = editor.getMarkdown().trim();
        
        postPreview.innerHTML = `
            <h2>${title}</h2>
            <div>${content}</div>
        `;
    });

    // 미리보기 버튼 클릭 시 제목과 내용 표시
    previewButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim() || '無題';
        const content = editor.getMarkdown().trim();
        
        postPreview.innerHTML = `
            <h2>${title}</h2>
            <div>${content}</div>
        `;
    });

    // 임시 저장 버튼 클릭 시 제목과 내용 저장
    saveDraftButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim() || '無題';
        const content = editor.getMarkdown().trim();
        
        // 여기서는 단순히 콘솔에 저장하는 로직을 추가
        console.log('임시 저장');
        console.log('제목:', title);
        console.log('내용:', content);
        
        // 실제 구현에서는 로컬 스토리지나 서버에 저장 로직을 추가해야 합니다.
        alert('임시 저장이 완료되었습니다!');
    });

    initializeTitle();
});
