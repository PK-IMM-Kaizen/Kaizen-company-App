export const paymentConfig = {
    amount: 100.000,
    methods: [
        {
            name: 'BRI',
            accountNumber: '066201016705509',
            accountName: 'M. ZIDAN AL FAREZEL'
        }
    ],
    qrisSrc: null as string | null,
    note: 'Cantumkan nama lengkap pada catatan transfer.'
}

export const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 100.000
    }).format(n)