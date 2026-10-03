/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.cloud.getServerNames();
    for (let i = 0; i < servers.length; i++) {
        ns.cloud.renameServer(servers[i], "pserv-"+i);
    }
}