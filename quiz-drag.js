/* The arrows remain available for keyboard and assistive technology users. */
function bindOrderDrag(container, question, render) {
  const list = container.querySelector('.olist');
  if (!list) return;
  let drag = null;
  let frame = 0;

  function autoScroll() {
    if (!drag) return;
    const edge = 70;
    const speed = drag.y < edge ? -Math.ceil((edge - drag.y) / 5) :
      drag.y > innerHeight - edge ? Math.ceil((drag.y - (innerHeight - edge)) / 5) : 0;
    if (speed) { window.scrollBy(0, speed); moveTo(drag.x, drag.y); }
    frame = requestAnimationFrame(autoScroll);
  }
  function moveTo(x, y) {
    if (!drag) return;
    drag.x = x; drag.y = y;
    const target = document.elementFromPoint(x, y)?.closest('.oitem[data-order-index]');
    if (!target || target.parentElement !== list) return;
    if (target === drag.item) {
      list.querySelectorAll('.drop-before, .drop-after').forEach(item => item.classList.remove('drop-before', 'drop-after'));
      drag.target = null;
      return;
    }
    const rect = target.getBoundingClientRect();
    list.querySelectorAll('.drop-before, .drop-after').forEach(item => item.classList.remove('drop-before', 'drop-after'));
    drag.target = target;
    drag.after = y >= rect.top + rect.height / 2;
    target.classList.add(drag.after ? 'drop-after' : 'drop-before');
  }
  list.addEventListener('pointerdown', event => {
    const handle = event.target.closest('[data-drag-handle]');
    if (!handle || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const item = handle.closest('.oitem');
    drag = { item, handle, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    item.classList.add('dragging');
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
    frame = requestAnimationFrame(autoScroll);
  });
  list.addEventListener('pointermove', event => {
    if (drag && event.pointerId === drag.pointerId) moveTo(event.clientX, event.clientY);
  });
  function finish(event, cancelled) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    cancelAnimationFrame(frame);
    const old = question.cur.slice();
    if (!cancelled && drag.target) {
      const from = +drag.item.dataset.orderIndex;
      let to = +drag.target.dataset.orderIndex + (drag.after ? 1 : 0);
      const [item] = old.splice(from, 1);
      if (from < to) to--;
      old.splice(to, 0, item);
      question.cur = old;
    }
    drag.item.classList.remove('dragging');
    drag = null;
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }
  list.addEventListener('pointerup', event => finish(event, false));
  list.addEventListener('pointercancel', event => finish(event, true));
  list.addEventListener('lostpointercapture', event => finish(event, true));
}
