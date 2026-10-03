/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1) {
        ns.tprint("Missing ram per server");
        ns.exit();
    }
    const ram = ns.args[0];

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    const answer = await ns.prompt(`Cost for ${ram} GB server is ${ns.cloud.getServerCost(ram)} (max is ${ns.cloud.getRamLimit()}). Continue?`);
    if (!answer) {
        ns.exit();
    }

    // rename existing servers
    const servers = ns.cloud.getServerNames();
    for (let i = 0; i < servers.length; i++) {
        const serverName = "pserv-"+i;
        ns.cloud.renameServer(servers[i], serverName);
        if (ns.getServerMaxRam(serverName) < ram) {
            ns.cloud.upgradeServer(serverName, ram);
            ns.tprint(`Upgraded ${serverName} to ${ram} GB ram`);
        }
    }

    let i = servers.length;

    while (i < ns.cloud.getServerLimit()) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.cloud.getServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            let hostname = ns.cloud.purchaseServer("pserv-" + i, ram);
            ++i;
        }
        //Make the script wait for a second before looping again.
        //Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(10000);
    }
    ns.tprint("Reached server purchase limit");
}