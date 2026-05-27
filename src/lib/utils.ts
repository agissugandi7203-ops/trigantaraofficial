/**
 * Automatically formats plain text or basic markdown-like syntax into styled HTML tags.
 * If the input already contains HTML tags, it returns the content unchanged.
 */
export function autoFormatHtml(content: string): string {
  if (!content) return '';
  
  // Check if content already contains typical HTML tags to prevent double formatting
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  if (hasHtml) return content;
  
  // Normalize line endings
  let text = content.replace(/\r\n/g, '\n').trim();
  
  // Split into paragraphs by double newlines
  const blocks = text.split(/\n\n+/);
  
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    
    // Convert headers: ###, ##, #
    if (trimmed.startsWith('### ')) {
      return `<h3 class="text-lg font-bold font-serif text-zinc-900 mt-6 mb-2">${trimmed.slice(4)}</h3>`;
    }
    if (trimmed.startsWith('## ')) {
      return `<h2 class="text-xl font-bold font-serif text-zinc-900 mt-8 mb-3 pb-1 border-b border-zinc-100">${trimmed.slice(3)}</h2>`;
    }
    if (trimmed.startsWith('# ')) {
      return `<h1 class="text-2xl font-bold font-serif text-zinc-900 mt-10 mb-4">${trimmed.slice(2)}</h1>`;
    }
    
    // Convert unordered lists: - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split(/\n/);
      const listItems = items.map(item => {
        const itemContent = item.replace(/^[-*]\s+/, '').trim();
        return `<li class="my-1.5 list-disc ml-5 text-zinc-700">${itemContent}</li>`;
      }).join('');
      return `<ul class="my-4 space-y-1">${listItems}</ul>`;
    }
    
    // Convert numbered lists: 1., 2.
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split(/\n/);
      const listItems = items.map(item => {
        const itemContent = item.replace(/^\d+\.\s+/, '').trim();
        return `<li class="my-1.5 list-decimal ml-5 text-zinc-700">${itemContent}</li>`;
      }).join('');
      return `<ol class="my-4 space-y-1">${listItems}</ol>`;
    }
    
    // Standard paragraph: Convert single newlines to <br />
    let paragraphContent = trimmed.replace(/\n/g, '<br />');
    
    // Bold markup: **text** -> <strong>text</strong>
    paragraphContent = paragraphContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return `<p class="text-zinc-700 leading-relaxed my-3">${paragraphContent}</p>`;
  });
  
  return formattedBlocks.filter(b => b).join('\n');
}
