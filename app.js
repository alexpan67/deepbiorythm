let bioChart;

function updateDeepBiorhythm() {
    const birthVal = document.getElementById('birthdate').value;
    if (!birthVal) return alert("Inserisci la tua data di nascita");

    const birthDate = new Date(birthVal);
    const today = new Date();
    today.setHours(0,0,0,0);

    const diffDays = (today - birthDate) / (1000 * 60 * 60 * 24);
    
    const labels = [], phys = [], emot = [], intel = [];
    let criticals = [];

    // Previsione per 30 giorni
    for (let i = 0; i < 30; i++) {
        const t = diffDays + i;
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        labels.push(date.toLocaleDateString('it-IT', {day:'numeric', month:'short'}));

        const vP = Math.sin(2 * Math.PI * t / 23);
        const vE = Math.sin(2 * Math.PI * t / 28);
        const vI = Math.sin(2 * Math.PI * t / 33);

        phys.push(vP.toFixed(4));
        emot.push(vE.toFixed(4));
        intel.push(vI.toFixed(4));

        // Rilevamento instabilità (passaggio per lo zero)
        if (Math.abs(vP) < 0.15 || Math.abs(vE) < 0.15) {
            criticals.push(labels[i]);
        }
    }

    document.getElementById('critical-days').innerText = criticals.length > 0 ? 
        "Fasi critiche: " + [...new Set(criticals)].slice(0,3).join(", ") : "";

    const ctx = document.getElementById('bioChart').getContext('2d');
    if (bioChart) bioChart.destroy();
    
    bioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Fisico', data: phys, borderColor: '#ff6384', borderWidth: 2, pointRadius: 0, tension: 0.3 },
                { label: 'Emotivo', data: emot, borderColor: '#36a2eb', borderWidth: 2, pointRadius: 0, tension: 0.3 },
                { label: 'Intellettuale', data: intel, borderColor: '#ffce56', borderWidth: 2, pointRadius: 0, tension: 0.3 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: -1.1, max: 1.1 } } }
    });
}
