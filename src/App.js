import React, { useState, useRef, useCallback } from 'react';
import Header from './Header';
import Canvas from './Canvas';
import './App.css';

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentRule, setCurrentRule] = useState('conway');
  const resetFunc = useRef(null);

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    if (resetFunc.current) {
      resetFunc.current();
    }
  };

  const handleRuleChange = useCallback((rule) => {
    setCurrentRule(rule);
  }, []);

  return (
    <div className="App">
      <Header 
        isPaused={isPaused} 
        onPlayPause={handlePlayPause} 
        onReset={handleReset}
        onRuleChange={handleRuleChange}
        currentRule={currentRule}
      />
      <Canvas 
        isPaused={isPaused} 
        onReset={(resetFunction) => {
          resetFunc.current = resetFunction;
        }}
        currentRule={currentRule}
      />
    </div>
  );
}

export default App;