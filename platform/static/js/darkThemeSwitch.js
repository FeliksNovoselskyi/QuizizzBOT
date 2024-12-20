
const body = document.body
const switchThemeButton = document.querySelector('.switch-theme')

switchThemeButton.addEventListener('click', () => {
    body.classList.toggle("dark-theme")

    if (body.classList.contains("dark-theme")) {
        switchThemeButton.textContent = "Light"
    } else {
        switchThemeButton.textContent = "Dark"
    }
})
