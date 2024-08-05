const Rules = {
    conway: (cell, neighbors) => {
      if (cell === 1 && (neighbors === 2 || neighbors === 3)) return 1;
      if (cell === 0 && neighbors === 3) return 1;
      return 0;
    },
    highlife: (cell, neighbors) => {
      if (cell === 1 && (neighbors === 2 || neighbors === 3)) return 1;
      if (cell === 0 && (neighbors === 3 || neighbors === 6)) return 1;
      return 0;
    },
    briansBrain: (cell, neighbors) => {
      if (cell === 1 && neighbors !== 2) return 0;
      if (cell === 0 && neighbors === 2) return 1;
      return 0;
    },
    walledCity: (cell, neighbors) => {
      if (cell === 1 && (neighbors >= 2 && neighbors <= 7)) return 1;
      if (cell === 0 && (neighbors === 3 || neighbors === 7)) return 1;
      return 0;
    },
    dayAndNight: (cell, neighbors) => {
      if ((cell === 0 && [3, 6, 7, 8].includes(neighbors)) ||
          (cell === 1 && [3, 4, 6, 7, 8].includes(neighbors))) {
        return 1;
      }
      return 0;
    }
  };
  
  export default Rules;