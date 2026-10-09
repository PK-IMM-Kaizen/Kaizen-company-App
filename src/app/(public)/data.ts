export type Page =
    | 'home' | 'profile' | 'management' | 'division' | 'news' | 'news-detail'
    | 'ekowir' | 'alumni' | 'contact'
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
    { label: 'Ekowir', page: 'ekowir' },
    { label: 'Alumni', page: 'alumni' },
    { label: 'Kontak', page: 'contact' },
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
}

export const newsData: NewsItem[] = [
    {
        id: 1,
        title: 'Pelantikan Pengurus IMM Kaizen Periode 2024–2025',
        excerpt: 'Ikatan Mahasiswa Muhammadiyah Komisariat Kaizen resmi melantik pengurus baru untuk periode 2024–2025 dalam rangkaian acara yang berlangsung khidmat.',
        content: `Ikatan Mahasiswa Muhammadiyah (IMM) Komisariat Kaizen telah resmi melantik jajaran pengurus baru untuk periode kepengurusan 2024–2025. Acara pelantikan berlangsung pada 15 Maret 2024 di Aula Universitas, dihadiri oleh pimpinan pusat, alumni, dan seluruh anggota aktif.\n\nDalam sambutannya, Ketua Umum yang baru dilantik menyampaikan visi besar untuk membawa IMM Kaizen ke level yang lebih tinggi dalam bidang akademik, sosial, dan kewirausahaan. Program-program strategis telah disiapkan untuk satu tahun ke depan.\n\nAcara pelantikan ini juga diisi dengan berbagai penampilan seni dari anggota, seremonial serah terima jabatan, dan doa bersama. Seluruh pengurus yang hadir berkomitmen untuk menjalankan amanah dengan sebaik-baiknya.`,
        date: '15 Maret 2024',
        publishDate: '16 Maret 2024',
        cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&auto=format',
        gallery: [
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop&auto=format',
        ],
        category: 'Organisasi',
        status: 'published',
    },
    {
        id: 2,
        title: 'Workshop Kewirausahaan Muda: Membangun Bisnis dari Nol',
        excerpt: 'Bidang Ekowir IMM Kaizen mengadakan workshop kewirausahaan yang diikuti lebih dari 80 peserta dari berbagai komisariat se-kota.',
        content: `Workshop Kewirausahaan Muda yang diselenggarakan oleh Bidang Ekonomi dan Kewirausahaan (Ekowir) IMM Kaizen berlangsung sukses pada 22 April 2024. Acara ini menghadirkan tiga pembicara berpengalaman dari dunia bisnis dan startup.\n\nSebanyak 85 peserta hadir dari berbagai komisariat IMM se-kota, antusias mengikuti materi tentang ideasi bisnis, validasi pasar, dan strategi pemasaran digital. Sesi praktik langsung menjadi daya tarik tersendiri, di mana peserta dibagi ke dalam kelompok untuk mengembangkan ide bisnis mereka.\n\nPanitia juga menyediakan mentoring one-on-one bagi peserta yang ingin mengembangkan ide bisnis lebih lanjut. Workshop ini diharapkan menjadi pemantik semangat wirausaha di kalangan mahasiswa.`,
        date: '22 April 2024',
        publishDate: '24 April 2024',
        cover: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop&auto=format',
        gallery: [
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop&auto=format',
        ],
        category: 'Ekowir',
        status: 'published',
    },
    {
        id: 3,
        title: 'Bakti Sosial IMM Kaizen di Kelurahan Sumber Jaya',
        excerpt: 'Dalam rangka Dies Natalis ke-7, IMM Kaizen menggelar bakti sosial berupa pembagian sembako dan pengobatan gratis bagi warga kurang mampu.',
        content: `Dalam rangka memperingati Dies Natalis ke-7, IMM Kaizen menggelar kegiatan Bakti Sosial di Kelurahan Sumber Jaya pada 5 Mei 2024. Kegiatan ini melibatkan lebih dari 60 anggota aktif yang bersama-sama memberikan kontribusi nyata bagi masyarakat sekitar.\n\nBentuk kegiatan meliputi pembagian 200 paket sembako kepada warga kurang mampu, layanan pengobatan gratis yang ditangani oleh mahasiswa kesehatan, dan perbaikan fasilitas umum berupa pengecatan pos ronda dan pembersihan lingkungan.\n\nKegiatan ini mendapat sambutan positif dari aparat kelurahan dan warga setempat. Lurah Sumber Jaya menyampaikan apresiasi atas kontribusi nyata mahasiswa dalam membantu masyarakat.`,
        date: '5 Mei 2024',
        publishDate: '7 Mei 2024',
        cover: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=500&fit=crop&auto=format',
        gallery: [],
        category: 'Sosial',
        status: 'published',
    },
    {
        id: 4,
        title: 'Pelatihan Desain Grafis untuk Kader IMM',
        excerpt: 'Bidang Media dan Komunikasi IMM Kaizen menyelenggarakan pelatihan desain grafis intensif bagi kader untuk meningkatkan kualitas visual konten organisasi.',
        content: `Bidang Media dan Komunikasi (Medkom) IMM Kaizen menggelar pelatihan desain grafis intensif pada 10–12 Juni 2024. Pelatihan ini ditujukan bagi kader yang ingin meningkatkan kemampuan visual mereka dalam mendukung kegiatan organisasi.\n\nMateri yang diajarkan mencakup dasar-dasar desain, penggunaan aplikasi Canva dan Adobe Photoshop, hingga pembuatan konten media sosial yang menarik dan informatif. Trainer adalah alumni IMM Kaizen yang kini bekerja sebagai desainer profesional.\n\nHasil karya peserta langsung diaplikasikan untuk kebutuhan konten IMM Kaizen, menjadikan pelatihan ini produktif sekaligus langsung berdampak pada kualitas komunikasi visual organisasi.`,
        date: '10 Juni 2024',
        publishDate: '13 Juni 2024',
        cover: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=500&fit=crop&auto=format',
        gallery: [],
        category: 'Medkom',
        status: 'published',
    },
    {
        id: 5,
        title: 'Studi Banding ke IMM Komisariat Al-Kindi',
        excerpt: 'Delegasi IMM Kaizen melaksanakan studi banding ke Komisariat Al-Kindi untuk mempelajari sistem kaderisasi dan pengelolaan organisasi.',
        content: `Delegasi IMM Kaizen yang terdiri dari 15 pengurus inti melaksanakan kunjungan studi banding ke IMM Komisariat Al-Kindi pada 20 Juli 2024. Kunjungan ini bertujuan untuk mempelajari best practice dalam sistem kaderisasi dan pengelolaan organisasi.\n\nSelama kunjungan, kedua komisariat bertukar pengalaman dalam bidang pengembangan SDM, pengelolaan keuangan organisasi yang transparan, dan strategi membangun loyalitas kader. Diskusi berlangsung hangat dan produktif, menghasilkan beberapa poin kesepakatan kerja sama ke depan.\n\nKetua Umum IMM Kaizen menyatakan bahwa kunjungan ini membuka wawasan baru dan akan menjadi referensi penting dalam menyusun program kaderisasi yang lebih baik di masa mendatang.`,
        date: '20 Juli 2024',
        publishDate: '22 Juli 2024',
        cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop&auto=format',
        gallery: [],
        category: 'Organisasi',
        status: 'published',
    },
    {
        id: 6,
        title: 'Launching Produk Baru Ekowir: Kaizen Merch Collection',
        date: '1 Agustus 2024',
        publishDate: '3 Agustus 2024',
        excerpt: 'Setelah melalui proses desain dan produksi selama dua bulan, Bidang Ekowir IMM Kaizen resmi meluncurkan Kaizen Merch Collection.',
        content: `Setelah melalui proses desain dan produksi yang panjang selama dua bulan, Bidang Ekonomi dan Kewirausahaan IMM Kaizen resmi meluncurkan Kaizen Merch Collection pada 1 Agustus 2024. Koleksi ini mencakup kaos, hoodie, totebag, dan berbagai aksesori berdesain eksklusif.\n\nSeluruh produk dirancang oleh tim desainer internal dengan mengedepankan identitas visual IMM Kaizen yang kuat. Material dipilih dengan standar kualitas tinggi untuk memastikan kepuasan konsumen.\n\nMerchandise ini tersedia untuk dipesan oleh seluruh anggota, alumni, dan simpatisan IMM Kaizen. Hasil penjualan akan digunakan untuk mendukung kegiatan organisasi dan program beasiswa kader berprestasi.`,
        cover: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=500&fit=crop&auto=format',
        gallery: [],
        category: 'Ekowir',
        status: 'draft',
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
    isLeader: boolean
}

export const managementData: Management[] = [
    { id: 1, name: 'Ahmad Fauzi Ramadhan', position: 'Ketua Umum', division: 'Pimpinan', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format', isLeader: true },
    { id: 2, name: 'Siti Nurhayati', position: 'Ketua I', division: 'Pimpinan', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format', isLeader: true },
    { id: 3, name: 'Rizky Pratama', position: 'Ketua II', division: 'Pimpinan', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format', isLeader: true },
    { id: 4, name: 'Dewi Rahmawati', position: 'Sekretaris Umum', division: 'Pimpinan', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format', isLeader: true },
    { id: 5, name: 'Muhammad Haikal', position: 'Bendahara Umum', division: 'Pimpinan', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format', isLeader: true },
    { id: 6, name: 'Fajar Nugroho', position: 'Ketua Bidang BPI', division: 'BPI', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&auto=format', isLeader: false },
    { id: 7, name: 'Annisa Fitri', position: 'Sekretaris Bidang BPI', division: 'BPI', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format', isLeader: false },
    { id: 8, name: 'Bagas Aditya', position: 'Ketua Bidang Medkom', division: 'Medkom', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&auto=format', isLeader: false },
    { id: 9, name: 'Rahma Indah', position: 'Sekretaris Bidang Medkom', division: 'Medkom', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&auto=format', isLeader: false },
    { id: 10, name: 'Dicky Firmansyah', position: 'Ketua Bidang Ekowir', division: 'Ekowir', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format', isLeader: false },
    { id: 11, name: 'Yuli Astuti', position: 'Sekretaris Bidang Ekowir', division: 'Ekowir', photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&auto=format', isLeader: false },
    { id: 12, name: 'Andi Saputra', position: 'Ketua Bidang Hikmah', division: 'Hikmah', photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&auto=format', isLeader: false },
]

export interface Division {
    id: number
    name: string
    description: string
    photo: string
    color: string
}

export const divisions: Division[] = [
    { id: 1, name: 'Bidang Pembinaan Kader (BPI)', description: 'Bertanggung jawab dalam pembinaan dan pengembangan kader IMM Kaizen melalui program pelatihan dan kaderisasi yang sistematis.', photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format', color: '#C8102E' },
    { id: 2, name: 'Bidang Media dan Komunikasi (Medkom)', description: 'Mengelola strategi komunikasi, media sosial, dokumentasi, dan penyebaran informasi organisasi kepada publik.', photo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop&auto=format', color: '#1A6FA8' },
    { id: 3, name: 'Bidang Ekonomi dan Kewirausahaan (Ekowir)', description: 'Mengembangkan jiwa wirausaha anggota melalui program usaha, pelatihan bisnis, dan pengelolaan produk organisasi.', photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format', color: '#D4A017' },
    { id: 4, name: 'Bidang Hikmah', description: 'Berfokus pada pengembangan nilai-nilai keislaman, kajian keagamaan, dan dakwah di lingkungan kampus dan masyarakat.', photo: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&h=400&fit=crop&auto=format', color: '#2D7D46' },
    { id: 5, name: 'Bidang Sosial Pemberdayaan Masyarakat (SPM)', description: 'Menginisiasi program sosial kemasyarakatan, pengabdian masyarakat, dan pemberdayaan komunitas di sekitar kampus.', photo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&auto=format', color: '#6B46C1' },
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
        { label: 'Overview', page: 'admin-overview', icon: '⊞' },
        { label: 'Organisasi', page: 'admin-organization', icon: '🏛' },
        { label: 'Kepengurusan', page: 'admin-management', icon: '👥' },
        { label: 'Bidang', page: 'admin-division', icon: '📋' },
        { label: 'Berita', page: 'admin-news', icon: '📰' },
        { label: 'Ekowir', page: 'admin-ekowir', icon: '🛍' },
        { label: 'Alumni', page: 'admin-alumni', icon: '🎓' },
        { label: 'Pengguna', page: 'admin-users', icon: '⚙' },
    ],
    bpi: [
        { label: 'Overview', page: 'admin-overview', icon: '⊞' },
        { label: 'Organisasi', page: 'admin-organization', icon: '🏛' },
        { label: 'Kepengurusan', page: 'admin-management', icon: '👥' },
        { label: 'Bidang', page: 'admin-division', icon: '📋' },
        { label: 'Berita', page: 'admin-news', icon: '📰' },
        { label: 'Alumni', page: 'admin-alumni', icon: '🎓' },
    ],
    medkom: [
        { label: 'Overview', page: 'admin-overview', icon: '⊞' },
        { label: 'Berita', page: 'admin-news', icon: '📰' },
    ],
    ekowir: [
        { label: 'Overview', page: 'admin-overview', icon: '⊞' },
        { label: 'Ekowir', page: 'admin-ekowir', icon: '🛍' },
    ],
}

export const roleLabels: Record<Role, string> = {
    superadmin: 'Super Admin',
    bpi: 'BPI',
    medkom: 'Medkom',
    ekowir: 'Ekowir',
}
