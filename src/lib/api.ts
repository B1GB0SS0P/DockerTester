// src/lib/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface Model {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped';
  accuracy: number;
  inference_time: string;
  created: string;
  image_count: number;
  container_size: string;
  container_name?: string;
  image_name?: string;
  port?: number;
  endpoint?: string;
}

export interface TestResult {
  id: string;
  filename: string;
  model: string;
  confidence: number;
  prediction: string;
  inference_time: string;
  status: 'completed' | 'processing' | 'failed';
  timestamp: string;
  error?: string;
}

export interface Analytics {
  totalModels: number;
  activeModels: number;
  totalTests: number;
  avgAccuracy: number;
  avgInference: string;
  successRate: number;
  models: Array<{
    name: string;
    accuracy: number;
    tests: number;
    status: string;
  }>;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Model Management
  async getModels(): Promise<Model[]> {
    return this.request<Model[]>('/models');
  }

  async deployModel(formData: FormData): Promise<{ success: boolean; model: Model; message: string }> {
    const response = await fetch(`${API_BASE_URL}/models/deploy`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async toggleModel(modelId: string): Promise<{ success: boolean; model: Model; message: string }> {
    return this.request(`/models/${modelId}/toggle`, {
      method: 'POST',
    });
  }

  async deleteModel(modelId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/models/${modelId}`, {
      method: 'DELETE',
    });
  }

  // Testing
  async runTest(modelId: string, images: File[]): Promise<{ success: boolean; results: TestResult[]; message: string }> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await fetch(`${API_BASE_URL}/test/${modelId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getTestResults(): Promise<TestResult[]> {
    return this.request<TestResult[]>('/test-results');
  }

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    return this.request<Analytics>('/analytics');
  }
}

export const apiService = new ApiService();