import {
	Archive,
	Banknote,
	Factory,
	Package,
	ShoppingCart,
	Tag,
	type LucideIcon,
} from "lucide-react";

interface Section {
	id: number;
	title: string;
	icon: LucideIcon;
	color: string;
	bg: string;
	steps: { title: string; desc: string }[];
}

export const SECTIONDOCS: Section[] = [
	{
		id: 1,
		title: "Cara Input Kategori",
		icon: Tag,
		color: "#1565A0",
		bg: "#E3F2FB",
		steps: [
			{
				title: "Buka menu Kategori",
				desc: "Dari sidebar, klik Settings → Kategori. Halaman daftar kategori akan tampil.",
			},
			{
				title: "Klik tombol Tambah Kategori",
				desc: 'Klik tombol "+ Tambah" di pojok kanan atas untuk membuka form kategori.',
			},
			{
				title: "Isi nama kategori",
				desc: 'Masukkan nama kategori produk, misalnya: "Roti", "Kue Kering", "Minuman". Nama harus unik.',
			},
			{
				title: "Simpan",
				desc: "Klik tombol Simpan. Kategori baru akan langsung muncul di daftar dan siap digunakan saat input produk.",
			},
		],
	},
	{
		id: 2,
		title: "Cara Input Bahan Baku",
		icon: Package,
		color: "#2E7D32",
		bg: "#E8F5E9",
		steps: [
			{
				title: "Buka menu Stok Bahan Baku",
				desc: "Dari sidebar, klik Stok Bahan Baku. Halaman daftar bahan baku akan tampil.",
			},
			{
				title: "Klik tombol Tambah Bahan",
				desc: 'Klik "+ Tambah Bahan Baku" untuk membuka form input bahan.',
			},
			{
				title: "Isi detail bahan baku",
				desc: "Masukkan: nama bahan (mis. Tepung Terigu), satuan (kg, gram, liter), stok awal, dan batas minimum stok untuk notifikasi kritis.",
			},
			{
				title: "Simpan bahan",
				desc: "Klik Simpan. Bahan akan masuk ke inventori dan stoknya bisa diupdate setiap kali ada pembelian.",
			},
			{
				title: "Update stok",
				desc: "Untuk update stok, klik ikon edit pada bahan, ubah jumlah stok sesuai kondisi gudang, lalu simpan.",
			},
		],
	},
	{
		id: 3,
		title: "Produk & Resep",
		icon: Archive,
		color: "#6A1B9A",
		bg: "#F3E5F5",
		steps: [
			{
				title: "Buka menu Produk & Resep",
				desc: "Klik Produk & Resep dari sidebar untuk melihat daftar semua produk.",
			},
			{
				title: "Tambah produk baru",
				desc: 'Klik "+ Tambah Produk". Isi nama produk, kategori (yang sudah dibuat sebelumnya), harga jual, dan deskripsi singkat.',
			},
			{
				title: "Tambah resep produk",
				desc: "Setelah produk tersimpan, klik tab Resep. Tambahkan setiap bahan baku yang digunakan beserta jumlahnya per batch produksi.",
			},
			{
				title: "Versi resep",
				desc: "Sistem menyimpan versi resep otomatis. Jika resep diubah, versi lama tetap tersimpan untuk referensi produksi sebelumnya.",
			},
			{
				title: "Harga pokok produksi",
				desc: "Sistem akan menghitung otomatis HPP berdasarkan bahan baku yang digunakan dan harga belinya.",
			},
		],
	},
	{
		id: 4,
		title: "Produksi",
		icon: Factory,
		color: "#E65100",
		bg: "#FFF8E1",
		steps: [
			{
				title: "Buka menu Produksi",
				desc: "Klik Produksi dari sidebar. Halaman ini menampilkan riwayat dan jadwal produksi.",
			},
			{
				title: "Buat produksi baru",
				desc: 'Klik "+ Buat Produksi". Pilih produk yang akan diproduksi dan jumlah batch (porsi).',
			},
			{
				title: "Verifikasi stok bahan",
				desc: "Sistem akan otomatis menghitung kebutuhan bahan berdasarkan resep. Pastikan stok mencukupi sebelum lanjut.",
			},
			{
				title: "Mulai produksi",
				desc: 'Klik Mulai Produksi. Status akan berubah menjadi "Proses". Stok bahan baku akan langsung terpotong otomatis.',
			},
			{
				title: "Selesaikan produksi",
				desc: "Setelah produksi selesai, klik Selesai dan masukkan jumlah aktual yang berhasil diproduksi. Sistem akan catat tanggal kedaluwarsa.",
			},
		],
	},
	{
		id: 5,
		title: "Order",
		icon: ShoppingCart,
		color: "#1565A0",
		bg: "#E3F2FB",
		steps: [
			{
				title: "Buka menu Order",
				desc: "Klik Order dari sidebar. Daftar semua order aktif dan riwayat akan tampil.",
			},
			{
				title: "Buat order baru",
				desc: 'Klik "+ Buat Order". Masukkan nama pelanggan, nomor kontak, dan tanggal pengiriman yang diinginkan.',
			},
			{
				title: "Tambah item order",
				desc: "Pilih produk dari dropdown, masukkan jumlah. Harga akan otomatis terisi dari data produk. Bisa tambah beberapa item sekaligus.",
			},
			{
				title: "Konfirmasi & proses",
				desc: "Setelah semua item ditambahkan, klik Konfirmasi. Status order berubah dari Pending → Proses.",
			},
			{
				title: "Tandai selesai",
				desc: "Saat order sudah disiapkan dan diserahkan ke pelanggan, klik Selesai. Data pemasukan akan tercatat otomatis ke modul Keuangan.",
			},
		],
	},
	{
		id: 6,
		title: "Keuangan",
		icon: Banknote,
		color: "#2E7D32",
		bg: "#E8F5E9",
		steps: [
			{
				title: "Buka menu Keuangan",
				desc: "Klik Keuangan dari sidebar untuk melihat ringkasan pemasukan dan pengeluaran.",
			},
			{
				title: "Pemasukan otomatis",
				desc: "Setiap order yang diselesaikan akan otomatis tercatat sebagai pemasukan. Tidak perlu input manual.",
			},
			{
				title: "Catat pengeluaran",
				desc: 'Untuk pengeluaran seperti pembelian bahan baku, klik "+ Tambah Pengeluaran". Masukkan nominal, kategori, dan deskripsi.',
			},
			{
				title: "Laporan harian/bulanan",
				desc: "Gunakan filter tanggal untuk melihat laporan per periode. Grafik akan menampilkan tren pemasukan vs pengeluaran.",
			},
			{
				title: "Export laporan",
				desc: "Klik Export untuk mengunduh laporan dalam format Excel atau PDF untuk keperluan pembukuan.",
			},
		],
	},
];
