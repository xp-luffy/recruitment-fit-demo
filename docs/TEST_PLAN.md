# Test Plan

## v1 Success Scenario (Manual)
1. Open app (not logged in) — candidate list loads with 3 seeded candidates ranked by score.
2. Click "New Candidate" → enter name + role → save → appears in list.
3. Go to Rubrics → confirm seeded "Engineering Hire" rubric with Culture/Capability/Potential (weights 1.0/2.0/1.0).
4. Open candidate → "New Evaluation" → select rubric → paste interview transcript text → eval_type = interview → click "Run Scoring".
5. Verify: per-criterion scores (0–5) appear, total_score = weighted average ×20 (0–100), justification shown.
6. Verify candidate list re-ranks — new evaluation's candidate moves position.
7. (If AI toggle available) Toggle AI on → suggested scores appear with confidence + review badge → click Accept → scores persist → list re-ranks.

## Empty / Error Cases
- **Empty candidate list:** Shows "No candidates yet. Create one." with create CTA.
- **Empty raw_text on evaluation:** Form validation blocks submit; message "Paste CV or transcript text to score."
- **Missing rubric:** Evaluation form warns "Select a rubric before scoring."
- **AI returns invalid JSON:** Error toast "Scoring failed — showing rule-based scores only." Rule-based scores still display.
- **Low-confidence AI score:** Score row highlighted yellow, badge "Needs review".
- **Network error:** Loading state → error state with retry button.

## Security Check
- Confirm no API keys in client bundle (grep build output).
- Confirm delete candidate requires confirm dialog (human-only action).
- Confirm audit_logs row exists after accepting AI scores.
