"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { createSupabaseClient } from "./supabaseClient";
import { UserProfile, AppState } from "./types";

const INITIAL_STATE: AppState = {
  screen: "onboarding",
  onboardingComplete: false,
  rejected: false,
  rejectionMessage: "",
  userProfile: null,
  currentIdea: null,
  executionPlan: null,
  chatMessages: [],
};

export function usePrisonState() {
  const { getToken, userId, isLoaded } = useAuth();
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  const fetchState = useCallback(async () => {
    if (!isLoaded || !userId) {
      setLoading(false);
      return;
    }

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        console.warn("No Supabase token found. Ensure JWT template is configured in Clerk Dashboard.");
        setLoading(false);
        return;
      }

      const supabase = createSupabaseClient(token);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching state:", error);
      } else if (data) {
        // Map snake_case from DB to camelCase for AppState
        const profile: UserProfile = {
          ageBracket: data.age_bracket,
          locationType: data.location_type,
          employmentStatus: data.employment_status,
          capitalAvailable: data.capital_available,
          monthlyRunway: data.monthly_runway,
          weeklyHours: data.weekly_hours,
          skillType: data.skill_type,
          pastAttempts: data.past_attempts,
          biggestFailure: data.biggest_failure,
          whyNow: data.why_now,
          commitment: data.commitment,
        };

        setState(prev => ({
          ...prev,
          userProfile: profile,
          onboardingComplete: true,
          screen: "prison",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch state:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken, userId, isLoaded]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const saveToCloud = async (newProfile: UserProfile) => {
    if (!userId) return;

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) return;

      const supabase = createSupabaseClient(token);
      
      const dbData = {
        id: userId,
        age_bracket: newProfile.ageBracket,
        location_type: newProfile.locationType,
        employment_status: newProfile.employmentStatus,
        capital_available: newProfile.capitalAvailable,
        monthly_runway: newProfile.monthlyRunway,
        weekly_hours: newProfile.weeklyHours,
        skill_type: newProfile.skillType,
        past_attempts: newProfile.pastAttempts,
        biggest_failure: newProfile.biggestFailure,
        why_now: newProfile.whyNow,
        commitment: newProfile.commitment,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .upsert(dbData);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        userProfile: newProfile,
        onboardingComplete: true,
        screen: "prison",
      }));
    } catch (err) {
      console.error("Failed to save state:", err);
    }
  };

  return {
    state,
    loading,
    saveToCloud,
    refresh: fetchState
  };
}
