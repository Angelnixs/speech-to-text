async function sendMessageChatGPT(message, callback) {
  console.time("chatgpt");
  // models: 'text-curie-001', 'text-ada-001', 'text-babbage-001',
  var url = "https://api.openai.com/v1/engines/text-curie-001/completions";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer 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");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      open_ai_response = xhr.responseText;
      const the_response = JSON.parse(open_ai_response).choices[0].text
      const finalMsg = the_response.replace(/(\r\n|\n|\r)/gm, "");
      callback(finalMsg)
    }
  };

  var data = `{
    "prompt": "${$.trim(message)}",
    "temperature": 0.3,
    "max_tokens": 150
  }`;

  xhr.send(data);
}

async function convertToAudio(message, callback) {
  var url = "https://play.ht/api/v1/convert";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer e0f873aeffa042f89b0da69b2abd56a0");
  xhr.setRequestHeader("X-USER-ID", "pnU7CtrkObYjzwm8uWt7f20Wx4H3");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.timeEnd("playht")
      callback(xhr.responseText)
    }
  };

  xhr.send(`{
    "content": ["${message}"],
    "voice": "es-CO-GonzaloNeural",
    "preset": "real-time",
    "speed": 1.2
  }`);
}