function cpFmt(t) {
  if (isNaN(t)) return '0:00';
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.custom-player').forEach(wrapper => {
    const vid = wrapper.querySelector('video');
    const playIcon = wrapper.querySelector('.play-icon');
    const pauseIcon = wrapper.querySelector('.pause-icon');
    const progFilled = wrapper.querySelector('.prog-filled');
    const timeEl = wrapper.querySelector('.cp-time');

    vid.addEventListener('click', (e) => { e.stopPropagation(); if (vid.paused) vid.play(); else vid.pause(); });
    vid.addEventListener('play', () => { wrapper.classList.remove('paused'); playIcon.classList.add('hidden'); pauseIcon.classList.remove('hidden'); });
    vid.addEventListener('pause', () => { wrapper.classList.add('paused'); playIcon.classList.remove('hidden'); pauseIcon.classList.add('hidden'); });
    vid.addEventListener('timeupdate', () => {
      if (vid.duration) {
        progFilled.style.width = (vid.currentTime / vid.duration * 100) + '%';
        timeEl.textContent = cpFmt(vid.currentTime) + ' / ' + cpFmt(vid.duration);
      }
    });
    vid.addEventListener('loadedmetadata', () => { timeEl.textContent = '0:00 / ' + cpFmt(vid.duration); });
    vid.addEventListener('ended', () => { vid.currentTime = 0; vid.pause(); });

    const progBar = wrapper.querySelector('.prog-bar');
    const hoverTip = wrapper.querySelector('.prog-hover-tip');
    progBar.addEventListener('mousemove', (e) => {
      const rect = progBar.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      hoverTip.textContent = cpFmt(pos * (vid.duration || 0));
      hoverTip.style.left = (pos * 100) + '%';
      hoverTip.style.opacity = '1';
    });
    progBar.addEventListener('mouseleave', () => { hoverTip.style.opacity = '0'; });

    const volGroup = wrapper.querySelector('.cp-vol-group');
    const volPopup = wrapper.querySelector('.cp-vol-popup');
    let volTimer;
    volGroup.addEventListener('mouseenter', () => { clearTimeout(volTimer); volPopup.classList.add('show'); });
    volGroup.addEventListener('mouseleave', () => { volTimer = setTimeout(() => volPopup.classList.remove('show'), 300); });

    document.addEventListener('click', () => {
      wrapper.querySelectorAll('.cp-speed-popup.show, .cp-quality-popup.show').forEach(p => p.classList.remove('show'));
    });

    let hideT;
    wrapper.addEventListener('mousemove', () => {
      wrapper.querySelector('.player-controls').style.opacity = '1';
      clearTimeout(hideT);
      hideT = setTimeout(() => { if (!vid.paused) wrapper.querySelector('.player-controls').style.opacity = '0'; }, 2500);
    });
  });
});

function cpTogglePlay(el) {
  const w = el.closest('.custom-player');
  const v = w.querySelector('video');
  if (v.paused) v.play(); else v.pause();
}
function cpToggleMute(btn) {
  const w = btn.closest('.custom-player');
  const v = w.querySelector('video');
  v.muted = !v.muted;
  w.querySelector('.cp-vol-icon').classList.toggle('hidden', v.muted);
  w.querySelector('.cp-mute-icon').classList.toggle('hidden', !v.muted);
  const val = v.muted ? 0 : v.volume;
  w.querySelector('.cp-vol-slider').value = val;
  w.querySelector('.cp-vol-pct').textContent = Math.round(val * 100) + '%';
  w.querySelector('.cp-vol-slider').style.setProperty('--vf', (val * 100) + '%');
}
function cpVolChange(slider) {
  const w = slider.closest('.custom-player');
  const v = w.querySelector('video');
  const val = parseFloat(slider.value);
  v.volume = val; v.muted = val === 0;
  w.querySelector('.cp-vol-icon').classList.toggle('hidden', val === 0);
  w.querySelector('.cp-mute-icon').classList.toggle('hidden', val > 0);
  w.querySelector('.cp-vol-pct').textContent = Math.round(val * 100) + '%';
  slider.style.setProperty('--vf', (val * 100) + '%');
}
function cpToggleSpeed(btn) {
  event.stopPropagation();
  btn.closest('.custom-player').querySelectorAll('.cp-quality-popup.show').forEach(p => p.classList.remove('show'));
  btn.closest('.cp-speed-group').querySelector('.cp-speed-popup').classList.toggle('show');
}
function cpToggleQuality(btn) {
  event.stopPropagation();
  btn.closest('.custom-player').querySelectorAll('.cp-speed-popup.show').forEach(p => p.classList.remove('show'));
  btn.closest('.cp-quality-group').querySelector('.cp-quality-popup').classList.toggle('show');
}
function cpSetSpeed(opt) {
  event.stopPropagation();
  const w = opt.closest('.custom-player');
  const rate = parseFloat(opt.dataset.speed);
  w.querySelector('video').playbackRate = rate;
  w.querySelector('.cp-speed-btn span').textContent = rate === 1 ? '1x' : rate + 'x';
  w.querySelectorAll('.cp-speed-opt').forEach(o => o.classList.remove('active'));
  opt.classList.add('active');
  opt.closest('.cp-speed-popup').classList.remove('show');
}
function cpSetQuality(opt) {
  event.stopPropagation();
  const w = opt.closest('.custom-player');
  w.querySelectorAll('.cp-quality-opt').forEach(o => o.classList.remove('active'));
  opt.classList.add('active');
  opt.closest('.cp-quality-popup').classList.remove('show');
}
function cpSeekStart(e, bar) {
  e.stopPropagation();
  const v = bar.closest('.custom-player').querySelector('video');
  const doSeek = (ev) => {
    const rect = bar.getBoundingClientRect();
    v.currentTime = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)) * v.duration;
  };
  doSeek(e);
  const onMove = (ev) => doSeek(ev);
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
}
function cpFullscreen(btn) {
  const w = btn.closest('.custom-player');
  if (!document.fullscreenElement) w.requestFullscreen?.() || w.webkitRequestFullscreen?.();
  else document.exitFullscreen?.() || document.webkitExitFullscreen?.();
}
