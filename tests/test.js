'use strict';

import test from 'node:test';
import assert from 'node:assert';

import process from 'node:process';
import fs from 'node:fs';

import run from '../main.js';

const describe = test.describe;
const it = test.it;

const start_args = process.argv.slice(0, 2);

const compare = (file1, file2) => {
    const content1 = fs.readFileSync(file1, 'utf8');
    const content2 = fs.readFileSync(file2, 'utf8');
    assert.strictEqual(content1, content2);
};

const test_dir = start_args[1].slice(0, start_args[1].lastIndexOf('/') + 1);

process.chdir(test_dir);

try {
    fs.mkdirSync('results/');
} catch (e) {
    const errno = e.errno;
    if (errno !== -17) { // -17 -> already exists
        console.error(e);
        process.exit(-1);
    }
}

const io_names = [
    'void',
    'bold',
    'italics',
    'preformatted',
    'monospaced',
    'bold-italics',
    'monospaced-preformatted',
    'bold-italics-monospaced-preformatted'
];

describe('simple html tests', () => {
    for (const name of io_names) {
        it(name, () => {
            const file = `results/${name}.html`;
            const args = [...start_args, `input/${name}.md`, '--out', file];
            run(args);
            compare(file, `output/${name}.html`);
        });
    }
});

describe('simple ansi tests', () => {
    for (const name of io_names) {
        it(name, () => {
            const file = `results/${name}.ansi`;
            const args = [...start_args, `input/${name}.md`, '--out', file, '--format'];
            run(args);
            compare(file, `output/${name}.ansi`);
        });
    }
});
