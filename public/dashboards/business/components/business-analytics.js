// Componente web para análisis de ventas
class BusinessAnalytics extends HTMLElement {
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
                :host { display: block; font-family: var(--font-family, 'Inter', sans-serif); }
                .analytics-container { background: white; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 2rem; max-width: 900px; margin: 2rem auto; }
                .analytics-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #764ba2; }
                .chart-placeholder { background: #f8fafc; border-radius: 12px; height: 300px; display: flex; align-items: center; justify-content: center; color: #667eea; font-size: 1.2rem; }
            </style>
            <div class="analytics-container">
                <div class="analytics-header">Análisis de Ventas</div>
                <div class="chart-placeholder">[Gráfico de ventas aquí]</div>
            </div>
        `;
    }
}
customElements.define('business-analytics', BusinessAnalytics); 