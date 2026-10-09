import { useState } from 'react'

export default function AdminOrganization() {
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        name: 'IMM Komisariat Kaizen',
        shortName: 'IMM Kaizen',
        founded: '2017',
        description: 'Ikatan Mahasiswa Muhammadiyah (IMM) Komisariat Kaizen merupakan organisasi mahasiswa Islam yang bergerak di lingkungan perguruan tinggi.',
        address: '[Alamat sekretariat belum diisi]',
        email: 'immkaizen@email.com',
        instagram: '@immkaizen_official',
        whatsapp: '',
    })

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profil Organisasi</h2>
            </div>

            {saved && (
                <div className="mb-4 p-3 rounded text-xs" style={{ background: '#D4EDDA', color: '#1A5730', border: '1px solid #B8DEC4' }}>
                    Profil organisasi berhasil diperbarui.
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="bg-white rounded p-6" style={{ border: '1px solid #E0DEDC' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-2" style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>
                                Informasi Dasar
                            </h3>
                            <div>
                                <label className="form-label">Nama Resmi Organisasi</label>
                                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label">Nama Singkat</label>
                                <input className="form-input" value={form.shortName} onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label">Tahun Berdiri</label>
                                <input className="form-input" value={form.founded} onChange={e => setForm(f => ({ ...f, founded: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label">Deskripsi Singkat</label>
                                <textarea className="form-input" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-2" style={{ color: '#888', fontFamily: 'Montserrat, sans-serif' }}>
                                Kontak & Media Sosial
                            </h3>
                            <div>
                                <label className="form-label">Alamat Sekretariat</label>
                                <textarea className="form-input" rows={2} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                            <div>
                                <label className="form-label">Email Resmi</label>
                                <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                            </div>
                            <div>
                                <label className="form-label">Instagram</label>
                                <input className="form-input" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@username" />
                            </div>
                            <div>
                                <label className="form-label">WhatsApp</label>
                                <input className="form-input" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+62 8xx..." />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-5 border-t flex gap-3" style={{ borderColor: '#E0DEDC' }}>
                        <button type="submit" className="btn-primary">Simpan Perubahan</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
