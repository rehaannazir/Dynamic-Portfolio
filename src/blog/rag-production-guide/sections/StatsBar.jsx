import { Reveal } from "@/lib/motion";
import { Counter } from "../components/Counter";
import { TOC } from "../toc";

export function StatsBar() {
  return (
    <Reveal variant="blur" duration={0.7}>
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="glass rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {[
            { end: 87, suffix: "", label: "chapters planned" },
            { end: 11, suffix: "", label: "parts" },
            { end: 14, suffix: "hr", label: "full guide length" },
            { end: TOC.length, suffix: "", label: "published so far" },
          ].map(({ end, suffix, label }) => (
            <div key={label} className="text-center py-7 px-4">
              <Counter end={end} suffix={suffix} />
              <div className="text-slate-400 text-xs mono mt-1.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
