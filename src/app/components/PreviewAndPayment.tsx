"use client";
import { useState } from 'react';

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

interface PaymentInfo {
  job_id: string;
  amount: number;
  currency: string;
  song_title: string;
  stems: string[];
  payment_completed: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getPaymentInfo(jobId: string): Promise<PaymentInfo> {
  const response = await fetch(`${API_BASE_URL}/payment/${jobId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get payment info');
  }
  return response.json();
}

async function completePayment(jobId: string): Promise<{ message: string; job_id: string }> {
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

function getPreviewUrl(jobId: string, filename: string): string {
  return `${API_BASE_URL}/preview/${jobId}/${filename}`;
}

function getDownloadUrl(jobId: string, filename: string): string {
  return `${API_BASE_URL}/download/${jobId}/${filename}`;
}

interface PreviewAndPaymentProps {
  job: JobStatus;
  onPaymentComplete: () => void;
}

export default function PreviewAndPayment({ job, onPaymentComplete }: PreviewAndPaymentProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const handlePreviewPlay = (stemName: string, previewUrl: string) => {
    if (isPlaying === stemName) {
      // Stop playing
      setIsPlaying(null);
      const audio = document.getElementById(`audio-${stemName}`) as HTMLAudioElement;
      audio?.pause();
    } else {
      // Start playing
      setIsPlaying(stemName);
      const audio = document.getElementById(`audio-${stemName}`) as HTMLAudioElement;
      audio?.play();
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(null);
  };

  const handlePayment = async () => {
    if (!paymentInfo) {
      try {
        const info = await getPaymentInfo(job.job_id);
        setPaymentInfo(info);
      } catch (error) {
        console.error('Failed to get payment info:', error);
        return;
      }
    }

    setIsProcessingPayment(true);
    
    try {
      // In a real implementation, you would integrate with Stripe or PayPal here
      // For now, we'll simulate payment completion
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
      
      await completePayment(job.job_id);
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownload = (stemName: string, downloadUrl: string) => {
    if (job.payment_required && !job.payment_completed) {
      alert('Payment required to download full stems');
      return;
    }

    // Create download link
    const filename = downloadUrl.split('/').pop() || '';
    const link = document.createElement('a');
    link.href = getDownloadUrl(job.job_id, filename);
    link.download = `${job.song_title}_${stemName}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Song Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {job.song_title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Duration: {Math.floor(job.song_duration / 60)}:{String(job.song_duration % 60).padStart(2, '0')}
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Processing Complete
          </div>
        </div>

        {/* Stems Preview */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
            Preview Your Stems
          </h3>
          
          {Object.entries(job.preview_urls).map(([stemName, previewUrl]) => (
            <div key={stemName} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {stemName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {stemName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      30-second preview
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Preview Button */}
                  <button
                    onClick={() => handlePreviewPlay(stemName, previewUrl as string)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isPlaying === stemName
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isPlaying === stemName ? (
                      <>
                        <span className="w-4 h-4 flex items-center justify-center">⏸️</span>
                        Stop
                      </>
                    ) : (
                      <>
                        <span className="w-4 h-4 flex items-center justify-center">▶️</span>
                        Preview
                      </>
                    )}
                  </button>
                  
                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(stemName, job.download_urls[stemName])}
                    disabled={job.payment_required && !job.payment_completed}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      job.payment_required && !job.payment_completed
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">⬇️</span>
                    {job.payment_required && !job.payment_completed ? 'Requires Payment' : 'Download'}
                  </button>
                </div>
              </div>
              
              {/* Hidden Audio Element */}
              <audio
                id={`audio-${stemName}`}
                onEnded={handleAudioEnded}
                preload="none"
              >
                <source src={getPreviewUrl(job.job_id, (previewUrl as string).split('/').pop() || '')} type="audio/mpeg" />
              </audio>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        {job.payment_required && !job.payment_completed && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Ready to Download?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pay $3 to download full-quality WAV files of your separated stems.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-500">✓</span>
                Studio-quality WAV files
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-500">✓</span>
                Instant download
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-500">✓</span>
                No subscription
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                'Pay $3 & Download →'
              )}
            </button>
          </div>
        )}

        {/* Payment Complete */}
        {job.payment_completed && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
              Payment Complete!
            </h3>
            <p className="text-green-600 dark:text-green-400">
              You can now download all your stems in full quality.
            </p>
          </div>
        )}

        {/* Start New Job */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ← Split Another Song
          </button>
        </div>
      </div>
    </div>
  );
}
