import Image from 'next/image'

// NFC icon using the user-provided asset
export const NfcIcon = ({ className, size = 32 }: { className?: string; size?: number }) => (
  <Image
    src="/nfc-icon.png"
    alt="NFC"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)
