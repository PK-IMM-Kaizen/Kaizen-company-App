import styles from '../../Dad.module.css'

export default function StickerTitle({
                                         text,
                                         as: Tag = 'h1',
                                         className = ''
                                     }: {
    text: string
    as?: 'h1' | 'h2'
    className?: string
}) {
    return (
        <Tag className={`${styles.sticker} ${className}`} aria-label={text.replace(/\n/g, ' ')}>
            <span aria-hidden className={styles.stickerStroke}>
                {text}
            </span>
            <span aria-hidden className={styles.stickerFill}>
                {text}
            </span>
        </Tag>
    )
}