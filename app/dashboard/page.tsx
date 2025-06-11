'use client';

import { useEffect, useRef, useState } from 'react';
import { useInference } from '@/hooks/useInference';
import useSendEmail from '@/hooks/useSendEmail';
import { getCredentials } from '@/helper/general';
import { useRouter } from 'next/navigation';
export default function LiveDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestPending = useRef(false);
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [detected, setDetected] = useState(false);
  const { runInference } = useInference();

  const {email , password} = getCredentials();  
  const navigate = useRouter();

  useEffect(() => {
    const startVideo = async () => {
      if (!email || !password) return navigate.push("/");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    startVideo();
  }, []);

  useEffect(() => {
    let lastRun = 0;
    const throttleDelay = 0;

    const detectLoop = async () => {
      const now = Date.now();
      if (
        videoRef.current &&
        captureCanvasRef.current &&
        overlayCanvasRef.current &&
        !requestPending.current &&
        now - lastRun >= throttleDelay
      ) {
        requestPending.current = true;
        await captureAndDetect();
        lastRun = Date.now();
        requestPending.current = false;
      }
      requestAnimationFrame(detectLoop);
    };

    detectLoop();
  }, []);

  useEffect(() => {
    if (detected && !emailTimerRef.current) {
      emailTimerRef.current = setInterval(() => {
        sendFaceImage();
      }, 10000); 
    } else if (!detected && emailTimerRef.current) {
      clearInterval(emailTimerRef.current);
      emailTimerRef.current = null;
    }

    return () => {
      if (emailTimerRef.current) {
        clearInterval(emailTimerRef.current);
        emailTimerRef.current = null;
      }
    };
  }, [detected]);

  const captureAndDetect = async () => {
    const video = videoRef.current!;
    const captureCanvas = captureCanvasRef.current!;
    const ctx = captureCanvas.getContext('2d')!;
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const blob = await new Promise<Blob>((res) =>
      captureCanvas.toBlob(res as any, 'image/jpeg')
    );

    try {
      const result = await runInference(blob!);
      const predictions = result?.outputs?.[0]?.predictions?.predictions || [];

      const facePredictions = predictions.filter(
        (p: any) => p.class === 'face' || p.label === 'face'
      );

      drawBoxes(facePredictions);
      setDetected(facePredictions.length > 0);
    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  const sendFaceImage = async () => {
    const video = videoRef.current!;
    const canvas = captureCanvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const base64 = canvas.toDataURL('image/jpeg'); 

    try {
      const res = await useSendEmail(base64, email, password);
      console.log(res)
       
    } catch (err) {
      console.error('Email sending failed', err);
    }
  };

  const drawBoxes = (predictions: any[]) => {
    const canvas = overlayCanvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = videoRef.current!.videoWidth;
    canvas.height = videoRef.current!.videoHeight;

    predictions.forEach((pred) => {
      const { x, y, width, height, class: label, confidence } = pred;
      const x1 = x - width / 4;
      const y1 = y - height / 4;

      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, width, height);

      ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.font = '15px sans-serif';
      ctx.fillText(
        `${label} (${(confidence * 100).toFixed(1)}%)`,
        x1 + 5,
        y1 - 5
      );
    });
  };

  return (
    <div className="relative w-fit flex items-center justify-center">
      <video ref={videoRef} autoPlay muted playsInline className="rounded w-screen object-contain h-screen" />
      <canvas ref={captureCanvasRef} className="hidden" />
      <canvas
        ref={overlayCanvasRef}
        className="absolute top-0 left-0 w-screen h-screen object-contain"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
