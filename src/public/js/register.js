const registerForm = document.querySelector("#registerForm")

if (registerForm instanceof HTMLFormElement) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault()
        const data = new FormData(registerForm)
        const obj = {}
        data.forEach((value, key) => obj[key] = value)
        fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        window.location.replace("/login")
    })
}

