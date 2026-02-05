import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Answer {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  emoji: string;
  answers: Answer[];
}

export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data: questions, error: qError } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (qError) throw qError;

      const { data: answers, error: aError } = await supabase
        .from("answers")
        .select("*");

      if (aError) throw aError;

      return questions.map((q) => ({
        ...q,
        answers: answers.filter((a) => a.question_id === q.id),
      })) as Question[];
    },
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      emoji,
      answers,
    }: {
      emoji: string;
      answers: { text: string; is_correct: boolean }[];
    }) => {
      const { data: question, error: qError } = await supabase
        .from("questions")
        .insert({ emoji })
        .select()
        .single();

      if (qError) throw qError;

      const { error: aError } = await supabase.from("answers").insert(
        answers.map((a) => ({
          question_id: question.id,
          text: a.text,
          is_correct: a.is_correct,
        }))
      );

      if (aError) throw aError;
      return question;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });
}
