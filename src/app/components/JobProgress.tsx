"use client";
import { useState, useEffect, useRef } from 'react';

// API types
interface JobStatus {
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

interface JobUpdate {
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_BASE_URL}/job/${jobId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get job status');
  }
  return response.json();
}

function createJobWebSocket(
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

interface JobProgressProps {
  jobId: string;
  onComplete: (job: JobStatus) => void;
  onError: (error: string) => void;
}

export default function JobProgress({ jobId, onComplete, onError }: JobProgressProps) {
  const [status, setStatus] = useState<string>('pending');
  const [message, setMessage] = useState<string>('Initializing...');
  const [progress, setProgress] = useState<number>(0);
  const [songTitle, setSongTitle] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  
  // Use refs to store the latest callbacks
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  
  // Update refs when props change
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

  useEffect(() => {
    // Prevent multiple polling for the same job
    if (!jobId) return;
    
    let isActive = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const pollJobStatus = async () => {
      if (!isActive) return;
      
      try {
        const job = await getJobStatus(jobId);
        
        if (!isActive) return; // Check again after async call
        
        setStatus(job.status);
        setMessage(`Status: ${job.status}`);
        setSongTitle(job.song_title || '');
        
        // Set progress based on status
        let newProgress = 0;
        switch (job.status) {
          case 'pending':
            newProgress = 5;
            break;
          case 'downloading':
            newProgress = 30;
            break;
          case 'processing':
            newProgress = 70;
            break;
          case 'completed':
            newProgress = 100;
            break;
        }
        setProgress(newProgress);
        
        if (job.status === 'completed') {
          onCompleteRef.current(job);
          return; // Stop polling
        } else if (job.status === 'failed') {
          onErrorRef.current(job.error_message || 'Processing failed');
          return; // Stop polling
        }
        
        // Continue polling for active jobs
        if (isActive && (job.status === 'pending' || job.status === 'downloading' || job.status === 'processing')) {
          pollInterval = setTimeout(pollJobStatus, 3000); // Increased to 3 seconds to reduce load
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        if (isActive) {
          onErrorRef.current('Failed to check job status');
        }
      }
    };

    // Start initial polling
    pollJobStatus();
    
    return () => {
      isActive = false;
      if (pollInterval) {
        clearTimeout(pollInterval);
      }
    };
  }, [jobId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'downloading':
        return 'text-blue-600';
      case 'processing':
        return 'text-purple-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'downloading':
        return '⬇️';
      case 'processing':
        return '🎵';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⚡';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Song Title */}
        {songTitle && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {songTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Job ID: {jobId}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">
            {getStatusIcon(status)}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        {(status === 'downloading' || status === 'processing') && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progress, 5)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {status !== 'completed' && status !== 'failed' && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {(status === 'downloading' || status === 'processing') && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This usually takes 5-10 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
