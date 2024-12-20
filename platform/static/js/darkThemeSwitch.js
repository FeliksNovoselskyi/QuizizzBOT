
const body = document.body
const switchThemeButton = document.querySelector('.switch-theme')

switchThemeButton.addEventListener('click', () => {
    body.classList.toggle("dark-theme")
    // switchThemeButton.textContent = "Light"
})
