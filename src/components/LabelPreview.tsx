'use client';

import React, { useState } from 'react';
import { TIMEOUTS, ALERT_TYPES } from '@/lib/constants';

interface LabelPreviewProps {
  labelUrl: string;
  format: string;
  trackingCode: string;
  rate: {
    service: string;
    rate: string | number;
    carrier: string;
  };
  trackingUrl?: string;
}

export default function LabelPreview({
  labelUrl,
  format,
  trackingCode,
  rate,
  trackingUrl
}: LabelPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  // Reset loading state when URL changes
  React.useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
  }, [labelUrl]);

  // Add timeout to stop loading if image doesn't load
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setLoadError('Image loading timeout. Please try again.');
      }
    }, TIMEOUTS.IMAGE_LOAD);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Alternative approach: check if image is actually loaded
  React.useEffect(() => {
    if (labelUrl && isLoading) {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        setLoadError(null);
      };
      img.onerror = () => {
        setIsLoading(false);
        setLoadError('Failed to load label image');
      };
      img.src = labelUrl;
    }
  }, [labelUrl, isLoading]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Try direct download first (works for same-origin or CORS-enabled resources)
      const link = document.createElement('a');
      link.href = labelUrl;
      link.download = `shipping-label-${trackingCode}.${format.toLowerCase()}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // If direct download doesn't work, try fetch approach
      try {
        const response = await fetch(labelUrl, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = `shipping-label-${trackingCode}.${format.toLowerCase()}`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          window.URL.revokeObjectURL(url);
        }
      } catch (fetchError) {
        // Fetch approach failed, direct download should work
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), TIMEOUTS.SUCCESS_MESSAGE);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(labelUrl, '_blank');
      alert('Download failed. The label has been opened in a new tab. You can save it from there.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      setPrintSuccess(false);

      // Create a new window with proper HTML structure for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Write HTML content to the new window
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Shipping Label - ${trackingCode}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .label-container { text-align: center; }
                .label-image { max-width: 100%; height: auto; }
                .label-info { margin-top: 20px; text-align: left; }
                @media print {
                  body { padding: 0; }
                  .label-container { page-break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <div class="label-container">
                <img src="${labelUrl}" alt="Shipping Label" class="label-image" />
                <div class="label-info">
                  <p><strong>Tracking Code:</strong> ${trackingCode}</p>
                  <p><strong>Service:</strong> ${rate.service}</p>
                  <p><strong>Carrier:</strong> ${rate.carrier}</p>
                  <p><strong>Rate:</strong> $${typeof rate.rate === 'string' ? parseFloat(rate.rate).toFixed(2) : rate.rate.toFixed(2)}</p>
                </div>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();

        setPrintSuccess(true);
        setTimeout(() => setPrintSuccess(false), TIMEOUTS.SUCCESS_MESSAGE);
      } else {
        throw new Error('Failed to open print window');
      }
    } catch (error) {
      console.error('Print error:', error);
      // Fallback: open image in new tab
      window.open(labelUrl, '_blank');
      alert('Print failed. The label has been opened in a new tab. You can print from there.');
    } finally {
      setIsPrinting(false);
    }
  };

  // Convert rate to number if it's a string
  const rateValue = typeof rate.rate === 'string' ? parseFloat(rate.rate) : rate.rate;

  const handleImageLoad = () => {
    setIsLoading(false);
    setLoadError(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Failed to load image:', labelUrl, e);
    setIsLoading(false);
    setLoadError('Failed to load label image');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Shipping Label Generated
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Service:</strong> {rate.service}</p>
            <p><strong>Carrier:</strong> {rate.carrier}</p>
            <p><strong>Rate:</strong> ${rateValue.toFixed(2)}</p>
          </div>
          <div>
            <p><strong>Tracking Code:</strong> {trackingCode}</p>
            {trackingUrl && (
              <p>
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Track shipment
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading label...</span>
            </div>
          )}

          {loadError && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-2">{loadError}</p>
                <p className="text-sm text-gray-600 mb-4">Label URL: {labelUrl}</p>
                <a
                  href={labelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Open label in new tab
                </a>
              </div>
            </div>
          )}

          {!isLoading && !loadError && (
            <>
              {format.toLowerCase() === 'pdf' ? (
                <iframe
                  src={labelUrl}
                  className="w-full h-96 border-0"
                  onLoad={handleIframeLoad}
                />
              ) : (
                <div className="space-y-4">
                  {/* Try image first */}
                  <img
                    src={labelUrl}
                    alt="Shipping label"
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                    onLoad={handleImageLoad}
                    onError={handleImageError}

                  />

                  {/* Fallback iframe for CORS issues */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      If the image doesn&apos;t load above, try viewing it in a new tab:
                    </p>
                    <a
                      href={labelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Label in New Tab
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading || isPrinting}
          className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${downloadSuccess
            ? 'bg-green-500 text-white ring-green-500'
            : isDownloading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            }`}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
              Downloading...
            </>
          ) : downloadSuccess ? (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Downloaded!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Label
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          disabled={isPrinting || isDownloading}
          className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${printSuccess
            ? 'bg-blue-500 text-white ring-blue-500'
            : isPrinting
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            }`}
        >
          {isPrinting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
              Opening Print...
            </>
          ) : printSuccess ? (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Print Dialog Opened!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> This is a test label. For real shipments,
          make sure to use an EasyPost account with available credits.
        </p>
      </div>
    </div>
  );
}
