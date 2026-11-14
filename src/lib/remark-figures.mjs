import { toString } from 'mdast-util-to-string';

const marker = /^\[!(NOTE|TIP|WARNING|STEPS|TIMELINE|TABLE|CHART|QUOTE|TERMINAL|CHANGELOG|DECISION|CHAT|ENV|ENDPOINT|KEYS|FAQ|FLOW|TREE|BOARD|STAT|SPEC|CHECK|DIFF|COMPARE|RANK|METER|SPARK|WAFFLE)\](?:\s+([^\n]+))?$/;

function glyphs(value) {
  return { type: 'html', value: `<span class="article-figure__bar" aria-hidden="true">${value}</span>` };
}

function bar(value, max) {
  const filled = max ? Math.round(value / max * 20) : 0;
  return glyphs(`${'█'.repeat(filled)}${'░'.repeat(20 - filled)}`);
}

function addBars(node, kind) {
  if (kind === 'rank') {
    const list = node.children.find((child) => child.type === 'list');
    const rows = list?.children.map((item) => {
      const paragraph = item.children[0];
      const match = paragraph?.type === 'paragraph' && toString(paragraph).match(/:\s*(\d+(?:\.\d+)?)\s*$/);
      const value = match && Number(match[1]);
      return match && Number.isFinite(value) ? { paragraph, value } : null;
    });
    if (!rows?.length || rows.some((row) => !row)) return;
    const max = Math.max(...rows.map((row) => row.value));
    rows.forEach(({ paragraph, value }) => paragraph.children.push(bar(value, max)));
  }
  if (kind === 'meter' || kind === 'waffle') {
    const paragraph = node.children[1];
    const match = paragraph?.type === 'paragraph' && toString(paragraph).match(/^(\d+(?:\.\d+)?)%/);
    const value = match && Number(match[1]);
    if (match && Number.isFinite(value) && value <= 100) {
      if (kind === 'meter') paragraph.children.push(bar(value, 100));
      else {
        const filled = Math.round(value);
        const cells = `${'█'.repeat(filled)}${'░'.repeat(100 - filled)}`;
        paragraph.children.push(glyphs(cells.match(/.{10}/g).join('\n')));
      }
    }
  }
  if (kind === 'spark') {
    const paragraph = node.children[1];
    const text = paragraph?.type === 'paragraph' && toString(paragraph).trim();
    if (!text || !/^\d+(?:\.\d+)?(?:\s+\d+(?:\.\d+)?)*$/.test(text)) return;
    const values = text.split(/\s+/).map(Number);
    if (values.some((value) => !Number.isFinite(value))) return;
    const min = Math.min(...values), max = Math.max(...values);
    const levels = '▁▂▃▄▅▆▇█';
    paragraph.children.push(glyphs(values.map((value) => levels[max === min ? 0 : Math.floor((value - min) / (max - min) * 7)]).join('')));
  }
}

export default function remarkFigures() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'blockquote') {
        const label = node.children[0];
        const text = label?.type === 'paragraph' && label.children.length === 1 && label.children[0].type === 'text' && label.children[0];
        const match = text && marker.exec(text.value);
        if (match) {
          const kind = match[1].toLowerCase();
          node.data = { hName: 'section', hProperties: { className: ['article-figure', `article-figure--${kind}`] } };
          label.data = { hProperties: { className: ['article-figure__label'] } };
          text.value = match[2] || kind;
          addBars(node, kind);
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
