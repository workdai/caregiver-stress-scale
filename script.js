/*─── script.js ───*/
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("stressForm");
  const resultArea = document.getElementById("resultArea");
  const scoreText = document.getElementById("scoreText");
  const adviceText = document.getElementById("adviceText");

  // 三段建議文字
  const adviceLow = "總分 0–13：您適應得很好，但是照顧的路是很漫長的，請繼續保持下去，加油！";
  const adviceMid =
    "總分 14–25：您已開始出現一些壓力的警訊，建議您利用社會資源來減輕照顧壓力，主動打電話詢問有哪些服務可以解決您的困擾。";
  const adviceHigh =
    "總分 26–42：您目前承受著相當沉重的負擔，強烈建議您立即尋求家人、親友或社會資源的協助，以確保您及被照顧者都能有良好的生活品質。";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 把 14 題加總
    let total = 0;
    for (let i = 1; i <= 14; i++) {
      const selected = form.querySelector(
        `input[name="q${i}"]:checked`
      );
      total += Number(selected.value);
    }

    // 根據分數區間決定要顯示哪段文字
    let advice = "";
    if (total <= 13) {
      advice = adviceLow;
    } else if (total <= 25) {
      advice = adviceMid;
    } else {
      advice = adviceHigh;
    }

    // 把結果顯示在 #resultArea 裡
    scoreText.textContent = "您的總分是 " + total + " 分";
    adviceText.textContent = advice;

    // 顯示結果區塊
    resultArea.classList.remove("hidden");

    // 自動捲到結果上方
    resultArea.scrollIntoView({ behavior: "smooth" });
  });
});
