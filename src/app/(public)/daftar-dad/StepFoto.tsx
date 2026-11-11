import FileDropzone from './Filedropzone'

export default function StepFoto({
                                     foto,
                                     fotoUrl,
                                     fotoError,
                                     onPick,
                                     onRemove
                                 }: {
    foto: File | null
    fotoUrl: string | null
    fotoError: string
    onPick: (file?: File) => void
    onRemove: () => void
}) {
    return (
        <>
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
            <p className="rounded-xl bg-[#fff3d1] px-4 py-3 text-xs leading-relaxed text-[#5b4a47]">
                Foto ini dipakai di kartu pesertamu. Gunakan foto berlatar polos, wajah terlihat jelas, dan posisi
                tegak.
            </p>
        </>
    )
}