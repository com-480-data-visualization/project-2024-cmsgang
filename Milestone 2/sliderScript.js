function updateSliderValue(slider) {
    var value = slider.value;
    var valueSpan = document.getElementById(slider.name + "-value");
    valueSpan.textContent = value;
}