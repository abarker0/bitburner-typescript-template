/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 4) {
        ns.tprint(`missing args target, end time, duration, port: ${args}`);
        ns.exit();
    }

    const target = ns.args[0];
    const endTime = ns.args[1];
    const duration = ns.args[2];
    const port = ns.args[3];

    const calculatedDelay = endTime - duration - Date.now();
    const mult = await ns.grow(target, {additionalMsec: calculatedDelay});
    const msg = {
        name: "grow",
        mult: mult,
        security: ns.getServerSecurityLevel(ns.args[0]),
        timeCompleted: Date.now(),
        timeDiff: Date.now() - endTime
    }
    ns.writePort(port, JSON.stringify(msg));
}