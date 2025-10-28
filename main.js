// main.js - v3 (支援動態角色頁面)

document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;

    // --- 任務一：載入共通導覽列 (現在只在 character.html 使用) ---
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) {
        // 從 trpg/character.html 返回 trpg/index.html
        const navPath = '../_includes/navigation.html';
        fetch(navPath)
            .then(response => response.ok ? response.text() : Promise.reject('Nav load failed'))
            .then(data => { navPlaceholder.innerHTML = data; })
            .catch(error => console.error('Error fetching navigation:', error));
    }

     // --- 任務二：載入 TRPG 角色列表 (在 trpg/index.html 執行) ---
     const characterListContainer = document.getElementById("character-list-container");
     if (characterListContainer) {
         fetch('characters.json')
             .then(response => response.ok ? response.json() : Promise.reject('JSON load failed'))
             .then(characters => {
                 characterListContainer.innerHTML = ''; 
                 characters.forEach(character => {
                     const listItem = document.createElement('li');
                     // 【關鍵修改】連結到通用的 character.html，並附上 URL 參數
                     const cardHTML = `
                         <div class="flip-card">
                             <div class="flip-card-inner">
                                 <div class="flip-card-front">
                                     <img src="${character.imageUrl}" alt="${character.name}的頭像">
                                     <span>${character.name}</span>
                                     <span>${character.katakana}</span>
                                 </div>
                                 <div class="flip-card-back">
                                     <h2>${character.name}</h2>
                                     <p>${character.description}</p>
                                     <!-- <a href="character.html?id=${character.id}" class="details-button">查看完整角色卡</a> -->
                                 </div>
                             </div>
                         </div>`;
                     listItem.innerHTML = cardHTML;
                     characterListContainer.appendChild(listItem);
                 });
             })
             .catch(error => console.error('Error fetching characters:', error));
     }
 
     // --- 【新增】任務三：填充單一角色頁面 (在 trpg/character.html 執行) ---
     const characterSheet = document.querySelector('.character-sheet');
     if (characterSheet && !characterListContainer) { // 確保只在角色頁執行
         // 1. 從 URL 取得角色 ID
         const params = new URLSearchParams(window.location.search);
         const characterId = params.get('id');
 
         if (characterId) {
             // 2. 抓取所有角色的資料
             fetch('characters.json') // 相對路徑，因為 character.html 和 json 在同一目錄
                 .then(response => response.ok ? response.json() : Promise.reject('JSON load failed'))
                 .then(characters => {
                     // 3. 找到 ID 匹配的角色
                     const character = characters.find(char => char.id === characterId);
 
                     if (character) {
                         // 4. 將資料填充到頁面的佔位符中
                         document.title = `角色卡 - ${character.name}`; // 更新網頁標題
                         document.getElementById('char-name').textContent = character.name;
                         document.getElementById('char-katakana').textContent = character.katakana;
                         // 【修改】智慧判斷圖片路徑
                        const imageUrl = character.fullImageUrl;
                        const imageElement = document.getElementById('char-image');

                        // 檢查 imageUrl 是否以 'http' 開頭，來判斷它是不是一個完整的外部 URL
                        if (imageUrl.startsWith('http')) {
                        // 如果是外部 URL，就直接使用它
                            imageElement.src = imageUrl;
                        } else {
                        // 如果是本地相對路徑，就在前面加上 ../
                             imageElement.src = `../${imageUrl}`;
                        }
                         document.getElementById('char-bio').textContent = character.bio;
                         document.getElementById('story-content').textContent = character.story;
 
                         // 填充屬性列表
                         const statsList = document.getElementById('stats-list');
                         statsList.innerHTML = ''; // 清空
                         for (const [statName, statValue] of Object.entries(character.stats)) {
                             statsList.innerHTML += `<li><strong>${statName}:</strong> ${statValue}</li>`;
                         }
 
                         // 填充技能列表
                         const skillsList = document.getElementById('skills-list');
                         skillsList.innerHTML = ''; // 清空
                         character.skills.forEach(skill => {
                             skillsList.innerHTML += `<li>${skill}</li>`;
                         });
                     } else {
                         document.getElementById('char-name').textContent = '角色未找到';
                     }
                 })
                 .catch(error => {
                     console.error('Error fetching character details:', error);
                     document.getElementById('char-name').textContent = '資料載入失敗';
                 });
         } else {
             document.getElementById('char-name').textContent = '未指定角色 ID';
         }
     }
 
     // --- 任務四：載入共通頁尾 (邏輯不變，但現在也要在 character.html 運作) ---
     const footerPlaceholder = document.getElementById("footer-placeholder");
     if (footerPlaceholder) {
         let footerPath = '';
         if (path.includes('/trpg/character.html')) {
             footerPath = '../_includes/footer.html';
         } else if (path.includes('/trpg/')) {
             footerPath = '../_includes/footer.html';
         } else {
             footerPath = '_includes/footer.html';
         }
         fetch(footerPath)
             .then(response => response.ok ? response.text() : Promise.reject('Footer load failed'))
             .then(data => { footerPlaceholder.innerHTML = data; })
             .catch(error => console.error('Error fetching footer:', error));
     }

// --- 【重構】任務五：載入並渲染跑團紀錄 ---
const completedContainer = document.getElementById('completed-scenarios');
const plannedContainer = document.getElementById('planned-scenarios');

if (completedContainer && plannedContainer) {
    console.log("任務五啟動：準備抓取跑團紀錄。");

    const createCardHTML = (scenario) => { /* ... (這個函式保持不變) ... */ };

    fetch('scenarios.json')
        .then(response => {
            console.log("Fetch 回應狀態:", response.status, response.statusText);
            if (!response.ok) {
                // 讓錯誤更明確
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(allScenarios => {
            console.log("成功解析 JSON，收到的資料:", allScenarios);

            // 【防禦性檢查 1】確認收到的資料是陣列
            if (!Array.isArray(allScenarios)) {
                throw new Error("JSON 檔案的根層級不是一個陣列 (Array)。");
            }

            // --- 1. 處理計畫中的劇本 (左欄) ---
            const planned = allScenarios.filter(s => s && s.status === 'planned');
            console.log("篩選出的計畫中劇本:", planned);
            plannedContainer.innerHTML = ''; 
            if (planned.length > 0) {
                // ... (渲染 planned 的程式碼) ...
            } else {
                plannedContainer.innerHTML = '<p>目前沒有計畫中的劇本。</p>';
            }

            // --- 2. 處理已完成的劇本 (右欄) ---
            const completed = allScenarios.filter(s => s && s.status === 'completed');
            console.log("篩選出的已完成劇本:", completed);
            completedContainer.innerHTML = '';
            
            if (completed.length > 0) {
                // 【防禦性檢查 2】檢查 date 欄位是否存在
                const validCompleted = completed.filter(s => s.date !== undefined && s.date !== null);
                if(validCompleted.length !== completed.length) {
                    console.warn("警告：部分已完成的劇本缺少 'date' 欄位。");
                }

                const groupedByYear = validCompleted.reduce((acc, scenario) => {
                    const year = scenario.date;
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(scenario);
                    return acc;
                }, {});
                console.log("按年份分組後的結果:", groupedByYear);

                const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);
                console.log("排序後的年份:", sortedYears);
                
                sortedYears.forEach(year => {
                    // ... (渲染 completed 的程式碼) ...
                });
            } else {
                completedContainer.innerHTML = '<p>目前沒有已通過的劇本。</p>';
            }
        })
        .catch(error => {
            // 【關鍵】讓錯誤訊息顯示在頁面上
            console.error('【錯誤】處理跑團紀錄時發生問題:', error);
            completedContainer.innerHTML = `<p style="color:red; font-weight:bold;">紀錄載入失敗！</p><p style="color:red; font-size: 0.8em;">詳細錯誤請查看瀏覽器主控台 (F12)。</p>`;
            plannedContainer.innerHTML = '';
        });
}
 });