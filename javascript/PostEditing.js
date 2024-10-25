document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("article-form");

    // LocalStorage에서 title과 contents 값 가져오기
    const title = localStorage.getItem('postTitle');
    console.log(title);
    const contents = localStorage.getItem('postContents');
    console.log(contents);
    const categoryId = localStorage.getItem('postCategoryId');
    console.log(categoryId);

    // URL에서 noteId 추출하기
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('id');
    
    const titleElement = document.getElementById("article-title");
    const defaultTitleText = title || "記事タイトル";  // 기본값으로 '記事タイトル' 사용
    const defaultEditorPlaceholder = contents || 'ここに内容を入力してください';  // 기본값 설정
    
    // Toast UI Editor 초기화
    const editor = new toastui.Editor({
        el: document.querySelector('#toast-editor'),
        height: '400px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: contents || '',  // contents가 존재하지 않을 경우 빈 값
        placeholder: defaultEditorPlaceholder
    });

    // 타이틀 초기화
    function initializeTitle() {
        if (titleElement.textContent.trim() === '' || titleElement.textContent === '記事タイトル') {
            titleElement.textContent = defaultTitleText;
            titleElement.style.color = '#888';  // 기본 타이틀일 때 흐리게 표시
        }
    }

    // 타이틀 요소에 포커스가 있을 때 초기화
    titleElement.addEventListener("focus", function() {
        if (titleElement.textContent === defaultTitleText) {
            titleElement.textContent = '';
            titleElement.style.color = '#000';  // 포커스 시 일반 글자 색으로 변경
        }
    });

    // 타이틀 요소에 포커스가 없어질 때 기본값이 없으면 초기화
    titleElement.addEventListener("blur", function() {
        if (titleElement.textContent.trim() === '') {
            titleElement.textContent = defaultTitleText;
            titleElement.style.color = '#888';  // 빈 값일 경우 기본값으로 초기화
        }
    });

    initializeTitle();  // 초기 타이틀 설정

    // 다른 기존 코드 (예: 노트 작성, 프리뷰, 드래프트 저장 등) 유지
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

    //노트수정
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
        const selectedCategoryId = localStorage.getItem("postCategoryId");
        console.log(selectedCategoryId);
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
            const response = await fetch(`http://localhost:49000/api/notes/${noteId}`, {
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
    const navbarPublish = document.getElementById("navbar-publish");
    if (navbarPublish) {
        navbarPublish.addEventListener("click", function() {
            // 폼 내의 公開に進む 버튼 클릭 트리거
            document.getElementById("submit-post").click();
        });
    } else {
        console.warn('navbar-publish 버튼을 찾을 수 없습니다。');
    }

});



document.addEventListener("DOMContentLoaded", function() {
    const navbarPublish = document.getElementById("navbar-publish");
    
    if (navbarPublish) {
        navbarPublish.addEventListener("click", function() {
            const submitPostButton = document.getElementById("submit-post");
            
            if (submitPostButton) {
                // submit-post 버튼이 존재하는 경우 클릭 이벤트 트리거
                submitPostButton.click();
            } else {
                console.warn('submit-post 버튼을 찾을 수 없습니다。');
            }
        });
    } else {
        console.warn('navbar-publish 버튼을 찾을 수 없습니다。');
    }
});