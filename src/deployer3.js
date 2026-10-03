/** @param {NS} ns */
export async function main(ns) {
    const DEBUG = false;
    const maxTargets = 3;

    const weaken = "weaken.js";
    const grow = "grow.js";
    const hack = "hack.js"; // each 1.75 gb
    let servers = new Map();
    let workers = [];
    let maxPorts = ns.fileExists("SQLInject.exe")
                    + ns.fileExists("HTTPWorm.exe")
                    + ns.fileExists("relaySMTP.exe")
                    + ns.fileExists("FTPCrack.exe")
                    + ns.fileExists("BruteSSH.exe");
    let totalThreads = 0;

    // initialize server data into servers Map and prep servers that we can use
    let neighbors = ["home"];
    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!servers.has(host)) {
            let numPorts = ns.getServerNumPortsRequired(host);
            let numThreads = Math.floor(ns.getServerMaxRam(host)/1.75);
            servers.set(host, {ports: numPorts, lvl: ns.getServerRequiredHackingLevel(host), money: ns.getServerMaxMoney(host), threads: numThreads});
            ns.print(`Found ${host}`);
            
            if (numPorts > maxPorts && host != "home") {
                ns.print(`Too many required ports: ${numPorts} > ${maxPorts}`);
                continue;
            }

            

            neighbors = neighbors.concat(ns.scan(host));
        }
    }

    servers.get("home").threads = Math.floor(0.99 * servers.get("home").threads);
        
    let prevMaxPorts = 0;
    let prevTargets = new Map();

    while (true) {
        maxPorts = ns.fileExists("SQLInject.exe")
                    + ns.fileExists("HTTPWorm.exe")
                    + ns.fileExists("relaySMTP.exe")
                    + ns.fileExists("FTPCrack.exe")
                    + ns.fileExists("BruteSSH.exe");

        // recalculate workers and threads
        if (maxPorts > prevMaxPorts) {
            workers = new Map([...servers.entries()].filter(([key, value]) => value.ports <= maxPorts));
            for (const [worker, data] of workers.entries()) {
                if (!ns.hasRootAccess(worker) && worker != "home") {
                    ns.print(`Attacking...`);
                    if (data.ports >= 5 && ns.fileExists("SQLInject.exe")) {
                        ns.sqlinject(worker);
                    }
                    if (data.ports >= 4 && ns.fileExists("HTTPWorm.exe")) {
                        ns.httpworm(worker);
                    }
                    if (data.ports >= 3 && ns.fileExists("relaySMTP.exe")) {
                        ns.relaysmtp(worker);
                    }
                    if (data.ports >= 2 && ns.fileExists("FTPCrack.exe")) {
                        ns.ftpcrack(worker);
                    }
                    if (data.ports >= 1 && ns.fileExists("BruteSSH.exe")) {
                        ns.brutessh(worker);
                    }
                    if (!ns.nuke(worker)) {
                        ns.print(`Couldn't nuke ${worker} with ${data.ports}`);
                        ns.exit();
                    }
                    ns.print("Nuked");
                }

                totalThreads += worker.threads;
            }
        }

        // get top 3 servers by money <= 1/2 hacking level
        targets = new Map([...servers.entries()]
                    .filter(([key, value]) => value.lvl <= ns.getHackingLevel()/2)
                    .sort((a,b) => b[1].money - a[1].money)
                    .slice(0,3));

        // recalculate targets by replacing lowest of 3 (if there is 3)
        for (const [target, data] of targets) {
            if (!prevTargets.has(target)) {
                let growThreads = [];
                for (let i = 0; i < ns.getGrowTime(target))
                    growThreads.push(ns.exec(grow, ));
                // need to figure out setting up threads, communicating w them, scaling them, and destroying them when changing targets
            }
        }

        ns.tprint(`Analyzing ${targets[0]}:
        Growth security increase: ${ns.growthAnalyzeSecurity(1, targets[0])}
        Growth time: ${ns.getGrowTime(targets[0])}
        Hack chance: ${ns.hackAnalyzeChance(targets[0])}
        Hack security increase: ${ns.hackAnalyzeSecurity(1, targets[0])}
        Hack time: ${ns.getHackTime(targets[0])}
        Weaken security decrease: ${ns.weakenAnalyze(1)}
        Weaken time: ${ns.getWeakenTime(targets[0])}
        `);

        // const ratios = [20, 18, 1];
        // const cumulative = [ratios[0], ratios[0]+ratios[1], ratios[0]+ratios[1]+ratios[2]];
        let counter = 0;
        let currIndex = 0;

        const delay = 50;
        let delayMult = 0;

        

        // while (neighbors.length != 0) {
        //     let host = neighbors.pop();
        //     if (!visited.includes(host)) {
        //         visited.push(host);
        //         if (DEBUG) ns.tprint(`Found ${host}`)
                
        //         let numPorts = ns.getServerNumPortsRequired(host);
                
        //         if (numPorts > maxPorts && host != "home") {
        //             if (DEBUG) ns.tprint(`Too many required ports: ${numPorts} > ${maxPorts}`);
        //             continue;
        //         }

        //         if (!ns.hasRootAccess(host) && host != "home") {
        //             if (DEBUG) ns.tprint(`Attacking...`);
        //             if (numPorts >= 5 && ns.fileExists("SQLInject.exe")) {
        //                 if (DEBUG) ns.tprint("SQL");
        //                 ns.sqlinject(host);
        //             }
        //             if (numPorts >= 4 && ns.fileExists("HTTPWorm.exe")) {
        //                 if (DEBUG) ns.tprint("HTTP");
        //                 ns.httpworm(host);
        //             }
        //             if (numPorts >= 3 && ns.fileExists("relaySMTP.exe")) {
        //                 if (DEBUG) ns.tprint("SMTP");
        //                 ns.relaysmtp(host);
        //             }
        //             if (numPorts >= 2 && ns.fileExists("FTPCrack.exe")) {
        //                 if (DEBUG) ns.tprint("FTP");
        //                 ns.ftpcrack(host);
        //             }
        //             if (numPorts >= 1 && ns.fileExists("BruteSSH.exe")) {
        //                 if (DEBUG) ns.tprint("SSH");
        //                 ns.brutessh(host);
        //             }
        //             if (!ns.nuke(host)) {
        //                 ns.tprint(`Couldn't nuke ${host} with ${numPorts}`);
        //                 continue;
        //             }
        //             if (DEBUG) ns.tprint("Nuked")
        //         }

        //         if (ns.getServerMaxRam(host) > 0) {
        //             if (DEBUG) ns.tprint("Launching threads");
        //             ns.killall(host, true);

        //             ns.scp(scripts, host);

        //             let threads = Math.floor(ns.getServerMaxRam(host) / 1.75);
        //             if (host == "home") {
        //                 threads *= .99;
        //             }
        //             for (let i = 0; i < threads; i++) {
        //                 if (counter >= cumulative[0]) {
        //                     currIndex = 1;
        //                 }
        //                 if (counter >= cumulative[1]) {
        //                     currIndex = 2;
        //                 }
        //                 if (counter >= cumulative[2]) {
        //                     currIndex = 0;
        //                     counter = -1;
        //                     targetIndex = (targetIndex + 1) % targets.length;
        //                 }

        //                 ns.exec(scripts[currIndex], host, 1, targets[targetIndex], delay*delayMult);
        //                 totalThreads[currIndex]++;
        //                 delayMult++;
        //                 counter++;
        //             }
                    
        //             deployedServers++;
        //         } else {
        //             if (DEBUG) ns.tprint("No ram");
        //         }

        //         neighbors = neighbors.concat(ns.scan(host));
        //     }
        // }

        // ns.tprint(`Deployed ${totalThreads[0]} weaken/${totalThreads[1]} grow/${totalThreads[2]} hack threads across ${deployedServers} servers against ${targets}.`);
    
        await ns.sleep(60000);
    }
}

function nuke(host) {

}