if ("webkitSpeechRecognition" in window) {
  // Initialize webkitSpeechRecognition
  let speechRecognition = new webkitSpeechRecognition();

  // String for the Final Transcript
  let final_transcript = "";

  // Set the properties for the Speech Recognition object
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = document.querySelector("#select_dialect").value;

  // Callback Function for the onStart Event
  speechRecognition.onstart = () => {
      // Show the Status Element
      document.querySelector("#status").style.display = "block";
  };
  speechRecognition.onerror = () => {
      // Hide the Status Element
      document.querySelector("#status").style.display = "none";
  };
  speechRecognition.onend = () => {
      // Hide the Status Element
      document.querySelector("#status").style.display = "none";
  };

  speechRecognition.onresult = (event) => {
      // Create the interim transcript string locally because we don't want it to persist like final transcript
      let interim_transcript = "";

      // Loop through the results from the speech recognition object.
      for (let i = event.resultIndex; i < event.results.length; ++i) {
          // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
          if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
          } else {
              interim_transcript += event.results[i][0].transcript;
          }
      }

      // Set the Final transcript and Interim transcript.
      document.querySelector("#final").innerHTML = final_transcript;
      document.querySelector("#interim").innerHTML = interim_transcript;
  };

  // Set the onClick property of the start button
  document.querySelector("#start").onclick = () => {
      // Start the Speech Recognition
      speechRecognition.start();
  };
  // Set the onClick property of the stop button
  document.querySelector("#stop").onclick = () => {
    speechRecognition.stop();

    console.time('responsetime');
    // ====================
    // ====================
    // ====================
    let open_ai_response;
    console.time("chatgpt");
    sendMessageChatGPT();
    

    async function sendMessageChatGPT() {
        // models: 'text-curie-001', 'text-ada-001', 'text-babbage-001',

        var url = "https://api.openai.com/v1/engines/text-babbage-001/completions";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer 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");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                open_ai_response = xhr.responseText;
                const the_response = JSON.parse(open_ai_response).choices[0].text
                const msg = the_response.replace(/(\r\n|\n|\r)/gm, "");
                console.timeEnd("chatgpt");
                console.time("playht")
                convertToAudio(msg);
            }
        };

        var data = `{
            "prompt": "Cual es la mejor manera de manejar una empresa?",
            "temperature": 0.3,
            "max_tokens": 150
        }`;

        xhr.send(data);
    }
    // ====================
    // ====================
    // ====================
  };

  let playht_response;
  async function convertToAudio(message) {
    var url = "https://play.ht/api/v1/convert";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer e0f873aeffa042f89b0da69b2abd56a0");
    xhr.setRequestHeader("X-USER-ID", "pnU7CtrkObYjzwm8uWt7f20Wx4H3");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            playht_response = xhr.responseText;
            console.timeEnd("playht")
        }
    };

    var data = `{
        "content": ["${message}"],
        "voice": "es-CO-GonzaloNeural",
        "preset": "real-time",
        "speed": 1.2
    }`;

    xhr.send(data);
}
} else {
  console.log("Speech Recognition Not Available");
}