import { BarChart2, Leaf, ShieldCheck } from "lucide-react";
import logo from "@/assets/image.png";
import BannerBackground from "@/components/common/BannerBackground";
import { cn } from "@/lib/utils";

const features = [
	{
		icon: BarChart2,
		title: "Pantau Stok Real-time",
		desc: "Data selalu terbaru, keputusan lebih tepat.",
	},
	{
		icon: Leaf,
		title: "Kurangi Pemborosan",
		desc: "Kelola bahan baku dengan lebih efisien.",
	},
	{
		icon: ShieldCheck,
		title: "Kontrol Penuh",
		desc: "Semua inventaris dalam satu sistem.",
	},
];

interface AuthBannerProps {
	className?: string;
}

export default function AuthBanner({ className }: AuthBannerProps) {
	return (
		<BannerBackground
			variant="full"
			className={cn("flex flex-col", className)}
			showDotTopRight={true}
			showRingTopRight={false}
		>
			{/* Logo */}
			<div className="relative z-10 flex items-center gap-3 px-14 pt-12 shrink-0">
				<img src={logo} alt="FANDM" className="h-7 object-contain" />
				<span className="text-white font-bold text-base tracking-[0.1em]">
					FANDM
				</span>
			</div>

			{/* Hero */}
			<div className="relative z-10 flex-1 flex flex-col justify-center px-14">
				<h1 className="text-white text-5xl font-semibold font-serif leading-[1.2] tracking-[-0.5px] mb-6">
					Stok Aman,
					<br />
					Hati Tenang.
					<sup className="text-[28px] font-normal ml-1 align-super">°</sup>
				</h1>

				{/* Accent line */}
				<div className="w-10 h-[3px] bg-[var(--fandm-accent)] rounded-full mb-8" />

				{/* Deskripsi */}
				<p className="text-[var(--fandm-border)] text-[15px] leading-relaxed max-w-xs mb-12">
					Jangan biarkan bahan baku terbuang sia-sia. Pantau inventaris secara
					real-time dan fokuslah pada apa yang kamu cintai: memasak.
				</p>

				{/* Feature list */}
				<div className="flex flex-col gap-7">
					{features.map(({ icon: Icon, title, desc }) => (
						<div key={title} className="flex items-center gap-4">
							<div className="w-[42px] h-[42px] rounded-full border border-white/20 flex items-center justify-center shrink-0">
								<Icon size={18} className="text-white" strokeWidth={1.5} />
							</div>
							<div>
								<p className="text-white text-sm font-semibold mb-1">{title}</p>
								<p className="text-[var(--fandm-border)] text-xs opacity-80">
									{desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Footer */}
			<div className="relative z-10 px-14 pb-8 shrink-0" />
		</BannerBackground>
	);
}
