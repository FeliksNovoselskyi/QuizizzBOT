
const body = document.body
const switchThemeButton = document.querySelector('.switch-theme')

if (localStorage.getItem("theme") == "dark") {
    body.classList.add("dark-theme")
    switchThemeButton.textContent = "Light"
} else {
    body.classList.remove("dark-theme")
    switchThemeButton.textContent = "Dark"
}

switchThemeButton.addEventListener('click', () => {
    body.classList.toggle("dark-theme")

    if (body.classList.contains("dark-theme")) {
        switchThemeButton.textContent = "Light"
        localStorage.setItem("theme", "dark")
    } else {
        localStorage.setItem("theme", "light")
        switchThemeButton.textContent = "Dark"
    }
})
