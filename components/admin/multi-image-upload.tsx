"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadIcon, XIcon, PlusIcon, ImageIcon } from "lucide-react";

type MultiImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  className?: string;
};

export function MultiImageUpload({ value, onChange, className }: MultiImageUploadProps) {
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
        onChange([...value, data.url]);
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

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateUrl(index: number, url: string) {
    const updated = [...value];
    updated[index] = url;
    onChange(updated);
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden border group">
            <div className="relative aspect-square">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={url.startsWith("/")}
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <XIcon className="h-3 w-3" />
            </Button>
            <div className="p-1">
              <Input
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="text-xs h-7"
              />
            </div>
          </div>
        ))}

        {/* Add button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground"
        >
          {uploading ? (
            <UploadIcon className="h-6 w-6 animate-pulse" />
          ) : (
            <>
              <PlusIcon className="h-6 w-6" />
              <span className="text-xs">Add image</span>
            </>
          )}
        </button>
      </div>

      {value.length === 0 && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full mt-2 py-8 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
        >
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm">Click to upload images</span>
        </button>
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
