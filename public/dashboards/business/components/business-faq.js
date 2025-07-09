// FAQ para negocios
class BusinessFAQ extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                    padding: 2rem;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 16px rgba(52,104,192,0.07);
                    max-width: 800px;
                    margin: 2rem auto;
                }
                h2 {
                    color: #3468c0;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                }
                .faq-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .faq-item {
                    margin-bottom: 1.5rem;
                }
                .faq-question {
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                    font-size: 1.1rem;
                }
                .faq-answer {
                    color: #64748b;
                    font-size: 1rem;
                    line-height: 1.6;
                }
            </style>
            <h2>Preguntas Frecuentes (FAQ) para Negocios</h2>
            <ul class="faq-list">
                <li class="faq-item">
                    <div class="faq-question">¿Cómo puedo agregar un nuevo producto?</div>
                    <div class="faq-answer">Desde la sección "Add Product" en el menú lateral, completa el formulario con la información de tu producto y haz clic en "Guardar".</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">¿Cómo gestiono mis ventas?</div>
                    <div class="faq-answer">En la sección "Sales" puedes ver todas tus ventas, su estado y detalles de cada transacción.</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">¿Puedo editar la información de mi negocio?</div>
                    <div class="faq-answer">Sí, en la sección "Profile" puedes actualizar los datos de tu empresa, dirección, contacto y más.</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">¿Cómo recibo notificaciones de nuevas compras?</div>
                    <div class="faq-answer">Las notificaciones aparecen en la sección "Notifications" y también recibirás alertas en tiempo real si tienes la app abierta.</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">¿A quién contacto si tengo un problema?</div>
                    <div class="faq-answer">Puedes escribirnos a soporte@swappit.com o usar el formulario de contacto en la sección "Settings".</div>
                </li>
            </ul>
        `;
    }
}
customElements.define('business-faq', BusinessFAQ); 