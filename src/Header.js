import React from 'react';

function Header({ isPaused, onPlayPause, onReset, onRuleChange, currentRule }) {
  return (
    <header>
      <button onClick={onPlayPause}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
      <button onClick={onReset}>Reset</button>
      <select value={currentRule} onChange={(e) => onRuleChange(e.target.value)}>
        <option value="conway">Conway's Game of Life</option>
        <option value="highlife">HighLife</option>
        <option value="briansBrain">Brian's Brain</option>
        <option value="walledCity">Walled City</option>
        <option value="dayAndNight">Day and Night</option>
      </select>
    </header>
  );
}

export default Header;