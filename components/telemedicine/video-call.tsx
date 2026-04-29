'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, apiGet } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Minimize2, Maximize2, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

interface TelemedicineProps {
  appointmentId: string;
  doctorName?: string;
  patientName?: string;
}

export function VideoCall({ appointmentId, doctorName = 'Doctor', patientName = 'Patient' }: TelemedicineProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Initialize telemedicine session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setStatus('connecting');
        setError(null);

        // Start telemedicine session
        const response = await apiPost('/api/telemedicine/sessions', {
          appointmentId,
        });

        if (response.success) {
          setSessionId(response.data.session.id);
          setStatus('connected');
          // In production, you would initialize Agora SDK here
        } else {
          setError(response.error || 'Failed to start session');
          setStatus('error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
        setStatus('error');
      }
    };

    if (appointmentId) {
      initializeSession();
    }
  }, [appointmentId]);

  // Track call duration
  useEffect(() => {
    if (status !== 'connected') return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    if (window.confirm('Are you sure you want to end this call?')) {
      router.push('/patient/appointments');
    }
  };

  return (
    <div className={`bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="w-full h-screen flex flex-col">
        {/* Video Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {status === 'connecting' && (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p>Connecting to {doctorName}...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center text-white max-w-md">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Connection Error</p>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button
                onClick={() => router.push('/patient/appointments')}
                className="bg-red-600 hover:bg-red-700"
              >
                Return to Appointments
              </Button>
            </div>
          )}

          {status === 'connected' && (
            <>
              {/* Remote Video (Placeholder) */}
              <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center relative">
                <div className="text-center text-white">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold">{doctorName}</p>
                  <p className="text-sm text-gray-400">Connected</p>
                </div>

                {/* Local Video (Placeholder) */}
                <div className="absolute bottom-4 right-4 w-32 h-32 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    {videoEnabled ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-2">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs">{patientName}</p>
                      </>
                    ) : (
                      <VideoOff className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Call Info Bar */}
              <div className="bg-gray-900 border-t border-gray-700 px-4 py-3 flex items-center justify-between text-white">
                <div className="text-sm">
                  <p className="font-semibold">{doctorName}</p>
                  <p className="text-gray-400">{formatDuration(callDuration)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        {status === 'connected' && (
          <div className="bg-gray-900 border-t border-gray-700 px-4 py-4 flex items-center justify-center gap-4">
            <Button
              onClick={() => setMicEnabled(!micEnabled)}
              variant={micEnabled ? 'default' : 'destructive'}
              className="gap-2"
            >
              {micEnabled ? (
                <>
                  <Mic className="w-4 h-4" />
                  Mic
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4" />
                  Mic Off
                </>
              )}
            </Button>

            <Button
              onClick={() => setVideoEnabled(!videoEnabled)}
              variant={videoEnabled ? 'default' : 'destructive'}
              className="gap-2"
            >
              {videoEnabled ? (
                <>
                  <Video className="w-4 h-4" />
                  Video
                </>
              ) : (
                <>
                  <VideoOff className="w-4 h-4" />
                  Video Off
                </>
              )}
            </Button>

            <div className="border-l border-gray-700 h-10" />

            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="outline"
              className="gap-2"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  Fullscreen
                </>
              )}
            </Button>

            <Button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 gap-2"
            >
              <Phone className="w-4 h-4" />
              End Call
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
