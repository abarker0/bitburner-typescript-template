/** @param {NS} ns */
export async function main(ns) {
    let visited = [];
    let neighbors = ["home"];
    let contracts = 0;
    let completed = 0;
    let failed = 0;

    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            
            if (host != "home") {
                for (let file of ns.ls(host)) {
                    if (file.startsWith("contract")) {
                        contracts++;
                        const contract = ns.codingcontract.getContract(file, host);
                        let solution;
                        ns.print(`Found ${contract.type} on ${host} with data ${contract.data} of type ${typeof(contract.data)}.`);

                        if (contract.type == "Unique Paths in a Grid I") {
                            ns.print(`Interpreted ${contract.data} as maxRows ${contract.data[0]}, maxCols ${contract.data[1]}`);
                            solution = uniquePaths1(contract.data[0], contract.data[1]);

                        } else if (contract.type == "Unique Paths in a Grid II") {
                            ns.print(`Interpreted ${contract.data} as grid ${contract.data}`);
                            solution = uniquePaths2(contract.data);

                        } else if (contract.type == "Encryption I: Caesar Cipher") {
                            ns.print(`Interpreted ${contract.data} as plaintext ${contract.data[0]}, left shift ${contract.data[1]}`);
                            solution = caesar(contract.data[0], contract.data[1]);
                            
                        } else if (contract.type == "Encryption II: Vigenère Cipher") {
                            ns.print(`Interpreted ${contract.data} as plaintext ${contract.data[0]}, keyword ${contract.data[1]}`);
                            solution = vigenere(contract.data[0], contract.data[1]);
                            
                        } else if (contract.type == "Spiralize Matrix") {
                            ns.print(`Interpreted ${contract.data} as matrix ${contract.data}`);
                            solution = spiral(contract.data);
                            
                        } else if (contract.type == "Merge Overlapping Intervals") {
                            ns.print(`Interpreted ${contract.data} as array of intervals ${contract.data}`);
                            solution = mergeIntervals(contract.data);
                            
                        } else if (contract.type == "Array Jumping Game") {
                            ns.print(`Interpreted ${contract.data} as array ${contract.data}`);
                            solution = arrayJumping(contract.data);
                            if (solution > 0) {
                                solution = 1;
                            }
                            
                        } else if (contract.type == "Array Jumping Game II") {
                            ns.print(`Interpreted ${contract.data} as array ${contract.data}`);
                            solution = arrayJumping(contract.data);
                            
                        } else if (contract.type == "Minimum Path Sum in a Triangle") {
                            ns.print(`Interpreted ${contract.data} as triangle ${contract.data}`);
                            solution = minTriangle(contract.data); 
                            
                        } else if (contract.type == "Total Ways to Sum") {
                            ns.print(`Interpreted ${contract.data} as n=${contract.data}`);
                            solution = totalWaysToSum(contract.data); 
                            
                        } else {
                            ns.print(`${contract.description}`);
                            ns.print(`------------------------------------------------------------------`);
                            continue;
                        }

                        ns.print(`Solution is ${solution}`);
                        let success = ns.codingcontract.attempt(solution, file, host);
                        if (success == "") {
                            ns.print(`Unsuccessful attempt: ${contract.numTriesRemaining()} tries left`);
                            failed++;
                        } else {
                            ns.print(`Success: ${success}`);
                            completed++;
                        }
                        
                        ns.print(`------------------------------------------------------------------`);
                    }
                }
            }
            
            neighbors = neighbors.concat(ns.scan(host));
        }
    }

    ns.tprint(`Found ${contracts} contracts: solved ${completed} with ${failed} failures`);
}

function uniquePaths1(maxRows, maxCols) {
    let col = 1;
    let row = 1;
    return uniquePaths1Helper(row, col, maxRows, maxCols);
}

function uniquePaths1Helper(row, col, maxRows, maxCols) {
    let sum = 0;
    if (col == maxCols && row == maxRows) {
        return 1;
    }
    if (col != maxCols) {
        sum += uniquePaths1Helper(row, col+1, maxRows, maxCols);
    }
    if (row != maxRows) {
        sum += uniquePaths1Helper(row+1, col, maxRows, maxCols);
    }
    return sum;
}

function uniquePaths2(grid) {
    return uniquePaths2Helper(grid, 0, 0);
}

function uniquePaths2Helper(grid, row, col) {
    let sum = 0;
    if (row == grid.length-1 && col == grid[0].length-1) {
        return 1;
    }
    if (grid[row][col] == 1) {
        return 0;
    }
    if (row != grid.length-1) {
        sum += uniquePaths2Helper(grid, row+1, col);
    }
    if (col != grid[0].length-1) {
        sum += uniquePaths2Helper(grid, row, col+1);
    }
    return sum;
}

function shortestPath(grid) {
    return shortestPathHelper(grid, 0, 0);
}

function shortestPathHelper(grid, row, col) { // todo
    let path = "";
    let temp = "";
    if (row == grid.length-1 && col == grid[0].length-1) {
        return "done";
    }
    if (grid[row][col] == 1 || grid[row][col] == -1) {
        return "";
    }

    grid[row][col] = -1;

    if (row != 0) {
        temp = shortestPathHelper(grid, row-1, col);
        if (temp == "done") {
            return "";
        }
        temp = "D".concat(temp);
        if (temp.length != 1 && temp.length < path.length)
            path = temp;
    }
    if (row != grid.length-1) {
        temp = "D".concat(shortestPathHelper(grid, row+1, col));
        if (temp.length != 1 && temp.length < path.length)
            path = temp;
    }
    if (col != 0) {
        temp = "L".concat(shortestPathHelper(grid, row, col-1));
        if (temp.length != 1 && temp.length < path.length)
            path = temp;
    }
    if (col != grid[0].length-1) {
        temp = "R".concat(shortestPathHelper(grid, row, col+1));
        if (temp.length != 1 && temp.length < path.length)
            path = temp;
    }
    return path;
}


function caesar(plaintext, leftShift) {
    let ciphertext = "";
    for (let i = 0; i < plaintext.length; i++) {
        if (plaintext.charAt(i) == ' ') {
            ciphertext = ciphertext.concat(" ");
            continue;   
        }

        let newChar = ((plaintext.charCodeAt(i) - 65 - leftShift + 26) % 26) + 65;
        ciphertext = ciphertext.concat(String.fromCharCode(newChar));
    }
    return ciphertext;
}

function vigenere(plaintext, keyword) {
    let ciphertext = "";
    for (let i = 0; i < plaintext.length; i++) {
        let combinedChar = (plaintext.charCodeAt(i) - 65) + (keyword.charCodeAt(i % keyword.length));
        if (combinedChar > 90) {
            combinedChar -= 26;
        }
        ciphertext = ciphertext.concat(String.fromCharCode(combinedChar));
    }
    return ciphertext;
}


function spiral(mat) {
    let dy = 0; //
    let dx = 1; //
    let sol = [];
    let y = 0;
    let x = 0;
    while (true) {
        sol.push(mat[y][x]);
        if (y+dy < 0 || y+dy == mat.length || x+dx < 0 || x+dx == mat[0].length || mat[y+dy][x+dx] == -1) {
            let temp = dy;
            dy = dx;
            dx = -temp;
        }
        if (y+dy < 0 || y+dy == mat.length || x+dx < 0 || x+dx == mat[0].length || mat[y+dy][x+dx] == -1) {
            return sol;
        }
        mat[y][x] = -1;
        y += dy;
        x += dx;
    }
}

/*
Merge Overlapping Intervals on aerocorp with data 23,30,21,30,24,34,10,12,9,12,20,30,4,6,17,21,5,14,25,31,6,14,12,22,6,9,19,21 of type object.
contract.js: Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.

 [[23,30],[21,30],[24,34],[10,12],[9,12],[20,30],[4,6],[17,21],[5,14],[25,31],[6,14],[12,22],[6,9],[19,21]]

 Example:

 [[1, 3], [8, 10], [2, 6], [10, 16]]

 would merge into [[1, 6], [8, 16]].

 The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.
*/
function mergeIntervals(intervalList) {
    intervalList = intervalList.sort((a,b) => a[0] - b[0]);
    let changed = true;
    while (changed) {
        changed = false;
        let i = 0;
        while (i < intervalList.length-1) {
            if (intervalList[i][1] >= intervalList[i+1][0]) {
                intervalList[i] = [intervalList[i][0], Math.max(intervalList[i][1], intervalList[i+1][1])];
                intervalList.splice(i+1, 1);
                changed = true;
            } else {
                i++;
            }
        }
    }
    return intervalList;
}


/*
5,3,4,4,5,2

 Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n. 

Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

 If it's impossible to reach the end, then the answer should be 0.


array len = 17 
prev = 9
furth = 9
jumps = 2
i = 9
 3,8,3,1,5,0,0,0,1,0,0,5,4,4,4,3,4
*/
function arrayJumping(array) {
    let jumps = 0;
    let prevFurthest = 0;
    let furthest = 0;
    let i = 0;
    while (prevFurthest < array.length - 1 && i < array.length) {
        furthest = Math.max(i+array[i], furthest);
        if (i == prevFurthest) {
            if (i == furthest) return 0;
            prevFurthest = furthest;
            jumps++;
        }
        i++;
    }
    // if (furthest < array.length - 1) {
    //     return 0;
    // }
    return jumps;
}

/*
Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent numbers in the row below. The triangle is represented as a 2D array of numbers:

 [
      [6],
     [8,6],
    [3,2,5],
   [7,6,1,5],
  [6,2,4,1,9]
]

 Example: If you are given the following triangle:

[
      [2],
     [3,4],
    [6,5,7],
   [4,1,8,3]
 ]

 The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
*/

function minTriangle(triangle) {
    let curr = triangle.length-1;
    while (curr != 0) {
        curr--;
        for (let i = 0; i < triangle[curr].length; i++) {
            triangle[curr][i] += Math.min(triangle[curr+1][i], triangle[curr+1][i+1]);
        }
        
    }
    return triangle[0][0];
}

function totalWaysToSum(n) {
    let results = new Array(n+1);
    for (let i = 0; i < n+1; i++) {
        results[i] = 0;
    }
    results[0] = 1;

    for (let i = 1; i < n; i++) {
        for (let j = i; j <= n; j++) {
            results[j] += results[j-i];
        }
    }
    return results[n];
}