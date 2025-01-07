
//Light/Dark mode
function toggleTheme() {
    const theme = document.getElementById('theme').value;

    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Allows for Light/Dark mode preference to be saved locally 
    localStorage.setItem('theme', theme);
}

function toggleFont() {
    const fontSize = document.getElementById('fontSize').value;

    if (fontSize === 'small') {
        document.body.classList.add('small-font');
        document.body.classList.remove('medium-font');
        document.body.classList.remove('large-font');
    } else if (fontSize === 'medium') {
        document.body.classList.add('medium-font');
        document.body.classList.remove('small-font');
        document.body.classList.remove('large-font');
    } else {
        document.body.classList.add('large-font');
        document.body.classList.remove('medium-font');
        document.body.classList.remove('small-font');
    }

    // Allows for Font Size preference to be saved locally 
    localStorage.setItem('fontSize', fontSize);
}

//Set theme to local save
function applySavedPreferences() {
    const savedTheme = localStorage.getItem('theme');
    const savedFont = localStorage.getItem('fontSize');
    if (savedTheme) {
        document.getElementById('theme').value = savedTheme;
        toggleTheme(); // Apply the theme based on saved value
    }
    if (savedFont) {
        document.getElementById('fontSize').value = savedFont;
        toggleFont(); // Apply the font size based on saved value
    }
}
applySavedPreferences();


//theme dropdown event listener
document.getElementById('theme').addEventListener('change', toggleTheme);

//font size dropdown event listener
document.getElementById('fontSize').addEventListener('change', toggleFont);

//Prediction checkbox
const predictionCheckbox = document.getElementById('predictionCheckbox');
predictionCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.getElementById("predictions").classList.remove("hidden");
    } else {
        document.getElementById("predictions").classList.add("hidden");
    }
  });


document.getElementById("evc-form").addEventListener("submit", function (event) {
    event.preventDefault();

    //Get store user inputs
    const budget = parseFloat(document.getElementById("budget").value);
    const currentCosts = parseFloat(document.getElementById("currentCosts").value);
    const scheduledProgress = parseFloat(document.getElementById("scheduledProgress").value) / 100;
    const actualProgress = parseFloat(document.getElementById("actualProgress").value) / 100;

    //Calculate Earned Value, Planned Value, CPI, and SPI, ETC, EAC
    const earnedValue = actualProgress * budget;
    const plannedValue = scheduledProgress * budget;
    const cpi = earnedValue / currentCosts;
    const spi = earnedValue / plannedValue;
    const etc = (budget-earnedValue) / cpi;
    const eac = currentCosts + etc;

    //Display results
    document.getElementById("ev").textContent = earnedValue.toFixed(2);
    document.getElementById("pv").textContent = plannedValue.toFixed(2);
    document.getElementById("cpi").textContent = cpi.toFixed(3);
    document.getElementById("spi").textContent = spi.toFixed(3);

    document.getElementById("etc").textContent = etc.toFixed(2);
    document.getElementById("eac").textContent = eac.toFixed(2);
    
    //Display appropriate project statuses
    if (cpi > 1) {
        document.getElementById("cpi-status").textContent = "under budget";
        document.getElementById("cpi-status").style.color = "green";
    } else if (cpi < 1) {
        document.getElementById("cpi-status").textContent = "over budget";
        document.getElementById("cpi-status").style.color = "red";
    } else {
        document.getElementById("cpi-status").textContent = "on budget";
        document.getElementById("cpi-status").style.color = "blue";
    }

    if (spi > 1) {
        document.getElementById("spi-status").textContent = "ahead of schedule";
        document.getElementById("spi-status").style.color = "green";
    } else if (spi < 1) {
        document.getElementById("spi-status").textContent = "behind schedule";
        document.getElementById("spi-status").style.color = "red";
    } else {
        document.getElementById("spi-status").textContent = "on schedule";
        document.getElementById("spi-status").style.color = "blue";
    }


    //Show results section
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("reportButton").classList.remove("hidden");
});

//Report Generation
document.getElementById("download-report").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const ev = document.getElementById("ev").textContent;
    const pv = document.getElementById("pv").textContent;
    const cpi = document.getElementById("cpi").textContent;
    const cpiStatus = document.getElementById("cpi-status").textContent;
    const spi = document.getElementById("spi").textContent;
    const spiStatus = document.getElementById("spi-status").textContent;
    const etc = document.getElementById("etc").textContent;
    const eac = document.getElementById("eac").textContent;
    
    //CPI and SPI explanation logic
    let cpiExplained = "";
    if (cpi < 0.5) {
        cpiExplained = "Oh no! Your project is  currently costing your team  more than double your earned value, indicating a severe inefficiency in cost management. This could potentially be caused by underestimations of budget and irresponsible allocation of resources. This issue should be addressed as quickly as possible in order to be able to meet the requirements of the project.";
    } else if (cpi >= 0.5 && cpi < 1) {
        cpiExplained = "Uh oh! Your project is currently slightly over budget indicating that there has been some poor planning regarding your project team’s allocation of resources. This could potentially be caused by smaller expenses that were not initially anticipated while planning for the project. In order to recuperate funds and make up for reduced productivity, it is suggested that your team focuses more closely on high impact tasks to ensure the functionality of the software’s main features.";
    } else if (cpi == 1) {
        cpiExplained = "Good Job! Your project is operating exactly as planned, and your costs match closely with your project’s earned value. This reflects an appropriate use of time and resources suggesting that this project was properly planned for and scheduled. To ensure your project does not fall behind, regularly review these metrics and adhere to a strict plan when making decisions regarding your project resources.";
    } else if (cpi > 1) {
        cpiExplained = "Congratulations! Your project is currently under budget meaning your team is operating more efficiently than what has been planned for. The amount of resources currently used have gotten your team further than what you have scheduled for. Keep up the good work! However, it is most important to ensure that the pace by which your project is being completed does not sacrifice the quality of the product being developed.";
    }

    let spiExplained = "";
    if (spi < 0.5) {
        spiExplained = "Oh no! Your project is currently falling significantly far below where it is expected to be, putting it at risk of significant delays and incompletion. With the current level of completed progress on this project, it may be necessary to modify the desired software requirements in order to maintain the integrity of the project’s schedule. It is important that the project’s status is reassessed before assigning any more time to project tasks.";
    } else if (spi >= 0.5 && spi < 1) {
        spiExplained = "Uh oh! Your project is currently slightly behind schedule causing your team to miss some important task deadlines. This delay in project completion could have been caused by minor inefficiencies or unforeseen challenges during the project development process. It is advised that more important, high-impact tasks are given priority to ensure the large project functionalities work as intended.";
    } else if (spi == 1) {
        spiExplained = "Good job! Your project is currently progressing exactly as planned with your team’s earned value equalling exactly with the project’s planned value at this stage in development. To ensure your project does not fall behind, regularly review these metrics and adhere to a strict plan when making decisions regarding your project’s scheduling.";
    } else if (spi > 1) {
        spiExplained = "Congratulations! Your project is currently ahead of schedule meaning for the amount of time and resources put into developing this project, your team has exceeded what was anticipated for. Keep up the good work! However, it is most important to ensure that the pace by which your project is being completed is not at the detriment of the quality of the product being developed.";
    }

    //Write to PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("Earned Value Analysis Report", 10, 20);

    doc.setFontSize(16);
    doc.text("Results", 10, 35);
    doc.setFontSize(12);
    doc.text(`Earned Value (EV): $${ev}`, 10, 45);
    doc.text(`Planned Value (PV): $${pv}`, 10, 55);

    doc.text(`Cost Performance Index (CPI): ${cpi} (${cpiStatus})`, 10, 65);
    doc.setFontSize(10);

    const wrappedCPI = doc.splitTextToSize(cpiExplained, 180);
    doc.text(wrappedCPI, 15, 70);
    doc.setFontSize(12);

    doc.text(`Schedule Performance Index (SPI): ${spi} (${spiStatus})`, 10, 100);
    doc.setFontSize(10);

    const wrappedSPI = doc.splitTextToSize(spiExplained, 180);
    doc.text(wrappedSPI, 15, 105);
    doc.setFontSize(16);

    doc.text("Predictions", 10, 135);
    doc.setFontSize(12);
    doc.text(`Estimated Cost to Complete (ETC): $${etc}`, 10, 145);
    doc.text(`Estimated Cost at Completion (EAC): $${eac}`, 10, 155);

    doc.setFontSize(16);
    doc.text("Formulas:", 10, 170);
    doc.setFontSize(12);
    doc.text("- Earned Value (EV): Budget * Actual Progress (%)", 10, 180);
    doc.text("- Planned Value (PV): Budget * Scheduled Progress (%)", 10, 190);
    doc.text("- Cost Performance Index (CPI): EV / Current Costs", 10, 200);
    doc.text("- Schedule Performance Index (SPI): EV / PV", 10, 210);
    doc.text("- Estimated Cost to Complete (ETC): (Budget-EV) / CPI", 10, 220);
    doc.text("- Estimated Cost at Completion (EAC): Current Costs + ETC", 10, 230);

    //Save PDF
    doc.save("Earned_Value_Report.pdf");
});