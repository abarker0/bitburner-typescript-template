/*
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

    2 = 1
    1 + 1


    3 = 2
    2 + 1
    1 + 1 + 1


It is possible write four as a sum in exactly four different ways:

    4 = 4
    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different distinct ways can the number 68 be written as a sum of at least two positive integers?


    5 = 6
    4 + 1
    3 + 2
    3 + 1 + 1
    2 + 2 + 1
    2 + 1 + 1 + 1
    1 + 1 + 1 + 1 + 1

    6 = 10
    5 + 1
    4 + 2
    4 + 1 + 1
    3 + 3
    3 + 2 + 1
    3 + 1 + 1 + 1
    2 + 2 + 2
    2 + 2 + 1 + 1
    2 + 1 + 1 + 1 + 1
    1 + 1 + 1 + 1 + 1 + 1

    1 + 1 + 1 + 1 + 1 + 1
    2 + 1 + 1 + 1 + 1
    3 + 1 + 1 + 1
    4 + 1 + 1
    5 + 1
    2 + 2 + 1 + 1
    2 + 2 + 2
    3 + 2 + 1
    




If your solution is an empty string, you must leave the text box empty. Do not use "", '', or ``.
*/

/** @param {NS} ns */
export async function main(ns) {
    let n = 68;
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
    ns.tprint(results[n]);
}