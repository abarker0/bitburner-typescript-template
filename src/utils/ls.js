/** @param {NS} ns */
export async function main(ns) {
    let servers = new Map();
    const myScripts = ["hack.js", "grow.js", "weaken.js", "script1.js"];

    let visited = [];
    let neighbors = ["home"];
    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            const files = ns.ls(host);
            const filtered = files.filter((file) => !file.startsWith("contract") && !myScripts.includes(file));
            if (filtered.length != 0)
                ns.tprint(`${host}: ${filtered}`);
            neighbors = neighbors.concat(ns.scan(host));
        }
    }
}