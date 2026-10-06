/** @param {NS} ns */
/*
Deploys hack/weaken/grow threads in batches so that executions are within 20 ms
Calls prep.js to prepare the target
Creates bhack.js 
*/

const PREP_SCRIPT = "/utils/prep.js";
const MONITOR_SCRIPT = "/batch/bmonitor.js"
const GROW_SCRIPT = "/batch/bgrow.js"
const HACK_SCRIPT = "/batch/bhack.js"
const WEAKEN_SCRIPT = "/batch/bweaken.js"
const HACK_THREADS = 50;
const WEAKEN_THREADS = 2;
const GROW_THREADS = 25
const DELAY = 5;
const HOME = "home";
const MAX_BATCHES = 50;

export async function main(ns) {
    if (ns.args.length != 1) {
        ns.tprint("Usage: run batch.js <target>");
        ns.exit();
    }
    const target = ns.args[0];

    // check if target is prepped, if not run a prep script and wait for success
    if (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target)
            || ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        ns.tprint("target needs to be prepped");
        const prepPort = ns.getPortHandle(ns.pid);
        prepPort.clear();
        ns.exec(PREP_SCRIPT, HOME, 1, target, HOME, ns.pid);
        await prepPort.nextWrite();
        const success = prepPort.read();
        if (success != "true") {
            ns.tprint(`prep failed, received response ${success}`);
            ns.exit();
        }
    }

    ns.tprint(`${target} is at min security and max money`);

    const monitorPortNum = ns.exec(MONITOR_SCRIPT, HOME, 1, target, MAX_BATCHES);

    const hackTime = ns.getHackTime(target);
    const weakenTime = 4*hackTime;
    const growTime = 3.2*hackTime;

    let endTime = Date.now() + weakenTime + 20;
    const firstResponseTime = endTime;

    // const maxMoney = ns.getServerMaxMoney(target)
    // const stolenMoneyPercentage = 50*ns.hackAnalyze(target); 
    // const stolenMoney = stolenMoneyPercentage * maxMoney; // percentage of money we want to steal per batch
    // const remaining = maxMoney - stolenMoney;
    // const mult = maxMoney / remaining;

    const hackSec = ns.hackAnalyzeSecurity(HACK_THREADS, target);
    const growSec = ns.growthAnalyzeSecurity(GROW_THREADS, target);
    const weakenSec = ns.weakenAnalyze(WEAKEN_THREADS);
    ns.tprint(`Hack analyze: ${hackSec}; grow analyze: ${growSec}, weaken analyze: ${weakenSec}`);

    // testing: running 5 batches
    let n = 1;
    ns.tprint(`Executing ${MAX_BATCHES} batches`);
    while (n <= MAX_BATCHES) {
        ns.exec(HACK_SCRIPT,    HOME, HACK_THREADS,     target, endTime,            hackTime,   monitorPortNum, n);
        ns.exec(WEAKEN_SCRIPT,  HOME, WEAKEN_THREADS,   target, endTime + DELAY,    weakenTime, monitorPortNum, n);
        ns.exec(GROW_SCRIPT,    HOME, GROW_THREADS,     target, endTime + DELAY*2,  growTime,   monitorPortNum, n);
        ns.exec(WEAKEN_SCRIPT,  HOME, WEAKEN_THREADS,   target, endTime + DELAY*3,  weakenTime, monitorPortNum, n, true);
        endTime += 20;
        n++;
    }
    
    ns.tprint(`Expecting first response in ${(firstResponseTime - Date.now())/1000} sec`);
}