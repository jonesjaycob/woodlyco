"use client";

import { useState, useCallback } from "react";
import { SparklesIcon, Loader2Icon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AiMode } from "@/lib/ai/prompts";

type UnsplashImage = {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
};

type AiWriterProps = {
  mode: AiMode;
  onApply: (fields: Record<string, string>, imageUrl?: string) => void;
};

const modeLabels: Record<AiMode, string> = {
  blog: "Blog Post",
  product: "Product",
  gallery: "Gallery Item",
};

const fieldLabels: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  excerpt: "Excerpt",
  content: "Content",
  category: "Category",
  author: "Author",
  name: "Name",
  description: "Description",
};

export function AiWriter({ mode, onApply }: AiWriterProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string> | null>(null);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [imageKeywords, setImageKeywords] = useState("");
  const [imagePage, setImagePage] = useState(1);
  const [applying, setApplying] = useState(false);

  const reset = useCallback(() => {
    setPrompt("");
    setGenerating(false);
    setLoadingImages(false);
    setError(null);
    setFields(null);
    setImages([]);
    setSelectedImage(undefined);
    setImageKeywords("");
    setImagePage(1);
    setApplying(false);
  }, []);

  async function searchImages(keywords: string, page = 1) {
    setLoadingImages(true);
    try {
      const res = await fetch(
        `/api/ai/unsplash?q=${encodeURIComponent(keywords)}&page=${page}`
      );
      if (res.ok) {
        const data = await res.json();
        if (page === 1) {
          setImages(data);
        } else {
          setImages((prev) => [...prev, ...data]);
        }
      }
    } catch {
      // Image search is non-critical
    } finally {
      setLoadingImages(false);
    }
  }

  function handleLoadMore() {
    const nextPage = imagePage + 1;
    setImagePage(nextPage);
    searchImages(imageKeywords, nextPage);
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    setFields(null);
    setImages([]);
    setSelectedImage(undefined);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), mode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      const { imageKeywords: keywords, ...generatedFields } = data;

      // Convert all values to strings
      const stringFields: Record<string, string> = {};
      for (const [key, value] of Object.entries(generatedFields)) {
        stringFields[key] = String(value);
      }

      setFields(stringFields);

      if (keywords) {
        setImageKeywords(keywords);
        setImagePage(1);
        searchImages(keywords, 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleApply() {
    if (!fields) return;
    setApplying(true);
    setError(null);

    let blobUrl: string | undefined;
    if (selectedImage) {
      try {
        // Download the Unsplash image
        const imgRes = await fetch(selectedImage);
        const blob = await imgRes.blob();
        const ext = blob.type.split("/")[1] || "jpg";
        const file = new File([blob], `unsplash-${Date.now()}.${ext}`, {
          type: blob.type,
        });

        // Upload to Vercel Blob via existing upload endpoint
        const formData = new FormData();
        formData.set("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await uploadRes.json();
        blobUrl = url;
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to upload selected image"
        );
        setApplying(false);
        return;
      }
    }

    onApply(fields, blobUrl);
    setOpen(false);
    reset();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <SparklesIcon className="size-4" />
          AI Write
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Writer — {modeLabels[mode]}</DialogTitle>
          <DialogDescription>
            Describe what you want to create and AI will generate all text
            fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prompt input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">
              Describe what you want to create...
            </Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder={
                mode === "blog"
                  ? "Write a blog post about the benefits of cedar wood for outdoor lighting"
                  : mode === "product"
                    ? "A handcrafted white oak light post with solar power"
                    : "A cedar light post photographed at golden hour in a garden"
              }
              disabled={generating}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Press Cmd+Enter to generate
              </p>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                size="sm"
              >
                {generating && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
                {generating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex justify-between items-center">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-destructive hover:text-destructive/80 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Generated fields preview */}
          {fields && (
            <div className="space-y-3 border rounded-lg p-4">
              <h4 className="text-sm font-medium">Generated Content</h4>
              {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {fieldLabels[key] || key}
                  </Label>
                  <Textarea
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    rows={key === "content" ? 10 : key === "excerpt" || key === "description" ? 3 : 1}
                    className={key === "content" ? "font-mono text-sm" : ""}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Unsplash images */}
          {(loadingImages || images.length > 0) && (
            <div className="space-y-3 border rounded-lg p-4">
              <h4 className="text-sm font-medium">Image Recommendations</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {loadingImages
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-video rounded-md" />
                    ))
                  : images.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            selectedImage === img.url ? undefined : img.url
                          )
                        }
                        className={`relative group rounded-md overflow-hidden border-2 transition-colors ${
                          selectedImage === img.url
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        <img
                          src={img.thumbUrl}
                          alt={img.alt}
                          className="aspect-video w-full object-cover"
                        />
                        {selectedImage === img.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <CheckIcon className="size-6 text-primary" />
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground p-1 truncate">
                          Photo by {img.photographer}
                        </p>
                      </button>
                    ))}
              </div>
              {images.length > 0 && !loadingImages && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  className="w-full"
                >
                  Load More Images
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {fields && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={applying}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={generating || applying}
            >
              Regenerate
            </Button>
            <Button type="button" onClick={handleApply} disabled={applying}>
              {applying && <Loader2Icon className="size-4 animate-spin" />}
              {applying ? "Uploading..." : "Apply to Form"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
