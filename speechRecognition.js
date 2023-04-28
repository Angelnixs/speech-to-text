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


    // ====================
    // ====================
    // ====================
    // let open_ai_response;

    // openai_test();

    // async function openai_test() {
    
    //     var url = "https://api.openai.com/v1/engines/text-ada-001/completions";

    //     var xhr = new XMLHttpRequest();
    //     xhr.open("POST", url);

    //     xhr.setRequestHeader("Content-Type", "application/json");
    //     xhr.setRequestHeader("Authorization", "Bearer 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");

    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4) {
    //             console.log(xhr.status);
    //             console.log(xhr.responseText);
    //             open_ai_response = xhr.responseText;
    //             console.log(open_ai_response);
    //         }};

    //     var data = `{
    //         "prompt": "How are you today?",
    //         "temperature": 0.7,
    //         "max_tokens": 150,
    //         "top_p": 1,
    //         "frequency_penalty": 0.75,
    //         "presence_penalty": 0
    //     }`;

    //     xhr.send(data);
    // }
    // ====================
    // ====================
    // ====================
  };
} else {
  console.log("Speech Recognition Not Available");
}