if ("webkitSpeechRecognition" in window) {
  // Initialize webkitSpeechRecognition
  let speechRecognition = new webkitSpeechRecognition();
  var meter = null;
  var recordingStarted = false;
  var WIDTH = 500;

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
      console.log('start')
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
    }
  };

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
    drawLoop();
  
  }
  
  var speakingblock = false;
  var timeoutHandle;

  function drawLoop(time) {
    setTimeout(function () {
      var pitchVolume = meter.volume * WIDTH * 1.4;
      $("#volumenumber").html(`<span>${pitchVolume.toFixed(0)}</span>`);

      if (speakingblock) {
        if (!timeoutHandle) {
          timeoutHandle = setTimeout(function () {
            speakingblock = false;
            console.log("message ended");
            // call function to stop recording here
          }, 2000);
        }
      }

      if (parseInt(pitchVolume) < 15) {
        console.log("silence");
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      } else {
        if (!speakingblock) {
          speakingblock = true;
          console.log("message started");
          // call function to start recording here
        }
      }

      drawLoop(time);
    }, 50);
  }
} else {
  console.log("Speech Recognition Not Available");
}