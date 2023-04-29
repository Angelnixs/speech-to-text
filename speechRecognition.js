if ("webkitSpeechRecognition" in window) {
  // Initialize webkitSpeechRecognition
  let speechRecognition = new webkitSpeechRecognition();
  var meter = null;
  var recordingStarted = false;
  var WIDTH = 500;
  let timeoutHandle;

  // String for the Final Transcript
  let final_transcript = "";

  // Set the properties for the Speech Recognition object
  speechRecognition.continuous = true;
  speechRecognition.maxAlternatives = 1;
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
      recordingStarted = true;
      speechRecognition.start();
  };
  // Set the onClick property of the stop button
  document.querySelector("#stop").onclick = () => {
    if (recordingStarted) {
      recordingStarted = false;

      speechRecognition.stop();
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

  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    __log('No live audio input: ' + e);
  });
  
  function startUserMedia(stream) {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const streamNode = ctx.createMediaStreamSource(stream);
    streamNode.connect(analyser);
  
    // Create a new volume meter and connect it.
    meter = createAudioMeter(ctx);
    streamNode.connect(meter);
    console.log(meter)
    drawLoop();
  
  }
  
  // Create pitch bar
  function drawLoop( time ) {
    
    var pitchVolume = meter.volume*WIDTH*1.4;
    // console.log(meter.volume)
    var width = 0;
  
    // Pitch detection minimum volume
    var minimum_volume = 130;
  
    // Get width if Recording started
    if(recordingStarted){
  
      if(pitchVolume < minimum_volume){
         width = 0;
      }else if(pitchVolume >= minimum_volume && pitchVolume < (minimum_volume+20) ){
         width = 10;
      }else if(pitchVolume >= (minimum_volume+20) && pitchVolume < (minimum_volume+40)){
         width = 20;
      }else if(pitchVolume >= (minimum_volume+40) && pitchVolume < (minimum_volume+60)){
         width = 30;
      }else if(pitchVolume >= (minimum_volume+60) && pitchVolume < (minimum_volume+80)){
         width = 40;
      }else if(pitchVolume >= (minimum_volume+80) && pitchVolume < (minimum_volume+100)){
         width = 50;
      }else if(pitchVolume >= (minimum_volume+100) && pitchVolume < (minimum_volume+120)){
         width = 60;
      }else if(pitchVolume >= (minimum_volume+120) && pitchVolume < (minimum_volume+140)){
         width = 70;
      }else if(pitchVolume >= (minimum_volume+140) && pitchVolume < (minimum_volume+160)){
         width = 80;
      }else if(pitchVolume >= (minimum_volume+160) && pitchVolume < (minimum_volume+180)){
         width = 90;
      }else if(pitchVolume >= (minimum_volume+180)){
         width = 100;
      }
  
    }
    $("#volumenumber").html(`<span>${pitchVolume.toFixed(1)}</span>`);    
    // Update width
    document.getElementById('voiceVolume').style.width = width+'%';
    setTimeout(function(){
      if(recordingStarted){
        if(parseInt(pitchVolume) < 15){
          timeoutHandle = setTimeout(function(){
            $("#stop").trigger("click")
          }, 2000);
        }else{
          window.clearTimeout(timeoutHandle);
        }
      }
      rafID = window.requestAnimationFrame( drawLoop );
    }, 200 );
  }
} else {
  console.log("Speech Recognition Not Available");
}

// var meter = null;
// var WIDTH = 500;
// var recordingStarted = false;

// // initialize SpeechRecognition object
// let recognition = new webkitSpeechRecognition();
// recognition.maxAlternatives = 1;
// recognition.continuous = true;

// // Detect the said words
// recognition.onresult = e => {

//   var current = event.resultIndex;

//   // Get a transcript of what was said.
//   var transcript = event.results[current][0].transcript;

//   // Add the current transcript with existing said values
//   var noteContent = $('#saidwords').val();
//   noteContent += ' ' + transcript;
//   $('#saidwords').val(noteContent);

// }

// // Stop recording
// function stopSpeech(){

//   // Change status
//   $('#status').text('Recording Stopped.');
//   recordingStarted = false;

//   // Stop recognition
//   recognition.stop();
// }

// // Start recording
// function startSpeech(){
//   try{ // calling it twice will throw..
//     $('#status').text('Recording Started.'); 
//     $('#saidwords').val('');
//     recordingStarted = true;

//     // Start recognition
//     recognition.start();
//   }
//   catch(e){}
// }

