const GAS_URL = "https://script.google.com/macros/s/AKfycbwbl-1m-cgmUrGf6T6ig44Uobtl25j9zez2BoAiVF1Ko7kLaMHQaPdErTIx7QoFEmIYXA/exec";

let currentRecordId = "";
let currentScore = 0;

document.getElementById("showResultBtn").addEventListener("click", async function () {

  const answers = getAnswers();
  if (!answers) return;

  const website = document.getElementById("website").value.trim();

  currentScore = answers.reduce((sum, val) => sum + Number(val), 0);

  try {

    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submitQuiz",
        answers: answers,
        score: currentScore,
        website: website
      })
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "送出失敗");
      return;
    }

    currentRecordId = result.recordId;

    showResult(currentScore);

    document.getElementById("resultSection").style.display = "block";
    document.getElementById("contactSection").style.display = "block";

    document.getElementById("resultSection").scrollIntoView({
      behavior: "smooth"
    });

  } catch (error) {

    console.error(error);
    alert("系統錯誤，請稍後再試");

  }

});


document.getElementById("submitContactBtn").addEventListener("click", async function () {

  if (!currentRecordId) {
    alert("找不到填答紀錄");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const checkAnswer = document.getElementById("checkAnswer").value.trim();

  try {

    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submitContact",
        recordId: currentRecordId,
        name: name,
        phone: phone,
        checkAnswer: checkAnswer
      })
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "送出失敗");
      return;
    }

    alert("聯絡資料已送出，謝謝您");
    document.getElementById("submitContactBtn").disabled = true;

  } catch (error) {

    console.error(error);
    alert("系統錯誤，請稍後再試");

  }

});


function getAnswers() {

  const answers = [];

  for (let i = 1; i <= 14; i++) {

    const checked = document.querySelector(`input[name="q${i}"]:checked`);

    if (!checked) {
      alert(`第 ${i} 題尚未作答`);
      return null;
    }

    answers.push(Number(checked.value));

  }

  return answers;

}


function showResult(score) {

  document.getElementById("scoreText").textContent = `您的總分：${score} 分`;

  let level = "";
  let description = "";

  if (score <= 13) {

    level = "調適得很好";
    description = "目前整體狀況仍在可調適範圍內。";

  } else if (score <= 25) {

    level = "壓力徵兆";
    description = "您已出現一些照顧壓力徵兆，建議適時休息並尋求支持。";

  } else {

    level = "承受沉重負擔";
    description = "您目前可能正承受較高程度的照顧壓力，建議尋求協助。";

  }

  document.getElementById("levelText").textContent = `結果：${level}`;
  document.getElementById("resultDescription").textContent = description;

}
