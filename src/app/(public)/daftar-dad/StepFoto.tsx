import FileDropzone from './Filedropzone'

interface StepFotoProps {
    foto: File | null
    fotoUrl: string | null
    fotoError: string
    onPick: (file?: File) => void
    onRemove: () => void
}

export default function StepFoto({
                                     foto,
                                     fotoUrl,
                                     fotoError,
                                     onPick,
                                     onRemove
                                 }: StepFotoProps) {
    return (
        <div className="space-y-4 sm:space-y-5">
            <FileDropzone
                id="foto"
                title="Foto memakai almamater, 3 x 4"
                accept="image/*"
                hint="JPG, PNG, atau WEBP. Maksimal 10MB."
                file={foto}
                previewUrl={fotoUrl}
                error={fotoError}
                onPick={onPick}
                onRemove={onRemove}
            />

            <div className="rounded-2xl border border-[#f4b82e]/40 bg-[#fff8e7] p-3.5 sm:p-4 text-xs leading-relaxed text-[#5b4a47]">
                <p className="mb-1 font-bold text-[#4d1010]">
                    💡 Catatan Foto Peserta:
                </p>
                Foto ini akan langsung dipasang pada kartu peserta Anda. Gunakan foto berlatar polos, wajah terlihat jelas, dan posisi tegak.
            </div>
        </div>
    )
}