document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');
    if (!form || !message) return;
    const inputs = [...form.querySelectorAll('input')];
    const limpiar = () => inputs.forEach((input) => input.closest('.input-box').classList.remove('input-error'));
    inputs.forEach((input) => input.addEventListener('input', () => {
        input.closest('.input-box').classList.remove('input-error');
        message.className = 'login-message';
        message.textContent = '';
    }));
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); limpiar();
        const respuesta = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }, body: new URLSearchParams(new FormData(form)) });
        const resultado = await respuesta.json().catch(() => ({ ok: false, message: 'No fue posible iniciar sesión.' }));
        message.textContent = resultado.message;
        message.className = `login-message ${resultado.ok ? 'success' : 'error'}`;
        if (!resultado.ok) {
            const input = document.getElementById(resultado.field);
            if (input) input.closest('.input-box').classList.add('input-error');
            return;
        }
        form.querySelector('button[type="submit"]').disabled = true;
        setTimeout(() => window.location.assign(resultado.redirect), 650);
    });
});
