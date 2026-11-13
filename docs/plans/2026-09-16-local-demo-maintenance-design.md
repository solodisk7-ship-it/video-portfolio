# Local demo maintenance

## Approval and scope

The owner approved the four maintenance items from the 2026-09-16 audit and explicitly kept the project in demo mode. There must be no push, deployment, hosted preview, or changes to the cloud bucket. Existing appearance, titles, videos, hidden work years and AI disclosure stay unchanged.

## Approaches considered

1. Targeted maintenance (selected): update affected dependencies, remove catalogue-size assumptions, use an existing real poster for sharing metadata and add repeatable browser checks. Preserve the demo release guard and current architecture.
2. Full production transition: rewrite release metadata, switch content status and prepare hosting changes. Rejected for this task because the owner is still adding content and has not authorized publication.

## Design

- Keep `contentStatus: 'demo'` and keep final release/deploy validation blocked while demo is active. A local quality/build command is not publication.
- Validate a nonempty visible catalogue with at least one featured work, without exact 6/11 counts or arbitrary launch minimums. New works can follow the current all-featured approach; non-featured works can still use Load More in batches of 12.
- Replace the hidden demo project's social image with the existing Boots — Horizontal poster, selected in site configuration with explicit dimensions/alt text. Validate that this is a visible real work's poster. No new image generation or design change.
- Update Next.js and its ESLint config together in the current stable branch. Refresh affected transitive dependencies. Update testing tools only as needed for security; if the fixed version requires a new major, verify compatibility explicitly.
- Keep browser UI tests independent of external storage by intercepting media requests for UI-only assertions. Put real media HTTP checks behind an explicit opt-in command. Test navigation, focus restoration/trap, Retry, responsive layout and metadata; derive catalogue counts from content rather than a snapshot of eleven items.
- Prepare CI to install Chromium, Firefox and WebKit and run the local static-export tests. This edits the workflow only; it does not trigger GitHub or publish the site.
- Update maintenance and demo instructions. Cloud cache settings, subtitles, a new domain and source-video re-exports remain separate tasks.

## Implementation plan and acceptance

1. Inspect source, audit and dependency advisories. No unrelated changes are present.
2. Patch dependency declarations and refresh the lockfile; repeat the security audit.
3. Extract/test catalogue validation rules, remove stale Featured constants/count assertions, centralize social image settings and update the CLI validator.
4. Extend UI tests and prepare CI. Preserve an opt-in check of real storage range/MIME responses.
5. Update README, content operations, deployment and QA notes to distinguish local demo work from future publication.
6. Run lint, typecheck, validation, unit tests, frozen installation consistency, static build and available browser engines. Exercise more than eleven works in synthetic regression tests. Verify that final release remains blocked by demo.
7. Record the actual test outcomes and any environment limitations. Do not push or deploy.

The separate writing-plans skill is not available in this session; the explicit implementation/verification plan above is the fallback. The audit and the owner's approval are the design input; no further interface redesign is introduced.

## Verification finding

WebKit exposed a focus-restoration defect: pointer-clicking a button does not always focus it, so the lightbox remembered the document rather than the opener. Focus the card without scrolling immediately before opening the lightbox and add a regression test. This is a behavior correction within the planned keyboard/focus checks, not a visual redesign.

Browser UI tests assert source assignment and Retry error handling, not that every engine must immediately honor the preload hint. Native playback of every real MP4 is checked separately in installed Edge; Range/MIME/CORS are checked by the explicit media suite.
