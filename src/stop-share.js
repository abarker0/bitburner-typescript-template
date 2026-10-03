/** @param {NS} ns */
export async function main(ns) {
    const servers = [];
    for (let i = 0; i < ns.cloud.getServerNames().length; i++) {
        servers.push(`pserv-${i}`);
    }

    for (let server of servers) {
        ns.scriptKill("share-worker.js", server);
    }
}