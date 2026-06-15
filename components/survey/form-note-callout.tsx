import type { Bilingual } from "@/components/forms/types";

type FormNoteCalloutProps = {
  note?: Bilingual;
};

export function FormNoteCallout({ note }: FormNoteCalloutProps) {
  if (!note) return null;

  return (
    <div className="border border-[#f0d9b8] border-l-4 border-l-[#c2410c] bg-[#fff7ed] px-4 py-3 text-sm text-[#7c2d12]">
      <p className="font-semibold">Note:</p>
      <p className="mt-1">{note.en}</p>
      <p className="mt-1 text-[13px] leading-relaxed">{note.hi}</p>
    </div>
  );
}
