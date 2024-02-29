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

test('--out & -o options', () => {
    const options = ['-o', '--out'];
    const name = 'empty';
    const empty_file = `input/${name}.md`
    for (const option of options) {
        const file = `results/${name}${option}`;
        const args = [...start_args, empty_file, option, file];
        run(args);
        compare(file, empty_file);
    }
});

test('--format & -f & --format=value options', () => {
    const options = ['-f', '--format'];
    const name = 'format';
    const ansi_file = `output/${name}.ansi`
    const md_file = `input/${name}.md`;
    for (const option of options) {
        const file = `results/${name}${option}.ansi`;
        const args = [...start_args, md_file, '--out', file, option];
        run(args);
        compare(file, ansi_file);
    }

    const values = ['ansi', 'html'];
    const check_files = {
        ansi: ansi_file,
        html: `output/${name}.html`
    };

    for (const value of values) {
        const file = `results/${name}.${value}`;
        const args = [...start_args, md_file, '--out', file, `--format=${value}`];
        run(args);
        compare(file, check_files[value]);
    }

    // default -> html
    const file = `results/${name}-default.html`;
    const args = [...start_args, md_file, '--out', file];
    run(args);
    compare(file, check_files['html']);
});

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

describe('simple html', () => {
    for (const name of io_names) {
        it(name, () => {
            const file = `results/${name}.html`;
            const args = [...start_args, `input/${name}.md`, '--out', file];
            run(args);
            compare(file, `output/${name}.html`);
        });
    }
});

describe('simple ansi', () => {
    for (const name of io_names) {
        it(name, () => {
            const file = `results/${name}.ansi`;
            const args = [...start_args, `input/${name}.md`, '--out', file, '--format'];
            run(args);
            compare(file, `output/${name}.ansi`);
        });
    }
});

const spec_names = ['bold', 'italics', 'monospaced', 'preformatted'];

const multi_test = (name, amount) => {
    for (const format of ['html', 'ansi']) {
        for (let i = 0; i < amount; i++) {
            it(`input/${name}/${i}.${format} to output/${name}/${i}.${format}`, () => {
                const file = `results/${name}/${i}.${format}`;
                const args = [...start_args, `input/${name}/${i}.md`, '--out', file, `--format=${format}`];
                run(args);
                compare(file, `output/${name}/${i}.${format}`);
            });
        }
    }
};

for (const name of spec_names) {
    describe(`specific ${name}`, () => {
        try {
            fs.mkdirSync(`results/${name}/`);
        } catch (e) {
            const errno = e.errno;
            if (errno !== -17) { // -17 -> already exists
                console.error(e);
                process.exit(-1);
            }
        }

        multi_test(name, 3);
    });
}

