export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      author: {
        Row: {
          about: string | null
          created_at: string
          custom_theme: Json | null
          id: number
          preferences: Json | null
          preset_theme: string | null
          primary: boolean | null
          theme: string | null
          user: string | null
          username: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          custom_theme?: Json | null
          id?: number
          preferences?: Json | null
          preset_theme?: string | null
          primary?: boolean | null
          theme?: string | null
          user?: string | null
          username?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string
          custom_theme?: Json | null
          id?: number
          preferences?: Json | null
          preset_theme?: string | null
          primary?: boolean | null
          theme?: string | null
          user?: string | null
          username?: string | null
        }
        Relationships: []
      }
      bookmark: {
        Row: {
          author: number | null
          chapter: number | null
          created_at: string
          id: number
          note: string | null
          user: string | null
        }
        Insert: {
          author?: number | null
          chapter?: number | null
          created_at?: string
          id?: number
          note?: string | null
          user?: string | null
        }
        Update: {
          author?: number | null
          chapter?: number | null
          created_at?: string
          id?: number
          note?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmark_chapter_fkey"
            columns: ["chapter"]
            isOneToOne: false
            referencedRelation: "chapter"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter: {
        Row: {
          author_note: string | null
          chapter_index: number | null
          content: string | null
          created_at: string
          id: number
          story: number | null
          summary: string | null
          theme: Json | null
          title: string
          user: string
          warning: Json | null
          word_count: number | null
        }
        Insert: {
          author_note?: string | null
          chapter_index?: number | null
          content?: string | null
          created_at?: string
          id?: number
          story?: number | null
          summary?: string | null
          theme?: Json | null
          title: string
          user: string
          warning?: Json | null
          word_count?: number | null
        }
        Update: {
          author_note?: string | null
          chapter_index?: number | null
          content?: string | null
          created_at?: string
          id?: number
          story?: number | null
          summary?: string | null
          theme?: Json | null
          title?: string
          user?: string
          warning?: Json | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_story_fkey"
            columns: ["story"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      comment: {
        Row: {
          author: number | null
          chapter: number | null
          content: string | null
          created_at: string
          id: number
          story: number | null
          user: string | null
        }
        Insert: {
          author?: number | null
          chapter?: number | null
          content?: string | null
          created_at?: string
          id?: number
          story?: number | null
          user?: string | null
        }
        Update: {
          author?: number | null
          chapter?: number | null
          content?: string | null
          created_at?: string
          id?: number
          story?: number | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_chapter_fkey"
            columns: ["chapter"]
            isOneToOne: false
            referencedRelation: "chapter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_story_fkey"
            columns: ["story"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      like: {
        Row: {
          author: number
          created_at: string
          id: number
          story: number
          user: string
        }
        Insert: {
          author: number
          created_at?: string
          id?: number
          story: number
          user: string
        }
        Update: {
          author?: number
          created_at?: string
          id?: number
          story?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_story_fkey"
            columns: ["story"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      rec: {
        Row: {
          author: number | null
          created_at: string
          id: number
          note: string | null
          story: number | null
          user: string | null
        }
        Insert: {
          author?: number | null
          created_at?: string
          id?: number
          note?: string | null
          story?: number | null
          user?: string | null
        }
        Update: {
          author?: number | null
          created_at?: string
          id?: number
          note?: string | null
          story?: number | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rec_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rec_story_fkey"
            columns: ["story"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      story: {
        Row: {
          author: number
          chapter_count: number | null
          created_at: string
          id: number
          primary_pairing: Json | null
          secondary_pairing: Json | null
          series: Json | null
          summary: string | null
          themes: Json | null
          title: string
          user: string
          warnings: Json | null
          word_count: number | null
        }
        Insert: {
          author: number
          chapter_count?: number | null
          created_at?: string
          id?: number
          primary_pairing?: Json | null
          secondary_pairing?: Json | null
          series?: Json | null
          summary?: string | null
          themes?: Json | null
          title: string
          user?: string
          warnings?: Json | null
          word_count?: number | null
        }
        Update: {
          author?: number
          chapter_count?: number | null
          created_at?: string
          id?: number
          primary_pairing?: Json | null
          secondary_pairing?: Json | null
          series?: Json | null
          summary?: string | null
          themes?: Json | null
          title?: string
          user?: string
          warnings?: Json | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "story_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
