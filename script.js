// script.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stressForm");
  const resultArea = document.getElementById("resultArea");
  const scoreText = document.getElementById("scoreText");
  const adviceText = document.getElementById("adviceText");

  // 三段建議文字（可依需求自行更改）
  const adviceLow =
    "總分 0–13：您適應得很好，但是照顧的路是很漫長的，請繼續保持下去，加油！";
  const adviceMid =
    "總分 14–25：您已開始出現一些壓力警訊，建議您利用社會資源來減輕照顧壓力，主動打電話詢問有哪些服務可以解決您的困擾。";
  const adviceHigh =
    "總分 26–42：您目前承受著相當沉重的負擔，強烈建議您立即尋求家人、親友或社會資源的協助，以確保您及被照顧者都能有良好的生活品質。";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 1. 計算 total（q1 ~ q14）
    let total = 0;
    for (let i = 1; i <= 14; i++) {
      const choice = form.querySelector(`input[name="q${i}"]:checked`);
      total += Number(choice.value);
    }

    // 2. 根據 total 選擇建議文字
    let advice = "";
    if (total <= 13) {
      advice = adviceLow;
    } else if (total <= 25) {
      advice = adviceMid;
    } else {
      advice = adviceHigh;
    }

    // 3. 在畫面上顯示分數與建議
    scoreText.textContent = "您的總分是 " + total + " 分";
    adviceText.textContent = advice;
    resultArea.classList.remove("hidden");
    resultArea.scrollIntoView({ behavior: "smooth" });

    // 4. 把 q1~q14 和 total 傳到 Google Apps Script
    const scriptURL =
      "https://script.google.com/macros/s/1AC6O158J4NmZ2VPJM7x4Qr97YNFglgzXkaekBzxULgI/exec";

    const formData = new FormData();
    for (let i = 1; i <= 14; i++) {
      const val = form.querySelector(`input[name="q${i}"]:checked`).value;
      formData.append("q" + i, val);
    }
    formData.append("total", total);

    fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then(() => {
        console.log("回應已寫入 Google Sheet");
      })
      .catch((err) => {
        console.error("寫入失敗：", err);
      });
  });
});
