const tiles = [['one', -1], ['two', -1], ['three', -1], ['four', -1], ['five', -1], ['six', -1], ['seven', -1], ['eight', -1], ['nine', -1]];
let player = true;
let winner = undefined;

const init = () => {
  for (let current = 0; current < tiles.length; current++) {
    document.getElementById(tiles[current][0]).addEventListener("click", function() {
      const value = play(this.getAttribute('tile'));


      if (value !== undefined) {
        this.innerText = value;
        setTimeout(() => {
          determine();
          tie();
        }, 300);
      }
    });
  }
};
const reset = () => {
  let message = `${winner} won`;
  if (winner === 'tie') {
    message = 'its a draw'
  }
  alert(message);
  tiles.forEach(tile => {
    tile[1] = -1;
    document.getElementById(tile[0]).innerText = '';
  });
  winner = undefined;
  player = true;
};

const inspectForWinner = (value, counter) => {
  if (counter < 3) {
    return winner;
  }

  if (value) {
    winner = 'player1';
  } else {
    winner = 'player2';
  }
  return winner;
};

const tie = () => {
  const tie = tiles.every(tile => tile[1] !== -1);
  if (tie) {
    winner = 'tie';
    reset();
  }
}

const winVerticaly = () => {
  let value = -2;
  let counter = 0;
  let candidates = []
  for (let current = 0; current < tiles.length; current++) {
    const tile = tiles[current][1];
    if (value === tile) {
      if (value === -1) {
        continue;
      }
      counter++;
      candidates.push(current);
      if ((candidates.includes(2) && candidates.includes(3)) || (candidates.includes(5) && candidates.includes(6))) {

      } else {
        const possibleWinner = inspectForWinner(value, counter);
        if (possibleWinner !== undefined) {
          return possibleWinner;
        }
      }
    } else {
      candidates = [current];
      counter = 1;
      value = tile;
    }
  }
  return undefined;
};
const winHorizontal = () => {
  let value;
  let counter;
  const starters = [0, 1, 2];
  for (let el of starters) {
    counter = 0;
    value = -2;
    for (let current = el; current < tiles.length; current = current + 3) {
      const tile = tiles[current][1];
      if (value === tile) {
        if (value === -1) {
          continue;
        }
        counter++;
        const possibleWinner = inspectForWinner(value, counter);
        if (possibleWinner !== undefined) {
          return possibleWinner;
        }
      } else {
        counter = 1;
        value = tile;
      }
    }
  }
  return undefined;
};
const winDiagonal = () => {
  let value = -1;
  let counter = 1;
  const combo = [tiles[0][1], tiles[4][1], tiles[8][1], tiles[2][1], tiles[4][1], tiles[6][1]];
  value = combo[0];
  for (let current = 1; current < combo.length; current++) {
    if (combo[current] !== value) {
      value = combo[current];
      counter = 1;
    } else {
      if (combo[current] === -1) {
        continue;
      }
      counter++;
      if (counter === 3) {
        break;
      }
    }
  }
  return inspectForWinner(value, counter);
};


const play = (tile) => {
  let symbol = '';
  const cell = Number(tile) - 1;
  if (tiles[cell][1] !== -1) {
    alert('oops this cell has already been used, please try again');
  } else {
    if (player) {
      symbol = 'X';
      tiles[cell][1] = true;
    } else {
      symbol = 'O';
      tiles[cell][1] = false;
    }
    player = !player;
    return symbol;
  }

  return undefined;
};
const determine = () => {
  winner = winVerticaly();
  if (winner !== undefined) {
    reset();
    return;
  }
  winner = winHorizontal();
  if (winner !== undefined) {
    reset();
    return;
  }
  winner = winDiagonal();
  if (winner !== undefined) {
    reset();
    return;
  }
};

init();


