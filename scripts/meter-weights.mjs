export const meterWeights = [
    {
        meter: '2/2',
        basis: 4,
        beats: [
            ['1', 'strong'],
            ['1+1/2', 'weak'],
            ['2', 'half-strong'],
            ['2+1/2', 'weak'],
        ],
    },
    {
        meter: '3/2',
        basis: 2,
        beats: [
            ['1', 'strong'],
            ['2', 'weak'],
            ['3', 'weak'],
        ],
    },
    {
        meter: '3/4',
        basis: 4,
        beats: [
            ['1', 'strong'],
            ['2', 'weak'],
            ['3', 'weak'],
        ],
    },
    {
        meter: '4/4',
        basis: 4,
        beats: [
            ['1', 'strong'],
            ['2', 'weak'],
            ['3', 'half-strong'],
            ['4', 'weak'],
        ],
    },
    {
        meter: '6/4',
        basis: 4,
        beats: [
            ['1', 'strong'],
            ['2', 'weak'],
            ['3', 'weak'],
            ['4', 'half-strong'],
            ['5', 'weak'],
            ['6', 'weak'],
        ],
    },
    {
        meter: '3/8',
        basis: 8,
        beats: [
            ['1', 'strong'],
            ['2', 'weak'],
            ['3', 'weak'],
        ],
    },
    {
        meter: '6/8',
        basis: 8,
        beats: [
            ['1', 'strong'],
            ['1+1/3', 'weak'],
            ['1+2/3', 'weak'],
            ['2', 'half-strong'],
            ['2+1/3', 'weak'],
            ['2+2/3', 'weak'],
        ],
    },
    {
        meter: '12/8',
        basis: 8,
        beats: [
            ['1', 'strong'],
            ['1+1/3', 'weak'],
            ['1+2/3', 'weak'],
            ['2', 'half-strong'],
            ['2+1/3', 'weak'],
            ['2+2/3', 'weak'],
            ['3', 'strong'],
            ['3+1/3', 'weak'],
            ['3+2/3', 'weak'],
            ['4', 'half-strong'],
            ['4+1/3', 'weak'],
            ['4+2/3', 'weak'],
        ],
    },
];

export function getBeatWeight(tsig, beat) {
    if (!tsig) return 'error';
    if (beat === '.') return '.';

    const meterDef = meterWeights.find(m => m.meter === tsig);
    if (!meterDef) return 'none';

    const beatDef = meterDef.beats.find(b => b[0] === beat);
    if (!beatDef) return 'none';

    return beatDef[1];
}