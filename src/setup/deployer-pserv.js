/** @param {NS} ns */
export async function main(ns) {
    const DEBUG = false;

    if (ns.args.length < 1) {
        ns.tprint("missing target args");
        ns.exit();
    }
    const scripts = ["weaken.js", "grow.js", "hack.js"]; //each 1.75 gb
    const maxPorts = ns.fileExists("SQLInject.exe")
                    + ns.fileExists("HTTPWorm.exe")
                    + ns.fileExists("relaySMTP.exe")
                    + ns.fileExists("FTPCrack.exe")
                    + ns.fileExists("BruteSSH.exe");

    const targets = ns.args;
    let targetIndex = 0;

    ns.tprint(`Analyzing ${targets[0]}:
    Growth security increase: ${ns.growthAnalyzeSecurity(1, targets[0])}
    Growth time: ${ns.getGrowTime(targets[0])}
    Hack chance: ${ns.hackAnalyzeChance(targets[0])}
    Hack security increase: ${ns.hackAnalyzeSecurity(1, targets[0])}
    Hack time: ${ns.getHackTime(targets[0])}
    Weaken security decrease: ${ns.weakenAnalyze(1)}
    Weaken time: ${ns.getWeakenTime(targets[0])}
    `);

    const ratios = [20, 18, 1];
    const cumulative = [ratios[0], ratios[0]+ratios[1], ratios[0]+ratios[1]+ratios[2]];
    let counter = 0;
    let currIndex = 0;

    const delay = 50;
    let delayMult = [];
    for (let target of targets) {
        delayMult.push(0);
    }

    let visited = [];
    let neighbors = ["home"];

    let deployedServers = 0;
    let totalThreads = [0,0,0];

    for (let target of targets) {
        if (DEBUG) ns.tprint(`Prepping target ${target}`);
        let numPorts = ns.getServerNumPortsRequired(target);
        if (!ns.hasRootAccess(target) && numPorts <= maxPorts) {
            if (numPorts >= 5 && ns.fileExists("SQLInject.exe")) {
                if (DEBUG) ns.tprint("SQL");
                ns.sqlinject(target);
            }
            if (numPorts >= 4 && ns.fileExists("HTTPWorm.exe")) {
                if (DEBUG) ns.tprint("HTTP");
                ns.httpworm(target);
            }
            if (numPorts >= 3 && ns.fileExists("relaySMTP.exe")) {
                if (DEBUG) ns.tprint("SMTP");
                ns.relaysmtp(target);
            }
            if (numPorts >= 2 && ns.fileExists("FTPCrack.exe")) {
                if (DEBUG) ns.tprint("FTP");
                ns.ftpcrack(target);
            }
            if (numPorts >= 1 && ns.fileExists("BruteSSH.exe")) {
                if (DEBUG) ns.tprint("SSH");
                ns.brutessh(target);
            }
            if (!ns.nuke(target)) {
                ns.tprint(`Couldn't nuke target ${target} with ${numPorts}, exiting`);
                ns.exit();
            }
            if (DEBUG) ns.tprint("Nuked");
        }
    }

    const hosts = ns.cloud.getServerNames();
    for (let host of hosts) {

        ns.killall(host, true);

        ns.scp(scripts, host);

        let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / 1.75);

        while (threads > 0) {
            let t = ratios[currIndex];
            if (threads - ratios[currIndex] < 0) {
                t = threads;
            }
            ns.exec(scripts[currIndex], host, t, targets[targetIndex], delay*delayMult[targetIndex]);
            threads -= t;
            currIndex = (currIndex + 1) % 3
            if (currIndex == 0) {
                counter = -1;
                targetIndex = (targetIndex + 1) % targets.length;
            }
            totalThreads[currIndex]++;
            delayMult[targetIndex]++;
            counter++;
        }
    }

    ns.tprint(`Deployed ${totalThreads[0]} weaken/${totalThreads[1]} grow/${totalThreads[2]} hack threads across ${deployedServers} servers against ${targets}.`);
}