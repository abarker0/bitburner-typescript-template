/** @param {NS} ns */
export async function main(ns) {
    
    const servers = [];
    for (let i = 0; i < ns.cloud.getServerNames().length; i++) {
        servers.push(`pserv-${i}`);
    }

    let numSharers = servers.length;

    if (ns.args.length == 1) {
        numSharers = ns.args[0];
    }

    ns.tprint(`Sharing memory on ${numSharers} servers`);

    for (let server of servers) {
        const threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam("share-worker.js"));
        if (threads == 0) continue;
        ns.scp("share-worker.js", server);
        ns.exec("share-worker.js", server, threads);
    }

}