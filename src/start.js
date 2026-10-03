/** @param {NS} ns */
export async function main(ns) {
    // get early money
    ns.exec("contract.js");

    // setup deployer script
    ns.exec("deployer.js");

    // setup server purchaser
    ns.exec("purchase-server.js", "home", 1, );

}