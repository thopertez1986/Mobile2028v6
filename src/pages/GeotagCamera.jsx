import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import { format } from "date-fns";
import { useGeolocation } from "../hooks/useGeolocation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Toggle } from "../components/ui/toggle";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Camera,
  Download,
  FlipHorizontal,
  Grid3x3,
  MapPin,
  Package,
  RefreshCcw,
  Settings,
  Upload,
  X,
  Zap,
  ZapOff,
  ZoomIn,
  Type,
  Text,
  Check,
  Save,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "../hooks/use-toast";
import { cn } from "../lib/utils";
import { Header } from "../components/Header";

export default function GeotagCamera() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Camera states
  const [facingMode, setFacingMode] = useState("environment");
  const [flashMode, setFlashMode] = useState("auto");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  // Default logo from /public (can be replaced via upload)
  const [logo, setLogo] = useState("/logome.webp");
  const [capturedImage, setCapturedImage] = useState(null);
  const [showAllControls, setShowAllControls] = useState(false);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Title and subtitle states
  const [title, setTitle] = useState("Geotagged Photo");
  const [subtitle, setSubtitle] = useState("Captured with GPS location");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Video constraints for HD quality
  const videoConstraints = {
    deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined,
    facingMode: devices.length > 1 ? undefined : facingMode,
    width: { ideal: 1920, min: 1280 },
    height: { ideal: 1080, min: 720 },
    frameRate: { ideal: 30, min: 24 },
  };

  // Geolocation
  const {
    location,
    address,
    error: geoError,
    loading: geoLoading,
  } = useGeolocation();

  // Fallback coordinates (used when GPS is unavailable) - Pio Duran, Albay
  const fallbackCoordinates = {
    latitude: 13.0547,
    longitude: 123.5214,
  };

  const effectiveCoordinates = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        source: "gps",
      }
    : {
        latitude: fallbackCoordinates.latitude,
        longitude: fallbackCoordinates.longitude,
        accuracy: null,
        source: "fallback",
      };

  // Initialize with geolocation error handling
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Location Error",
        description: "Unable to fetch location. Using default settings.",
        variant: "destructive",
      });
    }
  }, [geoError]);

  // Get available camera devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(
          (device) => device.kind === "videoinput",
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          const environmentDevice = videoDevices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("environment") ||
              device.label.toLowerCase().includes("rear"),
          );

          if (environmentDevice) {
            setCurrentDeviceId(environmentDevice.deviceId);
            setFacingMode("environment");
          } else {
            setCurrentDeviceId(videoDevices[0].deviceId);
          }
        }
      } catch (err) {
        console.error("Error getting devices:", err);
        toast({
          title: "Camera Error",
          description: "Unable to access camera devices",
          variant: "destructive",
        });
      }
    };

    getDevices();
  }, []);

  // Toggle camera facing mode
  const toggleCamera = () => {
    if (devices.length > 1) {
      const environmentDevice = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment") ||
          device.label.toLowerCase().includes("rear"),
      );
      const userDevice = devices.find(
        (device) =>
          device.label.toLowerCase().includes("front") ||
          device.label.toLowerCase().includes("user"),
      );

      if (facingMode === "environment" && userDevice) {
        setFacingMode("user");
        setCurrentDeviceId(userDevice.deviceId);
      } else if (facingMode === "user" && environmentDevice) {
        setFacingMode("environment");
        setCurrentDeviceId(environmentDevice.deviceId);
      }
    } else {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    }
  };

  // Toggle flash mode
  const toggleFlash = () => {
    setFlashMode((prev) => {
      const next = prev === "off" ? "on" : prev === "on" ? "auto" : "off";
      toast({
        title: `Flash ${next}`,
        description: `Flash mode set to ${next}`,
      });
      return next;
    });
  };

  // Draw overlays on captured image (embeds the info panel content into the saved photo)
  const drawOverlaysOnImage = (imageSrc, captureDateTime) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0);

        const scale = Math.max(1, canvas.width / 1080);
        const margin = Math.round(40 * scale);

        const drawRoundedRect = (x, y, w, h, r) => {
          const radius = Math.max(0, Math.min(r, w / 2, h / 2));
          if (typeof ctx.roundRect === "function") {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, radius);
            return;
          }
          // Manual rounded-rect path fallback
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
          ctx.lineTo(x + w, y + h - radius);
          ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
          ctx.lineTo(x + radius, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
        };

        // ---------- TOP TITLE ----------
        // Always embed title/subtitle so the captured photo includes the same context as the UI
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = Math.round(10 * scale);
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        const titleBoxW = Math.min(
          canvas.width - margin * 2,
          Math.round(860 * scale),
        );
        const titleBoxH = Math.round(110 * scale);
        const titleBoxX = Math.round((canvas.width - titleBoxW) / 2);
        const titleBoxY = Math.round(40 * scale);
        drawRoundedRect(
          titleBoxX,
          titleBoxY,
          titleBoxW,
          titleBoxH,
          Math.round(18 * scale),
        );
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${Math.round(44 * scale)}px Arial, sans-serif`;
        // Always embed title + subtitle in the saved photo
        ctx.fillText(
          title || "Geotagged Photo",
          canvas.width / 2,
          titleBoxY + Math.round(44 * scale),
        );

        if (subtitle) {
          ctx.font = `${Math.round(22 * scale)}px Arial, sans-serif`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fillText(
            subtitle,
            canvas.width / 2,
            titleBoxY + Math.round(82 * scale),
          );
        }
        ctx.restore();

        // ---------- BOTTOM INFO PANEL ----------
        const panelH = Math.round(190 * scale);
        const panelW = canvas.width - margin * 2;
        const panelX = margin;
        const panelY = canvas.height - margin - panelH;

        // Panel background
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = Math.round(14 * scale);
        ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
        drawRoundedRect(panelX, panelY, panelW, panelH, Math.round(20 * scale));
        ctx.fill();
        ctx.restore();

        // Inner layout
        const innerPad = Math.round(18 * scale);
        const contentX = panelX + innerPad;
        const contentY = panelY + innerPad;

        // Always embed logo in the saved photo when available (independent of UI toggle)
        const hasLogo = Boolean(logo);
        const logoSize = Math.round(86 * scale);
        const logoX = contentX;
        const logoY = contentY + Math.round(14 * scale);

        const textStartX = hasLogo
          ? logoX + logoSize + Math.round(18 * scale)
          : contentX;

        const coordsText = `${effectiveCoordinates.latitude.toFixed(5)}, ${effectiveCoordinates.longitude.toFixed(5)}`;
        const accuracyText =
          typeof effectiveCoordinates.accuracy === "number"
            ? ` ±${Math.round(effectiveCoordinates.accuracy)}m`
            : "";
        const sourceText = effectiveCoordinates.source
          ? ` ${effectiveCoordinates.source}`
          : "";

        const dateStr = format(
          captureDateTime || currentDateTime,
          "MMM dd, yyyy",
        );
        const timeStr = format(
          captureDateTime || currentDateTime,
          "hh:mm:ss a",
        );

        // Draw text
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = Math.round(8 * scale);

        // Subtitle line (top)
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.font = `bold ${Math.round(26 * scale)}px Arial, sans-serif`;
        ctx.fillText(
          subtitle || "Captured with GPS location",
          textStartX,
          contentY,
        );

        // Coordinates + address (always embedded in saved photo)
        if (effectiveCoordinates) {
          ctx.fillStyle = "rgba(180, 220, 255, 0.95)";
          ctx.font = `${Math.round(22 * scale)}px Courier New, monospace`;
          ctx.fillText(
            `${coordsText}${accuracyText}${sourceText}`,
            textStartX,
            contentY + Math.round(42 * scale),
          );

          if (address) {
            const addressLine = String(address).slice(0, 90);
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            ctx.font = `${Math.round(18 * scale)}px Arial, sans-serif`;
            ctx.fillText(
              addressLine,
              textStartX,
              contentY + Math.round(74 * scale),
            );
          }
        }

        // Date/time line (bottom)
        ctx.fillStyle = "rgba(220, 230, 240, 0.85)";
        ctx.font = `${Math.round(18 * scale)}px Arial, sans-serif`;
        ctx.fillText(
          `${dateStr}  •  ${timeStr}`,
          textStartX,
          contentY + Math.round(112 * scale),
        );

        ctx.restore();

        // Draw logo (async) then resolve
        if (hasLogo) {
          const logoImg = new Image();
          logoImg.onload = () => {
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
            ctx.shadowBlur = Math.round(10 * scale);
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            ctx.restore();
            resolve(canvas.toDataURL("image/jpeg", 0.95));
          };
          logoImg.onerror = () => {
            resolve(canvas.toDataURL("image/jpeg", 0.95));
          };
          logoImg.src = logo;
        } else {
          resolve(canvas.toDataURL("image/jpeg", 0.95));
        }
      };
      img.src = imageSrc;
    });
  };

  // Handle capture
  const capturePhoto = async () => {
    if (!webcamRef.current) return;

    try {
      // freeze date/time for overlay so it matches the moment of capture
      const captureDateTime = new Date();

      const imageSrc = webcamRef.current.getScreenshot({
        width: 1920,
        height: 1080,
      });

      if (imageSrc) {
        // Add overlays to image (title, subtitle, logo, coordinates, date/time)
        const processedImage = await drawOverlaysOnImage(
          imageSrc,
          captureDateTime,
        );
        setCapturedImage(processedImage);

        toast({
          title: "Photo Captured!",
          description: "Photo saved with embedded overlay details",
        });
      }
    } catch (error) {
      console.error("Capture error:", error);
      toast({
        title: "Capture Failed",
        description: "Unable to capture photo",
        variant: "destructive",
      });
    }
  };

  // Download image
  const downloadImage = () => {
    if (!capturedImage) return;

    try {
      const link = document.createElement("a");
      const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
      const locationStr = location
        ? `_${location.latitude?.toFixed(4) || "0.0000"}N_${location.longitude?.toFixed(4) || "0.0000"}E`
        : "";
      const filename = `geotag_${timestamp}${locationStr}_HD.jpg`;

      link.download = filename;
      link.href = capturedImage;
      link.click();

      toast({
        title: "Photo Downloaded",
        description: `Saved as ${filename}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download image",
        variant: "destructive",
      });
    }
  };

  // Reset capture
  const resetCapture = () => {
    setCapturedImage(null);
  };

  // Toggle all controls visibility
  const toggleAllControls = () => {
    setShowAllControls(!showAllControls);
  };

  // Logo upload
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
        toast({
          title: "Logo Uploaded",
          description: "Your logo has been successfully uploaded",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Upload Failed",
          description: "Unable to read logo file",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  // Save title settings
  const saveTitle = () => {
    setIsEditingTitle(false);
    toast({
      title: "Title Saved",
      description: "Title updated successfully",
    });
  };

  // Save subtitle settings
  const saveSubtitle = () => {
    setIsEditingSubtitle(false);
    toast({
      title: "Subtitle Saved",
      description: "Subtitle updated successfully",
    });
  };

  // Handle key press for title/subtitle editing
  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      if (type === "title") saveTitle();
      else saveSubtitle();
    } else if (e.key === "Escape") {
      if (type === "title") setIsEditingTitle(false);
      else setIsEditingSubtitle(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header title="Geotag Camera HD" showBack />

      <main className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-80px)]">
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera View */}
        <div className="flex-1 bg-black relative overflow-hidden">
          {!capturedImage ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoom})`,
              }}
              onUserMediaError={(error) => {
                console.error("Webcam error:", error);
                toast({
                  title: "Camera Error",
                  description:
                    "Unable to access camera. Please check permissions.",
                  variant: "destructive",
                });
              }}
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Grid Overlay */}
          {showGrid && !capturedImage && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(255,255,255,.1) 25%, rgba(255,255,255,.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.1) 75%, rgba(255,255,255,.1) 76%, transparent 77%, transparent)
                  `,
                  backgroundSize: "50px 50px",
                }}
              />
            </div>
          )}

          {/* Title Display (Center) */}
          {showTitle && !capturedImage && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 max-w-lg">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {title}
                </h2>
              </div>
            </div>
          )}

          {/* VERTICAL CONTROL BUTTONS - RIGHT SIDE */}
          <div className="absolute right-4 top-1/3 flex flex-col gap-3 z-10">
            {/* Flash Control */}
            <Button
              onClick={toggleFlash}
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full hover:bg-yellow-500/20",
                flashMode !== "off" && "bg-yellow-500/30 text-yellow-400",
              )}
              aria-label={`Flash ${flashMode}`}
            >
              {flashMode === "off" ? (
                <ZapOff className="w-5 h-5" />
              ) : flashMode === "on" ? (
                <Zap className="w-5 h-5" />
              ) : (
                <Zap className="w-5 h-5 text-blue-400" />
              )}
            </Button>

            {/* Grid Toggle */}
            <Toggle
              pressed={showGrid}
              onPressedChange={setShowGrid}
              className={cn(
                "w-10 h-10 rounded-full hover:bg-blue-500/20",
                showGrid && "bg-blue-500/30 text-blue-400",
              )}
              aria-label="Toggle grid"
            >
              <Grid3x3 className="w-5 h-5" />
            </Toggle>

            {/* Location Toggle */}
            <Toggle
              pressed={showLocation}
              onPressedChange={setShowLocation}
              className={cn(
                "w-10 h-10 rounded-full hover:bg-green-500/20",
                showLocation && "bg-green-500/30 text-green-400",
              )}
              aria-label="Toggle location"
            >
              <MapPin className="w-5 h-5" />
            </Toggle>

            {/* Title Toggle */}
            <Toggle
              pressed={showTitle}
              onPressedChange={setShowTitle}
              className={cn(
                "w-10 h-10 rounded-full hover:bg-purple-500/20",
                showTitle && "bg-purple-500/30 text-purple-400",
              )}
              aria-label="Toggle title"
            >
              <Type className="w-5 h-5" />
            </Toggle>

            {/* Logo Toggle */}
            <Toggle
              pressed={showLogo}
              onPressedChange={setShowLogo}
              className={cn(
                "w-10 h-10 rounded-full hover:bg-pink-500/20",
                showLogo && "bg-pink-500/30 text-pink-400",
              )}
              aria-label="Toggle logo"
            >
              <Package className="w-5 h-5" />
            </Toggle>
          </div>

          {/* Zoom Indicator */}
          {zoom > 1 && !capturedImage && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 border border-white/20 z-10">
              <ZoomIn className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">
                {zoom.toFixed(1)}x
              </span>
            </div>
          )}

          {/* Settings/Controls Toggle Button - TOP RIGHT */}
          <Button
            onClick={toggleAllControls}
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 border-white/30 z-10 shadow-lg"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </Button>

          {/* Bottom Container - info panel + capture button */}
          {!capturedImage && !showAllControls && (
            <div
              className="absolute bottom-4 left-4 right-4 flex items-end gap-3 z-10"
              data-testid="geotag-camera-bottom-bar"
            >
              {/* Info Panel (flex-1) */}
              <div
                className="flex-1 min-w-0"
                data-testid="geotag-camera-info-panel"
              >
                <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-lg">
                  <div className="flex items-start gap-3">
                    {showLogo && logo && (
                      <div
                        className="flex-shrink-0"
                        data-testid="geotag-camera-logo"
                      >
                        <img
                          src={logo}
                          alt="Logo"
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Line 1: Subtitle / status */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          {showTitle && subtitle ? (
                            <div className="text-sm font-semibold text-white truncate">
                              {subtitle}
                            </div>
                          ) : (
                            <div className="text-sm font-semibold text-white/90">
                              Photo ready
                            </div>
                          )}
                        </div>

                        <div
                          className="text-[10px] text-white/60 flex-shrink-0"
                          data-testid="geotag-camera-location-status"
                        >
                          {geoLoading
                            ? "Locating…"
                            : geoError
                              ? "Location off"
                              : "GPS on"}
                        </div>
                      </div>

                      {/* Line 2: Coordinates (always visible when Location toggle is on) */}
                      {showLocation && (
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-blue-200">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span
                            className="font-mono tracking-tight"
                            data-testid="geotag-camera-coordinates"
                          >
                            {effectiveCoordinates.latitude.toFixed(5)},{" "}
                            {effectiveCoordinates.longitude.toFixed(5)}
                            {typeof effectiveCoordinates.accuracy ===
                              "number" && (
                              <span className="font-sans text-white/60 ml-2">
                                ±{Math.round(effectiveCoordinates.accuracy)}m
                              </span>
                            )}
                            <span className="font-sans text-white/50 ml-2 uppercase tracking-wide">
                              {effectiveCoordinates.source}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Line 3: Date/time */}
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-300">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span data-testid="geotag-camera-date">
                          {format(currentDateTime, "MMM dd, yyyy")}
                        </span>
                        <span className="mx-1">•</span>
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span data-testid="geotag-camera-time">
                          {format(currentDateTime, "hh:mm:ss a")}
                        </span>
                      </div>

                      {/* Optional address */}
                      {showLocation && address && (
                        <div
                          className="mt-1 text-[10px] text-white/60 truncate"
                          title={address}
                          data-testid="geotag-camera-address"
                        >
                          {address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capture Button - pinned to the right */}
              <div
                className="flex-shrink-0 ml-auto"
                data-testid="geotag-camera-capture-container"
              >
                <Button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                  size="icon"
                  aria-label="Capture photo"
                  data-testid="geotag-camera-capture-button"
                >
                  <Camera className="w-14 h-14" />
                </Button>
              </div>
            </div>
          )}

          {/* All Controls Overlay */}
          {showAllControls && !capturedImage && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-end p-4 z-20 animate-in slide-in-from-bottom duration-300">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Title & Subtitle Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Title & Subtitle
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title" className="text-white/80">
                        Title
                      </Label>
                      <Toggle
                        pressed={showTitle}
                        onPressedChange={setShowTitle}
                        size="sm"
                        className="h-8"
                      >
                        {showTitle ? "Visible" : "Hidden"}
                      </Toggle>
                    </div>

                    {isEditingTitle ? (
                      <div className="flex gap-2">
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, "title")}
                          className="flex-1 bg-white/10 border-white/20 text-white"
                          placeholder="Enter title"
                          autoFocus
                        />
                        <Button
                          onClick={saveTitle}
                          size="icon"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setIsEditingTitle(false)}
                          variant="outline"
                          size="icon"
                          className="border-white/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditingTitle(true)}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <div className="text-white font-medium">{title}</div>
                        <div className="text-xs text-white/60 mt-1">
                          Click to edit
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subtitle" className="text-white/80">
                      Subtitle
                    </Label>
                    {isEditingSubtitle ? (
                      <div className="flex gap-2">
                        <Input
                          id="subtitle"
                          value={subtitle}
                          onChange={(e) => setSubtitle(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, "subtitle")}
                          className="flex-1 bg-white/10 border-white/20 text-white"
                          placeholder="Enter subtitle"
                          autoFocus
                        />
                        <Button
                          onClick={saveSubtitle}
                          size="icon"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setIsEditingSubtitle(false)}
                          variant="outline"
                          size="icon"
                          className="border-white/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditingSubtitle(true)}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <div className="text-white">{subtitle}</div>
                        <div className="text-xs text-white/60 mt-1">
                          Click to edit
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <ZoomIn className="w-4 h-4 text-white/70" />
                      <span className="text-white/70">Zoom Level</span>
                    </div>
                    <span className="text-white font-bold">
                      {(zoom * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    className="w-full"
                  />
                </div>

                {/* Camera Controls */}
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    onClick={toggleCamera}
                    variant="outline"
                    className="w-full h-12 bg-white/10 hover:bg-white/20 border-white/20"
                  >
                    <FlipHorizontal className="w-6 h-6 text-white mr-2" />
                    Flip
                  </Button>

                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/70 mb-1">Flash</span>
                    <Button
                      onClick={toggleFlash}
                      variant="outline"
                      size="icon"
                      className={cn(
                        "w-12 h-12",
                        flashMode !== "off" &&
                          "bg-yellow-500/30 border-yellow-500/50",
                      )}
                    >
                      {flashMode === "off" ? (
                        <ZapOff className="w-6 h-6 text-white" />
                      ) : flashMode === "on" ? (
                        <Zap className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <Zap className="w-6 h-6 text-blue-400" />
                      )}
                    </Button>
                    <span className="text-xs text-white/70 mt-1 capitalize">
                      {flashMode}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/70 mb-1">Camera</span>
                    <div className="text-xs text-white font-medium capitalize">
                      {facingMode === "environment" ? "Rear" : "Front"}
                    </div>
                  </div>
                </div>

                {/* Toggle Controls Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Toggle
                    pressed={showGrid}
                    onPressedChange={setShowGrid}
                    className={cn(
                      "h-12 justify-start gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4",
                      showGrid && "bg-blue-500/30 border-blue-500/50",
                    )}
                  >
                    <Grid3x3 className="w-5 h-5" />
                    <span className="text-white">Grid Lines</span>
                  </Toggle>

                  <Toggle
                    pressed={showLocation}
                    onPressedChange={setShowLocation}
                    className={cn(
                      "h-12 justify-start gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4",
                      showLocation && "bg-green-500/30 border-green-500/50",
                    )}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="text-white">Location</span>
                  </Toggle>

                  <Toggle
                    pressed={showLogo}
                    onPressedChange={setShowLogo}
                    className={cn(
                      "h-12 justify-start gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4",
                      showLogo && "bg-purple-500/30 border-purple-500/50",
                    )}
                  >
                    <Package className="w-5 h-5" />
                    <span className="text-white">Logo</span>
                  </Toggle>

                  {/* Logo Upload */}
                  <div {...getRootProps()} className="h-12">
                    <input {...getInputProps()} />
                    <Button
                      variant="outline"
                      className="w-full h-full justify-start gap-3 bg-white/10 hover:bg-white/20 border border-white/20"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-white">Upload Logo</span>
                    </Button>
                  </div>
                </div>

                {/* Capture Button */}
                <Button
                  onClick={capturePhoto}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  <Camera className="w-12 h-12" />
                  Capture HD Photo
                </Button>

                {/* Close Button */}
                <Button
                  onClick={() => setShowAllControls(false)}
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold py-3 rounded-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Close Controls
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Controls */}
        {capturedImage && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col justify-end p-6 z-30 animate-in fade-in duration-300">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Photo Captured!
                </h3>
                <p className="text-white/70 text-sm">
                  HD quality with geotagging and overlays
                </p>
              </div>

              <Button
                onClick={downloadImage}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg"
              >
                <Download className="w-6 h-6" />
                Download HD Photo
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={resetCapture}
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold py-3 rounded-lg"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>

                <Button
                  onClick={() => setCapturedImage(null)}
                  variant="outline"
                  className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300 font-bold py-3 rounded-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
