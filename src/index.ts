function timeline() {
  type Item = {
    elm: HTMLLIElement, level: number, height: number
  }
  const timelineRoot = document.getElementById('timeline')!
  const items: Item[] = []
  let maxLevel = 0
  for (const elm of timelineRoot.querySelectorAll('li').values()) {
    const level = parseInt(elm.dataset.level || '0')
    if (maxLevel < level) maxLevel = level
    items.push({
      elm, level,
      height: elm.clientHeight
    })
  }
  document.addEventListener('scroll', (_e) => {
    // 表示領域高さを取得
    const viewHeight = 100
    let itemsHeight = 0
    for (let i = maxLevel; i >= 0; --i) {
      items.filter(x => x.level == i).forEach(x => itemsHeight += x.height)
      if (viewHeight < itemsHeight) return i
    }
  })
}
function getTagFromHash(): string | null {
  const hash = globalThis.location.hash;
  const match = hash.match(/tag=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
function filterByTag() {
  const tag = getTagFromHash();
  for (const yearBlock of document.querySelectorAll<HTMLElement>('.year')) {
    let hasElem = false
    for (const elm of yearBlock.querySelectorAll('li')) {
      if (tag && !elm.dataset.tags?.includes(tag)) {
        elm.style.display = 'none';
      } else {
        elm.style.display = 'block';
        hasElem = true;
      }
    }
    yearBlock.style.display = hasElem ? 'block' : 'none';
  }
}
addEventListener('hashchange', filterByTag);
// addEventListener('popstage', filterByTag);
