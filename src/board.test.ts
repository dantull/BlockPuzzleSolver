import {describe, expect, jest, test} from '@jest/globals';
import { Board } from './board.js';
import { Point } from './geometry.js';
import { convert_to_points } from './stringify.js';

describe("board", () => {
    function makeBoard() {
        const grid = [
            "ooooo",
            "ooooo",
            "ooooo"
        ];

        return new Board(convert_to_points(grid));
    }

    test("reach whole board", () => {
        expect(makeBoard().reachable({x: 0, y: 0}, 16)).toEqual(15);
    });

    test("reach limit", () => {
        expect(makeBoard().reachable({x: 0, y: 0}, 3)).toEqual(3);
    });

    test("reach obstructed", () => {
        const board:Board = makeBoard();
        board.fill(convert_to_points([
            " xxx ",
            "x   x",
            " xx x ",
        ]), 'x');
        
        expect(board.reachable({x: 1, y: 1}, 5)).toEqual(4);
    });
});