import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [copyButtonClicked, setCopyButtonClicked] = useState(false);

  const recognition = useMemo(() => {
    const instance = new window.webkitSpeechRecognition();
    instance.continuous = true;
    instance.interimResults = true;
    return instance;
  }, []);

  useEffect(() => {
    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex][0].transcript;
      setTranscript(result);
    };

    return () => {
      recognition.stop();
    };
  }, [recognition]);

  const speakText = useCallback((text) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find((voice) => voice.name === 'Google UK English Female');

    synth.speak(utterance);
  }, []);

  useEffect(() => {
    if (transcript && copyButtonClicked) {
      speakText(transcript);
    }
  }, [transcript, copyButtonClicked, speakText]);

  const startListening = useCallback(() => {
    recognition.start();
    setListening(true);
  }, [recognition]);

  const stopListening = useCallback(() => {
    recognition.stop();
    setListening(false);
  }, [recognition]);

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(transcript);
    setCopyButtonClicked(true);

    setTimeout(() => {
      setCopyButtonClicked(false);
    }, 1000);
  }, [transcript]);

  return (
    <div className="App">
      <header className="App-header">
        <h3 style={{ color: '#fff' }}>Follow us on Instagram - @arpitingram</h3>
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