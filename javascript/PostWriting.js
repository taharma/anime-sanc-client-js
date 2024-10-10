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

    //노트작성
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = titleElement.textContent.trim();
        let content = editor.getHTML().trim();

        console.log('Title:', title);
        console.log('Content:', content);

        // <p>タグ을 제거하는 함수 호출
        content = removePTags(content);
        console.log('Content after removing <p> tags:', content);

        // 상세한 유효성 검사
        if (!title || !content || content === defaultEditorPlaceholder || selectedCategoryId === null) {
            alert('タイトル、内容、およびカテゴリは必須です。');
            console.log('Title, content, or category is missing.');
            return;
        }

        // memberId의 유효성 검사
        const memberId = localStorage.getItem("memberId");
        // const longMemberId = parseInt(memberId, 10); // 10진수로 변환 Long type
        if (!memberId) {
            alert('ログインが必要です。');
            return;
        }

        console.log('memberId:', memberId);

        const requestData = JSON.stringify({
            title: title,
            contents: content,
            categoryId: selectedCategoryId,
            memberId: memberId
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
                throw new Error(errorData.message || 'サーバーエラー');
            }

            const data = await response.json();
            console.log('投稿成功:', data);
            alert('投稿が正常に完了しました！');


            // 프로필 페이지로 리디렉션 (******게시판 생성 후 게시판으로 경로 변경 바람***********)
            window.location.href = 'Profile.html';

        } catch (error) {
            console.error('Error:', error);
            alert('エラーが発生しました: ' + error.message);
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
        // 드래프트 저장 로직 추가
        alert('下書きが保存されました。');
    });

    // 네비게이션 바의 버튼들에 기능 연동 추가
    const navbarSaveDraft = document.getElementById("navbar-save-draft");
    if (navbarSaveDraft) {
        navbarSaveDraft.addEventListener("click", function() {
            // 폼 내의 下書き保存 버튼 클릭 트리거
            document.getElementById("save-draft").click();
        });
    } else {
        console.warn('navbar-save-draft 버튼을 찾을 수 없습니다。');
    }

    const navbarPublish = document.getElementById("navbar-publish");
    if (navbarPublish) {
        navbarPublish.addEventListener("click", function() {
            // 폼 내의 公開に進む 버튼 클릭 트리거
            document.getElementById("submit-post").click();
        });
    } else {
        console.warn('navbar-publish 버튼을 찾을 수 없습니다。');
    }

    initializeTitle();

    /**
     * <p> 태그를 제거하는 함수
     * @param {string} html - 원본 HTML 문자열
     * @returns {string} - <p> 태그가 제거된 문자열
     */
    function removePTags(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const paragraphs = doc.querySelectorAll('p');

        paragraphs.forEach(p => {
            // <p> 태그를 제거하고 내부 텍스트만 남김
            const parent = p.parentNode;
            while (p.firstChild) {
                parent.insertBefore(p.firstChild, p);
            }
            parent.removeChild(p);
        });

        return doc.body.innerHTML;
    }
});
