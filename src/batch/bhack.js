/** @param {NS} ns */
/*
Child process that executes `hack` on target server to finish at a specified end time
*/

export async function main(ns) {
    if (ns.args.length != 5) {
        ns.tprint(`Usage: run bhack.js <target> <end time> <duration> <port> <batch num>`);
        ns.exit();
    }

    const target = ns.args[0];
    const endTime = ns.args[1];
    const duration = ns.args[2];
    const port = ns.args[3];
    const batchNum = ns.args[4];

    const calculatedDelay = endTime - duration - Date.now();
    const money = await ns.hack(target, {additionalMsec: calculatedDelay});
    
    const msg = {
        name: "hack",
        money: money,
        batchNum: batchNum,
        // security: ns.getServerSecurityLevel(ns.args[0]),
        timeCompleted: Date.now(),
        timeDiff: Date.now() - endTime
    }
    ns.writePort(port, JSON.stringify(msg));
}