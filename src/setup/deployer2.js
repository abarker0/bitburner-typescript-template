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

    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            if (DEBUG) ns.tprint(`Found ${host}`)
            
            let numPorts = ns.getServerNumPortsRequired(host);
            
            if (numPorts > maxPorts && host != "home") {
                if (DEBUG) ns.tprint(`Too many required ports: ${numPorts} > ${maxPorts}`);
                continue;
            }

            if (!ns.hasRootAccess(host) && host != "home") {
                if (DEBUG) ns.tprint(`Attacking...`);
                if (numPorts >= 5 && ns.fileExists("SQLInject.exe")) {
                    if (DEBUG) ns.tprint("SQL");
                    ns.sqlinject(host);
                }
                if (numPorts >= 4 && ns.fileExists("HTTPWorm.exe")) {
                    if (DEBUG) ns.tprint("HTTP");
                    ns.httpworm(host);
                }
                if (numPorts >= 3 && ns.fileExists("relaySMTP.exe")) {
                    if (DEBUG) ns.tprint("SMTP");
                    ns.relaysmtp(host);
                }
                if (numPorts >= 2 && ns.fileExists("FTPCrack.exe")) {
                    if (DEBUG) ns.tprint("FTP");
                    ns.ftpcrack(host);
                }
                if (numPorts >= 1 && ns.fileExists("BruteSSH.exe")) {
                    if (DEBUG) ns.tprint("SSH");
                    ns.brutessh(host);
                }
                if (!ns.nuke(host)) {
                    ns.tprint(`Couldn't nuke ${host} with ${numPorts}`);
                    continue;
                }
                if (DEBUG) ns.tprint("Nuked")
            }

            if (ns.getServerMaxRam(host) > 0) {
                if (DEBUG) ns.tprint("Launching threads");
                ns.killall(host, true);

                ns.scp(scripts, host);

                let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / 1.75);
                if (host == "home") {
                    threads *= .99;
                }
                for (let i = 0; i < threads; i++) {
                    if (counter >= cumulative[0]) {
                        currIndex = 1;
                    }
                    if (counter >= cumulative[1]) {
                        currIndex = 2;
                    }
                    if (counter >= cumulative[2]) {
                        currIndex = 0;
                        counter = -1;
                        targetIndex = (targetIndex + 1) % targets.length;
                    }

                    ns.exec(scripts[currIndex], host, 1, targets[targetIndex], delay*delayMult[targetIndex]);
                    totalThreads[currIndex]++;
                    delayMult[targetIndex]++;
                    counter++;
                }
                
                deployedServers++;
            } else {
                if (DEBUG) ns.tprint("No ram");
            }

            neighbors = neighbors.concat(ns.scan(host));
            await ns.sleep(100);
        }
    }

    ns.tprint(`Deployed ${totalThreads[0]} weaken/${totalThreads[1]} grow/${totalThreads[2]} hack threads across ${deployedServers} servers against ${targets}.`);
}