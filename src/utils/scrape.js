/** @param {NS} ns */
export async function main(ns) {
    let homeFiles = ns.ls("home").filter((file) => file.includes("files/")).map((file) => file.split("/").pop());
    let newFiles = [];
    let js = [];

    let visited = [];
    let neighbors = ["home"];
    while (neighbors.length != 0) {
        let host = neighbors.pop();
        if (!visited.includes(host)) {
            visited.push(host);
            for (let file of ns.ls(host)) {
                if (!homeFiles.includes(file) && !newFiles.includes(file) && host != "home" && !file.startsWith("contract")) {
                    if (file.endsWith(".js") && !js.includes(file)) {
                        ns.tprint(`Found ${file}`);
                        js.push(file);
                        continue;
                    }
                    newFiles.push(file);
                    ns.scp(file, "home", host);
                }
            }

            neighbors = neighbors.concat(ns.scan(host));
        }
    }

    ns.tprint(`SCP'd ${newFiles.length} new files:
    ${newFiles}`);
}