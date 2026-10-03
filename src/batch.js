/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) {
        ns.tprint("missing target arg");
        ns.exit();
    }

    const target = ns.args[0];

    if (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target) || ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        ns.tprint("server needs to be prepped");
        const prepPort = ns.getPortHandle(ns.pid);
        prepPort.clear();
        ns.exec("prep.js", "home", 1, target, ns.pid);
        await prepPort.nextWrite();
        const success = prepPort.read();
        if (success != "true") {
            ns.tprint("prep failed");
            ns.exit();
        }
    }

    const port = ns.exec("bmonitor.js", "home", 1, target);

    const hackTime = ns.getHackTime(target);
    const weakenTime = 4*hackTime;
    const growTime = 3.2*hackTime;
    const delay = 5;

    let endTime = Date.now() + weakenTime + 20;

    const maxMoney = ns.getServerMaxMoney(target)
    const stolenMoneyPercentage = 50*ns.hackAnalyze(target); // percentage
    const stolenMoney = stolenMoneyPercentage * maxMoney;
    const remaining = maxMoney - stolenMoney;
    const mult = maxMoney/remaining;


    const hackSec = ns.hackAnalyzeSecurity(50, target);
    const growSec = ns.growthAnalyzeSecurity(25, target);
    const weakenSec = ns.weakenAnalyze(2);
    ns.tprint(`${hackSec}
    ${growSec}
    ${weakenSec}`)


    let i = 0;
    while (i < 5) {
        ns.exec("bhack.js", "home", 50, target, endTime, hackTime, port);
        ns.exec("bweaken.js", "home", 2, target, endTime + delay, weakenTime, port);
        ns.exec("bgrow.js", "home", 25, target, endTime + 2*delay, growTime, port);
        ns.exec("bweaken.js", "home", 2, target, endTime + 3*delay, weakenTime, port, true);
        endTime += 20;
        i++;
    }
    
}