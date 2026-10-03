/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("requires target and delay time args");
        ns.exit();
    }
    await ns.sleep(ns.args[1]);
    while (true) {
        await ns.hack(ns.args[0]);
    }
}