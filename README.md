# YY的 個人網站

<!-- 徽章 (Badges) 是選用的，但能讓你的專案看起來更專業 -->
<!-- 將 <你的GitHub使用者名稱> 和 <你的倉庫名稱> 替換成你自己的 -->
![GitHub Pages](https://img.shields.io/github/deployments/yuying-trpg/yuying-trpg.github.io/production?label=Website&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/yuying-trpg/yuying-trpg.github.io)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> 這是一個使用AI跟純粹的前端技術產出的作品(。・∀・)ノ，為了集中展示、記錄我在各個跑團冒險中的角色們而建立的個人網站。
---

## ✨ 網站特色 (Features)

*   **入口頁 (Portal Page)**：一個簡潔的個人介紹頁面，作為整個網站的起點，並提供前往各社群平台的連結。
*   **動態角色列表**：角色卡片是透過 JavaScript 動態從 `characters.json` 檔案讀取並渲染的，方便未來擴充。
*   **CSS 翻轉卡片效果**：滑鼠懸停在角色頭像上時，會觸發流暢的 3D 翻轉動畫，顯示角色的簡介。
*   **模組化設計**：網站頁尾 (Footer) 使用 JavaScript 動態載入，實現了程式碼的複用，未來只需修改一個檔案即可更新所有頁面。
<!-- *   **角色詳細資料頁**：每個角色都擁有獨立的頁面，展示其全身立繪、詳細屬性、技能與背景故事。 -->
<!-- *   **響應式佈局 (RWD)**：所有頁面都經過調整，在桌面瀏覽器和手機等小螢幕裝置上都能有良好的瀏覽體驗。 -->

---

## 🛠️ 技術棧 (Technology Stack)

本專案完全使用前端靜態網頁技術來建構：

*   **HTML5**: 負責建立網頁的語意化結構。
*   **CSS3**: 負責網頁的視覺樣式與動畫效果。
    *   **Flexbox**: 主要用於實現靈活且響應式的頁面佈局。
    *   **CSS Transitions & Transforms**: 用於製作卡片翻轉等動態效果。
*   **JavaScript (ES6+)**: 負責網站的動態功能。
    *   **Fetch API**: 用於非同步抓取 JSON 資料與 HTML 模組，實現動態內容載入。
    *   **DOM Manipulation**: 用於將抓取到的資料動態生成 HTML 元素並插入頁面中。
*   **GitHub Pages**: 提供免費、快速的靜態網站託管服務。
*   **.nojekyll**: 解決了在 GitHub Pages 上因 Jekyll 預設處理而導致 `_includes` 資料夾無法訪問的問題。

---
## 版本紀錄
*  2025/10/09:建立網站 V1.0
*  2025/10/10:修改頁尾無法載入問題 V1.01
*  2025/10/10:調整內容結構，以便後續維護 V1.1.1
---

## ©️ 版權與授權

本專案由 **YY** 建立與維護。

本專案採用 [MIT License](LICENSE) 授權。
