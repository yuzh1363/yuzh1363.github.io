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
     /*const footerPlaceholder = document.getElementById("footer-placeholder");
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
     }*/

     // --- 【修正】任務五：載入並渲染跑團紀錄 (在 trpg/log.html 執行) ---
const completedContainer = document.getElementById('tabs-container');
const plannedContainer = document.getElementById('planned-scenarios');

if (completedContainer && plannedContainer) {

    // 步驟 1: 將 createCardHTML 函式定義在最前面，作為一個公用的工具函式
    const createCardHTML = (scenario) => {
        // 如果傳入的 scenario 是無效的，返回一個錯誤提示，避免 undefined
        if (!scenario) {
            return '<div class="scenario-card"><p>錯誤：劇本資料無效。</p></div>';
        }
        return `
            <div class="scenario-title">${scenario.name || '未知劇本'}</div>
            <div class="scenario-details">
                <span><strong>KP:</strong> ${scenario.kp || 'N/A'}</span>
                <span><strong>PC:</strong> ${(scenario.pc || []).join(', ')}</span>
            </div>
        `;
    };

    // 步驟 2: 執行 fetch
    fetch('scenarios.json')
        .then(response => response.ok ? response.json() : Promise.reject('Scenarios JSON load failed'))
        .then(allScenarios => {
            
            // --- 步驟 3: 處理計畫中的劇本 (左欄) ---
            const planned = allScenarios.filter(s => s.status === 'planned');
            plannedContainer.innerHTML = ''; // 清空「載入中」
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

            // --- 步驟 4: 處理已完成的劇本 (右欄) ---
            const completed = allScenarios.filter(s => s.status === 'completed');
            const tabButtonsList = document.getElementById('tab-buttons-list');
            const tabContentPanels = document.getElementById('tab-content-panels');
            
            // 清空舊內容
            tabButtonsList.innerHTML = '';
            tabContentPanels.innerHTML = '';
            
            if (completed.length > 0) {
                const groupedByYear = completed.reduce((acc, scenario) => {
                    const year = scenario.date;
                    if (!acc[year]) acc[year] = [];
                    acc[year].push(scenario);
                    return acc;
                }, {});

                const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

                sortedYears.forEach((year, index) => {
                    const buttonItem = document.createElement('li');
                    const button = document.createElement('button');
                    button.className = 'tab-button';
                    button.textContent = year;
                    button.dataset.target = `panel-${year}`;
                    buttonItem.appendChild(button);
                    tabButtonsList.appendChild(buttonItem);

                    const panel = document.createElement('div');
                    panel.className = 'tab-panel';
                    panel.id = `panel-${year}`;
                    
                    const listContainer = document.createElement('div');
                    listContainer.className = 'completed-list';

                    const sortedScenarios = groupedByYear[year].sort((a, b) => {
                        const numA = parseInt(String(a.id).replace(/[^0-9]/g, ''), 10) || 0;
                        const numB = parseInt(String(b.id).replace(/[^0-9]/g, ''), 10) || 0;
                        return numB - numA;
                    });

                    sortedScenarios.forEach(scenario => {
                        const card = document.createElement('div');
                        card.className = 'scenario-card';
                        // 【修正】確保這裡呼叫 createCardHTML
                        card.innerHTML = createCardHTML(scenario);
                        listContainer.appendChild(card);
                    });

                    panel.appendChild(listContainer);
                    tabContentPanels.appendChild(panel);

                    if (index === 0) {
                        button.classList.add('active');
                        panel.classList.add('active');
                    }
                });

                tabButtonsList.addEventListener('click', (event) => {
                    if (event.target.tagName === 'BUTTON') {
                        const targetButton = event.target;
                        const targetPanelId = targetButton.dataset.target;
                        
                        tabButtonsList.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                        tabContentPanels.querySelectorAll('.tab-panel').forEach(pnl => pnl.classList.remove('active'));

                        targetButton.classList.add('active');
                        document.getElementById(targetPanelId).classList.add('active');
                    }
                });

            } else {
                // 如果沒有已完成劇本，也需要顯示提示
                tabContentPanels.innerHTML = '<p>目前沒有已通過的劇本。</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching scenarios:', error);
            plannedContainer.innerHTML = '<p style="color:red;">紀錄載入失敗！</p>';
            // 如果 tabs-container 存在，也顯示錯誤
            const tabsContent = document.getElementById('tab-content-panels');
            if(tabsContent) {
                tabsContent.innerHTML = '<p style="color:red;">紀錄載入失敗！</p>';
            }
        });
}
 });