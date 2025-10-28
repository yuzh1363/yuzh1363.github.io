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

// --- 【重構】任務五：載入並渲染跑團紀錄 (在 trpg/log.html 執行) ---
const completedContainer = document.getElementById('completed-scenarios');
const plannedContainer = document.getElementById('planned-scenarios');

// 只有當頁面上存在這兩個容器時，才執行
if (completedContainer && plannedContainer) {

    // 渲染單個卡片的函式 (保持不變)
    const createCardHTML = (scenario) => {
        return `
            <div class="scenario-title">${scenario.name}</div>
            <div class="scenario-details">
                <!-- <span><strong>日期:</strong> ${scenario.date}</span> -->
                <span><strong>系統:</strong> ${scenario.system}</span>
                <span><strong>KP:</strong> ${scenario.kp}</span>
                <span><strong>PC:</strong> ${scenario.pc.join(', ')}</span>
            </div>
            <!-- <div class="scenario-notes">${scenario.notes}</div> -->
        `;
    };

    // 抓取 JSON 資料
    fetch('scenarios.json')
        .then(response => response.ok ? response.json() : Promise.reject('Scenarios JSON load failed'))
        .then(allScenarios => {
            
            // --- 1. 處理計畫中的劇本 (左欄) ---
            const planned = allScenarios.filter(s => s.status === 'planned');
            plannedContainer.innerHTML = ''; // 清空
            if (planned.length > 0) {
                planned.forEach(scenario => {
                    const card = document.createElement('div');
                    card.className = 'scenario-card';
                    card.innerHTML = createCardHTML(scenario);
                    plannedContainer.appendChild(card);
                });
            } else {
                plannedContainer.innerHTML = '<p>目前沒有計畫中的劇本。</p>';
            }

            // --- 2. 處理已完成的劇本 (右欄) ---
            const completed = allScenarios.filter(s => s.status === 'completed');
            completedContainer.innerHTML = ''; // 清空
            
            if (completed.length > 0) {
                // 按年份分組
                const groupedByYear = completed.reduce((acc, scenario) => {
                    const year = scenario.date; // 直接使用 date 欄位的值作為年份
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(scenario);
                    return acc;
                }, {});

                // 按年份從大到小排序
                const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

                // 遍歷排序後的年份，並生成 HTML
                sortedYears.forEach(year => {
                    // 建立年份容器
                    const yearGroup = document.createElement('div');
                    yearGroup.className = 'year-group';

                    // 建立年份標題
                    const yearTitle = document.createElement('h3');
                    yearTitle.className = 'year-title';
                    yearTitle.textContent = year;
                    
                    // 建立該年份的劇本列表容器
                    const yearList = document.createElement('div');
                    yearList.className = 'completed-list';

                    // 將該年份的所有劇本卡片加入列表
                    groupedByYear[year].forEach(scenario => {
                        const card = document.createElement('div');
                        card.className = 'scenario-card';
                        card.innerHTML = createCardHTML(scenario);
                        yearList.appendChild(card);
                    });
                    
                    // 將標題和列表組裝到年份容器中
                    yearGroup.appendChild(yearTitle);
                    yearGroup.appendChild(yearList);

                    // 最後將整個年份容器加入到右欄的主容器中
                    completedContainer.appendChild(yearGroup);
                });

            } else {
                completedContainer.innerHTML = '<p>目前沒有已通過的劇本。</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching scenarios:', error);
            completedContainer.innerHTML = '<p style="color:red;">紀錄載入失敗！</p>';
        });
}

 });
