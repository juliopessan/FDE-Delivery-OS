# Architecture Decision Records

An ADR records a decision that shaped this system — the *why*, and what was
given up. Code shows what was built; it never shows what was rejected, or the
constraint that made the alternative unworkable. That is the only thing an ADR
is for.

## Where a record lives

The path carries two facts, so neither needs a field inside the file:
`{lifecycle}/{class}/ADR-NNNN-topic-title.md`.

**Lifecycle** is the top-level folder, and a record moves between folders as its
status changes:

| Folder | Meaning |
|---|---|
| `proposed/` | Under review. Not built, or built only in part. |
| `implemented/` | Shipped. Kept true to what actually shipped — see below. |
| `rejected/` | Considered and declined. Kept only while it still prevents a mistake. |

**Class** is the nested folder — the kind of decision. The set is closed; adding
to it means changing this table:

| Class | What it covers |
|---|---|
| `architecture` | The shipped system — how the platform, the agent pipeline, and the data contracts relate. |
| `method` | The delivery method itself — phases, gates, what a phase must produce. |
| `process` | Tooling and workflow *around* the work — repository conventions, CI, review gates. Not runtime behavior. |

The discriminator between `architecture` and `process`: architecture is about
what we ship, process is about how we work on it.

## Three rules that make the tree worth maintaining

**An implemented record is kept current with what shipped.** When a later change
renames a package, moves a file, or changes a default that the record names, the
record is corrected in the same commit. Facts only — paths, names, structure.
The decision and its rationale are history and stay as written.

**A rejected record survives only while it prevents a tempting mistake.** The
reason to keep "we considered a multi-agent swarm and declined" is that someone
will propose it again. When a rejection stops being tempting, delete the file —
a rejected record nobody would re-propose is filing, not knowledge.

**A proposal is never archived, only rejected.** A stale proposal in `proposed/`
reads as pending work. If it is not going to happen, say so and move it.

## What a record must contain

Use [the template](../templates/adr-template.md). A record that states only its
decision has recorded the part the code already shows, and left out the part only
the author knew: the alternatives, the evidence, and the consequence accepted.

Cross-references between records use relative markdown links, never a bare
`ADR-0003` in prose — a link survives a move between folders and can be checked
mechanically.

There is no index file. The tree is the inventory; browse it or search it.

## Current state

The four records in `implemented/architecture/` are **titles and one-line
decisions**, written before this convention. None of them carries context,
alternatives, evidence, or consequences, so none of them yet does the job
described above. They are numbered `ADR-NNNN` rather than dated because the
number is their identity and is referenced elsewhere.

Filling them in is worth more than adding new ones.

---

The lifecycle-and-class-in-the-path scheme, and the retention rules above, are
adapted from the Agent Notes convention in
[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (MIT).
