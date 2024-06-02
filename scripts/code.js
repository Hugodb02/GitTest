const setup = () => {
    // Sliders en save button initialiseren
    let sliders = document.getElementsByClassName("slider");
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener("change", update);
        sliders[i].addEventListener("input", update);
    }
    document.getElementById("saveButton").addEventListener("click", saveColor);

    // Laad opgeslagen waarden en favorieten
    loadState();
};

const loadState = () => {
    // Laad sliderinstellingen
    let storedSliders = JSON.parse(localStorage.getItem("sliderSettings"));
    if (storedSliders) {
        document.getElementById("sldRed").value = storedSliders.red;
        document.getElementById("sldGreen").value = storedSliders.green;
        document.getElementById("sldBlue").value = storedSliders.blue;
    }
    update(); // Update UI met geladen waarden

    // Laad favoriete kleuren
    let storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
        storedFavorites.forEach(color => addFavoriteColor(color));
    }
};

const update = () => {
    // Haal sliderwaarden op en werk UI bij
    let red = document.getElementById("sldRed").value;
    let green = document.getElementById("sldGreen").value;
    let blue = document.getElementById("sldBlue").value;

    document.getElementById("lblRed").textContent = red;
    document.getElementById("lblGreen").textContent = green;
    document.getElementById("lblBlue").textContent = blue;

    document.getElementById("swatch").style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

    // Sla sliderinstellingen op
    let sliderValues = { red: red, green: green, blue: blue };
    localStorage.setItem("sliderSettings", JSON.stringify(sliderValues));
};

const saveColor = () => {
    // Haal sliderwaarden op en maak RGB-object
    let red = document.getElementById("sldRed").value;
    let green = document.getElementById("sldGreen").value;
    let blue = document.getElementById("sldBlue").value;
    let rgbObject = { red: red, green: green, blue: blue };

    // Voeg nieuwe kleur toe aan favorieten in localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(rgbObject);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Voeg nieuwe kleur toe aan de UI
    addFavoriteColor(rgbObject);
};

const addFavoriteColor = (rgbObject) => {
    // Maak een nieuwe kleur swatch
    let newSwatch = document.createElement("div");
    newSwatch.classList.add("b-swatch");
    newSwatch.style.backgroundColor = `rgb(${rgbObject.red}, ${rgbObject.green}, ${rgbObject.blue})`;
    newSwatch.setAttribute('data-color', JSON.stringify(rgbObject));

    // Voeg delete button toe
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", deleteSwatch);

    // Voeg swatch en delete button toe aan de favorieten
    newSwatch.appendChild(deleteButton);
    document.getElementById("favorites").appendChild(newSwatch);

    // Voeg klik event toe om kleur te herstellen
    newSwatch.addEventListener("click", restoreColor);
};

const restoreColor = (event) => {
    if (event.target.classList.contains("deleteButton")) {
        return;
    }
    let rgbObject = JSON.parse(event.currentTarget.getAttribute('data-color'));

    // Herstel sliderwaarden en update UI
    document.getElementById("sldRed").value = rgbObject.red;
    document.getElementById("sldGreen").value = rgbObject.green;
    document.getElementById("sldBlue").value = rgbObject.blue;
    update();
};

const deleteSwatch = (event) => {
    let swatch = event.target.parentNode;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let rgbObject = JSON.parse(swatch.getAttribute('data-color'));

    // Verwijder kleur uit favorieten
    favorites = favorites.filter(color =>
        color.red != rgbObject.red ||
        color.green != rgbObject.green ||
        color.blue != rgbObject.blue
    );
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Verwijder swatch uit de UI
    swatch.remove();
};

window.addEventListener("load", setup);