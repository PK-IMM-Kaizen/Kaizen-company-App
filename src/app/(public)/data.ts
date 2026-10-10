export type Page =
    | 'home' | 'profile' | 'management' | 'division' | 'news' | 'news-detail'
    | 'ekowir' | 'alumni' | 'kontak'
    | 'admin-login' | 'admin-overview' | 'admin-organization' | 'admin-management'
    | 'admin-division' | 'admin-news' | 'admin-news-create' | 'admin-ekowir'
    | 'admin-ekowir-create' | 'admin-alumni' | 'admin-users'

export type Role = 'superadmin' | 'bpi' | 'medkom' | 'ekowir'

export interface NavItem { label: string; page: Page }

export const navItems: NavItem[] = [
    { label: 'Beranda', page: 'home' },
    { label: 'Profil', page: 'profile' },
    { label: 'Kepengurusan', page: 'management' },
    { label: 'Bidang', page: 'division' },
    { label: 'Berita', page: 'news' },
    { label: 'Alumni', page: 'alumni' },
    { label: 'Kontak', page: 'kontak' },
]

export interface NewsItem {
    id: number
    title: string
    excerpt: string
    content: string
    date: string
    publishDate: string
    cover: string
    gallery: string[]
    category: string
    status: 'published' | 'draft'
    pwmuUrl?: string
}

export const newsData: NewsItem[] = [
    {
        id: 1,
        title: 'Kajian September Hitam PK IMM Kaizen Bahas Sejarah, HAM, dan Peran Mahasiswa',
        excerpt: 'Pimpinan Komisariat (PK) Ikatan Mahasiswa Muhammadiyah (IMM) Kaizen menggelar Kajian September Hitam 2026 pada Rabu (30/9/2026) pukul 15.00 WIB.',
        content: 'Kegiatan diawali pembukaan oleh Moh. Faiz Haikal selaku Master of Ceremony (MC) sekaligus Sekretaris Bidang HPKP PK IMM Kaizen. Kajian kemudian dilanjutkan dengan penyampaian materi oleh Syarif Hidayat dengan Febri Dimas Ferdiansyah sebagai moderator....',
        date: '30 September 2026',
        publishDate: '01 Oktober 2026',
        cover: 'https://pwmu.co/wp-content/uploads/2026/10/konsep-otomatis-Zizw.jpeg',
        gallery: [
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&auto=format',
        ],
        category: 'Bidang HPKP',
        status: 'published',
        pwmuUrl: 'https://pwmu.co/kajian-september-hitam-pk-imm-kaizen-bahas-sejarah-ham-dan-peran-mahasiswa/'
    },
    {
        id: 2,
        title: 'Mastakom PK IMM Kaizen Umsura Kenalkan Perkaderan melalui Simulasi Aksi',
        excerpt: 'Pimpinan Komisariat (PK) Ikatan Mahasiswa Muhammadiyah (IMM) Kaizen Fakultas Teknik Universitas Muhammadiyah Surabaya (UMSurabaya) menggelar Masa Ta’aruf Komisariat (Mastakom) 2026 di Gedung At-Ta’awun Umsura Lantai 21, Rabu (16/9/2026)',
        content: 'Kegiatan tersebut menjadi pengenalan awal bagi peserta terhadap IMM, Muhammadiyah, dan PK IMM Kaizen. Mastakom mengusung tema “Manifestasi Nilai Trilogi IMM: Mengukir Kader Autentik, Melahirkan The Next Champion yang Berintegritas.”...',
        date: '16 September 2026',
        publishDate: '18 September 2026',
        cover: 'https://pwmu.co/wp-content/uploads/2026/09/mastakom-pk-imm-kaizen-umsura-kenalkan-perkaderan-melalui-simulasi-aksi-mAoj.jpeg',
        gallery: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop&auto=format',
        ],
        category: 'Bidang Kader',
        status: 'published',
        pwmuUrl: 'https://pwmu.co/mastakom-pk-imm-kaizen-umsura-kenalkan-perkaderan-melalui-simulasi-aksi/'
    },
    {
        id: 3,
        title: 'Raker PK IMM Kaizen Susun Program Kerja untuk Satu Periode Kepengurusan',
        excerpt: 'Pimpinan Komisariat Ikatan Mahasiswa Muhammadiyah (PK IMM) Kaizen melaksanakan Rapat Kerja (Raker) pada Sabtu (5/9/2026). Kegiatan tersebut berlangsung di Gedung F, Ruang F-203, Universitas Muhammadiyah Surabaya (Umsura), mulai pukul 08.00 WIB hingga selesai.',
        content: 'Raker dihadiri oleh seluruh pengurus PK IMM Kaizen. Kegiatan ini menjadi forum bagi pengurus untuk membahas dan menyusun program kerja yang akan dilaksanakan selama satu periode kepengurusan....',
        date: '8 September 2026',
        publishDate: '5 September 2026',
        cover: 'https://pwmu.co/wp-content/uploads/2026/09/konsep-otomatis-V9a3.jpeg',
        gallery: [],
        category: 'BPH',
        status: 'published',
        pwmuUrl: 'https://pwmu.co/raker-pk-imm-kaizen-susun-program-kerja-untuk-satu-periode-kepengurusan/'
    },
    {
        id: 4,
        title: 'PK IMM Kaizen Lantik Pengurus 2026/2027, Resmi Launching Website Kaizen Company',
        excerpt: 'Pimpinan Komisariat Ikatan Mahasiswa Muhammadiyah (PK IMM) Kaizen Universitas Muhammadiyah Surabaya (Umsura) resmi memulai kepengurusan periode 2026/2027. Momentum tersebut ditandai dengan pelantikan pengurus baru sekaligus peluncuran website Kaizen Company sebagai platform digital resmi organisasi..',
        content: 'Kegiatan yang berlangsung di Gedung At-Tauhid Umsura lantai 13 pada Senin (24/8/2026) itu mengusung tema “Ilmi Amaliah, Amal Ilmiah, Transformasi Digital, dan Perbaikan Tiada Henti.”...',
        date: '24 Agustus 2026',
        publishDate: '26 Agustus 2026',
        cover: 'https://pwmu.co/wp-content/uploads/2026/08/pk-imm-kaizen-lantik-pengurus-2026-2027-resmi-launching-website-kaizen-company-k4VS.jpeg',
        gallery: [],
        category: 'Pelantikan',
        status: 'published',
        pwmuUrl: 'https://pwmu.co/pk-imm-kaizen-lantik-pengurus-2026-2027-resmi-launching-website-kaizen-company/'
    },
]

export interface Product {
    id: number
    name: string
    description: string
    price: number
    available: boolean
    image: string
    category: string
}

export const products: Product[] = [
    {
        id: 1,
        name: 'Kaos IMM Kaizen Classic',
        description: 'Kaos lengan pendek berbahan cotton combed 30s dengan sablon logo IMM Kaizen di dada. Tersedia dalam berbagai ukuran.',
        price: 85000,
        available: true,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
        category: 'Pakaian',
    },
    {
        id: 2,
        name: 'Hoodie Kaizen Premium',
        description: 'Hoodie premium fleece dengan bordir logo IMM Kaizen. Nyaman dipakai untuk kegiatan indoor maupun outdoor.',
        price: 220000,
        available: true,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop&auto=format',
        category: 'Pakaian',
    },
    {
        id: 3,
        name: 'Totebag Kaizen',
        description: 'Totebag kanvas premium dengan desain eksklusif IMM Kaizen. Cocok untuk kegiatan kampus sehari-hari.',
        price: 65000,
        available: true,
        image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop&auto=format',
        category: 'Aksesori',
    },
    {
        id: 4,
        name: 'Pin Set IMM Kaizen',
        description: 'Set 3 buah pin logam premium dengan motif logo dan semboyan IMM Kaizen. Edisi terbatas.',
        price: 35000,
        available: true,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop&auto=format',
        category: 'Aksesori',
    },
    {
        id: 5,
        name: 'Mug Kaizen',
        description: 'Mug keramik 350ml dengan cetak logo IMM Kaizen full color. Tahan panas dan microwave safe.',
        price: 75000,
        available: false,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop&auto=format',
        category: 'Aksesori',
    },
    {
        id: 6,
        name: 'Notebook Kaizen Edition',
        description: 'Buku catatan A5 hard cover 200 halaman dengan desain cover eksklusif IMM Kaizen. Kertas HVS 80gsm.',
        price: 45000,
        available: true,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format',
        category: 'Stationery',
    },
]

export interface Management {
    id: number
    name: string
    position: string
    division: string
    photo: string
    isLeader?: boolean // Menjadi opsional (?) agar tidak error bila belum diisi
}

export const managementData: Management[] = [
    { id: 1, name: 'Abdul Baari\' Al Fakhri', position: 'Ketua Umum', division: 'BPH', photo: '/img/profile/ketum.png', isLeader: true },
    { id: 2, name: 'Muhammad Zakky Arifina', position: 'Sekretaris Umum', division: 'BPH', photo: '/img/profile/sekum.jpg', isLeader: true },
    { id: 3, name: 'Muhammad Zidan Al Farezel', position: 'Bendahara Umum', division: 'BPH', photo: '/img/profile/bendum.png', isLeader: true },

    { id: 4, name: 'Rafa Alexyz Virginanda', position: 'Ketua Bidang', division: 'Organisasi', photo: '/img/profile/imm.jpeg', isLeader: true },
    { id: 5, name: 'Rafi Ilham Syamsudin', position: 'Sekretaris Bidang', division: 'Organisasi', photo: '/img/profile/imm.jpeg' },
    { id: 6, name: 'Zaenal Abidin', position: 'Anggota', division: 'Organisasi', photo: '/img/profile/imm.jpeg' },
    { id: 7, name: 'Muhammad Reno Setiawa', position: 'Anggota', division: 'Organisasi', photo: '/img/profile/imm.jpeg' },

    { id: 8, name: 'Nobel Danial Muhammad', position: 'Ketua Bidang', division: 'Kader', photo: '/img/profile/imm.jpeg', isLeader: true },
    { id: 9, name: 'Abdullah Azzam Arif Firmansyah', position: 'Sekretaris Bidang', division: 'Kader', photo: '/img/profile/imm.jpeg' },
    { id: 10, name: 'Maulidia Dliyaun N', position: 'Anggota', division: 'Kader', photo: '/img/profile/imm.jpeg' },
    { id: 11, name: 'Hamas Fatih Izzudin', position: 'Anggota', division: 'Kader', photo: '/img/profile/imm.jpeg' },

    { id: 12, name: 'M Lutfi Zaka Firdaus', position: 'Ketua Bidang', division: 'Hikmah Politik Kebijakan Publik', photo: '/img/profile/imm.jpeg', isLeader: true },
    { id: 13, name: 'Moh Faiz Haikal', position: 'Sekretaris Bidang', division: 'Hikmah Politik Kebijakan Publik', photo: '/img/profile/imm.jpeg' },
    { id: 14, name: 'Febri Dimas Ferdiansyah', position: 'Anggota', division: 'Hikmah Politik Kebijakan Publik', photo: '/img/profile/imm.jpeg' },
    { id: 15, name: 'Mochammad Faiq Naabih', position: 'Anggota', division: 'Hikmah Politik Kebijakan Publik', photo: '/img/profile/imm.jpeg' },

    { id: 16, name: 'Abidzar Dzakwan Sahudi', position: 'Ketua Bidang', division: 'Riset Pengembangan Keilmuan', photo: '/img/profile/imm.jpeg', isLeader: true },
    { id: 17, name: 'Rifqah Nur Izzah', position: 'Sekretaris Bidang', division: 'Riset Pengembangan Keilmuan', photo: '/img/profile/imm.jpeg' },
    { id: 18, name: 'Syafiih', position: 'Anggota', division: 'Riset Pengembangan Keilmuan', photo: '/img/profile/imm.jpeg' },
    { id: 19, name: 'Moh. Syahrul Gunawan', position: 'Anggota', division: 'Riset Pengembangan Keilmuan', photo: '/img/profile/imm.jpeg' }
];

export interface Division {
    id: number
    name: string
    description: string
    photo: string
    color: string
}

export const divisions: Division[] = [
    { id: 1, name: 'Organisasi', description: 'Mewadahi pengelolaan administrasi, penataan struktur internal, serta koordinasi keorganisasian agar jalannya komisariat tetap solid, tertib, dan sistematis.', photo: '/img/divisions/organisasi.jpg', color: 'var(--primary)' },
    { id: 2, name: 'Perkaderan', description: 'Jantung utama perkaderan yang bertanggung jawab atas proses rekruitasi, pembinaan ideologi, serta pengawalan jenjang kaderisasi berkesinambungan melalui DAD dan Teras Perkaderan.', photo: '/img/divisions/perkaderan.jpg', color: 'var(--accent)' },
    { id: 3, name: 'Hikmah Politik & Kebijakan Publik', description: 'Mengasah kepekaan kritis kader terhadap isu-isu keumatan, kebangsaan, dan sosial kemasyarakatan melalui kajian politik, advokasi, dan perumusan kebijakan publik.', photo: '/img/divisions/hikmah.jpg', color: '#D4A017' },
    { id: 4, name: 'Riset & Pengembangan Keilmuan', description: 'Mengembangkan budaya literasi, kajian akademik, ilmiah, serta riset teknologi khas mahasiswa teknik untuk mewujudkan intelektualitas kader yang unggul.', photo: '/img/divisions/rpk.jpg', color: '#1A6FA8' },
    { id: 5, name: 'Tabligh & Kajian Keislaman', description: 'Menanamkan nilai-nilai religiusitas, memperdalam pemahaman al-Islam dan Kemuhammadiyahan (AIK), serta menyelenggarakan kajian keagamaan rutin untuk internal dan publik.', photo: '/img/divisions/tabligh.jpg', color: '#2E7D32' },
    { id: 6, name: 'Sosial Pemberdayaan Masyarakat', description: 'Mengorganisir aksi-aksi kemanusiaan, bakti sosial (Baksos), serta pengabdian masyarakat secara nyata di berbagai wilayah pelosok Jawa Timur.', photo: '/img/divisions/spm.jpg', color: '#C8102E' },
    { id: 7, name: 'Ekonomi & Kewirausahaan', description: 'Menumbuhkan jiwa kemandirian finansial komisariat dan kader melalui unit bisnis kreatif (Ekowir), penjualan merchandise, serta pelatihan wirausaha digital.', photo: '/img/divisions/ekowir.jpg', color: '#2D7D46' },
    { id: 8, name: 'IMMawati', description: 'Fokus pada penguatan kapasitas, wawasan kesetaraan gender, isu kepemimpinan perempuan, serta ruang aktualisasi khusus bagi seluruh kader perempuan (Immawati) Kaizen.', photo: '/img/divisions/immawati.jpg', color: '#C71585' },
    { id: 9, name: 'Seni Budaya & Olahraga', description: 'Wadah penyaluran bakat, minat, dan ekspresi kreatif kader di bidang seni, kebudayaan, serta menjaga kebugaran fisik dan keakraban melalui kegiatan olahraga bersama.', photo: '/img/divisions/sbo.jpg', color: '#E07B1A' },
    { id: 10, name: 'Media Komunikasi & Informasi', description: 'Garda terdepan syiar digital yang mengelola publikasi, desain visual, dokumentasi kegiatan, serta branding #1ByteLebihDekat di berbagai platform media sosial.', photo: '/img/divisions/medkom.jpg', color: 'var(--primary-light)' },
]

export interface Alumni {
    id: number
    name: string
    batch: string
    bio: string
    achievement: string
    photo: string
    role: string
}

export const alumniData: Alumni[] = [
    { id: 1, name: 'Dr. Arief Wibowo', batch: '2015', bio: 'Doktor di bidang Ilmu Ekonomi dari Universitas Indonesia. Kini aktif sebagai peneliti ekonomi digital dan advisor startup.', achievement: 'Penerima Beasiswa LPDP, Founder EduTech Startup', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&auto=format', role: 'Peneliti & Entrepreneur' },
    { id: 2, name: 'Ir. Siti Maharani', batch: '2016', bio: 'Engineer di perusahaan BUMN terkemuka. Aktif dalam kegiatan sosial kemasyarakatan dan pemberdayaan perempuan.', achievement: 'Best Young Engineer Award 2022, Relawan Pengajar Pelosok', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format', role: 'Engineer & Aktivis' },
    { id: 3, name: 'Muhammad Ridwan, M.Pd', batch: '2014', bio: 'Pendidik dan motivator muda. Mendirikan lembaga bimbingan belajar yang kini melayani ribuan siswa di seluruh Indonesia.', achievement: 'Founder "Belajar Bareng" — 5.000+ siswa terlayani', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', role: 'Pendidik & Social Entrepreneur' },
    { id: 4, name: 'Nurul Hidayah', batch: '2017', bio: 'Jurnalis dan penulis muda yang karya-karyanya telah diterbitkan di berbagai media nasional. Pemenang lomba jurnalistik tingkat nasional.', achievement: 'Juara 1 Lomba Karya Jurnalistik Nasional 2023', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format', role: 'Jurnalis & Penulis' },
]

export const adminMenuByRole: Record<Role, { label: string; page: Page; icon: string }[]> = {
    superadmin: [
        { label: 'Page', page: 'admin-overview', icon: '⊞' },
        { label: 'Organisasi', page: 'admin-organization', icon: '🏛' },
        { label: 'Kepengurusan', page: 'admin-management', icon: '👥' },
        { label: 'Bidang', page: 'admin-division', icon: '📋' },
        { label: 'Berita', page: 'admin-news', icon: '📰' },
        { label: 'Ekowir', page: 'admin-ekowir', icon: '🛍' },
        { label: 'Alumni', page: 'admin-alumni', icon: '🎓' },
        { label: 'Pengguna', page: 'admin-users', icon: '⚙' },
    ],
    bpi: [
        { label: 'Page', page: 'admin-overview', icon: '⊞' },
        { label: 'Organisasi', page: 'admin-organization', icon: '🏛' },
        { label: 'Kepengurusan', page: 'admin-management', icon: '👥' },
        { label: 'Bidang', page: 'admin-division', icon: '📋' },
        { label: 'Berita', page: 'admin-news', icon: '📰' },
        { label: 'Alumni', page: 'admin-alumni', icon: '🎓' },
    ],
    medkom: [
        { label: 'Page', page: 'admin-overview', icon: '⊞' },
        { label: 'Berita', page: 'admin-news', icon: '📰' },
    ],
    ekowir: [
        { label: 'Page', page: 'admin-overview', icon: '⊞' },
        { label: 'Ekowir', page: 'admin-ekowir', icon: '🛍' },
    ],
}

export const roleLabels: Record<Role, string> = {
    superadmin: 'Super Admin',
    bpi: 'BPI',
    medkom: 'Medkom',
    ekowir: 'Ekowir',
}