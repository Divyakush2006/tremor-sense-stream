import { useState, useRef } from "react";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export default function Upload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      status: "uploading" as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach((file, index) => {
      const fileIndex = uploadedFiles.length + index;
      
      const interval = setInterval(() => {
        setUploadedFiles(prev => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex].progress += Math.random() * 20;
            
            if (updated[fileIndex].progress >= 100) {
              updated[fileIndex].progress = 100;
              // Simulate random success/error
              updated[fileIndex].status = Math.random() > 0.2 ? "success" : "error";
              if (updated[fileIndex].status === "error") {
                updated[fileIndex].error = "Invalid CSV format or corrupted data";
              }
              clearInterval(interval);
            }
          }
          return updated;
        });
      }, 200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Data Upload</h1>
        <p className="text-muted-foreground">
          Upload CSV files containing sensor readings and historical data for analysis
        </p>
      </div>

      {/* Upload Instructions */}
      <div className="sensor-card mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">File Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-foreground mb-2">Supported Formats</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• CSV files (.csv)</li>
              <li>• Maximum file size: 50MB</li>
              <li>• UTF-8 encoding preferred</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Required Columns</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• timestamp (ISO 8601 format)</li>
              <li>• sensor_id (e.g., DISP-001)</li>
              <li>• value (numeric reading)</li>
              <li>• unit (measurement unit)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="sensor-card mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Upload Files</h2>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drop CSV files here or click to browse
          </h3>
          <p className="text-muted-foreground mb-4">
            Support for multiple file upload
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Select Files
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="sensor-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Upload Progress</h2>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground truncate">{file.name}</h3>
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <div className="text-sm text-muted-foreground">
                          {file.progress.toFixed(0)}%
                        </div>
                      )}
                      {file.status === "success" && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{formatFileSize(file.size)}</span>
                    {file.status === "error" && file.error && (
                      <span className="text-destructive">{file.error}</span>
                    )}
                    {file.status === "success" && (
                      <span className="text-success">Upload complete</span>
                    )}
                  </div>
                  
                  {file.status === "uploading" && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {uploadedFiles.filter(f => f.status === "success").length}
                </div>
                <div className="text-sm text-success">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {uploadedFiles.filter(f => f.status === "uploading").length}
                </div>
                <div className="text-sm text-primary">Uploading</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {uploadedFiles.filter(f => f.status === "error").length}
                </div>
                <div className="text-sm text-destructive">Failed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}