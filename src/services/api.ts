// API Service for Canteen Management System

const API_BASE_URL = 'http://localhost:4000';

class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  static async login(identifier: string, password?: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ identifier, password }),
    });
    return this.handleResponse(response);
  }

  static async signup(userData: {
    username: string;
    email: string;
    password: string;
    roll_number: string;
    role: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // Menu endpoints
  static async getMenuItems() {
    const response = await fetch(`${API_BASE_URL}/menu_items`);
    return this.handleResponse(response);
  }

  static async addMenuItem(itemData: {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/menu_items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    return this.handleResponse(response);
  }

  // Order endpoints
  static async createOrder(items: Array<{ menu_item_id: number; quantity: number }>) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return this.handleResponse(response);
  }

  static async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async updateOrderStatus(orderId: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  static async getKitchenOrders() {
    const response = await fetch(`${API_BASE_URL}/kitchen/orders`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // User endpoints
  static async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export default ApiService;