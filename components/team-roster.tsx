import type { TeamMember } from "@/lib/content";

interface TeamRosterProps {
  members: TeamMember[];
  caption: string;
  groupByRole?: boolean;
}

export function TeamRoster({ members, caption, groupByRole = false }: TeamRosterProps) {
  if (!groupByRole) {
    return <RosterTable members={members} caption={caption} />;
  }

  const groups = members.reduce<Record<string, TeamMember[]>>((acc, m) => {
    (acc[m.role] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([role, group]) => (
        <div key={role}>
          <h3 className="text-sm font-semibold text-[--color-muted] uppercase tracking-wider mb-3">
            {role}
          </h3>
          <RosterTable members={group} caption={`${caption} — ${role}`} />
        </div>
      ))}
    </div>
  );
}

function RosterTable({ members, caption }: { members: TeamMember[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-[--radius-lg] border border-[--color-border]">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-[--color-surface-alt] text-left">
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text] w-8 text-center">
              #
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text]">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text]">
              Designation / Organisation
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[--color-text] hidden sm:table-cell">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[--color-border]">
          {members.map((m, i) => (
            <tr
              key={`${m.name}-${i}`}
              className="bg-[--color-surface] hover:bg-[--color-brand-50] transition-colors"
            >
              <td className="px-4 py-3 text-[--color-muted] text-center">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-[--color-text]">{m.name}</td>
              <td className="px-4 py-3 text-[--color-text-subtle]">{m.designation}</td>
              <td className="px-4 py-3 text-[--color-muted] hidden sm:table-cell">{m.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
