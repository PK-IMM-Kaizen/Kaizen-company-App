import logoImg from '../../../public/img/logo/logo.png'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'white'
}

export default function Logo({ size = 'md', variant = 'default' }: LogoProps) {
    const imgSizes = { sm: 36, md: 44, lg: 60 }
    const s = imgSizes[size]
    const textColor = variant === 'white' ? '#fff' : '#111'
    const subColor = variant === 'white' ? 'rgba(255,255,255,0.65)' : '#888'
    const textSizes = { sm: '0.75rem', md: '0.875rem', lg: '1rem' }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoImg.src}
                alt="IMM Kaizen Logo"
                style={{
                    width: s,
                    height: s,
                    objectFit: 'contain',
                    flexShrink: 0,
                    mixBlendMode: variant === 'white' ? 'screen' : 'normal',
                    filter: variant === 'white' ? 'brightness(1.15)' : 'none',
                }}
            />
            <div style={{ lineHeight: 1.2 }}>
                <div style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 800,
                    fontSize: textSizes[size],
                    color: textColor,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                }}>
                    IMM Kaizen
                </div>
                <div style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: subColor,
                    marginTop: '1px',
                }}>
                    Komisariat Kaizen
                </div>
            </div>
        </div>
    )
}