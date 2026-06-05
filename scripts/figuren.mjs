import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
// import { meterWeights } from '../app/utils/meter-weights.js';
import { getIdFromFilename, getFiles } from './utils.mjs';

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

        const cmd = `cat ${file} | extractxx -k$ | extractxx -I '**dynam' | ridxx -LGTMd | mint -d | ridxx -I`;
        const stdout = execSync(cmd).toString().trim();
        const mintArray = stdout.split('\n');
        console.log(mintArray)
        for (let i = 0; i < mintArray.length; i++) {
            const currentMint = mintArray[i];
            const nextMint = mintArray[i+1];
            // subsumtio
            if (currentMint === '-3' && nextMint === '+2') {
                console.log('subsumtio', i);
            }
            // subsumtio
            if (currentMint === '+3' && nextMint === '-2') {
                console.log('superjectio', i);
            }
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
