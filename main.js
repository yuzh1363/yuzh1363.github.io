// 等待整個 HTML 文件都載入並解析完畢後再執行
document.addEventListener("DOMContentLoaded", function() {

    // 找到頁面中用來放置導覽列的佔位符元素
    const navPlaceholder = document.getElementById("navbar-placeholder");

    // 如果頁面上有這個佔位符，才執行後續動作
    if (navPlaceholder) {
        // 使用 fetch API 去抓取我們的導覽列 HTML 檔案的內容
        // 【重要】路徑是相對於引用這個 JS 的 HTML 檔案
        fetch('../_includes/navigation.html')
            .then(response => {
                // 檢查請求是否成功
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                // 將回應的內容轉為文字
                return response.text();
            })
            .then(data => {
                // 將抓取到的 HTML 內容，塞進佔位符裡面
                navPlaceholder.innerHTML = data;
            })
            .catch(error => {
                // 如果抓取失敗，在控制台印出錯誤，方便除錯
                console.error('Error fetching navigation bar:', error);
                navPlaceholder.innerHTML = "<p style='color:red;'>導覽列載入失敗！</p>";
            });
    }
});