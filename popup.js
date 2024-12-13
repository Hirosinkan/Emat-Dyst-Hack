document.getElementById("start-button").addEventListener("click", () => {  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url.includes("https://contera.dk/tabel/dysten/opg.aspx")) {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: solveMathProblems
          });
      } else {
          alert("Please navigate to the correct page on contera.dk before starting!");
      }
  });
});

function solveMathProblems() {
  function gentags_funktion() {
      const questionLabel = document.getElementById("Label_Spg");
      const answerBox = document.getElementById("Textbox_BrugersvarA");

      
      if (questionLabel && answerBox) {
          const question = questionLabel.textContent;
          const cleanedQuestion = question.replace(/\s/g, "");

          
          let operator, num1, num2, answer;
          if (cleanedQuestion.includes("+")) {
              [num1, num2] = cleanedQuestion.split("+").map(n => parseInt(n, 10));
              answer = num1 + num2;
          } else if (cleanedQuestion.includes("-")) {
              [num1, num2] = cleanedQuestion.split("-").map(n => parseInt(n, 10));
              answer = num1 - num2;
          } else if (cleanedQuestion.includes(":")) {
              [num1, num2] = cleanedQuestion.split(":").map(n => parseInt(n, 10));
              answer = num1 / num2;
          } else if (cleanedQuestion.includes("•")) {
              [num1, num2] = cleanedQuestion.split("•").map(n => parseInt(n, 10));
              answer = num1 * num2;
          } else {
              console.log("Unsupported operator detected. Skipping...");
              setTimeout(gentags_funktion, 200); 
              return;
          }

          
          const answerStr = answer.toString();

          if (answerBox.value !== answerStr) {
              let charIndex = 0;

              function typeNextChar() {
                  if (charIndex < answerStr.length) {
                      answerBox.value += answerStr[charIndex];
                      charIndex++;
                      setTimeout(typeNextChar, 1); 
                    } else {
                      
                      const enterEvent = new KeyboardEvent('keydown', {
                          key: 'Enter',
                          code: 'Enter',
                          bubbles: true
                      });
                      answerBox.dispatchEvent(enterEvent);

                      console.log("Answer submitted. Checking for the next question...");
                      
                      setTimeout(gentags_funktion, 1000);
                  }
              }

              typeNextChar(); 
          } else {
              console.log("Answer already typed. Waiting for the next question...");
              setTimeout(gentags_funktion, 1000);
          }
      } else {
          console.log("No question or text box detected. Retrying...");
          setTimeout(gentags_funktion, 1000); 
      }
  }

  gentags_funktion(); 
}
