function revealLearnMoreInfo(hidden_DIV_ID, btn_ID){
    // Reveal Hidden Div after Learn More button is clicked

    // Toggle Visibility of DIV
    document.getElementById(hidden_DIV_ID).classList.toggle("hidden");

    // Change the Content of the BTN
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