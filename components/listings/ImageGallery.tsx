'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
    images: string[]
    alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    if (images.length === 0) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-brand-cream">
                <i className="ti ti-photo text-6xl text-gray-300" aria-hidden="true" />
            </div>
        )
    }

    return (
        <div>
            {/* Main image */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={images[activeIndex]}
                    alt={alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 65vw"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.slice(0, 4).map((url, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 transition ${i === activeIndex ? 'ring-2 ring-brand-green ring-offset-1' : 'opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="96px" />
                        </button>
                    ))}
                    {images.length > 4 && (
                        <button
                            type="button"
                            onClick={() => setActiveIndex(4)}
                            className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 text-sm font-medium text-gray-600"
                        >
                            +{images.length - 4} more
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
