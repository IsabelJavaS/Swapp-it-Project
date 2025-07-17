// Componente web para configuraciones del negocio
class BusinessSettings extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Save settings button
        const saveBtn = this.shadowRoot.querySelector('.save-settings-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // Toggle switches
        this.shadowRoot.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateToggleState(e.target);
            });
        });

        // Theme selector
        const themeSelect = this.shadowRoot.querySelector('#themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        // Language selector
        const languageSelect = this.shadowRoot.querySelector('#languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    updateToggleState(toggle) {
        const label = toggle.nextElementSibling;
        if (toggle.checked) {
            label.textContent = 'Enabled';
            label.classList.add('enabled');
        } else {
            label.textContent = 'Disabled';
            label.classList.remove('enabled');
        }
    }

    changeTheme(theme) {
        console.log('Changing theme to:', theme);
        // Apply theme changes
        document.documentElement.setAttribute('data-theme', theme);
    }

    changeLanguage(language) {
        console.log('Changing language to:', language);
        // Apply language changes
    }

    saveSettings() {
        console.log('Saving settings...');
        // Save settings to Firebase
        this.showNotification('Settings saved successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        this.shadowRoot.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                }

                .settings-overview {
                    padding: 0.5rem 3rem 0.5rem 3rem;
                }

                .section-header {
                    margin-bottom: 2rem;
                }

                .section-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .section-header p {
                    color: #64748b;
                    font-size: 1rem;
                    margin: 0;
                }

                .settings-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .settings-section {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 1.5rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .section-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: white;
                }

                .section-icon.account {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                }

                .section-icon.notifications {
                    background: linear-gradient(135deg, #ffa424, #ff8c00);
                }

                .section-icon.privacy {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .section-icon.appearance {
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                }

                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid #f1f5f9;
                }

                .setting-item:last-child {
                    border-bottom: none;
                }

                .setting-info {
                    flex: 1;
                }

                .setting-label {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .setting-description {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
                }

                .setting-control {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                /* Toggle Switch */
                .toggle-switch {
                    position: relative;
                    width: 60px;
                    height: 32px;
                    background: #e5e7eb;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    outline: none;
                    appearance: none;
                    -webkit-appearance: none;
                }

                .toggle-switch:checked {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    box-shadow: 0 0 0 2px rgba(52, 104, 192, 0.2);
                }

                .toggle-switch::before {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 28px;
                    height: 28px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .toggle-switch:checked::before {
                    transform: translateX(28px);
                    box-shadow: 0 2px 8px rgba(52, 104, 192, 0.3);
                }

                .toggle-switch:hover {
                    background: #d1d5db;
                }

                .toggle-switch:checked:hover {
                    background: linear-gradient(135deg, #1d4ed8, #1e40af);
                }

                .toggle-switch:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }

                .toggle-switch:checked:focus {
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.2);
                }

                .toggle-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #64748b;
                    min-width: 70px;
                    text-align: center;
                    transition: color 0.3s ease;
                }

                .toggle-label.enabled {
                    color: #3468c0;
                }

                /* Select Inputs */
                .form-select {
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-family: inherit;
                    background: white;
                    color: #1f2937;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 150px;
                }

                .form-select:focus {
                    outline: none;
                    border-color: #3468c0;
                    box-shadow: 0 0 0 3px rgba(52, 104, 192, 0.1);
                }

                /* Buttons */
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3468c0, #1d4ed8);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(52, 104, 192, 0.3);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                }

                .btn-danger:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .settings-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #f1f5f9;
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }

                .notification.success {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .notification.error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .settings-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .settings-overview {
                        padding: 0.5rem 1rem 0.5rem 1rem;
                    }

                    .settings-section {
                        padding: 1.5rem;
                    }

                    .setting-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .setting-control {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .settings-actions {
                        flex-direction: column;
                    }
                }
            </style>

            <div class="settings-overview">
                <!-- Section Header -->
                <div class="section-header">
                    <h1>Business Settings</h1>
                    <p>Manage your business account preferences and store settings</p>
                </div>

                <!-- Settings Grid -->
                <div class="settings-grid">
                    <!-- Account Settings -->
                    <div class="settings-section">
                        <h3 class="section-title">
                            <div class="section-icon account">
                                <i class="fas fa-store"></i>
                            </div>
                            Store Settings
                        </h3>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Store Status</div>
                                <div class="setting-description">Set your store as active or temporarily closed</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="storeStatus" checked>
                                <span class="toggle-label enabled">Enabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Auto-approve Orders</div>
                                <div class="setting-description">Automatically approve incoming orders</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="autoApproveOrders">
                                <span class="toggle-label">Disabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Language</div>
                                <div class="setting-description">Choose your preferred language</div>
                            </div>
                            <div class="setting-control">
                                <select class="form-select" id="languageSelect">
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Notification Settings -->
                    <div class="settings-section">
                        <h3 class="section-title">
                            <div class="section-icon notifications">
                                <i class="fas fa-bell"></i>
                            </div>
                            Notification Preferences
                        </h3>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Order Notifications</div>
                                <div class="setting-description">Get notified when new orders are placed</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="orderNotifications" checked>
                                <span class="toggle-label enabled">Enabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Inventory Alerts</div>
                                <div class="setting-description">Receive alerts when products are low in stock</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="inventoryAlerts" checked>
                                <span class="toggle-label enabled">Enabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Review Notifications</div>
                                <div class="setting-description">Get notified when customers leave reviews</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="reviewNotifications" checked>
                                <span class="toggle-label enabled">Enabled</span>
                            </div>
                        </div>
                    </div>

                    <!-- Privacy Settings -->
                    <div class="settings-section">
                        <h3 class="section-title">
                            <div class="section-icon privacy">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            Privacy & Security
                        </h3>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Two-Factor Authentication</div>
                                <div class="setting-description">Add an extra layer of security to your account</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="twoFactorAuth">
                                <span class="toggle-label">Disabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Data Analytics</div>
                                <div class="setting-description">Allow us to collect usage data for improvements</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="dataAnalytics" checked>
                                <span class="toggle-label enabled">Enabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Location Services</div>
                                <div class="setting-description">Use location for local business features</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="locationServices">
                                <span class="toggle-label">Disabled</span>
                            </div>
                        </div>
                    </div>

                    <!-- Appearance Settings -->
                    <div class="settings-section">
                        <h3 class="section-title">
                            <div class="section-icon appearance">
                                <i class="fas fa-palette"></i>
                            </div>
                            Appearance
                        </h3>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Theme</div>
                                <div class="setting-description">Choose your preferred color theme</div>
                            </div>
                            <div class="setting-control">
                                <select class="form-select" id="themeSelect">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Compact Mode</div>
                                <div class="setting-description">Use a more compact layout</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="compactMode">
                                <span class="toggle-label">Disabled</span>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">Animations</div>
                                <div class="setting-description">Enable smooth animations and transitions</div>
                            </div>
                            <div class="setting-control">
                                <input type="checkbox" class="toggle-switch" id="animations" checked>
                                <span class="toggle-label enabled">Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Actions -->
                <div class="settings-actions">
                    <button class="btn btn-secondary">
                        <i class="fas fa-undo"></i>
                        Reset to Default
                    </button>
                    <button class="btn btn-danger">
                        <i class="fas fa-trash"></i>
                        Delete Store
                    </button>
                    <button class="btn btn-primary save-settings-btn">
                        <i class="fas fa-save"></i>
                        Save Settings
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('business-settings', BusinessSettings); 