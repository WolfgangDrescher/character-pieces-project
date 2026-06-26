import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
// import { meterWeights } from '../app/utils/meter-weights.js';
import { getIdFromFilename, getFiles } from './utils.mjs';
import { getBeatWeight } from './meter-weights.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = [
    // 'faure-dolly-suite',
    // 'tchaikovsky-childrens-album',
    // 'tchaikovsky-the-seasons',
    // 'schumann-album-fuer-die-jugend',
    // 'debussy-childrens-corner',
    // 'schumann-kinderszenen',
    'chaminade-album-des-enfants',
].map(repo => [repo, join(__dirname, '..', 'corpus', repo, 'kern')]);

const dataFile = `${__dirname}/../content/specials.yaml`;
const result = [];


pathToKernScores.forEach(([repo, path]) => {
    
    
    getFiles(path).splice(10,1).forEach((file) => {

        const slug = getIdFromFilename(file);
        const uid = `${repo}-${getIdFromFilename(file)}`;
        console.log(uid);

        // const cmd = `cat ${file} | lnnr -p | extractxx -k$ | extractxx -I '**dynam' | ridxx -LGTMd | mint -d | ridxx -I`;

        const baseFile = execSync(`cat ${file} | extractxx -k$ | lnnr -p | /Users/wolfgang/mhfreiburg/humlib-dev/bin/composite -F`).toString().trim();
        const otherCmd = `meter -tLr `;
        const mintCmd = `mint -d`;
        // const stdout = execSync(cmd).toString().trim();

        const otherOuput= execSync(otherCmd, {input: baseFile}).toString().trim();
        const mintOutput = execSync(mintCmd, {input: baseFile}).toString().trim();

        const otherArray = otherOuput.split('\n');
        const mintArray = mintOutput.split('\n');
        const resultArray = [];
        console.log(otherOuput);
        console.log(mintOutput);
        if (otherArray.length !== mintArray.length) {
            throw new Error('mintCmd output does not equal othersCmd output')
        }

        for (let i = 0; i < otherArray.length; i++) {
            const otherLine = otherArray[i];
            if (otherLine.startsWith('!') || otherLine.startsWith('*') || otherLine.startsWith('=')) {
                continue;
            }
            const otherTokens = otherArray[i].split('\t');
            const mintTokens = mintArray[i].split('\t');
            // console.log(otherTokens)
            // console.log(mintTokens)
            // console.log('')

            const mint = mintTokens[2].split(' ').at(-1);
            const lineToken = otherTokens[4];

            if (lineToken === '.') continue;

            resultArray.push({
                lineToken: lineToken,
                lnnr: mintTokens[1],
                mint: mint,
                beat: otherTokens[1],
                timeSig: otherTokens[2],
                meterWeight: getBeatWeight(otherTokens[2], otherTokens[1]),
            });
        }

        console.log('========');
        // console.log(resultArray);
        

        // const mintArray = stdout.split('\n');

        // console.log(mintArray)
        for (let i = 0; i < resultArray.length; i++) {
            const currentElem = resultArray[i];
            const nextElem = resultArray[i+1];
            const overnextElem = resultArray[i+2]; // lol

            if (!currentElem || !nextElem || !overnextElem) continue;

            const currentMint = currentElem.mint;
            const nextMint = nextElem.mint;

            // subsumtio
            // if (nextElem === '-3' && overnextElem === '+2') {
            //     console.log('subsumtio', currentElem.lnnr);
            // }
            // superjectio
            if (nextElem === '+3' && overnextElem === '-2') {
                // wenn nextElem = strong && currentElem = (weak || none)
                // Achtung im 3/4 Takt, wenn superjectio erst im nächsten Takt auflöst
                console.log('superjectio', currentElem.lnnr);
            }
            // Wechselnote abwärts
            // if (nextElem === '+2' && overnextElem === '-2') {
            //     console.log('Wechselnote abwärts', currentElem.lnnr);
            // }
            // Wechselnote aufwärts
            // if (nextElem === '-2' && overnextElem === '+2') {
            //     console.log('Wechselnote aufwärts', currentElem.lnnr);
            // }
            // todo probleme mit akkorden lösen
            // todo meter weight
            // todo wo ist die stelle (beatx?, '4/3.75')
/*
superjectio:
    -
            uid: chaminade-album-des-enfants-vol1-11-air_de_ballet
            start: '4/3.75'
            meterWeight: 1/2/3
subsumtio:
    -
            uid: chaminade-album-des-enfants-vol1-11-air_de_ballet
            start: '4/3.75'
            meterWeight: 1/2/3
*/
        }
    
    });
});

fs.writeFileSync(dataFile, yaml.dump({specials: result}, {
    indent: 4,
    lineWidth: -1,
    sortKeys: true,
    flowLevel: 2,
}));
