import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const getVoterId = () => {
  let voterId = localStorage.getItem("voter_id");
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem("voter_id", voterId);
  }
  return voterId;
};

export interface VoteCount {
  answer_id: string;
  count: number;
}

export function useVoteCounts(questionId: string) {
  return useQuery({
    queryKey: ["vote-counts", questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votes")
        .select("answer_id")
        .eq("question_id", questionId);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((vote) => {
        counts[vote.answer_id] = (counts[vote.answer_id] || 0) + 1;
      });
      return counts;
    },
  });
}

export function useHasVoted(questionId: string) {
  return useQuery({
    queryKey: ["has-voted", questionId],
    queryFn: async () => {
      const voterId = getVoterId();
      const { data, error } = await supabase
        .from("votes")
        .select("id")
        .eq("question_id", questionId)
        .eq("voter_id", voterId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
  });
}

export function useResetVotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("votes").delete().neq("id", "");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["has-voted"] });
      queryClient.invalidateQueries({ queryKey: ["vote-counts"] });
    },
  });
}

export function useSubmitVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      answerId,
    }: {
      questionId: string;
      answerId: string;
    }) => {
      const voterId = getVoterId();

      const { error } = await supabase.from("votes").insert({
        question_id: questionId,
        answer_id: answerId,
        voter_id: voterId,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["has-voted", variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ["vote-counts", variables.questionId] });
    },
  });
}
