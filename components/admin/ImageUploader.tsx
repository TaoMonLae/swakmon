'use client'

import { useCallback, useState, useRef } from 'react'
import Image from 'next/image'

export interface ImageItem {
  url: string
  publicId: string
  order: number
}

interface ImageUploaderProps {
  images: ImageItem[]
  onChange: (images: ImageItem[]) => void
  max?: number
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export function ImageUploader({ images, onChange, max = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(async (files: File[]) => {
    setError('')
    const validFiles = files.filter((f) => {
      if (!ACCEPTED.includes(f.type)) { setError('Only jpg, png, webp accepted'); return false }
      if (f.size > MAX_FILE_SIZE) { setError('File too large (max 5MB)'); return false }
      return true
    }).slice(0, max - images.length)

    if (validFiles.length === 0) return

    setUploading(true)
    const newImages: ImageItem[] = []

    for (const file of validFiles) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        if (!res.ok) {
          // Server may return a non-JSON error page (502, etc.); read text safely.
          const message = await res.text().catch(() => '')
          setError(message?.slice(0, 200) || `Upload failed (${res.status})`)
          continue
        }
        const data = await res.json()
        if (data.url && data.publicId) {
          newImages.push({ url: data.url, publicId: data.publicId, order: images.length + newImages.length })
        } else if (data.error) {
          setError(data.error)
        }
      } catch {
        setError('Upload failed')
      }

    }

    onChange([...images, ...newImages])
    setUploading(false)
  }, [images, onChange, max])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    uploadFiles(files)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(Array.from(e.target.files))
  }

  async function handleDelete(publicId: string) {
    // Check the result BEFORE updating UI state. If Cloudinary delete fails and
    // we remove it from state anyway, the image becomes orphaned in Cloudinary
    // (costs money) while disappearing from the listing on the next save.
    try {
      const res = await fetch(`/api/admin/upload/${encodeURIComponent(publicId)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? `Delete failed (${res.status})`)
        return
      }
    } catch {
      setError('Network error — image not deleted')
      return
    }
    const updated = images.filter((img) => img.publicId !== publicId).map((img, i) => ({ ...img, order: i }))
    onChange(updated)
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= images.length) return
    const reordered = [...images]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, moved)
    onChange(reordered.map((img, i) => ({ ...img, order: i })))
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition ${dragOver ? 'border-ink bg-surface-soft' : 'border-hairline hover:border-ink'
          }`}
      >
        {uploading ? (
          <svg className="h-6 w-6 animate-spin text-brand-green" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <>
            <i className="ti ti-cloud-upload text-3xl text-gray-400" aria-hidden="true" />
            <p className="mt-2 text-sm text-gray-500">
              Drop or click to upload photos
            </p>
            <p className="text-xs text-gray-400">jpg, png, webp – max 5MB each, {max} total</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={img.publicId} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
              <Image src={img.url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="96px" />
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(img.publicId)}
                className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                aria-label="Delete image"
              >
                ✕
              </button>
              {/* Reorder buttons */}
              <div className="absolute bottom-1 left-1 hidden gap-0.5 group-hover:flex">
                {i > 0 && (
                  <button type="button" onClick={() => moveImage(i, -1)} className="h-5 w-5 rounded bg-black/50 text-xs text-white">←</button>
                )}
                {i < images.length - 1 && (
                  <button type="button" onClick={() => moveImage(i, 1)} className="h-5 w-5 rounded bg-black/50 text-xs text-white">→</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">{images.length}/{max} photos</p>
    </div>
  )
}
