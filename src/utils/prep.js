/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 2 && ns.args.length != 3) {
        ns.tprint(`Usage: run prep.js <target> <host> <?return port>`);
        ns.exit();
    }

    const target = ns.args[0];
    const host = ns.args[1];
    let returnPortNum = -1;
    if (ns.args.length == 3) {
        returnPortNum = ns.args[2];
    }
    const maxPorts = ns.fileExists("SQLInject.exe")
                    + ns.fileExists("HTTPWorm.exe")
                    + ns.fileExists("relaySMTP.exe")
                    + ns.fileExists("FTPCrack.exe")
                    + ns.fileExists("BruteSSH.exe");
    const numPorts = ns.getServerNumPortsRequired(target);

    // crack target if no root access
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
                    ns.writePort(returnPortNum, "false");
                }
                ns.exit();
            }
        }
    }

    // run infinite loop weaken/grow threads against target
    let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host))/1.75);
    ns.scp("weaken.js", host, "home");
    let weakens = ns.exec("weaken.js", host, Math.floor(0.5*threads), target, 0);
    ns.scp("grow.js", host, "home");
    let grows = ns.exec("grow.js", host, Math.floor(0.5*threads), target, 0);

    // wait until infinite loop threads max security and money then kill
    while (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target) || ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        await ns.sleep(10000);
    }
    ns.kill(weakens);
    ns.kill(grows);

    ns.tprint(`Finished prepping ${target}`);
    if (ns.args.length == 3) {
        ns.writePort(returnPortNum, "true");
    }
}