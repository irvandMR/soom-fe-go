import {
	Archive,
	Banknote,
	Factory,
	Package,
	ShoppingCart,
	LayoutDashboard,
	type LucideIcon,
} from "lucide-react";

interface Section {
	id: number;
	title: string;
	icon: LucideIcon;
	color: string;
	bg: string;
	pathPattern?: string; // To match the help context dynamically
	steps: { title: string; desc: string }[];
}

export const SECTIONDOCS: Section[] = [
	{
		id: 1,
		title: "Dashboard & Analitik",
		icon: LayoutDashboard,
		color: "#1565A0",
		bg: "#E3F2FB",
		pathPattern: "/dashboard",
		steps: [
			{
				title: "Ringkasan Indikator Utama",
				desc: "Memantau Total Pesanan, Omset/Pendapatan, Jumlah Transaksi Lunas, dan Uang Muka (DP) secara realtime.",
			},
			{
				title: "Rencana Restock Bahan",
				desc: "Membaca estimasi belanja bahan baku yang dihitung otomatis dari sisa stok bahan baku yang berada di bawah batas aman minimum.",
			},
			{
				title: "Tren Aliran Kas Mingguan",
				desc: "Membaca grafik visual mingguan (Area Chart) untuk memantau perbandingan pemasukan vs pengeluaran secara cepat.",
			},
			{
				title: "Evaluator Margin Kritis",
				desc: "Memantau daftar produk dengan keuntungan tipis (margin < 40%) agar Anda bisa segera memperbarui harga jual atau komposisi resep di halaman Produk.",
			},
		],
	},
	{
		id: 2,
		title: "Transaksi & Pemantauan",
		icon: ShoppingCart,
		color: "#0D9488",
		bg: "#F0FDFA",
		pathPattern: "/orders",
		steps: [
			{
				title: "Monitoring Ritel POS",
				desc: "Memantau semua nota penjualan dari kasir outlet aktif secara realtime. Halaman ini bersifat read-only (hanya baca) karena sinkronisasi POS luar.",
			},
			{
				title: "Status Bayar (DP vs Lunas)",
				desc: "Membaca status Lunas (telah bayar penuh) atau DP (Uang Muka) beserta nominal uang muka yang telah disetorkan pelanggan.",
			},
			{
				title: "Rincian & Sisa Pembayaran",
				desc: "Membuka detail transaksi untuk melihat rincian item belanja, metode pembayaran, catatan pelanggan, dan sisa pembayaran (Total Tagihan dikurangi DP).",
			},
			{
				title: "Filter Tanggal & Ekspor",
				desc: "Memfilter data berdasarkan nama pelanggan, nomor invoice, rentang tanggal masuk, status pembayaran, dan mengekspor rekap penjualan.",
			},
		],
	},
	{
		id: 3,
		title: "Bahan Baku & Kemasan",
		icon: Package,
		color: "#2E7D32",
		bg: "#E8F5E9",
		pathPattern: "/ingredients",
		steps: [
			{
				title: "Tab Bahan vs Kemasan",
				desc: "Gunakan sub-tab 'Bahan Baku' untuk bahan dasar makanan/adonan dan 'Kemasan & Wadah' untuk kotak dus, stiker, atau plastik packing.",
			},
			{
				title: "Tambah Bahan Baru",
				desc: "Mendaftarkan bahan baku atau kemasan baru dengan menentukan satuan dasar (gr, ml, pcs) serta batas aman minimum stok untuk memicu notifikasi kritis.",
			},
			{
				title: "Stok Masuk (Restock Gudang)",
				desc: "Menambahkan kuantitas stok bahan dengan memasukkan harga beli satuan terbaru. Harga beli ini akan menjadi acuan perhitungan HPP produk.",
			},
			{
				title: "Notifikasi Stok Menipis",
				desc: "Sistem menandai stok di bawah batas aman dengan warna merah/kuning untuk membantu Anda memesan ulang sebelum kehabisan bahan.",
			},
		],
	},
	{
		id: 4,
		title: "Produk & Manajemen Resep",
		icon: Archive,
		color: "#6A1B9A",
		bg: "#F3E5F5",
		pathPattern: "/products",
		steps: [
			{
				title: "Tipe Produk",
				desc: "Pilih tipe saat membuat produk: 'Made to Stock' (dibuat massal/ready di rak), 'Made to Order' (inden/pesanan khusus), atau 'Resell' (barang beli jadi seperti minuman kemasan).",
			},
			{
				title: "Komposisi Resep & Konversi UOM",
				desc: "Memasukkan takaran bahan baku per batch adonan. Sistem otomatis mengonversi satuan (misal bahan dibeli dalam kg, tapi resep ditulis dalam gram).",
			},
			{
				title: "Penyusunan HPP Kemasan",
				desc: "Masukkan bahan pembantu/kemasan di tab kemasan (misal stiker & plastik per unit produk jadi) untuk memecah hitungan HPP bahan vs kemasan.",
			},
			{
				title: "Aktivasi Versi Resep & Final HPP",
				desc: "Sistem mencatat resep secara versi (v1, v2). Aktifkan versi resep yang diinginkan untuk memperbarui nilai Harga Pokok Produksi secara instan.",
			},
		],
	},
	{
		id: 5,
		title: "Pencatatan Produksi & QC",
		icon: Factory,
		color: "#E65100",
		bg: "#FFE0B2",
		pathPattern: "/productions",
		steps: [
			{
				title: "Buat Produksi Baru",
				desc: "Memulai proses produksi dengan memilih produk, memilih versi resep aktif, dan memasukkan target jumlah porsi/batch. Stok bahan baku adonan otomatis terpotong.",
			},
			{
				title: "Quality Control (Ok vs Reject)",
				desc: "Setelah produksi selesai, masukkan jumlah aktual sukses (lolos QC) dan jumlah gagal (reject/waste). Status batch berubah menjadi sukses, sukses dengan reject, atau gagal total.",
			},
			{
				title: "Biaya Overhead & Rekomendasi Harga",
				desc: "Sistem otomatis mengalokasikan 20% biaya overhead operasional di atas HPP dasar, lalu merekomendasikan harga jual eceran terbaik untuk margin keuntungan 60%.",
			},
			{
				title: "Potensi Pendapatan Ritel",
				desc: "Memantau total potensi omset penjualan dari batch produksi yang sukses lolos QC berdasarkan rekomendasi harga jual pasar.",
			},
		],
	},
	{
		id: 6,
		title: "Manajemen Keuangan",
		icon: Banknote,
		color: "#374151",
		bg: "#F3F4F6",
		pathPattern: "/cash-flow",
		steps: [
			{
				title: "Pemasukan Otomatis POS",
				desc: "Setiap transaksi eceran yang selesai dari kasir outlet otomatis tercatat sebagai pemasukan keuangan. Tidak perlu diinput ulang secara manual.",
			},
			{
				title: "Catat Pengeluaran Operasional",
				desc: "Gunakan tombol Tambah Pengeluaran untuk mencatat biaya di luar pembelian bahan baku, seperti sewa outlet, listrik, air, atau gaji staf.",
			},
			{
				title: "Grafik Aliran Kas",
				desc: "Menganalisis pergerakan kas bulanan untuk memantau laba bersih (pemasukan dikurangi pengeluaran operasional).",
			},
		],
	},
];
