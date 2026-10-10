'use client'

import { useState } from 'react'
import { Building, Share2, CheckCircle2, Save } from 'lucide-react'

export default function AdminOrganization() {
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        name: 'IMM Komisariat Kaizen',
        shortName: 'IMM Kaizen',
        founded: '2017',
        description: 'Ikatan Mahasiswa Muhammadiyah (IMM) Komisariat Kaizen merupakan organisasi mahasiswa Islam yang bergerak di lingkungan Fakultas Teknik Universitas Muhammadiyah Surabaya.',
        address: 'Kompleks Gedung PKM (Pusat Kegiatan Mahasiswa) Lt. 1, Fakultas Teknik, Universitas Muhammadiyah Surabaya. Jl. Sutorejo No. 59, Mulyorejo, Surabaya, Jawa Timur 60113.',
        email: 'immkaizen.umsura@gmail.com',
        instagram: '@imm_kaizen',
        whatsapp: '+62 812-3456-7890',
    })

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-[var(--text-primary)] font-display">
                    Profil Organisasi
                </h2>
            </div>

            {saved && (
                <div className="mb-6 p-4 rounded-[var(--radius)] text-xs bg-[#D4EDDA] text-[#1A5730] border border-[#B8DEC4] font-medium flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#1A5730] shrink-0" />
                    <span>Profil organisasi berhasil diperbarui.</span>
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                        <div className="space-y-4">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-2 text-[var(--text-muted)] font-display flex items-center gap-2">
                                <Building className="w-3.5 h-3.5" /> Informasi Dasar
                            </h3>
                            <div>
                                <label className="form-label">Nama Resmi Organisasi</label>
                                <input
                                    className="form-input"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="form-label">Nama Singkat</label>
                                <input
                                    className="form-input"
                                    value={form.shortName}
                                    onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="form-label">Tahun Berdiri</label>
                                <input
                                    className="form-input"
                                    value={form.founded}
                                    onChange={e => setForm(f => ({ ...f, founded: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="form-label">Deskripsi Singkat</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-xs uppercase tracking-widest mb-2 text-[var(--text-muted)] font-display flex items-center gap-2">
                                <Share2 className="w-3.5 h-3.5" /> Kontak & Media Sosial
                            </h3>
                            <div>
                                <label className="form-label">Alamat Sekretariat</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={form.address}
                                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label className="form-label">Email Resmi</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="form-label">Instagram</label>
                                <input
                                    className="form-input"
                                    value={form.instagram}
                                    onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                                    placeholder="@username"
                                />
                            </div>
                            <div>
                                <label className="form-label">WhatsApp</label>
                                <input
                                    className="form-input"
                                    value={form.whatsapp}
                                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                                    placeholder="+62 8xx..."
                                />
                            </div>
                        </div>

                    </div>

                    <div className="mt-6 pt-5 border-t border-[var(--border)] flex gap-3">
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}