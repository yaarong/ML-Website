/* ============================================================
   ML Study Hub — shared site JS
   - reveal-on-scroll
   - True/False quiz widget renderer
   ============================================================ */

/* ---------- reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(e => io.observe(e));
}

/* ---------- True/False quiz ----------
   Usage: TFQuiz.render('#tfmount', [{q, a:true|false, e:'explanation'}, ...])
*/
const TFQuiz = {
  render(sel, items) {
    const mount = document.querySelector(sel);
    if (!mount) return;
    let answered = 0, correct = 0;
    const total = items.length;

    const head = document.createElement('div');
    head.innerHTML = `<h2>🧠 שאלות נכון / לא נכון</h2>
      <p class="sub">בחנו את עצמכם — ${total} טענות מאתגרות. בחרו "נכון" או "לא נכון" וקבלו הסבר מיד.</p>`;
    mount.appendChild(head);

    const scoreEl = document.createElement('div');
    scoreEl.className = 'tf-score';
    scoreEl.textContent = `התקדמות: 0 / ${total}`;

    items.forEach((it, i) => {
      const box = document.createElement('div');
      box.className = 'tf-item';
      box.innerHTML = `
        <div class="q"><span class="qn">${i + 1}</span>${it.q}</div>
        <div class="tf-btns">
          <button data-v="true">✔ נכון</button>
          <button data-v="false">✘ לא נכון</button>
        </div>
        <div class="tf-exp"></div>`;
      const [btnT, btnF] = box.querySelectorAll('button');
      const exp = box.querySelector('.tf-exp');

      function choose(val, btn) {
        [btnT, btnF].forEach(b => b.disabled = true);
        const isRight = (val === it.a);
        answered++; if (isRight) correct++;
        btn.classList.add(val ? 'sel-true' : 'sel-false');
        exp.classList.add('show', isRight ? 'ok' : 'no');
        const truth = it.a ? 'נכון' : 'לא נכון';
        exp.innerHTML = `<span class="verdict">${isRight ? '✔ צדקת!' : '✘ טעות.'} התשובה הנכונה: ${truth}.</span><br>${it.e}`;
        scoreEl.textContent = `התקדמות: ${answered} / ${total} — נכונות: ${correct}`;
        if (answered === total) {
          const pct = Math.round(correct / total * 100);
          scoreEl.textContent = `סיימת! ${correct} / ${total} תשובות נכונות (${pct}%) ` +
            (pct >= 85 ? '🏆 מצוין!' : pct >= 60 ? '👍 יפה, כדאי לחזור על הנקודות שפספסת.' : '📚 שווה לחזור על הנושא.');
        }
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([exp]);
      }
      btnT.addEventListener('click', () => choose(true, btnT));
      btnF.addEventListener('click', () => choose(false, btnF));
      mount.appendChild(box);
    });
    mount.appendChild(scoreEl);
    if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([mount]);
  }
};

document.addEventListener('DOMContentLoaded', initReveal);
