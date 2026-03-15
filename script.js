// ── CONFIG ──────────────────────────────────────────────
var WA_DEFAULT_NUM     = '27815648219';
var WA_DEFAULT_DISPLAY = '+27 81 564 8219';
var EM_DEFAULT_ADDR    = 'dylannfortune@gmail.com';
var EM_SUBJECT         = 'Website Enquiry — Fortune Consulting';

// Current modal state
var _waNum     = WA_DEFAULT_NUM;
var _waDisplay = WA_DEFAULT_DISPLAY;
var _waMsg     = '';
var _emAddr    = EM_DEFAULT_ADDR;

// ── WHATSAPP ─────────────────────────────────────────────
function openWaModal(msg, num, display) {
  _waNum     = num     || WA_DEFAULT_NUM;
  _waDisplay = display || WA_DEFAULT_DISPLAY;
  _waMsg     = msg     || "Hi, I found your website and I'd like to get in touch.";

  document.getElementById('wa-copy-display').textContent = _waDisplay;
  document.getElementById('wa-copy-btn').textContent = 'Copy';
  document.getElementById('wa-copy-btn').classList.remove('copied');

  openModal('wa-modal');
}

function forceWhatsApp() {
  var url  = 'https://wa.me/' + _waNum + '?text=' + encodeURIComponent(_waMsg);
  var deep = 'whatsapp://send?phone=' + _waNum + '&text=' + encodeURIComponent(_waMsg);

  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-1px;left:-1px;width:1px;height:1px;opacity:0;border:none;';
  document.body.appendChild(iframe);
  try { iframe.contentWindow.location.href = deep; } catch(e) {}

  setTimeout(function() {
    try { document.body.removeChild(iframe); } catch(e) {}
    window.open(url, '_blank', 'noopener,noreferrer');
  }, 1000);
}

function copyWaNum() {
  var raw = _waDisplay.replace(/\s/g, '');
  copyToClipboard(raw, document.getElementById('wa-copy-btn'));
}

// ── EMAIL ────────────────────────────────────────────────
function openEmModal(addr) {
  _emAddr = addr || EM_DEFAULT_ADDR;

  var subj = encodeURIComponent(EM_SUBJECT);
  var to   = encodeURIComponent(_emAddr);

  document.getElementById('gmail-btn').href
    = 'https://mail.google.com/mail/?view=cm&to=' + to + '&su=' + subj;
  document.getElementById('outlook-btn').href
    = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + to + '&subject=' + subj;

  document.getElementById('em-copy-display').textContent = _emAddr;
  document.getElementById('em-copy-btn').textContent = 'Copy';
  document.getElementById('em-copy-btn').classList.remove('copied');

  openModal('em-modal');
}

function tryMailto() {
  window.location.href = 'mailto:' + _emAddr + '?subject=' + encodeURIComponent(EM_SUBJECT);
}

function copyEmAddr() {
  copyToClipboard(_emAddr, document.getElementById('em-copy-btn'));
}

// ── MODAL HELPERS ────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function(m) {
      closeModal(m.id);
    });
  }
});

// ── CLIPBOARD ────────────────────────────────────────────
function copyToClipboard(text, btn) {
  function success() {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(success).catch(legacyCopy);
  } else {
    legacyCopy();
  }
  function legacyCopy() {
    var el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(el);
    el.focus();
    el.select();
    try { document.execCommand('copy'); success(); } catch(e) {}
    document.body.removeChild(el);
  }
}
