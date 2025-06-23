// API Module for communicating with Express backend
class API {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    // Test backend connection
    async testBackend() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error testing backend:', error);
            return { error: 'Backend no disponible' };
        }
    }

    // Test Firebase connection
    async testFirebase() {
        try {
            const response = await fetch(`${this.baseURL}/firebase-test`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error testing Firebase:', error);
            return { error: 'Firebase no disponible' };
        }
    }

    // Generic GET request
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(`Error in GET ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic POST request
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error in POST ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic PUT request
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error in PUT ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic DELETE request
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error(`Error in DELETE ${endpoint}:`, error);
            throw error;
        }
    }
}

// Create global API instance
window.api = new API(); 