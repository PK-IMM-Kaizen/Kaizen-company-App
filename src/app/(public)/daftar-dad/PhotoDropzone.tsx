import { useState } from 'react'
import { Trash2, UploadCloud } from 'lucide-react'
import { formatSize } from './Format'

export default function PhotoDropzone({
                                          foto,
                                          fotoUrl,
                                          error,
                                          onPick,
                                          onRemove
                                      }: {
    foto: File | null
    fotoUrl: string | null
    error: string
    onPick: (file?: File) => void
    onRemove: () => void
}) {
    const [isDragging, setIsDragging] = useState(false)

    return (
        <div>
            <p className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                Foto memakai almamater, 3 x 4
            </p>

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
                    id="foto"
                    name="foto"
                    accept="image/*"
                    className="peer sr-only"
                    onChange={e => {
                        onPick(e.target.files?.[0])
                        e.target.value = ''
                    }}
                    aria-describedby={error ? 'foto-error' : undefined}
                />
                <label
                    htmlFor="foto"
                    className={`flex flex-col sm:flex-row items-center gap-4 w-full cursor-pointer rounded-xl border-2 border-dashed p-5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)]/50 ${
                        isDragging
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                            : error
                                ? 'border-red-500 bg-[var(--surface-2)]'
                                : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--primary)]/60'
                    }`}
                >
                    {fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={fotoUrl}
                            alt="Pratinjau foto"
                            className="w-20 aspect-[3/4] rounded-lg object-cover border border-[var(--border)] shrink-0"
                        />
                    ) : (
                        <span className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                            <UploadCloud className="w-6 h-6" />
                        </span>
                    )}
                    <span className="text-center sm:text-left min-w-0">
                        <span className="block text-sm font-semibold text-[var(--text-primary)] truncate">
                            {foto
                                ? foto.name
                                : isDragging
                                    ? 'Lepaskan untuk mengunggah'
                                    : 'Pilih foto atau seret ke sini'}
                        </span>
                        <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                            {foto
                                ? `${formatSize(foto.size)}. Ketuk untuk mengganti.`
                                : 'JPG, PNG, atau WEBP. Maksimal 10MB.'}
                        </span>
                    </span>
                </label>
            </div>

            {foto && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus foto
                </button>
            )}
            {error && (
                <p id="foto-error" role="alert" className="text-red-500 text-xs mt-1.5">
                    {error}
                </p>
            )}
        </div>
    )
}