/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("missing script and/or target args");
        ns.exit();
    }
    const script = ns.args[0];
    const target = ns.args[1];
    let visited = [];
    let neighbors = ["home"];

    let deployedServers = 0;
    let totalThreads = 0;

    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            
            if (host != "home" && ns.getServerMaxRam(host) > 0) {
                ns.killall(host);
                // ns.print(ns.ls(host));
                if (!ns.hasRootAccess(host)) {
                    const numPorts = ns.getServerNumPortsRequired(host);
                    if (numPorts > 5) {
                        continue;
                    }
                    if (numPorts >= 5) {
                        ns.sqlinject(host);
                    }
                    if (numPorts >= 4) {
                        ns.httpworm(host);
                    }
                    if (numPorts >= 3) {
                        ns.relaysmtp(host);
                    }
                    if (numPorts >= 2) {
                        ns.ftpcrack(host);
                    }
                    if (numPorts >= 1) {
                        ns.brutessh(host);
                    }
                    if (!ns.nuke(host)) {
                        ns.tprint(`Couldn't nuke ${host} with ${numPorts}`);
                        continue;
                    }
                }

                if (!ns.ls(host).includes(script)) {
                    ns.scp(script, host);
                }
                const threads = Math.floor(ns.getServerMaxRam(host) / ns.getScriptRam(script));
                ns.exec(script, host, threads, target);
                totalThreads += threads;
                deployedServers++;
            }

            neighbors = neighbors.concat(ns.scan(host));
        }
    }

    ns.tprint(`Deployed ${totalThreads} instances of ${script} across ${deployedServers} servers.`);
}