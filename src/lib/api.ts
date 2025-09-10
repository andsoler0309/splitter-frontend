/**
 * API utilities for communicating with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface SplitRequest {
  youtube_url: string;
  stems: string[];
}

export interface SplitResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface JobStatus {
  job_id: string;
  status: string;
  download_urls: Record<string, string>;
  preview_urls: Record<string, string>;
  error_message: string;
  song_title: string;
  song_duration: number;
  payment_required: boolean;
  payment_completed: boolean;
}

export interface JobUpdate {
  job_id: string;
  status: string;
  message: string;
  progress?: number;
  error_message?: string;
  download_urls?: Record<string, string>;
  preview_urls?: Record<string, string>;
  song_title?: string;
  song_duration?: number;
}

export interface PaymentInfo {
  job_id: string;
  amount: number;
  currency: string;
  song_title: string;
  stems: string[];
  payment_completed: boolean;
}

/**
 * Start audio splitting job
 */
export async function startSplit(request: SplitRequest): Promise<SplitResponse> {
  const response = await fetch(`${API_BASE_URL}/split`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to start split');
  }

  return response.json();
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_BASE_URL}/job/${jobId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get job status');
  }

  return response.json();
}

/**
 * Get payment information
 */
export async function getPaymentInfo(jobId: string): Promise<PaymentInfo> {
  const response = await fetch(`${API_BASE_URL}/payment/${jobId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get payment info');
  }

  return response.json();
}

/**
 * Complete payment
 */
export async function completePayment(jobId: string): Promise<{ message: string; job_id: string }> {
  const response = await fetch(`${API_BASE_URL}/payment/${jobId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to complete payment');
  }

  return response.json();
}

/**
 * Create WebSocket connection for job updates
 */
export function createJobWebSocket(
  jobId: string,
  onMessage: (update: JobUpdate) => void,
  onError?: (error: Event) => void,
  onClose?: (event: CloseEvent) => void
): WebSocket {
  const wsUrl = `${API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://')}/ws/${jobId}`;
  
  const ws = new WebSocket(wsUrl);
  
  ws.onmessage = (event) => {
    try {
      const update = JSON.parse(event.data);
      onMessage(update);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = (event) => {
    console.log('WebSocket closed:', event);
    if (onClose) onClose(event);
  };
  
  return ws;
}

/**
 * Get preview URL
 */
export function getPreviewUrl(jobId: string, filename: string): string {
  return `${API_BASE_URL}/preview/${jobId}/${filename}`;
}

/**
 * Get download URL
 */
export function getDownloadUrl(jobId: string, filename: string): string {
  return `${API_BASE_URL}/download/${jobId}/${filename}`;
}
