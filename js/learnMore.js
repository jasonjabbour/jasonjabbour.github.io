function revealLearnMoreInfo(hidden_DIV_ID, btn_ID){
    var el = document.getElementById(hidden_DIV_ID);

    if (el.classList.contains('hidden')) {
        // OPENING — animate from 6px strip to the actual content height
        var target = el.scrollHeight;
        el.classList.remove('hidden');
        // Pin to the closed state momentarily so the transition has a starting point
        el.style.maxHeight = '6px';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
        void el.offsetHeight;  // force the browser to apply the pinned state
        // Animate to the open state
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
        // CLOSING — animate from current content height back to the 6px strip
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