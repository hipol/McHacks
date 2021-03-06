
// Define the set of test frequencies that we'll use to analyze microphone data.
var C4 = 261.626; // C2 note, in Hz.
var notes = ["c4", "c#4", "d4", "d#4", "e4", "f4", "f#4", "g4", "g#4", "a4", "a#4", "b4"];
var test_frequencies = [];
var summation = 0;
var counter = 0;
var averageMert = 0;
var tempArray = [];
var unfilteredArray = [];
var filteredArray = [];
var filled = false;
var recording = false;
var totalDuration = 0;
var rms;
var noteDisplay;

//set up an analyzer
/*
var analyzer = context.createAnalyzer();
analyzer.smoothingTimeConstant = 0.3;
analyzer.fftSize = 1024;
*/

//set up javascript node
/*var javascriptNode = context.createScriptProcessor(2048, 1, 1);


javascriptNode.onaudioproccess = function() {
  // get the average, bitcount is fftsize/2
  var array = new Unit8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(array);
  var average = getAverageVolume(array)

  ctx.clearRext(0, 0, 60, 130);
  ctx.fillStyle=gradient;
  ctx.fillRext(0,130-average,25,130);
}
*/
function getAverageVolume(array)  {
  var values = 0;
  var average;
  var length = array.length;

  //get all the freq amplitudes
  for(var i = 0; i<length; i++) {
    values += array[i];
  }

  average = values / length;
  return average;
}

function filterArray(unfilteredArray) {
  var filteredArray = [];
  for(var i = 0; i < unfilteredArray.length; i++) {
    var duration = 3;
    while(unfilteredArray[i] == unfilteredArray[i+1]) {
      duration += 3;
      i++;
    }
    filteredArray.push([totalDuration/100, 0, unfilteredArray[i], 127, duration/100]);
    totalDuration += duration;
  }
  return(filteredArray);
}

for (var i = 0; i < 30; i++)
{
  var note_frequency = C4 * Math.pow(2, i / 12);
  var note_name = notes[i%12];
  var note = { "frequency": note_frequency, "name": note_name };
  var just_above = { "frequency": note_frequency * Math.pow(2, 1 / 48), "name": note_name + " (a bit sharp)" };
  var just_below = { "frequency": note_frequency * Math.pow(2, -1 / 48), "name": note_name + " (a bit flat)" };
  test_frequencies = test_frequencies.concat([note]);
}
window.addEventListener("load", initialize);
var correlation_worker = new Worker(URL.createObjectURL(new Blob(["("+worker_function.toString()+")()"], {type: 'text/javascript'})));
correlation_worker.addEventListener("message", interpret_correlation_result);


function toggle(button)
{

     

    console.log('asldkf');
    //gain_node.gain.value = 0.1;
  if(document.getElementById("recorder").value=="Record"){
    var note_context = new AudioContext();
var note_node = note_context.createOscillator();
var gain_node = note_context.createGain();
note_node.frequency = C4 * Math.pow(2, 4 / 12); // E, ~82.41 Hz.
gain_node.gain.value = 0;
note_node.connect(gain_node);
gain_node.connect(note_context.destination);
note_node.start();
var playing = false;

  playing = !playing;
    console.log('asldkf');
    gain_node.gain.value = 0.1;
    document.getElementById("recorder").style="background-color: red; border:3px solid black;";
    document.getElementById("recorder").value="3";
    //gain_node.gain.value = 0.1;
    setTimeout('document.getElementById("recorder").value="2";', 1000);
    //gain_node.gain.value = 0;
    setTimeout('document.getElementById("recorder").value="1";', 2000);
    //gain_node.gain.value = 0.1;
    setTimeout('document.getElementById("recorder").value="Stop Recording";', 3000);
    //gain_node.gain.value = 0;
    setTimeout(function(){ gain_node.gain.value = 0; }, 500);
    setTimeout(function(){ gain_node.gain.value = 0.1; }, 1000);
    setTimeout(function(){ gain_node.gain.value = 0; }, 1500);
    setTimeout(function(){ gain_node.gain.value = 0.1; }, 2000);
    setTimeout(function(){ gain_node.gain.value = 0; }, 2500);


   recording = true;
   console.log("i got here");
   

   playback();
}

  else if(document.getElementById("recorder").value=="Stop Recording"){
   document.getElementById("recorder").value="Record";
   document.getElementById("recorder").style="background-color: #44c767";
   recording = false;

   addDom();

}
}

function initialize()
{
  var get_user_media = navigator.getUserMedia;
  get_user_media = get_user_media || navigator.webkitGetUserMedia;
  get_user_media = get_user_media || navigator.mozGetUserMedia;
  get_user_media.call(navigator, { "audio": true }, use_stream, function() {});
  //document.getElementById("play-note").addEventListener("click", toggle_playing_note);
}
function use_stream(stream)
{
  var audio_context = new AudioContext();
  var microphone = audio_context.createMediaStreamSource(stream);
  var script_processor = audio_context.createScriptProcessor(1024, 1, 1);
  script_processor.connect(audio_context.destination);
  microphone.connect(script_processor);
  var buffer = [];
  var sample_length_milliseconds = 15.625;
  var recording = true;
  // Need to leak this function into the global namespace so it doesn't get
  // prematurely garbage-collected.
  // http://lists.w3.org/Archives/Public/public-audio/2013JanMar/0304.html
  window.capture_audio = function(event)
  {
    console.log("jkghfdshrdjhtfgmj");


    if (!recording)
      return;

    buffer = buffer.concat(Array.prototype.slice.call(event.inputBuffer.getChannelData(0)));
    var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
    var sum = 0;
    var x;
    for (var i=0; i<bufLength; i++) {
      x = buf[i];
      if (Math.abs(x)>=this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    var volume = Math.max(rms, this.volume*this.averaging);
    //console.log(rms);
    // Stop recording after sample_length_milliseconds.
    if (buffer.length > sample_length_milliseconds * audio_context.sampleRate / 1000)
    {
      recording = false;
      correlation_worker.postMessage
      (
        {
          "timeseries": buffer,
          "test_frequencies": test_frequencies,
          "sample_rate": audio_context.sampleRate
        }
      );
      buffer = [];
      setTimeout(function() { recording = true; }, 15.625);
    }
  };
  script_processor.onaudioprocess = window.capture_audio;
}
function interpret_correlation_result(event)
{
  var timeseries = event.data.timeseries;
  var frequency_amplitudes = event.data.frequency_amplitudes;
  // Compute the (squared) magnitudes of the complex amplitudes for each
  // test frequency.
  var magnitudes = frequency_amplitudes.map(function(z) { return z[0] * z[0] + z[1] * z[1]; });
  // Find the maximum in the list of magnitudes.
  var maximum_index = -1;
  var maximum_magnitude = 0;
  for (var i = 0; i < magnitudes.length; i++)
  {
    if (magnitudes[i] <= maximum_magnitude)
      continue;
    maximum_index = i;
    maximum_magnitude = magnitudes[i];
  }
  // Compute the average magnitude. We'll only pay attention to frequencies
  // with magnitudes significantly above average.
  var average = magnitudes.reduce(function(a, b) { return a + b; }, 0) / magnitudes.length;
  var confidence = maximum_magnitude / average;
  var confidence_threshold = 10; // empirical, arbitrary.
  var dominant_frequency = test_frequencies[maximum_index];
  //console.log(dominant_frequency);
  if (confidence > confidence_threshold)
  {
    summation = dominant_frequency.frequency;
    counter ++;
    //console.log(dominant_frequency.frequency);
    //document.getElementById("noteDisplay").textContent = dominant_frequency.name;
    //document.getElementById("frequency").textContent = dominant_frequency.frequency;


  }
  else {
    counter++;
    summation = dominant_frequency.frequency;
    //console.log(dominant_frequency.frequency)
  }

  if(counter==10) {
      counter = 0;
      averageMert = summation;
      //console.log(average + "    " + counter);
    }

  //document.getElementById("average").textContent = averageMert;
  //console.log(averageMert);
  //var noteArray = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];
  var noteArray = [48,49,50,51,52,53,54,55,56,57,58,59];
  var frequencyArray = [];
  for (var i = 0; i < 30; i++)
  {
    var freq = C4 * Math.pow(2, i / 12);
    var noteName = noteArray[i%12];
    var noteMert = noteName;
    frequencyArray = frequencyArray.concat([freq]);
  }
  //console.log(frequencyArray);
  //console.log(noteArray);

  
  for(var i = 0; i<30; i++) {
    if(rms>.15)  {
    if(averageMert <= frequencyArray[0])  {
      if(rms > .15)  {
        noteDisplay = noteArray[0];
        console.log(noteArray[0]);
    }
      break;
    }
    if(averageMert >= frequencyArray[29]) {
      noteDisplay = noteArray[29%12];
      break;
    }
    if(averageMert < frequencyArray[i+1]) {
      distance = (frequencyArray[i] + frequencyArray[i+1])/2;
      if(averageMert >= distance)
        noteDisplay = noteArray[(i+1)%12];
      else
        noteDisplay = noteArray[i%12];

      console.log(noteDisplay);
      break;
    }
  }
  

  }
  console.log(noteDisplay);

  if(recording) {
    console.log(noteDisplay);
    if(rms>.15)
      tempArray.push(noteDisplay);
    console.log("ahh");
    filled = false;
  }
  else {
    if(!filled) {
      unfilteredArray = tempArray;
      filteredArray = filterArray(unfilteredArray);
      console.log(filteredArray);
      createMIDI(filteredArray, 30000); /// included a random end clock... TODO fix please?
      console.log(unfilteredArray);
      console.log("hello");
      totalDuration = 0;
    }
    filled = true;
    tempArray = [];

  }
  //console.log(noteDisplay);
  //document.getElementById("noteDisplay").textContent = noteDisplay;
}