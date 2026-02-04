export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      inventory: {
        Row: InventoryItem;
        Insert: InventoryItemInsert;
        Update: InventoryItemUpdate;
      };
      quotes: {
        Row: Quote;
        Insert: QuoteInsert;
        Update: QuoteUpdate;
      };
      quote_line_items: {
        Row: QuoteLineItem;
        Insert: QuoteLineItemInsert;
        Update: QuoteLineItemUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: BlogPostUpdate;
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: GalleryItemInsert;
        Update: GalleryItemUpdate;
      };
    };
    Views: {};
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "client" | "admin";
      inventory_status: "available" | "sold" | "reserved" | "draft";
      power_type: "solar" | "battery" | "electric";
      quote_status:
        | "draft"
        | "submitted"
        | "reviewing"
        | "quoted"
        | "accepted"
        | "rejected"
        | "expired";
      order_status:
        | "confirmed"
        | "materials"
        | "building"
        | "finishing"
        | "ready"
        | "shipped"
        | "delivered"
        | "completed";
    };
  };
};

// --- Profiles ---

export type Profile = {
  id: string;
  role: "client" | "admin";
  full_name: string | null;
  email: string;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  property_type: string | null;
  property_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;

// --- Inventory ---

export type InventoryItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // stored in cents
  power: "solar" | "battery" | "electric";
  status: "available" | "sold" | "reserved" | "draft";
  images: string[];
  dimensions: string;
  wood: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type InventoryItemInsert = Omit<InventoryItem, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type InventoryItemUpdate = Partial<Omit<InventoryItem, "id" | "created_at" | "updated_at">>;

// --- Quotes ---

export type Quote = {
  id: string;
  client_id: string;
  status: "draft" | "submitted" | "reviewing" | "quoted" | "accepted" | "rejected" | "expired";
  wood_type: string | null;
  power_source: "solar" | "battery" | "electric" | null;
  dimensions: string | null;
  quantity: number;
  custom_notes: string | null;
  admin_notes: string | null;
  quoted_total: number | null; // cents
  valid_until: string | null;
  created_at: string;
  updated_at: string;
};

export type QuoteInsert = Omit<Quote, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type QuoteUpdate = Partial<Omit<Quote, "id" | "client_id" | "created_at" | "updated_at">>;

// --- Quote Line Items ---

export type QuoteLineItem = {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number; // cents
  sort_order: number;
  created_at: string;
};

export type QuoteLineItemInsert = Omit<QuoteLineItem, "id" | "created_at"> & {
  id?: string;
};
export type QuoteLineItemUpdate = Partial<Omit<QuoteLineItem, "id" | "quote_id" | "created_at">>;

// --- Orders ---

export type Order = {
  id: string;
  quote_id: string;
  client_id: string;
  status:
    | "confirmed"
    | "materials"
    | "building"
    | "finishing"
    | "ready"
    | "shipped"
    | "delivered"
    | "completed";
  status_note: string | null;
  estimated_completion: string | null;
  tracking_number: string | null;
  delivery_address: string | null;
  total: number; // cents
  created_at: string;
  updated_at: string;
};

export type OrderInsert = Omit<Order, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type OrderUpdate = Partial<
  Omit<Order, "id" | "quote_id" | "client_id" | "created_at" | "updated_at">
>;

// --- Messages ---

export type Message = {
  id: string;
  quote_id: string | null;
  order_id: string | null;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type MessageInsert = Omit<Message, "id" | "created_at"> & {
  id?: string;
};
export type MessageUpdate = Partial<Pick<Message, "is_read">>;

// --- Joined Types ---

export type QuoteWithClient = Quote & {
  profiles: Pick<Profile, "full_name" | "email">;
};

export type QuoteWithLineItems = Quote & {
  quote_line_items: QuoteLineItem[];
};

export type QuoteDetail = Quote & {
  profiles: Pick<Profile, "full_name" | "email" | "phone">;
  quote_line_items: QuoteLineItem[];
};

export type OrderWithClient = Order & {
  profiles: Pick<Profile, "full_name" | "email">;
};

export type OrderWithQuote = Order & {
  quotes: Pick<Quote, "wood_type" | "power_source" | "dimensions" | "quantity">;
};

export type OrderDetail = Order & {
  profiles: Pick<Profile, "full_name" | "email" | "phone">;
  quotes: Pick<Quote, "wood_type" | "power_source" | "dimensions" | "quantity">;
};

export type MessageWithSender = Message & {
  profiles: Pick<Profile, "full_name" | "email">;
};

// --- Blog Posts ---

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  date: string;
  author: string;
  category: string | null;
  image: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPostInsert = Omit<BlogPost, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type BlogPostUpdate = Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>;

// --- Gallery Items ---

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryItemInsert = Omit<GalleryItem, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type GalleryItemUpdate = Partial<Omit<GalleryItem, "id" | "created_at" | "updated_at">>;
