"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadIcon, XIcon, ImageIcon } from "lucide-react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  className?: string;
};

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  return (
    <div className={className}>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border">
          <div className="relative aspect-video">
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-cover"
              unoptimized={value.startsWith("/")}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => onChange("")}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
        >
          {uploading ? (
            <>
              <UploadIcon className="h-8 w-8 animate-pulse" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm">Click to upload image</span>
            </>
          )}
        </button>
      )}

      {value && (
        <div className="mt-2 flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className="text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            Replace
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
