-- ─────────────────────────────────────────────────────────────────────────────
-- Partner RLS policies
-- Allows an authenticated user to SELECT rows owned by their active partner.
-- Multiple SELECT policies on the same table are combined with OR in Postgres,
-- so these additions never break the existing "own data" policies.
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: returns true when the calling user has an active partner connection
-- with the row's owner.
-- We inline the EXISTS subquery in each policy so no extra function is needed.

-- ── emis ──────────────────────────────────────────────────────────────────────
CREATE POLICY "partners_can_select_emis"
ON public.emis
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.partner_connections pc
    WHERE pc.status = 'active'
      AND (
        (pc.inviter_id = auth.uid() AND pc.invitee_id = emis.user_id)
        OR
        (pc.invitee_id = auth.uid() AND pc.inviter_id = emis.user_id)
      )
  )
);

-- ── recurring_payments ────────────────────────────────────────────────────────
CREATE POLICY "partners_can_select_recurring_payments"
ON public.recurring_payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.partner_connections pc
    WHERE pc.status = 'active'
      AND (
        (pc.inviter_id = auth.uid() AND pc.invitee_id = recurring_payments.user_id)
        OR
        (pc.invitee_id = auth.uid() AND pc.inviter_id = recurring_payments.user_id)
      )
  )
);

-- ── categories ────────────────────────────────────────────────────────────────
CREATE POLICY "partners_can_select_categories"
ON public.categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.partner_connections pc
    WHERE pc.status = 'active'
      AND (
        (pc.inviter_id = auth.uid() AND pc.invitee_id = categories.user_id)
        OR
        (pc.invitee_id = auth.uid() AND pc.inviter_id = categories.user_id)
      )
  )
);
