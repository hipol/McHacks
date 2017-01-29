


// passes an array of notes:
//Note: 1 --> clock: 100, MIDI channel: 0, note: F5, velocity: 127, duration: 100 clocks
//Note: 2 --> clock: 200, MIDI channel: 0, note: E5, velocity: 127, duration: 50 clocks
//End time = 300 clocks




var MIDI_s = [];
var createMIDI_counter = -1;

function createMIDI(notesArray, end) {
  createMIDI_counter = createMIDI_counter + 1;

  //MIDI_s.push(notesArray);
  MIDI_s[createMIDI_counter ] = notesArray;
  console.log("this is midi_s");
  console.log(MIDI_s);

}

function deleteMIDI(index) {
  MIDI_s.splice(index, 1);

  if (MIDI_s.length == 0){
    MIDI_s = [];
  }

  document.getElementById("row" + index).style.display = "none";
}

console.log("gagagagagaggaga");


function playback() {
  console.log("starting playback");

  var instrumentName = [];
  var MIDI_sLength = MIDI_s.length;

  for (var b = 0; b < MIDI_sLength; b++) {
    console.log(b)
    console.log(document.getElementById("instrument" + b))
    if (document.getElementById("instrument" + b) !== null){
      if (document.getElementById("instrument" + b).value !== null ) {
      instrumentName[b] = document.getElementById("instrument" + b).value;
      }
    } else{
      instrumentName[b] = "acoustic_grand_piano"
    }

  }


  MIDI.loadPlugin({
      soundfontUrl: "examples/soundfont/",
      instrument: "acoustic_grand_piano", // or the instrument code 1 (aka the default)
      instruments: instrumentName, // or multiple instruments
      onprogress: function(state, progress) {
        console.log(state, progress);
      },
      onsuccess: function() {
        var note = 51;
        var velocity = 100;
        var delay = 0;


        // play the note
        //var instrumentName = document.getElementById("instrument").value
        for (var b = 0; b < MIDI_sLength; b++) {
          MIDI.programChange(b, MIDI.GM.byName[instrumentName[b]].number); // set channel 0 to piano
          MIDI.setVolume(b, 127);

          console.log("im insides");
          console.log("I am: index " + b)
          //console.log(MIDI_s[b]);
          if (typeof MIDI_s[b] !== 'undefined') {
            var notesArrayLength = MIDI_s[b].length;
            for (var i = 0; i < notesArrayLength; i++) {
              MIDI.noteOn(b, MIDI_s[b][i][2], velocity, MIDI_s[b][i][0]);
              MIDI.noteOff(b, MIDI_s[b][i][2], MIDI_s[b][i][0] + MIDI_s[b][i][4]);
              //Do something
            }
          }
        }

        /*
        MIDI.noteOn(0, note, velocity, delay);
        MIDI.noteOff(0, note, delay + 0.75);
        MIDI.noteOn(1, note, velocity, delay+0.5);
        MIDI.noteOff(1, note, delay+0.5 + 0.75);
        */
      }
    });

console.log("done!");
}



function individualPlayback(b) {

  var instrumentName = document.getElementById("instrument" + b).value
  console.log(instrumentName);

  MIDI.loadPlugin({
      soundfontUrl: "examples/soundfont/",
      instrument: instrumentName, // or the instrument code 1 (aka the default)
      onprogress: function(state, progress) {
        console.log(state, progress);
      },
      onsuccess: function() {
        var note = 51;
        var velocity = 100;
        var delay = 0;

        // play the note

        MIDI.programChange(0, MIDI.GM.byName[instrumentName].number); // set channel 0 to piano
        MIDI.setVolume(0, 127);

        if (typeof MIDI_s[b] !== 'undefined') {
          var notesArrayLength = MIDI_s[b].length;
          for (var i = 0; i < notesArrayLength; i++) {
            MIDI.noteOn(0, MIDI_s[b][i][2], velocity, MIDI_s[b][i][0]);
            MIDI.noteOff(0, MIDI_s[b][i][2], MIDI_s[b][i][0] + MIDI_s[b][i][4]);
            //Do something
          }
        }


      }
    });
}


/***

var uri;
var uri2;
console.log("resetting counter");
var midi_counter = -1;
var b64 = [];
var str = [];


function createMIDI(notesArray, end) {
  midi_counter += 1;
  console.log("midi_counter  : " + midi_counter );
  // Create a MIDI file. Type 1; 100 clocks per quarter note.
  // Normally, it would rather be 96, but 100 makes it easier to count.
  mf = new JZZ_.MidiFile(1,100);

  var tr0 = new JZZ_.MidiFile.MTrk; mf.push(tr0);
  tr0.addTempo(0,120); // Set to 120 BPM

  // Add MIDI file tracks:
  var tr2 = new JZZ_.MidiFile.MTrk; mf.push(tr2); // This one will be for the music

  tr2.addName(0,'Music');
  tr2.addMidi(0,0xc0,0x0b); // clock: 0, MIDI signal: 0xc0 0x0b (change channel 0 program to vibraphone)

  //tr2.addNote(100,0,'F5',127,50); // clock: 100, MIDI channel: 0, note: E5, velocity: 127, duration: 50 clocks
  var notesArrayLength = notesArray.length;
  for (var i = 0; i < notesArrayLength; i++) {
    console.log(notesArray[i]);
    tr2.addNote(notesArray[i][0], notesArray[i][1], notesArray[i][2], notesArray[i][3], notesArray[i][4]);
    //Do something
  }

  tr2.setTime(end); // otherwise it will end on clock 1690

  str[midi_counter]  = mf.dump(); // MIDI file dumped as a string
  b64[midi_counter] = JZZ_.MidiFile.toBase64(str[midi_counter]); // convert to base-64 string

  playback(midi_counter);
}



function playback(num){

  var uri = 'data:audio/midi;base64,' + b64[num]; // data URI

  var instrumentName = document.getElementById("instrument").value

  MIDI.loadPlugin({
  soundfontUrl: "examples/soundfont/",
  instrument: instrumentName,
  onprogress: function(state, progress) {
    console.log(state, progress);
  },
  onsuccess: function() {

    MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
    MIDI.Player.loadFile(uri, MIDI.Player.start); // load .MIDI from base64 or binary XML
  }

  });
}
*/


