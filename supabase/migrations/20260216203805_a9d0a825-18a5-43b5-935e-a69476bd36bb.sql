
-- Allow deleting votes (needed for reset votes feature in admin)
CREATE POLICY "Anyone can delete votes"
ON public.votes
FOR DELETE
USING (true);
