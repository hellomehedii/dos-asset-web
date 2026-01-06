export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          content: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          section_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          section_type: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          section_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          badge_text: string | null
          banner_image: string | null
          created_at: string
          headline: string | null
          highlight_text: string | null
          id: string
          primary_button_link: string | null
          primary_button_text: string | null
          stat_1_label: string | null
          stat_1_value: string | null
          stat_2_label: string | null
          stat_2_value: string | null
          stat_3_label: string | null
          stat_3_value: string | null
          subtext: string | null
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          banner_image?: string | null
          created_at?: string
          headline?: string | null
          highlight_text?: string | null
          id?: string
          primary_button_link?: string | null
          primary_button_text?: string | null
          stat_1_label?: string | null
          stat_1_value?: string | null
          stat_2_label?: string | null
          stat_2_value?: string | null
          stat_3_label?: string | null
          stat_3_value?: string | null
          subtext?: string | null
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          banner_image?: string | null
          created_at?: string
          headline?: string | null
          highlight_text?: string | null
          id?: string
          primary_button_link?: string | null
          primary_button_text?: string | null
          stat_1_label?: string | null
          stat_1_value?: string | null
          stat_2_label?: string | null
          stat_2_value?: string | null
          stat_3_label?: string | null
          stat_3_value?: string | null
          subtext?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      management_team: {
        Row: {
          bio: string | null
          created_at: string
          designation: string
          display_order: number | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          social_facebook: string | null
          social_linkedin: string | null
          social_twitter: string | null
          team_category: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          designation: string
          display_order?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          social_facebook?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          team_category?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          designation?: string
          display_order?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          social_facebook?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          team_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          created_at: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_image: string | null
          page_slug: string
          page_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_slug: string
          page_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_slug?: string
          page_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          amenities: Json | null
          created_at: string
          description: string | null
          display_order: number | null
          featured_image: string | null
          gallery: Json | null
          google_map_embed: string | null
          latitude: number | null
          longitude: number | null
          id: string
          is_featured: boolean | null
          land_area: string | null
          location: string
          name: string
          num_apartments: number | null
          orientation: string | null
          plan: string | null
          room_details: string | null
          slug: string
          status: Database["public"]["Enums"]["project_status"]
          HandOver: number | null
          unit_size: string | null
          updated_at: string
          verandas: number | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured_image?: string | null
          gallery?: Json | null
          google_map_embed?: string | null
          latitude?: number | null
          longitude?: number | null
          id?: string
          is_featured?: boolean | null
          land_area?: string | null
          location: string
          name: string
          num_apartments?: number | null
          orientation?: string | null
          plan?: string | null
          room_details?: string | null
          slug: string
          status?: Database["public"]["Enums"]["project_status"]
          HandOver?: number | null
          unit_size?: string | null
          updated_at?: string
          verandas?: number | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured_image?: string | null
          gallery?: Json | null
          google_map_embed?: string | null
          latitude?: number | null
          longitude?: number | null
          id?: string
          is_featured?: boolean | null
          land_area?: string | null
          location?: string
          name?: string
          num_apartments?: number | null
          orientation?: string | null
          plan?: string | null
          room_details?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["project_status"]
          HandOver?: number | null
          unit_size?: string | null
          updated_at?: string
          verandas?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          favicon_url: string | null
          footer_text: string | null
          google_analytics_id: string | null
          id: string
          logo_url: string | null
          meta_pixel_id: string | null
          phone: string | null
          primary_color: string | null
          site_name: string
          site_tagline: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          google_analytics_id?: string | null
          id?: string
          logo_url?: string | null
          meta_pixel_id?: string | null
          phone?: string | null
          primary_color?: string | null
          site_name?: string
          site_tagline?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          favicon_url?: string | null
          footer_text?: string | null
          google_analytics_id?: string | null
          id?: string
          logo_url?: string | null
          meta_pixel_id?: string | null
          phone?: string | null
          primary_color?: string | null
          site_name?: string
          site_tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_editor: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
      project_status: "upcoming" | "ongoing" | "handed_over"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      project_status: ["upcoming", "ongoing", "handed_over"],
    },
  },
} as const
