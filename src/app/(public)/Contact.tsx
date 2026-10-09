export default function Contact() {
    return (
        <div>
            <div className="py-14" style={{ background: '#C8102E' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="section-label mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Hubungi Kami</div>
                    <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Kontak Resmi</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="section-label mb-3">Kanal Komunikasi Resmi</div>
                        <h2 className="text-xl font-black mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Kami siap menjawab pertanyaan Anda
                        </h2>

                        <div className="space-y-4">
                            {[
                                {
                                    icon: '📸',
                                    platform: 'Instagram',
                                    handle: '@immkaizen_official',
                                    desc: 'Ikuti kami untuk update kegiatan terbaru',
                                    color: '#E1306C',
                                    placeholder: true,
                                },
                                {
                                    icon: '💬',
                                    platform: 'WhatsApp',
                                    handle: '+62 8xx-xxxx-xxxx',
                                    desc: 'Hubungi pengurus aktif melalui WhatsApp',
                                    color: '#25D366',
                                    placeholder: true,
                                },
                                {
                                    icon: '✉️',
                                    platform: 'Email',
                                    handle: 'immkaizen@email.com',
                                    desc: 'Kirimkan pertanyaan atau surat resmi',
                                    color: '#C8102E',
                                    placeholder: true,
                                },
                                {
                                    icon: '🎵',
                                    platform: 'TikTok',
                                    handle: '@immkaizen',
                                    desc: 'Konten kreatif dan dokumentasi kegiatan',
                                    color: '#000',
                                    placeholder: true,
                                },
                            ].map((item) => (
                                <div key={item.platform} className="flex items-start gap-4 p-4 rounded"
                                     style={{ border: '1px solid #E0DEDC', background: '#fff' }}>
                                    <div className="w-10 h-10 flex items-center justify-center rounded text-xl flex-shrink-0"
                                         style={{ background: '#F7F6F5' }}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.platform}</h4>
                                            {item.placeholder && (
                                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#FFF3CD', color: '#856404', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          Placeholder
                        </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold" style={{ color: item.color, fontFamily: 'Inter, sans-serif' }}>{item.handle}</p>
                                        <p className="text-xs mt-0.5" style={{ color: '#888' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded text-xs" style={{ background: '#FFF8E7', border: '1px solid #F0E4B0', color: '#7A5C00' }}>
                            <strong>Catatan:</strong> Informasi kontak di atas adalah placeholder. Data kontak resmi akan diperbarui setelah dikonfirmasi oleh pengurus.
                        </div>
                    </div>

                    <div>
                        <div className="section-label mb-3">Lokasi</div>
                        <h2 className="text-xl font-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alamat Sekretariat</h2>
                        <div className="rounded overflow-hidden mb-5" style={{ background: '#F0EFEE', height: '280px', border: '1px solid #E0DEDC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                            <span className="text-3xl">📍</span>
                            <p className="text-sm font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Peta Lokasi</p>
                            <p className="text-xs" style={{ color: '#888' }}>Akan diintegrasikan dengan Google Maps</p>
                        </div>
                        <div className="p-4 rounded" style={{ background: '#F7F6F5', border: '1px solid #E0DEDC' }}>
                            <h4 className="font-bold text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sekretariat IMM Kaizen</h4>
                            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                                [Alamat sekretariat akan diisi sesuai data resmi]<br />
                                Jam Operasional: Senin – Jumat, 09.00 – 16.00 WIB
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
