// main.js

// 等待整個 HTML 文件都載入並解析完畢後再執行
document.addEventListener("DOMContentLoaded", function() {

    // --- 任務一：載入共通導覽列 (之前的程式碼) ---
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
        fetch('../_includes/navigation.html')
            .then(response => response.ok ? response.text() : Promise.reject('Failed to load nav'))
            .then(data => {
                navPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching navigation bar:', error);
                navPlaceholder.innerHTML = "<p style='color:red;'>導覽列載入失敗！</p>";
            });
    }

    // --- 【新增】任務二：如果在首頁，就載入角色列表 ---
    const characterListContainer = document.getElementById("character-list-container");
    
    // 只有當頁面上存在角色列表容器時，才執行這段程式碼
    if (characterListContainer) {
        // 使用 fetch API 去抓取我們的 JSON 資料庫檔案
        fetch('characters.json')
            .then(response => {
                // 檢查請求是否成功
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                // 將回應的內容解析為 JSON 格式
                return response.json();
            })
            .then(characters => {
                // 清空容器內的「載入中...」提示
                characterListContainer.innerHTML = ''; 

                // 【關鍵】使用 forEach 迴圈遍歷每一個角色物件
                characters.forEach(character => {
                    // 為每個角色建立一個 li 元素
                    const listItem = document.createElement('li');

                    // 使用模板字串 (template literals) ` ` 來建立卡片的 HTML 結構
                    // 這樣可以很方便地將變數插入 HTML 中
                    const cardHTML = `
                    <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${character.imageUrl}" alt="${character.name}的頭像">
                            <span>${character.name}</span>
                            <span>${character.katakana}</span>
                        </div>
                        <div class="flip-card-back">
                            <!-- 背面內容：你的自訂文字和連結 -->
                            <p>${character.description}</p>
                            <!-- <a href="characters/ayla.html" class="details-button">查看完整角色卡</a> -->
                        </div>
                    </div>
                </div>
                    `;
                    
                    // 將生成的 HTML 放入 li 元素中
                    listItem.innerHTML = cardHTML;
                    
                    // 將這個 li 元素附加到我們的容器 ul 中
                    characterListContainer.appendChild(listItem);
                });
            })
            .catch(error => {
                // 如果抓取或處理失敗，在頁面上顯示錯誤訊息
                console.error('Error fetching character data:', error);
                characterListContainer.innerHTML = "<p style='color:red;'>角色資料載入失敗！請檢查 console 裡的錯誤訊息。</p>";
            });
    }
    // --- 【新增】任務三：載入共通頁尾 ---
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        
        // 【關鍵】判斷當前頁面在哪個目錄，以決定正確的 fetch 路徑
        let path = '_includes/footer.html'; // 預設路徑 (給 index.html, trpg.html)
        if (window.location.pathname.includes('/characters/')) {
            path = '../_includes/footer.html'; // 給 characters/ 子目錄下的頁面
        }

        fetch(path)
            .then(response => response.ok ? response.text() : Promise.reject('Failed to load footer'))
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching footer:', error);
                footerPlaceholder.innerHTML = "<p style='text-align:center; color:red;'>頁尾載入失敗！</p>";
            });
    }
});