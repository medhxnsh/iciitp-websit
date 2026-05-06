import type { LabEquipment } from "@/lib/content";

interface LabSpecTableProps {
  equipment: LabEquipment[];
  labName: string;
}

export function LabSpecTable({ equipment, labName }: LabSpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-[--radius-lg] border border-[--color-border]">
      <table className="w-full text-sm">
        <caption className="sr-only">{labName} equipment list</caption>
        <thead>
          <tr className="bg-[--color-surface-alt] text-left">
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text] w-8 text-center">#</th>
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text]">Equipment</th>
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text]">Purpose / Capability</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[--color-border]">
          {equipment.map((item, i) => (
            <tr key={item.name} className="bg-[--color-surface] hover:bg-[--color-brand-50] transition-colors">
              <td className="px-4 py-3 text-[--color-muted] text-center">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-[--color-text]">{item.name}</td>
              <td className="px-4 py-3 text-[--color-text-subtle]">{item.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
