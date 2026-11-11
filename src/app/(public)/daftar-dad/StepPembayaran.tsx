import FileDropzone from './Filedropzone'
import PaymentInfo from './PaymentInfo'
import ReviewSummary from './ReviewSummary'
import type { FormValues } from './Form'

export default function StepPembayaran({
                                           values,
                                           bukti,
                                           buktiUrl,
                                           buktiError,
                                           onPick,
                                           onRemove,
                                           onEditData
                                       }: {
    values: FormValues
    bukti: File | null
    buktiUrl: string | null
    buktiError: string
    onPick: (file?: File) => void
    onRemove: () => void
    onEditData: () => void
}) {
    return (
        <>
            <PaymentInfo />
            <FileDropzone
                id="bukti"
                title="Unggah bukti pembayaran"
                accept="image/*,application/pdf"
                hint="Screenshot atau foto bukti transfer, atau PDF. Maksimal 5MB."
                file={bukti}
                previewUrl={buktiUrl}
                error={buktiError}
                thumbClass="w-20 aspect-square"
                onPick={onPick}
                onRemove={onRemove}
            />
            <ReviewSummary values={values} onEdit={onEditData} />
        </>
    )
}