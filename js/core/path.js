// core/path.js
export const PATH = [];

const SIZE = 16;

/*
EXAKT MÖNSTER SOM I BILDEN

Start:
- Renhuvud: PATH[0]  = (0, 0)
- Tomte:    PATH[1]  = (1, 0)

Sedan:
- Rad 0:  →→→→→→→→→→→→→→→→
- Rad 1:  ←←←←←←←←←←←←←←←←
- Rad 2:  →→→→→→→→→→→→→→→→
- Rad 3:  ←←←←←←←←←←←←←←←←
- ...
- Fortsätter tills hela planen är fylld
*/

for (let y = 0; y < SIZE; y++) {
  if (y % 2 === 0) {
    // jämn rad: vänster → höger
    for (let x = 0; x < SIZE; x++) {
      PATH.push({ x, y });
    }
  } else {
    // udda rad: höger → vänster
    for (let x = SIZE - 1; x >= 0; x--) {
      PATH.push({ x, y });
    }
  }
}
