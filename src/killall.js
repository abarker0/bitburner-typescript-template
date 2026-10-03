/** @param {NS} ns */
export async function main(ns) {
    let visited = [];
    let neighbors = ["home"];

    let killHome = false;
    if (ns.args.length > 0 && ns.args[0] == "-h") {
        killHome = true;
    }

    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            
            if (host != "home" || killHome) {
                ns.killall(host, true);
            }

            neighbors = neighbors.concat(ns.scan(host));
        }
    }
}