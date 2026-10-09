'use client'

import { type Page } from '../../app/(public)/data'
import logoImg from '../../../public/img/logo/logo.jpg'

interface ProfileProps { onNavigate: (page: Page) => void }

export default function Profile({ onNavigate }: ProfileProps) {
    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Tentang Kami</div>
                    <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profil Organisasi</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <div className="section-label mb-3">Identitas Organisasi</div>
                            <h2 className="text-xl font-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                IMM Komisariat Kaizen
                            </h2>
                            <div className="rounded mb-6 flex items-center justify-center overflow-hidden relative"
                                 style={{ background: 'linear-gradient(135deg, #CC1021 0%, #9B0D1A 50%, #1A0A0C 100%)', height: '260px' }}>
                                <div className="absolute left-0 top-0 bottom-0 w-1"
                                     style={{ background: 'linear-gradient(180deg, #F5C400, #E07B1A, #CC1021)' }} />
                                <img
                                    src={logoImg.src}
                                    alt="Logo IMM Kaizen"
                                    style={{ height: 200, width: 200, objectFit: 'contain', mixBlendMode: 'screen',
                                        filter: 'brightness(1.1) drop-shadow(0 0 32px rgba(224,123,26,0.4))' }}
                                />
                                <div className="absolute bottom-4 right-6 text-right">
                                    <p className="text-white font-black text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>IMM KAIZEN</p>
                                    <p className="text-xs" style={{ color: '#E07B1A', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, letterSpacing: '0.1em' }}>KOMISARIAT KAIZEN</p>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: '#444' }}>
                                Ikatan Mahasiswa Muhammadiyah (IMM) Komisariat Kaizen merupakan organisasi mahasiswa Islam yang bergerak di lingkungan perguruan tinggi. Komisariat ini berdiri pada tahun 2017 dan telah melahirkan ratusan kader yang berkontribusi aktif di berbagai bidang.
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
                                Nama <strong>Kaizen</strong> diambil dari filosofi Jepang yang berarti perbaikan berkesinambungan — mencerminkan komitmen organisasi untuk terus berkembang dan meningkatkan kualitas diri serta pelayanan kepada masyarakat.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded" style={{ border: '1px solid #E0DEDC', background: '#F7F6F5' }}>
                                <div className="w-8 h-1 rounded mb-3" style={{ background: '#C8102E' }} />
                                <h3 className="font-black text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Visi</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                                    [Visi organisasi akan diisi sesuai data resmi]
                                </p>
                            </div>
                            <div className="p-6 rounded" style={{ border: '1px solid #E0DEDC', background: '#F7F6F5' }}>
                                <div className="w-8 h-1 rounded mb-3" style={{ background: '#D4A017' }} />
                                <h3 className="font-black text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Misi</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                                    [Misi organisasi akan diisi sesuai data resmi]
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="section-label mb-3">Sejarah Singkat</div>
                            <div className="space-y-4">
                                {[
                                    { year: '2017', event: 'Pendirian IMM Komisariat Kaizen' },
                                    { year: '2019', event: 'Pembentukan bidang Ekowir pertama kali' },
                                    { year: '2021', event: 'Penambahan bidang Media dan Komunikasi' },
                                    { year: '2023', event: 'Peluncuran platform digital Kaizen Company' },
                                    { year: '2024', event: 'Peningkatan program kaderisasi dan kewirausahaan' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-12 h-6 flex items-center justify-center rounded text-xs font-black text-white"
                                             style={{ background: '#C8102E', fontFamily: 'Montserrat, sans-serif' }}>
                                            {item.year}
                                        </div>
                                        <p className="text-sm pt-0.5" style={{ color: '#444' }}>{item.event}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 rounded" style={{ border: '1px solid #E0DEDC' }}>
                            <h4 className="font-black text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Info Organisasi</h4>
                            <dl className="space-y-3">
                                {[
                                    { label: 'Nama Resmi', value: 'IMM Komisariat Kaizen' },
                                    { label: 'Tahun Berdiri', value: '2017' },
                                    { label: 'Status', value: 'Aktif' },
                                    { label: 'Anggota Aktif', value: '120+ Orang' },
                                    { label: 'Jumlah Bidang', value: '5 Bidang' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-start gap-4 text-xs pb-2"
                                         style={{ borderBottom: '1px solid #F0EFEE' }}>
                                        <dt style={{ color: '#888', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>{label}</dt>
                                        <dd className="font-semibold text-right" style={{ color: '#111', fontFamily: 'Inter, sans-serif' }}>{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="p-5 rounded" style={{ background: '#C8102E', color: '#fff' }}>
                            <h4 className="font-black text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bergabung dengan Kami</h4>
                            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Tertarik bergabung? Hubungi kami untuk informasi pendaftaran anggota baru.
                            </p>
                            <button onClick={() => onNavigate('contact')} className="w-full btn-primary"
                                    style={{ background: '#fff', color: '#C8102E', fontWeight: 700, justifyContent: 'center' }}>
                                Hubungi Kami
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
