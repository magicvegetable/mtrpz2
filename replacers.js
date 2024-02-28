'use strict';

const check_italics = text => {
    const exp = /((?<=\s|^)(_.*?\s_)(?=\s|$))/gm;
    const matches = text.match(exp) ?? [];
    for (const match of matches) {
        console.error(`Whitespace characters are not allowed before the closing underscore: ${match}`);
    }

    return !matches.length;
};

const replace = (tag, md, match) => {
    return `<${tag}>${match.substring(md.length, match.length - md.length)}</${tag}>`;
};

const italics = match => {
    const success = check_italics(match);

    if (!success) return [success, ''];
    
    const replaced = replace('i', '_', match);

    return [success, replaced];
};

const bold = match => {
    return [true, replace('b', '**', match)];
};

const preformated = match => {
    return [true, replace('pre', '```', match)];
};

const monospaced = match => {
    return [true, replace('tt', '`', match)];
};

const replacers = {
    preformated,
    monospaced,
    bold,
    italics
};

export default replacers;

