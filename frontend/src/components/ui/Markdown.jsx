import ReactMarkdown from 'react-markdown'

/**
 * Render markdown dari AI feedback dengan gaya yang menyatu ke design system.
 * react-markdown meneruskan prop `node` (passNode) ke tiap komponen; kita buang
 * agar tidak bocor sebagai atribut DOM yang memicu warning React.
 */
function el(Tag, className) {
  return function MarkdownEl({ ...props }) {
    delete props.node
    return <Tag className={className} {...props} />
  }
}

const components = {
  p: el('p', 'mb-2 leading-relaxed last:mb-0'),
  ul: el('ul', 'mb-2 list-disc space-y-1 pl-5 last:mb-0'),
  ol: el('ol', 'mb-2 list-decimal space-y-1 pl-5 last:mb-0'),
  li: el('li', ''),
  strong: el('strong', 'font-semibold text-ink'),
  em: el('em', 'italic'),
  code: el('code', 'rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-ink'),
  h1: el('h3', 'mb-2 font-display text-base font-semibold text-ink'),
  h2: el('h3', 'mb-2 font-display text-base font-semibold text-ink'),
  h3: el('h3', 'mb-2 font-display text-sm font-semibold text-ink'),
  a: el('a', 'text-primary-deep underline'),
}

export default function Markdown({ children, className = '' }) {
  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      <ReactMarkdown components={components}>{children ?? ''}</ReactMarkdown>
    </div>
  )
}
