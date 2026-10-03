/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 4 && ns.args.length != 5) {
        ns.tprint(`missing args target, end time, duration, port, (is batch end): ${args}`);
        ns.exit();
    }

    const target = ns.args[0];
    const endTime = ns.args[1];
    const duration = ns.args[2];
    const port = ns.args[3];

    const calculatedDelay = endTime - duration - Date.now();
    const security = await ns.weaken(target, {additionalMsec: calculatedDelay});
    const msg = {
        name: "weaken",
        endOfBatch: ns.args.length == 5 && ns.args[4] ? true : false,
        security: ns.getServerSecurityLevel(ns.args[0]),
        timeCompleted: Date.now(),
        timeDiff: Date.now() - endTime
    }
    
    ns.writePort(port, JSON.stringify(msg));
}