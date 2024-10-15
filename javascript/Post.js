        //내용 가져오기 fetch
        async function fetchPost() {
            try {
                // URL에서 noteId 추출하기
                console.log(window.location.search); // 쿼리 문자열 확인
                const urlParams = new URLSearchParams(window.location.search);
                const noteId = urlParams.get('id');

                //null검사
                if (!noteId) {
                    console.error("noteId가 존재하지 않습니다.");
                    return;
                }
                const response = await fetch(`http://localhost:9000/api/notes/${noteId}`);
                const post = await response.json();
                console.log(post)
                localStorage.setItem('postTitle' , post.title);
                localStorage.setItem('postContents' , post.contents);
                localStorage.setItem('postCategoryId' , post.categoryId);
                console.log(post);
                displayPost(post);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        }
        // 내용 표시하기
        function displayPost(post) {
            const contentsDiv = document.getElementById('contents');
            
            if (contentsDiv) {
                // post 객체에서 내용을 가져와서 표시
                const content = post.contents || post.content || "No content available";  // 적절한 속성 확인
                contentsDiv.textContent = content;
            } else {
                console.error("contents div가 존재하지 않습니다.");
            }
        }

        // 페이지 로드 후 fetchPost 호출
        window.addEventListener('DOMContentLoaded', function() {
            fetchPost(); // 페이지가 로드되면 즉시 fetchPost 함수 호출
        });

        //postEditing으로 title contents 전달
        document.addEventListener("DOMContentLoaded", function() {
            const editLink = document.getElementById('edit-post-link');
            
            // 링크 클릭 시 이벤트 리스너 추가
            editLink.addEventListener('click', function(event) {
                event.preventDefault(); // 기본 동작 방지 (링크 클릭 시 페이지 이동 막기)
                setEditPostLink(); // setEditPostLink 함수 호출
            });
        });
    
        //postEditing으로 moteId
        function setEditPostLink() {
            // URL에서 noteId 추출
            const urlParams = new URLSearchParams(window.location.search);
            const noteId = urlParams.get('id');
            
            if (noteId) {
                // noteId가 있을 경우 해당 ID를 URL에 추가하여 페이지 이동
                const newHref = `/PostEditing.html?id=${noteId}`;
                
                // 페이지 이동 처리
                window.location.href = newHref; // 새 URL로 이동
            } else {
                alert('Note ID가 없습니다.');
            }
        }

        //  GPT 내용 요약 Chatbot feature!
        async function summarizeNote() {
            try {
                // Extract note ID from the URL or another source
                const urlParams = new URLSearchParams(window.location.search);
                const noteId = urlParams.get('id'); // Assuming the note ID is passed as a query parameter
                console.log(noteId);

                if (!noteId) {
                    throw new Error('Note ID not found in the URL');
                }

                // Fetch note data from backend
                const response = await fetch(`http://localhost:9000/api/notes/${noteId}`);

                console.log(response);

                if (!response.ok) {
                    throw new Error('Failed to fetch note data');
                }

                // 한 번만 response.json() 호출
                const note = await response.json();

                console.log(note);

                // Send note content to OpenAI API for summarization
                const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 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`
                    },
                    body: JSON.stringify({
                        model: `gpt-4o-mini`,
                        messages: [
                            //gpt에 
                            {
                                role: 'system',
                                content: 'Print the answer in Japanese.And Summarize in 300 words'
                            },
                            //현재 note의 내용 변수이름 : contents
                            {
                                role: 'user',
                                content: `Summarize the following content in bullet points:
                                ${note.contents}"`
                            }
                        ],
                        //글자수 조절 , $5
                        max_tokens: 300
                    })
                });


                if (!openAIResponse.ok) {
                    throw new Error('Failed to fetch summary from OpenAI');
                }

                const summaryData = await openAIResponse.json();
                console.log(summaryData);
                const summary = summaryData.choices[0].message.content.trim();

                // Display the summary
                document.getElementById('summary').innerText = summary;
            } catch (error) {
                console.error('Error summarizing note:', error);
                document.getElementById('summary').innerText = "Error fetching the summary."; // 에러 발생 시 메시지 표시
            }
        }

        // 댓글 창 열기/닫기 기능
        function toggleCommentBox() {
            const commentBox = document.getElementById('comment-box');
            const toggleButton = document.querySelector('.toggle-comment-button');

            commentBox.style.display = commentBox.style.display === 'block' ? 'none' : 'block';
            toggleButton.textContent = commentBox.style.display === 'block' ? 'コメント覧を閉じる' : 'コメント覧を開く';
        }

        // 샌드박스 열기/닫기 기능
        function toggleSandbox() {
            const sandboxContent = document.querySelector('.sandbox-content');
            const sandboxButton = document.querySelector('.dropdown-sandbox button');

            sandboxContent.style.display = sandboxContent.style.display === 'block' ? 'none' : 'block';
            sandboxButton.style.transform = sandboxContent.style.display === 'block' ? 'rotate(0deg)' : 'rotate(90deg)';
        }

        // 좋아요 클릭 시 숫자 변경 기능 추가
        function toggleIconColor(iconElement, type) {
            iconElement.classList.toggle('active');

            if (type === 'like') {
                const likeCountElement = iconElement.nextElementSibling;
                let likeCount = parseInt(likeCountElement.textContent, 10);
                likeCountElement.textContent = iconElement.classList.contains('active') ? likeCount + 1 : likeCount - 1;
            }

            if (type === 'share') {
                if (iconElement.classList.contains('active')) {
                    showTooltip(iconElement, "링크를 복사하였습니다");
                    copyToClipboard(window.location.href);
                }
            }

            if (type === 'bookmark') {
                showTooltip(iconElement, iconElement.classList.contains('active') ? "북마크되었습니다" : "북마크가 취소되었습니다");
            }

            if (type === 'more') {
                //드롭다운 메뉴
                const dropdownMenu = iconElement.nextElementSibling; // 드롭다운 메뉴 요소
                dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none'; // 토글
            }
        }
        // 페이지의 다른 곳을 클릭하면 드롭다운을 닫는 기능 추가
        document.addEventListener('click', function(event) {
                const isClickInsideDropdown = event.target.closest('.dropdown');
                if (!isClickInsideDropdown) {
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.style.display = 'none';
                    });
                }
            });
        // 클립보드 복사 기능
        function copyToClipboard(text) {
            const tempInput = document.createElement('input');
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
        }

        // 말풍선 표시 기능
        function showTooltip(element, message) {
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = message;

            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.pageXOffset}px`;
            tooltip.style.top = `${rect.top + window.pageYOffset - tooltip.offsetHeight}px`;

            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }

        // 답글 입력창 열기/닫기 기능
        function toggleReply(button) {
            const replyBox = button.nextElementSibling;
            replyBox.style.display = replyBox.style.display === "block" ? "none" : "block";
        }

        // 답글 제출 기능
        function submitReply(button) {
            const replyBox = button.parentElement;
            const textarea = replyBox.querySelector("textarea");
            const replyContent = textarea.value.trim();

            if (replyContent !== "") {
                const currentDate = new Date().toLocaleString();
                const newReply = document.createElement("div");
                newReply.classList.add("comment");
                newReply.innerHTML = `
                <img src="/icon/user.png" alt="Profile Icon" class="comment-icon">
                <div class="comment-content">
                    <span class="comment-username">TEST1</span>
                    <p>${replyContent}</p>
                    <span class="comment-date">${currentDate}</span>
                    <button onclick="editReply(this)">수정</button>
                    <button onclick="deleteReply(this)">삭제</button>
                </div>
            `;
                replyBox.parentNode.appendChild(newReply);
                textarea.value = "";
                replyBox.style.display = "none";
            }
        }

        // 답글 수정 기능
        function editReply(button) {
            const replyContent = button.previousElementSibling.previousElementSibling;
            const newContent = prompt("댓글을 수정하세요:", replyContent.textContent);
            if (newContent) {
                replyContent.textContent = newContent;
            }
        }

        // 답글 삭제 기능
        function deleteReply(button) {
            if (confirm("댓글을 삭제하시겠습니까?")) {
                button.parentElement.parentElement.remove();
            }
        }

        // 알람 드롭다운 토글 기능
        function toggleNotificationDropdown() {
            const dropdown = document.getElementById('notification-dropdown');
            dropdown.classList.toggle('show'); // 'show' 클래스를 토글하여 드롭다운을 열고 닫음
        }

        // 프로필 드롭다운 토글 기능
        function toggleProfileDropdown() {
            const dropdown = document.getElementById('profile-dropdown');
            dropdown.classList.toggle('show'); // 'show' 클래스를 토글하여 드롭다운을 열고 닫음
        }


        

        //post delete 
        function deleteNote() {
            console.log(window.location.search); // 쿼리 문자열 확인
            const urlParams = new URLSearchParams(window.location.search);
            const noteId = urlParams.get('id'); // URL에서 noteId 가져오기
            const memberId =  localStorage.getItem("memberId");
            console.log("memberId : ",memberId);
            
            fetch(`http://localhost:9000/api/notes/${noteId}?memberId=${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('노트가 삭제되었습니다.');
                    location.href = '/index.html';
                } else {
                    alert('삭제 중 문제가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // alert('서버와의 연결에 문제가 발생했습니다.');
                //일단 임시방편 
                location.href = '/index.html';
            });
        }