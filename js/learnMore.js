// Toggle between Navigation / Manipulation video rows in the GLUESTICK card.
// Supports click on either button AND drag/swipe on the active button.
(function setupVideoGalleryToggle() {
    function init() {
        document.querySelectorAll('.video-gallery').forEach(function (gallery) {
            var rows = gallery.querySelectorAll('.video-row');
            var toggle = gallery.querySelector('.video-toggle');
            var btns = gallery.querySelectorAll('.video-toggle__btn');
            var initial = gallery.getAttribute('data-active') || 'navigation';

            function activate(task, isInitial) {
                gallery.setAttribute('data-active', task);
                rows.forEach(function (row) {
                    var match = row.getAttribute('data-task') === task;
                    row.classList.toggle('is-active', match);
                    row.querySelectorAll('video').forEach(function (v) {
                        if (match) {
                            v.play().catch(function () { /* ignore autoplay reject */ });
                        } else {
                            v.pause();
                        }
                    });
                    // YouTube/iframe handling: load with autoplay when the row
                    // becomes active, unload (stopping playback) when inactive.
                    row.querySelectorAll('iframe').forEach(function (f) {
                        var base = f.getAttribute('data-src');
                        if (!base) return;
                        if (match) {
                            var sep = base.indexOf('?') >= 0 ? '&' : '?';
                            var wantSrc = base + sep + 'autoplay=1&mute=1';
                            if (f.src !== wantSrc) {
                                f.src = wantSrc;
                            }
                        } else {
                            f.removeAttribute('src');
                        }
                    });
                });
                btns.forEach(function (b) {
                    b.setAttribute('aria-selected', b.getAttribute('data-task') === task ? 'true' : 'false');
                });
                // Drop focus from whichever toggle button held it so no stale
                // browser focus highlight lingers after the switch.
                if (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('video-toggle__btn')) {
                    document.activeElement.blur();
                }
            }

            // --- Drag-to-switch ---
            var pointerId = null;
            var startX = 0;
            var didDrag = false;
            var DRAG_THRESHOLD = 25;   // px before we'll switch on release
            var MOVE_THRESHOLD = 5;    // px before we consider it a drag (vs a click)

            function getActive() { return toggle.querySelector('[aria-selected="true"]'); }

            toggle.addEventListener('pointerdown', function (e) {
                var active = getActive();
                if (!active) return;
                // Only initiate drag if the pointer started on the active button
                if (e.target.closest('.video-toggle__btn') !== active) return;
                pointerId = e.pointerId;
                startX = e.clientX;
                didDrag = false;
                toggle.classList.add('is-dragging');
                try { toggle.setPointerCapture(e.pointerId); } catch (err) {}
            });

            toggle.addEventListener('pointermove', function (e) {
                if (e.pointerId !== pointerId) return;
                var raw = e.clientX - startX;
                if (Math.abs(raw) > MOVE_THRESHOLD) didDrag = true;
                // Limit visual drag to roughly one button's worth of travel
                var maxDrag = toggle.offsetWidth / 2;
                var delta = Math.max(-maxDrag, Math.min(maxDrag, raw));
                var active = getActive();
                if (active) active.style.transform = 'translateX(' + delta + 'px)';
            });

            function endDrag(e) {
                if (e.pointerId !== pointerId) return;
                var delta = e.clientX - startX;
                var active = getActive();
                if (active) {
                    active.style.transform = '';
                }
                toggle.classList.remove('is-dragging');
                pointerId = null;

                if (didDrag && Math.abs(delta) > DRAG_THRESHOLD) {
                    var other = null;
                    btns.forEach(function (b) { if (b !== active) other = b; });
                    if (other) activate(other.getAttribute('data-task'));
                }
            }
            toggle.addEventListener('pointerup', endDrag);
            toggle.addEventListener('pointercancel', endDrag);

            // Suppress the synthetic click that follows a drag, so we don't double-fire.
            toggle.addEventListener('click', function (e) {
                if (didDrag) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    didDrag = false;
                    return;
                }
                var btn = e.target.closest('.video-toggle__btn');
                if (btn) activate(btn.getAttribute('data-task'));
            }, true);

            activate(initial, true);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

function revealLearnMoreInfo(hidden_DIV_ID, btn_ID){
    var el = document.getElementById(hidden_DIV_ID);

    if (el.classList.contains('hidden')) {
        // OPENING — animate from 6px strip to the actual content height.
        // Remove .hidden FIRST so the open-state padding is applied when we
        // measure scrollHeight (otherwise target is too small by 2× padding
        // and the panel jumps by that amount at the end of the transition).
        el.classList.remove('hidden');
        var target = el.scrollHeight;

        // Pin to the closed state without triggering a transition.
        el.style.transition = 'none';
        el.style.maxHeight = '6px';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
        void el.offsetHeight;  // force layout

        // Re-enable transitions and animate to the measured target.
        el.style.transition = '';
        el.style.maxHeight = target + 'px';
        el.style.paddingTop = '';
        el.style.paddingBottom = '';

        // After the transition finishes, drop the inline max-height so the panel
        // can resize naturally if its content ever changes.
        var onOpenEnd = function (e) {
            if (e.target === el && e.propertyName === 'max-height') {
                el.style.maxHeight = '';
                el.removeEventListener('transitionend', onOpenEnd);
            }
        };
        el.addEventListener('transitionend', onOpenEnd);
    } else {
        // CLOSING — animate from current content height back to the 6px strip.
        var current = el.scrollHeight;
        el.style.maxHeight = current + 'px';
        void el.offsetHeight;  // force the explicit current-height start frame
        el.classList.add('hidden');
        el.style.maxHeight = '';  // hand control back to CSS so .hidden's 6px takes over
        // padding transitions automatically via CSS
    }

    updateLearnMoreBtnHTML(btn_ID);
}

function updateLearnMoreBtnHTML(btn_ID){
    // Change the content of the Learn Btn if it is Clicked
    if (document.getElementById(btn_ID).innerHTML.includes("Learn More")){
        document.getElementById(btn_ID).innerHTML = "Show Less &nbsp<span class='ion-chevron-up'></span>";
    }
    else {
        document.getElementById(btn_ID).innerHTML = "Learn More &nbsp<span class='ion-chevron-down'></span>";
    }
}