'use client'

import React, { useState } from 'react'
import { AFXCard } from '@/components/ui/afx-card'
import { AFXButton } from '@/components/ui/afx-button'
import { Upload, Trash2, Link as LinkIcon } from 'lucide-react'

interface MediaFile {
  name: string
  url: string
  size: string
  inUse: boolean
  usedBy?: string
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([
    {
      name: 'ftmo-logo.png',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=60',
      size: '24 KB',
      inUse: true,
      usedBy: 'FTMO Listing',
    },
    {
      name: 'topstep-banner.jpg',
      url: 'https://images.unsplash.com/photo-1642390091310-70f1a87d6677?w=200&auto=format&fit=crop&q=60',
      size: '142 KB',
      inUse: true,
      usedBy: 'TopStep Listing',
    },
    {
      name: 'axismarkets-logo.png',
      url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=60',
      size: '18 KB',
      inUse: false,
    },
  ])

  const handleDelete = (item: MediaFile) => {
    if (item.inUse) {
      alert(`WARNING: This file is currently in use by: ${item.usedBy}. Please re-assign its usages before deleting.`);
      return
    }

    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setMedia((prev) => prev.filter((m) => m.name !== item.name))
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Public asset URL copied to clipboard! 📋')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2 afx-gradient-heading">
            Central Media Library
          </h1>
          <p className="text-text-secondary text-sm">Upload once, reuse anywhere. Deleting references checks usage rules.</p>
        </div>
        <AFXButton
          onClick={() => alert('Media drag-and-drop uploader is configured')}
          variant="primary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-bg-base bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 transition-all text-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </AFXButton>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {media.map((file) => (
          <AFXCard key={file.name} className="bg-bg-surface border border-border-subtle p-0 overflow-hidden flex flex-col justify-between group">
            <div className="relative h-40 bg-bg-base flex items-center justify-center border-b border-border-subtle overflow-hidden">
              <img src={file.url} alt={file.name} className="w-full h-full object-contain p-4 group-hover:scale-102 transition-transform duration-300" />
              {file.inUse && (
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20 text-[9px] font-bold uppercase tracking-wider font-mono">
                  In Use
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="font-bold text-text-primary text-sm truncate">{file.name}</p>
                <p className="text-text-muted text-[10px] font-mono mt-0.5">{file.size}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border-subtle/50 gap-2">
                <button
                  onClick={() => handleCopyUrl(file.url)}
                  className="flex items-center gap-1 text-[10px] font-bold text-accent-cyan hover:underline font-mono"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Asset URL
                </button>

                <button
                  onClick={() => handleDelete(file)}
                  className="p-1.5 rounded-lg hover:bg-bg-base text-text-muted hover:text-red-400 transition-colors border border-transparent hover:border-border-subtle"
                  title="Delete asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AFXCard>
        ))}
      </div>
    </div>
  )
}
