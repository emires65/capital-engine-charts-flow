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
      admin_logs: {
        Row: {
          action_type: string
          admin_id: string | null
          amount: number | null
          created_at: string | null
          description: string | null
          id: string
          user_affected: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          user_affected?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          user_affected?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_logs_user_affected_fkey"
            columns: ["user_affected"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_plans: {
        Row: {
          created_at: string | null
          daily_profit_percentage: number
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          minimum_deposit: number
          name: string
        }
        Insert: {
          created_at?: string | null
          daily_profit_percentage: number
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean | null
          minimum_deposit: number
          name: string
        }
        Update: {
          created_at?: string | null
          daily_profit_percentage?: number
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          minimum_deposit?: number
          name?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          amount: number
          coin_symbol: string
          created_at: string | null
          id: string
          purchase_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          coin_symbol: string
          created_at?: string | null
          id?: string
          purchase_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          coin_symbol?: string
          created_at?: string | null
          id?: string
          purchase_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          coin_type: string | null
          created_at: string | null
          id: string
          payment_method: string | null
          plan_id: string | null
          profit_amount: number | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          amount: number
          coin_type?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          profit_amount?: number | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          coin_type?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string | null
          profit_amount?: number | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "investment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profits: {
        Row: {
          created_at: string | null
          daily_profit: number
          id: string
          is_paid: boolean | null
          plan_id: string | null
          profit_date: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          daily_profit: number
          id?: string
          is_paid?: boolean | null
          plan_id?: string | null
          profit_date: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          daily_profit?: number
          id?: string
          is_paid?: boolean | null
          plan_id?: string | null
          profit_date?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "investment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profits_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          balance: number | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          plan_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          balance?: number | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          plan_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          balance?: number | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          plan_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "investment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_daily_profits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
