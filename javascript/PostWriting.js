document.addEventListener("DOMContentLoaded", function() {
    const titleElement = document.getElementById("article-title");
    const contentElement = document.getElementById("article-content");

    function clearText(element, defaultText) {
        if (element.textContent === defaultText) {
            element.textContent = '';
            element.style.color = '#000'; // 글자 색상을 검정색으로 변경
        }
    }

    function resetText(element, defaultText) {
        if (element.textContent.trim() === '') {
            element.textContent = defaultText;
            element.style.color = '#888'; // 글자 색상을 회색으로 변경
        }
    }

    // 기본 텍스트 설정
    const defaultTitleText = "記事タイトル";
    const defaultContentText = "ここに記事の内容を入力してください...";

    // 제목 영역 이벤트 설정
    titleElement.addEventListener("focus", function() {
        clearText(titleElement, defaultTitleText);
    });

    titleElement.addEventListener("blur", function() {
        resetText(titleElement, defaultTitleText);
    });

    // 내용 영역 이벤트 설정
    contentElement.addEventListener("focus", function() {
        clearText(contentElement, defaultContentText);
    });

    contentElement.addEventListener("blur", function() {
        resetText(contentElement, defaultContentText);
    });

    // 초기 설정
    resetText(titleElement, defaultTitleText);
    resetText(contentElement, defaultContentText);
});
