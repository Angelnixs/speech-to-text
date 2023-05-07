$(document).ready(function() {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "es-MX";
  recognition.onstart = function() {
    console.log("Recording started");
  };
  
  recognition.onresult = function(event) {
    var transcript = event.results[event.results.length - 1][0].transcript;
    $('#respuestas').append('<p class="user">' + transcript + '</p>');
    sendMessageChatGPT(transcript);
  };
  
  recognition.onspeechend = function() {
    console.log("Silence detected");
    recognition.stop();
  };
  
  // When the recording is stopped
  recognition.onend = function() {
    console.log("Recording stopped");
    recognition.start();
  };
  
  // Start the recording
  recognition.start();
});

async function sendMessageChatGPT(msg) {
  // models: 'text-curie-001', 'text-ada-001', 'text-babbage-001',
  var url = "https://api.openai.com/v1/chat/completions";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer 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");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let open_ai_response = xhr.responseText;
      console.log(JSON.parse(open_ai_response))
      const the_response = JSON.parse(open_ai_response).choices[0].message.content
      // const msg = the_response.replace(/(\r\n|\n|\r)/gm, "");
      $('#respuestas').append('<p class="ai">' + the_response + '</p>');
      return ['success', the_response] ;
    }
  };

  const context = JSON.stringify({
    "role": "system",
    "content": `
      you will read responses from money debtors over the phone and you have to guess how they feel,
      you can only respond with numbers from 1 to 6, you cant use words, letters, or other characters:

      1 means I agree,
      2 means I respectfully disagree,
      3 means I am respectfully angry,
      4 means I am being disrespectful,
      5 means I am confused,
      6 means its hard to tell how i feel or I am making no sense,
    `
  })

  var data = `{
    "model": "gpt-3.5-turbo",
    "messages": [${context},{"role": "user", "content": "${msg}"}]
  }`;
  
  xhr.send(data);
}