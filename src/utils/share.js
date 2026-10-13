/** @param {NS} ns */
const SHARE_WORKER_SCRIPT = "utils/share-worker.js";

export async function main(ns) {
    let servers = [];
    for (let i = 0; i < ns.cloud.getServerNames().length; i++) {
        servers.push(`pserv-${i}`);
    }

    let numSharers = servers.length;

    if (ns.args.length == 1) {
        numSharers = ns.args[0];
    }

    ns.tprint(`Sharing memory on ${numSharers} servers`);

    for (let server of servers) {
        const threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(SHARE_WORKER_SCRIPT));
        if (threads == 0) continue;
        ns.scp(SHARE_WORKER_SCRIPT, server);
        ns.exec(SHARE_WORKER_SCRIPT, server, threads);
    }

}