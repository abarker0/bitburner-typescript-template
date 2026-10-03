/** @param {NS} ns */
export async function main(ns) {
    const targets = ns.args;
    ns.tprint(`Analyzing ${targets[0]}:
    Growth security increase: ${ns.growthAnalyzeSecurity(1, targets[0])}
    Growth time: ${ns.getGrowTime(targets[0])}
    Hack chance: ${ns.hackAnalyzeChance(targets[0])}
    Hack security increase: ${ns.hackAnalyzeSecurity(1, targets[0])}
    Hack time: ${ns.getHackTime(targets[0])}
    Weaken security decrease: ${ns.weakenAnalyze(1)}
    Weaken time: ${ns.getWeakenTime(targets[0])}
    `);
}