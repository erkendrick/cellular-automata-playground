export default class Rules {

    static conway(x, y, countNeighbors, grid) {
        let neighbor = countNeighbors(x, y);

        if (grid[x][y] == 1 && (neighbor == 2 || neighbor == 3)) {
            return 1;
        }
        if (grid[x][y] == 1 && (neighbor < 2 || neighbor > 3)) {
            return 0;
        }
        if (grid[x][y] == 0 && neighbor == 3) {
            return 1;
        }

        return 0;
    }

    static highlife(x, y, countNeighbors, grid) {
        let neighbor = countNeighbors(x, y);

        if (grid[x][y] == 1 && (neighbor == 2 || neighbor == 3)) {
            return 1;
        }
        if (grid[x][y] == 0 && (neighbor == 3 || neighbor == 6)) {
            return 1;
        }

        return 0;
    }

    static briansBrain(x, y, countNeighbors, grid) {
        let neighbor = countNeighbors(x, y);

        if (grid[x][y] == 1 && neighbor !== 2) {
            return 0;
        }
        if (grid[x][y] == 0 && neighbor == 2) {
            return 1;
        }

        return 0;
    }

    static walledCity(x, y, countNeighbors, grid) {
        let neighbor = countNeighbors(x, y);

        if (grid[x][y] == 1 && (neighbor >= 2 && neighbor <= 7)) {
            return 1;
        }
        if (grid[x][y] == 0 && (neighbor == 3 || neighbor == 7)) {
            return 1;
        }

        return 0;
    }

    static dayAndNight(x, y, countNeighbors, grid) {
        let neighbor = countNeighbors(x, y);

        if ((grid[x][y] == 0 && (neighbor == 3 || neighbor == 6 || neighbor == 7 || neighbor == 8)) ||
            (grid[x][y] == 1 && (neighbor == 3 || neighbor == 4 || neighbor == 6 || neighbor == 7 || neighbor == 8))) {
            return 1;
        }

        return 0;
    }

}
