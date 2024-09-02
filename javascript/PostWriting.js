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
        const title = titleElement.textContent.trim() || '無題';
        const content = editor.getMarkdown().trim();
        
        postPreview.innerHTML = 
            <h2>${title}</h2>
            <div>${content}</div>
        ;

        // API로 데이터 전송
        fetch('https://localhost:9000/api/notes', {
            method: 'POST', // 'POST' 요청 사용
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content }) // title과 content를 JSON으로 변환
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワーク応答が不正です。');
            }
            return response.json();
        })
        .then(data => {
            console.log('投稿成功:', data);
            alert('投稿が正常に完了しました！');
        })
        .catch(error => {
            console.error('投稿失敗:', error);
            alert('投稿に失敗しました。');
        });
    });

    // 미리보기 버튼 클릭 시 제목과 내용 표시
    previewButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim() || '無題';
        const content = editor.getMarkdown().trim();
        
        postPreview.innerHTML = 
            <h2>${title}</h2>
            <div>${content}</div>
        ;
    });

    // 임시 저장 버튼 클릭 시 API로 임시 저장
    saveDraftButton.addEventListener('click', function() {
        const title = titleElement.textContent.trim() || '無題';
        const content = editor.getMarkdown().trim();
        
        // API로 데이터 전송 (임시 저장 로직)
        fetch('https://localhost:9000/api/notes', {
            method: 'POST', // 실제로 임시 저장을 위한 별도의 엔드포인트가 있다면 수정 필요
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content }) // title과 content를 JSON으로 변환
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワーク応答が不正です。');
            }
            return response.json();
        })
        .then(data => {
            console.log('一時保存成功:', data);
            alert('一時保存が正常に完了しました！');
        })
        .catch(error => {
            console.error('一時保存失敗:', error);
            alert('一時保存に失敗しました。');
        });
    });

    initializeTitle();
});