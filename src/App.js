import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

export default function App() {
  const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState('');
    const [listening, setListening] = useState(false);
    const [copyButtonClicked, setCopyButtonClicked] = useState(false);
  
    const recognition = new window.webkitSpeechRecognition();
  
    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex][0].transcript;
      setTranscript(result);
    };

    
  
    useEffect(() => {
      recognition.continuous = true;
      recognition.interimResults = true;
    
      return () => {
        recognition.stop();
      };
    }, []);

    useEffect(() => {
      if (transcript && copyButtonClicked) {
        speakText(transcript);
      }
    }, [transcript, copyButtonClicked]);
  
    const startListening = () => {
      recognition.start();
      setListening(true);
    };
  
    const stopListening = () => {
      recognition.stop();
      setListening(false);
    };

    
    const speakText = (text) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find((voice) => voice.name === 'Google UK English Female'); // voice adjust provided by google

    synth.speak(utterance);
  };


    const handleCopyToClipboard = () => {
      navigator.clipboard.writeText(transcript);
      setCopyButtonClicked(true);
  

      setTimeout(() => {
        setCopyButtonClicked(false);
      }, 1000);
    };
  
    return { transcript, listening, startListening, stopListening, handleCopyToClipboard, copyButtonClicked, setTranscript, speakText};
  };
  
    const { transcript, listening, startListening, stopListening, handleCopyToClipboard, copyButtonClicked, setTranscript, speakText} = useSpeechRecognition();
  
    return (
      <div className="App">
        <header className="App-header">
         <h3 style={{ color: '#fff' }}>Follow us on Instragram - @arpitingram</h3>
          <h1 style={{ color: '#fff' }}>Convert your speech to text bro</h1>
          <div className="textbox">
            <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          </div>
          <div className="buttons">
            <button onClick={startListening} disabled={listening}>
              Start Mic
            </button>
            <button onClick={stopListening} disabled={!listening}>
              Stop Mic
            </button>
            <button
            onClick={handleCopyToClipboard}
            disabled={!transcript}
            className={copyButtonClicked ? 'copy-btn-clicked' : ''}
          >
            Copy to Clipboard
          </button>
          </div>

          <div className="speak-button">
          <button
            onClick={() => speakText(transcript)}
            disabled={!transcript}
            className="speak-btn"
          >
            Speak
          </button>
        </div>

        </header>
      </div>
    );
  }
  

  



