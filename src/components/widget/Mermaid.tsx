import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid configuration with brand color mappings
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#f8fafc",
    primaryTextColor: "#334155",
    primaryBorderColor: "#e2e8f0",
    lineColor: "#94a3b8",
    secondaryColor: "#ecfdf5",
    tertiaryColor: "#fffbeb",
    noteBkgColor: "#fffbeb",
    noteBorderColor: "#fde68a",
  },
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis",
  },
});

let idCounter = 0;

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const elementId = useRef(`mermaid-chart-${idCounter++}`);

  useEffect(() => {
    let active = true;

    const renderChart = async () => {
      try {
        setError(false);
        const { svg: renderedSvg } = await mermaid.render(elementId.current, chart);
        if (active) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error("Failed to render Mermaid chart:", err);
        if (active) {
          setError(true);
        }
      }
    };

    renderChart();

    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 text-center text-xs text-rose-500 bg-rose-50 rounded-xl border border-rose-100">
        Gagal merender diagram alir. Silakan muat ulang halaman.
      </div>
    );
  }

  return (
    <div
      className="flex justify-center p-4 md:p-6 bg-white rounded-xl border border-slate-100 overflow-x-auto shadow-xs w-full [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{
        __html: svg || '<span className="text-xs text-slate-400 animate-pulse">Menyiapkan diagram...</span>',
      }}
    />
  );
}
