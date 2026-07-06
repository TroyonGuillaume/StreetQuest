document.addEventListener('DOMContentLoaded', () => {
    // --- DONNÉES ---
    const hunts = [
        {
            id: 1, name: "Le mystère du Beffroi",
            lat: 50.1738, lon: 3.2323,
            question: "Combien de petites fenêtres sur la façade principale ?",
            answer: "6",
            hint: "Compte bien les fenêtres du rez-de-chaussée !"
        },
        {
            id: 2, name: "Le secret du Jardin Public",
            lat: 50.1765, lon: 3.2365,
            question: "Quelle est la couleur du banc devant la grande statue ?",
            answer: "vert",
            hint: "C'est la couleur de l'herbe !"
        }
    ];

    let currentHunt = null;
    const map = L.map('map').setView([50.1732, 3.2327], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

    const homeView = document.getElementById('home-view');
    const gameView = document.getElementById('game-view');

    window.showHome = function() {
        homeView.classList.add('active');
        gameView.classList.remove('active');
    };

    window.startHunt = function(huntId) {
        currentHunt = hunts.find(h => h.id === huntId);
        if (!currentHunt) return;

        homeView.classList.remove('active');
        gameView.classList.add('active');

        document.getElementById('q-text').innerText = currentHunt.question;
        document.getElementById('q-answer').value = "";

        const hintEl = document.getElementById('q-hint') || document.createElement('p');
        hintEl.id = 'q-hint';
        hintEl.style.cssText = "font-style: italic; color: #fff; margin-top: 10px; font-size: 0.9rem;";
        hintEl.innerText = "💡 Indice : " + currentHunt.hint;

        if (!document.getElementById('q-hint')) {
            document.getElementById('q-text').after(hintEl);
        }

        setTimeout(() => {
            map.invalidateSize();
            map.setView([currentHunt.lat, currentHunt.lon], 17);
        }, 100);
    };

    document.getElementById('btn-gps').addEventListener('click', () => {
        if (!currentHunt) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const userPos = L.latLng(pos.coords.latitude, pos.coords.longitude);
            const target = L.latLng(currentHunt.lat, currentHunt.lon);
            const distance = userPos.distanceTo(target);

            if (distance < 50) {
                document.getElementById('quiz-overlay').style.display = 'flex';
            } else {
                alert("Encore trop loin ! Rapproche-toi, il reste " + Math.round(distance) + " mètres.");
            }
        });
    });

    document.getElementById('btn-submit').addEventListener('click', () => {
        const val = document.getElementById('q-answer').value.toLowerCase().trim();
        if (currentHunt && val === currentHunt.answer.toLowerCase()) {
            alert("🎉 Bravo ! Mission accomplie !");
            document.getElementById('quiz-overlay').style.display = 'none';
            showHome();
        } else {
            alert("🤔 Pas tout à fait... réessaie ou demande un indice !");
        }
    });

    const list = document.getElementById('hunt-list');
    hunts.forEach(h => {
        const card = document.createElement('div');
        card.className = 'hunt-card';
        card.innerHTML = `<h3>${h.name}</h3>`;
        card.onclick = () => window.startHunt(h.id);
        list.appendChild(card);
    });
});