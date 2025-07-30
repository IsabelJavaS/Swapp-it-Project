// Business FAQ Component
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
            <h2>Frequently Asked Questions (FAQ) for Businesses</h2>
            <ul class="faq-list">
                <li class="faq-item">
                    <div class="faq-question">How can I add a new product?</div>
                    <div class="faq-answer">From the "Add Product" section in the sidebar, complete the form with your product information and click "Save".</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">How do I manage my sales?</div>
                    <div class="faq-answer">In the "Sales" section you can view all your sales, their status and details of each transaction.</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">Can I edit my business information?</div>
                    <div class="faq-answer">Yes, in the "Profile" section you can update your company data, address, contact information and more.</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">How do I receive notifications for new purchases?</div>
                    <div class="faq-answer">Notifications appear in the "Notifications" section and you'll also receive real-time alerts if you have the app open.</div>
                </li>
                <li class="faq-item">
                    <div class="faq-question">Who do I contact if I have a problem?</div>
                    <div class="faq-answer">You can write to us at support@swappit.com or use the contact form in the "Settings" section.</div>
                </li>
            </ul>
        `;
    }
}
customElements.define('business-faq', BusinessFAQ); 