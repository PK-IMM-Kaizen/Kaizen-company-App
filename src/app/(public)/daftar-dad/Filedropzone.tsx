import { useState } from 'react'
import { FileText, Trash2, UploadCloud } from 'lucide-react'
import { formatSize } from './Format'

export default function FileDropzone({
                                         id,
                                         title,
                                         accept,
                                         hint,
                                         file,
                                         previewUrl,
                                         error,
                                         thumbClass = 'w-20 aspect-[3/4]',
                                         onPick,
                                         onRemove
                                     }: {
    id: string
    title: string
    accept: string
    hint: string
    file: File | null
    previewUrl: string | null
    error: string
    thumbClass?: string
    onPick: (file?: File) => void
    onRemove: () => void
}) {
    const [isDragging, setIsDragging] = useState(false)

    return (
        <div>
            <p className="mb-1.5 block text-sm font-bold text-[#2b1414]">{title}</p>

            <div
                onDragOver={e => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                    e.preventDefault()
                    setIsDragging(false)
                    onPick(e.dataTransfer.files?.[0])
                }}
            >
                <input
                    type="file"
                    id={id}
                    name={id}
                    accept={accept}
                    className="peer sr-only"
                    onChange={e => {
                        onPick(e.target.files?.[0])
                        e.target.value = ''
                    }}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                <label
                    htmlFor={id}
                    className={`flex w-full cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed p-5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#6b1b1b]/40 sm:flex-row ${
                        isDragging
                            ? 'border-[#6b1b1b] bg-[#f4b82e]/20'
                            : error
                                ? 'border-red-500 bg-[#fcf8f5]'
                                : 'border-[#d9c9c1] bg-[#fcf8f5] hover:border-[#6b1b1b]'
                    }`}
                >
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt="Pratinjau"
                            className={`${thumbClass} shrink-0 rounded-lg border border-[#e9ddd7] object-cover`}
                        />
                    ) : file ? (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#6b1b1b] text-white">
                            <FileText className="h-7 w-7" />
                        </span>
                    ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4b82e] text-[#4d1010]">
                            <UploadCloud className="h-6 w-6" />
                        </span>
                    )}
                    <span className="min-w-0 text-center sm:text-left">
                        <span className="block truncate text-sm font-bold text-[#2b1414]">
                            {file ? file.name : isDragging ? 'Lepaskan untuk mengunggah' : 'Pilih file atau seret ke sini'}
                        </span>
                        <span className="mt-0.5 block text-xs text-[#7d6b68]">
                            {file ? `${formatSize(file.size)}. Ketuk untuk mengganti.` : hint}
                        </span>
                    </span>
                </label>
            </div>

            {file && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#7d6b68] transition-colors hover:text-red-600"
                >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus file
                </button>
            )}
            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}