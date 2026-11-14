const marker = /^\[!(NOTE|TIP|WARNING|STEPS|TIMELINE|TABLE|CHART)\](?:\s+([^\n]+))?$/;

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
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
