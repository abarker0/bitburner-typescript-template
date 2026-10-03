/** @param {NS} ns */
export async function main(ns) {
    let servers = new Map();

    let visited = [];
    let neighbors = ["home"];
    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            servers.set(host, [ns.getServerMaxMoney(host), ns.getServerRequiredHackingLevel(host)]);
            // ns.tprint(`${host}: \t\t${ns.getServerMaxMoney(host)} money, ${ns.getServerRequiredHackingLevel(host)} hack level, ${ns.getServerMaxRam(host)} ram`);
            neighbors = neighbors.concat(ns.scan(host));
        }
    }
    const green = "\u001b[32m";
    let sortedServers = new Map([...servers.entries()].sort((a,b) => b[1][0] - a[1][0]));
    sortedServers.forEach((k, v) => v <= ns.getHackingLevel()/2 ? ns.tprint(`${green}${k}: ${v}`) : ns.tprint(`${k}: ${v}`));
}