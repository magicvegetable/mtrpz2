'use strict';

const italics = '((?<=\\s|^)(_.*?_)(?=\\s|$))';
const bold = '(\\*{2}.*?\\*{2})';
const preformatted = '(`{3}(.|\\n)*?`{3})';
const monospaced = '(`.*?(?<!`)`(?!`{1,2}))';

const all = [italics, bold, preformatted, monospaced];

const regexp = new RegExp(all.join('|'), 'gm');

export default regexp;

