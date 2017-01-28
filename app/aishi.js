



// passes an array of notes:
//Note: 1 --> clock: 100, MIDI channel: 0, note: F5, velocity: 127, duration: 100 clocks
//Note: 2 --> clock: 200, MIDI channel: 0, note: E5, velocity: 127, duration: 50 clocks
//End time = 300 clocks


function createMIDI(notesArray, end) {

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

  var str = mf.dump(); // MIDI file dumped as a string
  var b64 = JZZ_.MidiFile.toBase64(str); // convert to base-64 string
  var uri = 'data:audio/midi;base64,' + b64; // data URI




  MIDI.loadPlugin({
  soundfontUrl: "examples/soundfont/",
  instrument: "acoustic_grand_piano",
  onprogress: function(state, progress) {
    console.log(state, progress);
  },
  onsuccess: function() {


    MIDI.Player.loadFile(uri, MIDI.Player.start); // load .MIDI from base64 or binary XML
  }

  });

}


