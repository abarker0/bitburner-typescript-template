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

    ns.tprint("Finished scanning servers");
    ns.print(servers);

    let cmd = `connect ${target}`;
    let prev = servers.get(target);
    if (prev == null) {
        ns.tprint(`${target} is not a valid server, found ${servers.keys()}`);
        ns.exit();
    }
    while (prev != "") {
        ns.print(`Found ${prev}`);
        cmd = `connect ${prev}; `.concat(cmd);
        prev = servers.get(prev);
    }

    ns.tprint(`Connect command:\n${cmd}`);
}