/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) {
        ns.tprint("Missing target");
        ns.exit();
    }
    const target = ns.args[0];

    let servers = new Map();
    servers.set("home", "")

    let visited = [];
    let neighbors = ["home"];
    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            let adjacent = ns.scan(host);
            for (let adj of adjacent) {
                if (!servers.has(adj)) {
                    servers.set(adj, host);
                }
            }
            neighbors = neighbors.concat(adjacent);
        }
    }

    ns.tprint(servers);

    let cmd = `connect ${target}`;
    let prev = servers.get(target);
    while (prev != "") {
        ns.tprint(`Found ${prev}`);
        cmd = `connect ${prev}; `.concat(cmd);
        prev = servers.get(prev);
    }

    ns.tprint(cmd);
}