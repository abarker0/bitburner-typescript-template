/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) {
        ns.tprint("missing target");
        ns.exit();
    }
    const port = ns.getPortHandle(ns.pid);
    port.clear();

    const target = ns.args[0];

    while (true) {
        await port.nextWrite();
        const data = JSON.parse(port.read());
        ns.print(data);
        // if (data.name == "weaken" && data.endOfBatch) {
        //     ns.print(`
        //     ${target} snapshot:
        //     Money difference: ${ns.getServerMaxMoney(target) - ns.getServerMoneyAvailable(target)}
        //     Server security difference: ${ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)}`);
            
        // }
    }
}