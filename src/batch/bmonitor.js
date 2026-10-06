/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 1 && ns.args.length != 2) {
        ns.tprint(`Usage: run bmonitor.js <target> <?maxBatches>`);
        ns.exit();
    }
    const port = ns.getPortHandle(ns.pid);
    port.clear();

    const target = ns.args[0];
    let maxBatches = -1;
    if (ns.args.length == 2) {
        maxBatches = ns.args[1];
    }

    ns.kill("/batch/bmonitor.js", "home", 1, target);

    ns.tprint(`Monitor script for ${target} is online`)

    let lastTimeCompleted = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await port.nextWrite();
        const data = JSON.parse(port.read());
        ns.print(data);
        if (data.timeDiff >= 19 || data.timeDiff <= -1) {
            ns.tprint(`Warning: ${data.name}${(data.name == "weaken") ? ":"+data.endOfBatch : ""} thread in batch ${data.batchNum} had bigger time difference than expected: ${data.timeDiff}`)
        }
        if (data.timeCompleted < lastTimeCompleted) {
            ns.tprint(`Warning: ${data.name}${(data.name == "weaken") ? ":"+data.endOfBatch : ""} thread in batch ${data.batchNum} happened too fast`)
        }
        if (data.name == "weaken" && data.endOfBatch) {
            const moneyDiff = ns.getServerMaxMoney(target) - ns.getServerMoneyAvailable(target);
            const secDiff = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
            if (moneyDiff != 0 && secDiff != 0) {
                ns.tprint(`Warning: batch ${data.batchNum} caused difference in money/security: money difference ${moneyDiff} security difference ${secDiff}`);
            } 
            if (data.batchNum == maxBatches) {
                ns.tprint(`Finished final batch of ${maxBatches} batches, exiting`);
                break;
            }
        }
    }
}