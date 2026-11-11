import FileDropzone from './Filedropzone'
import PaymentInfo from './PaymentInfo'
import ReviewSummary from './ReviewSummary'
import type { FormValues } from './Form'

interface StepPembayaranProps {
    values: FormValues
    bukti: File | null
    buktiUrl: string | null
    buktiError: string
    onPick: (file?: File) => void
    onRemove: () => void
    onEditData: () => void
}

export default function StepPembayaran({
                                           values,
                                           bukti,
                                           buktiUrl,
                                           buktiError,
                                           onPick,
                                           onRemove,
                                           onEditData
                                       }: StepPembayaranProps) {
    return (
        <div className="space-y-5 sm:space-y-6">
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
        </div>
    )
}