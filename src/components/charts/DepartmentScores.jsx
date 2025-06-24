import React, { useState, useEffect } from "react";

const DepartmentScores = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwe-Bvd7px2trl1lu2uvWnOtrawtso8LSdUsBCGC23w5G5wZMwcSi61pnbncvUBA0Gd-w/exec";

  const fetchImageFromScript = async () => {
    try {
      setLoading(true);
      setStatus("🔄 Loading image from Google Script...");
      setError(null);

      const requestUrl = `${GOOGLE_SCRIPT_URL}?action=getGraphImage&timestamp=${Date.now()}`;
      console.log("🌐 Requesting:", requestUrl);

      // ✅ Try fetch first
      try {
        const response = await fetch(requestUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response ok:", response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log("📄 Response data keys:", Object.keys(data));
          console.log("📄 Has image:", !!data.departmentScoreGraphImage);
          console.log(
            "📄 Image length:",
            data.departmentScoreGraphImage?.length || 0
          );

          if (data.departmentScoreGraphImage) {
            const base64Image = `data:image/png;base64,${data.departmentScoreGraphImage}`;
            setImageUrl(base64Image);
            setStatus("✅ Image loaded successfully via fetch!");
            setDebugInfo({
              method: "fetch",
              success: true,
              imageSize: data.departmentScoreGraphImage.length,
              timestamp: new Date().toLocaleTimeString(),
            });
            return;
          }
        }
      } catch (fetchError) {
        console.log("❌ Fetch failed:", fetchError.message);
        setStatus("⚠️ Fetch failed, trying JSONP...");
      }

      // ✅ JSONP fallback (यह definitely काम करेगा)
      await new Promise((resolve, reject) => {
        const callbackName = `jsonp_callback_${Date.now()}`;
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error("JSONP timeout"));
        }, 15000);

        const cleanup = () => {
          clearTimeout(timeoutId);
          if (window[callbackName]) {
            delete window[callbackName];
          }
          const script = document.getElementById(callbackName);
          if (script) {
            script.remove();
          }
        };

        window[callbackName] = (data) => {
          console.log("📄 JSONP Response received:", Object.keys(data));
          console.log("📄 JSONP Has image:", !!data.departmentScoreGraphImage);

          cleanup();

          if (data.departmentScoreGraphImage) {
            const base64Image = `data:image/png;base64,${data.departmentScoreGraphImage}`;
            setImageUrl(base64Image);
            setStatus("✅ Image loaded successfully via JSONP!");
            setDebugInfo({
              method: "jsonp",
              success: true,
              imageSize: data.departmentScoreGraphImage.length,
              timestamp: new Date().toLocaleTimeString(),
            });
            resolve();
          } else {
            reject(new Error("No image data in JSONP response"));
          }
        };

        const script = document.createElement("script");
        script.id = callbackName;
        script.src = `${GOOGLE_SCRIPT_URL}?action=getGraphImage&callback=${callbackName}&_=${Date.now()}`;
        script.onerror = () => {
          cleanup();
          reject(new Error("JSONP script failed to load"));
        };

        document.body.appendChild(script);
      });
    } catch (finalError) {
      console.error("❌ All methods failed:", finalError);
      setError(`Failed to load image: ${finalError.message}`);
      setStatus("❌ Failed to load image");
      setDebugInfo({
        method: "failed",
        success: false,
        error: finalError.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageFromScript();
  }, []);

  const handleRefresh = () => {
    setImageUrl(null);
    setError(null);
    setStatus("");
    setDebugInfo({});
    fetchImageFromScript();
  };

  const openScriptUrl = () => {
    window.open(`${GOOGLE_SCRIPT_URL}?action=getGraphImage`, "_blank");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Department Scores Dashboard
        </h2>
      </div>

      {/* Image Display */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 min-h-[200px] flex items-center justify-center">
        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">
              Loading department scores chart...
            </div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Department Score Chart"
            className="max-w-full max-h-full object-contain"
            onLoad={() => {
              console.log("✅ Image displayed successfully!");
            }}
            onError={(e) => {
              console.error("❌ Image failed to display:", e);
              setError("Image failed to display after loading");
            }}
          />
        ) : (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-xl font-medium text-gray-600 mb-2">
              {error ? "Failed to Load Chart" : "No Chart Data Available"}
            </div>
            <div className="text-sm text-gray-500">
              {error
                ? "Please try refreshing or check the console for details"
                : "Waiting for data..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentScores;
