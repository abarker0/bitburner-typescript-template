/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 2 && ns.args.length != 3) {
        ns.tprint(`missing target, host, (return port)`);
        ns.exit();
    }

    const target = ns.args[0];
    const maxPorts = ns.fileExists("SQLInject.exe")
                    + ns.fileExists("HTTPWorm.exe")
                    + ns.fileExists("relaySMTP.exe")
                    + ns.fileExists("FTPCrack.exe")
                    + ns.fileExists("BruteSSH.exe");
    const numPorts = ns.getServerNumPortsRequired(target);
    if (!ns.hasRootAccess(target)) {
        if (!ns.hasRootAccess(target) && numPorts <= maxPorts) {
            if (numPorts >= 5 && ns.fileExists("SQLInject.exe")) {
                ns.sqlinject(target);
            }
            if (numPorts >= 4 && ns.fileExists("HTTPWorm.exe")) {
                ns.httpworm(target);
            }
            if (numPorts >= 3 && ns.fileExists("relaySMTP.exe")) {
                ns.relaysmtp(target);
            }
            if (numPorts >= 2 && ns.fileExists("FTPCrack.exe")) {
                ns.ftpcrack(target);
            }
            if (numPorts >= 1 && ns.fileExists("BruteSSH.exe")) {
                ns.brutessh(target);
            }
            if (!ns.nuke(target)) {
                ns.tprint(`Couldn't nuke target ${target} with ${numPorts}, exiting`);
                if (ns.args.length == 3) {
                    ns.writePort(ns.args[2], "false");
                }
                ns.exit();
            }
        }
    }

    let threads = Math.floor((ns.getServerMaxRam(ns.args[1]) - ns.getServerUsedRam(ns.args[1]))/1.75);
    ns.scp("weaken.js", ns.args[1], "home");
    let weakens = ns.exec("weaken.js", ns.args[1], Math.floor(0.5*threads), target, 0);
    ns.scp("grow.js", ns.args[1], "home");
    let grows = ns.exec("grow.js", ns.args[1], Math.floor(0.5*threads), target, 0);

    while (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target) || ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        await ns.sleep(10000);
    }
    ns.kill(weakens);
    ns.kill(grows);

    ns.alert(`Finished prepping ${target}`);
    if (ns.args.length == 3) {
        ns.writePort(ns.args[2], "true");
    }
}