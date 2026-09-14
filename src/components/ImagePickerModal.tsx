import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  RefreshCw,
  Check,
  UploadCloud,
  AlertCircle,
  SwitchCamera,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  currentImageUrl: string;
  userName?: string;
  isBanner?: boolean;
  onImageSelected: (newImageUrl: string) => void;
  initialTab?: 'gallery' | 'camera' | 'url';
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  currentImageUrl,
  userName = 'User',
  isBanner = false,
  onImageSelected,
  initialTab = 'gallery',
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'camera' | 'monogram' | 'url'>('gallery');
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl || '');

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentImageUrl || '');
      setUrlInput(currentImageUrl || '');
      setCapturedSnapshot(null);
      setCameraError(null);
      setCountdown(null);
      setActiveTab(initialTab);
    } else {
      stopCamera();
    }
  }, [isOpen, currentImageUrl, initialTab]);

  // Clean up or trigger camera on tab changes
  useEffect(() => {
    if (activeTab === 'camera' && isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, isOpen, facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);
    setCapturedSnapshot(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Live camera access is not supported by your browser.');
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: isBanner ? 1280 : 640 },
          height: { ideal: isBanner ? 720 : 640 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser or select an image from your device gallery.'
          : 'Unable to start camera preview. Please check permissions or choose from your gallery.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Trigger camera snapshot capture
  const doCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    const targetWidth = isBanner ? 1200 : 500;
    const targetHeight = isBanner ? 500 : 500;

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    // Frame calculation
    const videoAspect = video.videoWidth / video.videoHeight;
    const canvasAspect = targetWidth / targetHeight;

    let sx = 0,
      sy = 0,
      sWidth = video.videoWidth,
      sHeight = video.videoHeight;

    if (videoAspect > canvasAspect) {
      sWidth = video.videoHeight * canvasAspect;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      sHeight = video.videoWidth / canvasAspect;
      sy = (video.videoHeight - sHeight) / 2;
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedSnapshot(dataUrl);
    setPreviewUrl(dataUrl);
    stopCamera();
  };

  const capturePhotoWithCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          doCapture();
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  const retakePhoto = () => {
    setCapturedSnapshot(null);
    startCamera(facingMode);
  };

  // Handle file chosen from gallery / disk
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processImageFile(files[0]);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = isBanner ? 1280 : 640;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPreviewUrl(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    let finalUrl = previewUrl;
    if (activeTab === 'url') {
      finalUrl = urlInput.trim();
    } else if (activeTab === 'monogram') {
      finalUrl = '';
    }
    onImageSelected(finalUrl);
    onClose();
  };

  const handleSetMonogramBlank = () => {
    setPreviewUrl('');
    setUrlInput('');
    setCapturedSnapshot(null);
    onImageSelected('');
    onClose();
  };

  // Helper to get first letter of first word for display
  const getFirstLetter = (nameStr: string) => {
    if (!nameStr || !nameStr.trim()) return 'U';
    const cleaned = nameStr.trim().replace(/^[@"'#\s]+/, '');
    const firstWord = cleaned.split(/\s+/)[0];
    return (firstWord ? firstWord.charAt(0) : 'U').toUpperCase();
  };

  const firstLetter = getFirstLetter(userName);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card-warm-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--card-border)] relative flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-amber)]/15 text-[var(--accent-amber)] flex items-center justify-center border border-[var(--accent-amber)]/30 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {subtitle || 'Take a photo with camera, upload from gallery, or use letter monogram'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--card-inner-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--card-inner-bg)] rounded-2xl border border-[var(--card-inner-border)] my-4">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
            <span className="hidden xs:inline">Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
            <span className="hidden xs:inline">Camera</span>
          </button>

          {!isBanner && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('monogram');
                setPreviewUrl('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'monogram'
                  ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
              <span className="hidden xs:inline">Letter ({firstLetter})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[var(--accent-amber)]" />
            <span className="hidden xs:inline">URL</span>
          </button>
        </div>

        {/* Content Tabs */}
        <div className="space-y-4 flex-1">
          
          {/* TAB 1: Gallery / Device File */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--card-inner-border)] hover:border-[var(--accent-amber)] bg-[var(--card-inner-bg)] rounded-2xl p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    Choose from Device Gallery / Photos
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Drag &amp; drop or click to browse photos (JPG, PNG, WebP)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-md hover:opacity-90 flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Browse Photos</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Camera Stream & Capture */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Camera Access Required</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed">{cameraError}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => startCamera(facingMode)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className="px-3 py-1.5 rounded-lg bg-[var(--card-inner-bg)] text-[var(--text-primary)] font-semibold text-xs border border-[var(--card-inner-border)] cursor-pointer"
                      >
                        Use Gallery Instead
                      </button>
                    </div>
                  </div>
                </div>
              ) : capturedSnapshot ? (
                <div className="space-y-3 text-center">
                  <div className={`overflow-hidden rounded-2xl border-2 border-[var(--accent-amber)] bg-black mx-auto shadow-xl ${isBanner ? 'h-48 w-full' : 'w-48 h-48'}`}>
                    <img
                      src={capturedSnapshot}
                      alt="Captured photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-primary)] border border-[var(--card-inner-border)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                    </button>
                    <span className="text-xs text-[#10B981] font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Snapshot Ready!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <div className={`relative overflow-hidden rounded-2xl border-2 border-[var(--card-inner-border)] bg-black mx-auto shadow-lg ${isBanner ? 'h-48 w-full' : 'w-56 h-56'}`}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />

                    {/* Camera Flash overlay */}
                    {isFlashing && (
                      <div className="absolute inset-0 bg-white z-20 animate-out fade-out duration-200 pointer-events-none" />
                    )}

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                      <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center text-white text-5xl font-black animate-ping">
                        {countdown}
                      </div>
                    )}

                    {!isCameraActive && (
                      <div className="absolute inset-0 flex items-center justify-center text-white/80 text-xs bg-black/80">
                        Starting camera preview...
                      </div>
                    )}

                    {/* Camera Switcher */}
                    {isCameraActive && (
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                        title="Flip Camera (Front/Back)"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={doCapture}
                      disabled={!isCameraActive || countdown !== null}
                      className="px-6 py-2.5 rounded-full text-xs font-bold bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Photo Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={capturePhotoWithCountdown}
                      disabled={!isCameraActive || countdown !== null}
                      className="px-3.5 py-2.5 rounded-full text-xs font-semibold bg-[var(--card-inner-bg)] hover:bg-[var(--card-inner-border)] text-[var(--text-primary)] border border-[var(--card-inner-border)] cursor-pointer"
                      title="3-Second Timer"
                    >
                      <span>⏱️ 3s</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Letter Monogram / Blank */}
          {activeTab === 'monogram' && !isBanner && (
            <div className="p-5 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] text-center space-y-4">
              <div className="flex justify-center">
                <UserAvatar
                  name={userName}
                  avatarUrl=""
                  size="2xl"
                  shape="squircle"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  Letter Monogram: "{firstLetter}"
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                  Displays the letter of the first word of your name (<span className="font-semibold text-[var(--text-primary)]">{userName.split(' ')[0] || 'User'}</span>) on a styled badge matching your active color palette.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSetMonogramBlank}
                className="px-5 py-2 rounded-full text-xs font-bold bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-md hover:opacity-90 cursor-pointer"
              >
                Use Letter Monogram
              </button>
            </div>
          )}

          {/* TAB 4: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Image Web Address (URL)
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl px-4 py-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--accent-amber)]"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                Direct web link to an image file (.jpg, .png, .webp).
              </p>
            </div>
          )}

          {/* Live Preview Container */}
          <div className="pt-3 border-t border-[var(--card-border)]">
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="p-3.5 rounded-2xl bg-[var(--card-inner-bg)] border border-[var(--card-inner-border)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {isBanner ? (
                  <div className="w-28 h-16 rounded-xl overflow-hidden bg-black/20 border border-[var(--card-border)] flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] italic">No Banner (Blank)</span>
                    )}
                  </div>
                ) : (
                  <UserAvatar
                    name={userName}
                    avatarUrl={previewUrl}
                    size="lg"
                  />
                )}
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {previewUrl ? 'Custom Image' : `Letter Monogram ("${firstLetter}")`}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {previewUrl
                      ? 'Custom photo ready to apply.'
                      : 'Shows the initial of your first word.'}
                  </p>
                </div>
              </div>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleSetMonogramBlank}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Remove image and use letter monogram"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Use Letter</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-[var(--card-border)] mt-4">
          <button
            type="button"
            onClick={handleSetMonogramBlank}
            className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
          >
            Reset to Monogram ({firstLetter})
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-full text-xs font-bold bg-[var(--accent-amber)] text-[var(--nav-item-active-text,#181614)] shadow-md hover:opacity-90 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Photo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
