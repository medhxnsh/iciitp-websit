"use client";

import { useState, useRef } from "react";
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
  const [active, setActive] = useState<TeamMember | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(m: TeamMember) {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    const hasExtra = m.photo || m.bio || m.email || m.linkedin;
    if (hasExtra) setActive(m);
  }

  function hide() {
    leaveTimer.current = setTimeout(() => setActive(null), 200);
  }

  function keepOpen() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-[--radius-lg] border border-[--color-border]">
        <table className="w-full text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-[--color-surface-alt] text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-[--color-text] w-8 text-center">#</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[--color-text]">Name</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[--color-text]">Designation</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[--color-text] hidden sm:table-cell">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--color-border]">
            {members.map((m, i) => (
              <tr
                key={`${m.name}-${i}`}
                onMouseEnter={() => show(m)}
                onMouseLeave={hide}
                className="transition-colors cursor-default"
                style={{ backgroundColor: active === m ? "#f0f7e6" : "var(--color-surface)" }}
              >
                <td className="px-4 py-2.5 text-[--color-muted] text-center">{i + 1}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    {m.photo ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: "#d4e6c4" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.photo}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: "center 15%" }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>
                        {m.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <span className="font-medium text-[--color-text]">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[--color-text-subtle]">{m.designation}</td>
                <td className="px-4 py-2.5 text-[--color-muted] hidden sm:table-cell">{m.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <ProfileCard member={active} onMouseEnter={keepOpen} onMouseLeave={hide} />
      )}
    </>
  );
}

function ProfileCard({
  member,
  onMouseEnter,
  onMouseLeave,
}: {
  member: TeamMember;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <>
      {/* Dim backdrop — pointer-events: none so it never intercepts mouse, stopping the flicker */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.35)", pointerEvents: "none" }}
        aria-hidden="true"
      />

      {/* Card — centered, natural image height */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[92vw] rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid #dde0d4", backgroundColor: "#fff" }}
        role="tooltip"
      >
        {/* Photo at natural aspect ratio — no crop, no fixed height */}
        {member.photo && (
          <div className="relative w-full" style={{ backgroundColor: "#f0f0ec" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="w-full block"
              style={{ maxHeight: "55vh", objectFit: "contain" }}
            />
            {/* role badge */}
            <span
              className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(240,247,230,0.95)", color: "#3a5214" }}
            >
              {member.role}
            </span>
          </div>
        )}

        <div className="p-5">
          <p className="text-lg font-black leading-tight" style={{ color: "#1c2e06" }}>{member.name}</p>
          <p className="text-sm mt-0.5 mb-3" style={{ color: "#7a8e6a" }}>{member.designation}</p>

          {!member.photo && (
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}>{member.role}</span>
          )}

          {member.bio && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#444" }}>
              {member.bio}
            </p>
          )}

          {(member.email || member.linkedin) && (
            <div className="flex gap-2 flex-wrap pt-3 border-t" style={{ borderColor: "#e8f0e0" }}>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {member.email}
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
