/** @param {NS} ns */
export async function main(ns) {
    ns.tprint(`max ram ${ns.cloud.getRamLimit()} cost ${ns.cloud.getServerCost(ns.cloud.getRamLimit())}`);
    ns.tprint(`4 TB cost ${ns.cloud.getServerCost(4096)} + upgrade ${ns.cloud.getServerUpgradeCost("pserv-1", 8192)} = ${ns.cloud.getServerCost(4096)+ns.cloud.getServerUpgradeCost("pserv-1", 8192)}`);
    ns.tprint(`8 TB cost ${ns.cloud.getServerCost(8192)}`);

}