'use strict';

const italics = '((?<=\\s|^)(_.*?_)(?=\\s|$))';
const bold = '(\\*{2}.*?\\*{2})';
const preformated = '(`{3}(.|\\n)*?`{3})';
const monospaced = '(`.*?(?<!`)`(?!`{1,2}))';

const all = [italics, bold, preformated, monospaced];

const regexp = new RegExp(all.join('|'), 'gm');

export default regexp;

