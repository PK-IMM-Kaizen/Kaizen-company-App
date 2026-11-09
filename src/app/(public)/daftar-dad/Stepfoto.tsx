import PhotoDropzone from './Photodropzone'
import ReviewSummary from './Reviewsummary'
import type { FormValues } from './Form'

export default function StepFoto({
                                     values,
                                     foto,
                                     fotoUrl,
                                     fotoError,
                                     onPick,
                                     onRemove,
                                     onEditData
                                 }: {
    values: FormValues
    foto: File | null
    fotoUrl: string | null
    fotoError: string
    onPick: (file?: File) => void
    onRemove: () => void
    onEditData: () => void
}) {
    return (
        <>
            <PhotoDropzone
                foto={foto}
                fotoUrl={fotoUrl}
                error={fotoError}
                onPick={onPick}
                onRemove={onRemove}
            />
            <ReviewSummary values={values} onEdit={onEditData} />
        </>
    )
}