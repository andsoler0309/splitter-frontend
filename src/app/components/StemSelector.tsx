"use client";
import { useState } from 'react';
import JobProgress from './JobProgress';
import PreviewAndPayment from './PreviewAndPayment';

// API types and functions
interface SplitRequest {
  youtube_url: string;
  stems: string[];
}

interface SplitResponse {
  job_id: string;
  status: string;
  message: string;
}

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function startSplit(request: SplitRequest): Promise<SplitResponse> {
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

type AppState = 'input' | 'processing' | 'preview' | 'error';

export default function StemSelector() {
  const [selectedStem, setSelectedStem] = useState<'bass' | 'drums' | 'vocals'>('vocals');
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>('input');
  const [jobId, setJobId] = useState<string>('');
  const [completedJob, setCompletedJob] = useState<JobStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    if (!url.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    try {
      setIsSubmitting(true);
      setAppState('processing');
      setErrorMessage('');
      
      const response = await startSplit({
        youtube_url: url,
        stems: [selectedStem]
      });
      
      setJobId(response.job_id);
      
    } catch (error) {
      console.error('Failed to start split:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start processing');
      setAppState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJobComplete = (job: JobStatus) => {
    setCompletedJob(job);
    setAppState('preview');
  };

  const handleJobError = (error: string) => {
    setErrorMessage(error);
    setAppState('error');
  };

  const handlePaymentComplete = () => {
    if (completedJob) {
      setCompletedJob({
        ...completedJob,
        payment_completed: true
      });
    }
  };

  const resetToInput = () => {
    setAppState('input');
    setJobId('');
    setCompletedJob(null);
    setErrorMessage('');
    setUrl('');
    setIsSubmitting(false);
  };

  // Render based on current state
  if (appState === 'processing' && jobId) {
    return (
      <div className="mt-10">
        <JobProgress 
          jobId={jobId}
          onComplete={handleJobComplete}
          onError={handleJobError}
        />
      </div>
    );
  }

  if (appState === 'preview' && completedJob) {
    return (
      <div className="mt-10">
        <PreviewAndPayment 
          job={completedJob}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className="mt-10">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">❌</div>
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
              Processing Failed
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {errorMessage}
            </p>
            <button
              onClick={resetToInput}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default input state
  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:gap-6">
        <input
          required
          type="url"
          inputMode="url"
          placeholder="Paste YouTube URL (https://...)"
          className="shadow-lg rounded-xl border-2 border-gray-200 px-6 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200/50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 transition-all duration-200"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`rounded-xl px-8 py-4 text-lg font-bold text-white shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isSubmitting ? 'Starting...' : 'Split Now →'}
        </button>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Select stem type:</span>
        <div className="flex gap-2">
          {(['bass', 'drums', 'vocals'] as const).map((stem) => (
            <label key={stem} className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="stem" 
                value={stem} 
                checked={selectedStem === stem}
                onChange={(e) => setSelectedStem(e.target.value as typeof selectedStem)}
                className="sr-only" 
              />
              <span className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 shadow-lg ${
                selectedStem === stem
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-transparent'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
              }`}>
                {selectedStem === stem && '● '}
                {stem.charAt(0).toUpperCase() + stem.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        💰 Only $3 per split • ⚡ Results in 5-10 minutes • 🎵 Studio-quality output
      </div>
    </div>
  );
}
