/** @param {NS} ns */
export async function main(ns) {
    let array = [5,3,4,4,5,2];
    let jumps = 0;
    let prevFurthest = 0;
    let furthest = 0;
    let i = 0;
    while (prevFurthest < array.length - 1 && i < array.length) {
        furthest = Math.max(i+array[i], furthest);
        if (i == prevFurthest) {
            prevFurthest = furthest;
            jumps++;
        }
        i++;
    }
    ns.tprint(furthest);
    if (furthest < array.length-1) {
        ns.tprint(0);
        return;
    };
    ns.tprint(jumps);
}