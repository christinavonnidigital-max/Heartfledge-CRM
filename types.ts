

export enum VehicleType {
  REFRIGERATED = 'refrigerated',
  DRY = 'dry',
  FLATBED = 'flatbed',
}

export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  OUT_OF_SERVICE = 'out_of_service',
}

export enum MaintenanceType {
  ROUTINE = 'routine',
  REPAIR = 'repair',
  INSPECTION = 'inspection',
  EMERGENCY = 'emergency',
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ExpenseType {
  FUEL = 'fuel',
  MAINTENANCE = 'maintenance',
  INSURANCE = 'insurance',
  LICENSE = 'license',
  TOLLS = 'tolls',
  PARKING = 'parking',
  OTHER = 'other',
}

export enum Currency {
    USD = 'USD',
    ZWL = 'ZWL',
    ZIG = 'ZIG',
}

export interface Vehicle {
  id: number;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  capacity_tonnes: number;
  status: VehicleStatus;
  current_km: number;
  last_service_date: string;
  next_service_due_km: number;
  gps_device_id: string;
}

export interface VehicleMaintenance {
  id: number;
  vehicle_id: number;
  maintenance_type: MaintenanceType;
  description: string;
  cost: number;
  service_date: string;
  status: MaintenanceStatus;
  next_service_date?: string;
}

export interface VehicleExpense {
  id: number;
  vehicle_id: number;
  expense_type: ExpenseType;
  amount: number;
  currency: Currency;
  description: string;
  expense_date: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri: string;
            review: string;
        }[];
    }[]
  };
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  groundingChunks?: GroundingChunk[];
}

// --- USER ---
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

// --- CRM & LEAD GENERATION ---

// --- LEADS MODULE ---

export enum LeadSource {
    WEBSITE = 'website',
    REFERRAL = 'referral',
    COLD_OUTREACH = 'cold_outreach',
    EVENT = 'event',
    SOCIAL_MEDIA = 'social_media',
    PARTNER = 'partner',
    OTHER = 'other',
}

export enum LeadStatus {
    NEW = 'new',
    CONTACTED = 'contacted',
    QUALIFIED = 'qualified',
    PROPOSAL_SENT = 'proposal_sent',
    NEGOTIATION = 'negotiation',
    WON = 'won',
    LOST = 'lost',
}

export enum CompanySize {
    STARTUP = 'startup',
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    ENTERPRISE = 'enterprise',
}

export enum Industry {
    FMCG = 'fmcg',
    RETAIL = 'retail',
    MANUFACTURING = 'manufacturing',
    AGRICULTURE = 'agriculture',
    MINING = 'mining',
    WHOLESALE = 'wholesale',
    OTHER = 'other',
}

export interface Lead {
    id: number;
    lead_source: LeadSource;
    lead_status: LeadStatus;
    lead_score: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
    company_size: CompanySize;
    industry: Industry;
    position: string;
    website: string;
    address: string;
    city: string;
    country: string;
    logistics_needs: string;
    current_provider?: string;
    monthly_shipment_volume?: number;
    preferred_routes?: string;
    assigned_to?: number; // user.id
    next_follow_up_date?: string;
    last_contact_date?: string;
    converted_to_customer_id?: number; // customer.id
    converted_at?: string;
    lost_reason?: string;
    lost_at?: string;
    notes?: string;
    tags: string[]; // or JSON
    custom_fields: Record<string, any>; // JSON
    created_at: string;
    updated_at: string;
}

export enum LeadActivityType {
    CALL = 'call',
    EMAIL = 'email',
    MEETING = 'meeting',
    NOTE = 'note',
    QUOTE_SENT = 'quote_sent',
    PROPOSAL_SENT = 'proposal_sent',
    STATUS_CHANGE = 'status_change',
    CAMPAIGN_EMAIL = 'campaign_email',
}

export interface LeadActivity {
    id: number;
    lead_id: number; // lead.id
    activity_type: LeadActivityType;
    subject: string;
    description: string;
    outcome?: string;
    next_action?: string;
    next_action_date?: string;
    performed_by: number; // user.id
    created_at: string;
}

export interface LeadScoringRule {
    id: number;
    rule_name: string;
    condition: Record<string, any>; // JSON
    points: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- EMAIL CAMPAIGNS MODULE ---

export enum CampaignType {
    COLD_OUTREACH = 'cold_outreach',
    NURTURE = 'nurture',
    REENGAGEMENT = 'reengagement',
    NEWSLETTER = 'newsletter',
    PROMOTIONAL = 'promotional',
}

export enum CampaignStatus {
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    ARCHIVED = 'archived',
}

export interface Campaign {
    id: number;
    campaign_name: string;
    campaign_type: CampaignType;
    campaign_goal: string;
    target_audience: string;
    status: CampaignStatus;
    timezone: string;
    sending_hours_start: string; // time
    sending_hours_end: string; // time
    send_on_weekends: boolean;
    daily_send_limit?: number;
    track_opens: boolean;
    track_clicks: boolean;
    auto_pause_on_reply: boolean;
    include_unsubscribe_link: boolean;
    from_name: string;
    from_email: string;
    reply_to_email: string;
    total_leads: number;
    emails_sent: number;
    emails_delivered: number;
    emails_opened: number;
    emails_clicked: number;
    emails_replied: number;
    emails_bounced: number;
    unsubscribes: number;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
    started_at?: string;
    paused_at?: string;
    completed_at?: string;
}

export enum SendCondition {
    ALWAYS = 'always',
    IF_OPENED = 'if_opened',
    IF_CLICKED = 'if_clicked',
    IF_NOT_OPENED = 'if_not_opened',
    IF_NOT_CLICKED = 'if_not_clicked',
}

export enum ABTestVariant {
    A = 'A',
    B = 'B',
}

export interface EmailSequence {
    id: number;
    campaign_id: number; // campaign.id
    step_number: number;
    step_name: string;
    subject_line: string;
    email_body: string; // text/HTML
    delay_days: number;
    delay_hours: number;
    send_condition: SendCondition;
    is_ab_test: boolean;
    ab_test_variant?: ABTestVariant;
    ab_test_percentage?: number;
    emails_sent: number;
    emails_opened: number;
    emails_clicked: number;
    created_at: string;
    updated_at: string;
}

export enum CampaignLeadStatus {
    PENDING = 'pending',
    SENDING = 'sending',
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    UNSUBSCRIBED = 'unsubscribed',
    BOUNCED = 'bounced',
    OPTED_OUT = 'opted_out',
}

export interface CampaignLead {
    id: number;
    campaign_id: number; // campaign.id
    lead_id: number; // lead.id
    status: CampaignLeadStatus;
    current_sequence_step: number;
    emails_sent: number;
    emails_opened: number;
    emails_clicked: number;
    has_replied: boolean;
    personalization_data: Record<string, any>; // JSON
    next_email_scheduled_at?: string;
    last_email_sent_at?: string;
    last_opened_at?: string;
    last_clicked_at?: string;
    replied_at?: string;
    unsubscribed_at?: string;
    exit_reason?: string;
    added_at: string;
    completed_at?: string;
}

export enum EmailLogStatus {
    QUEUED = 'queued',
    SENDING = 'sending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    OPENED = 'opened',
    CLICKED = 'clicked',
    REPLIED = 'replied',
    BOUNCED = 'bounced',
    FAILED = 'failed',
}

export enum BounceType {
    HARD = 'hard',
    SOFT = 'soft',
}

export interface EmailLog {
    id: number;
    campaign_lead_id: number; // campaign_lead.id
    campaign_id: number; // campaign.id
    lead_id: number; // lead.id
    sequence_id: number; // email_sequence.id
    email_subject: string;
    email_body: string;
    from_email: string;
    to_email: string;
    tracking_pixel_id: string;
    status: EmailLogStatus;
    sent_at?: string;
    delivered_at?: string;
    first_opened_at?: string;
    last_opened_at?: string;
    first_clicked_at?: string;
    last_clicked_at?: string;
    replied_at?: string;
    bounced_at?: string;
    open_count: number;
    click_count: number;
    links_clicked: string[]; // JSON array
    bounce_type?: BounceType;
    bounce_reason?: string;
    error_message?: string;
    created_at: string;
}

export enum EmailTemplateCategory {
    COLD_OUTREACH = 'cold_outreach',
    FOLLOW_UP = 'follow_up',
    NURTURE = 'nurture',
    THANK_YOU = 'thank_you',
    REENGAGEMENT = 'reengagement',
    CUSTOM = 'custom',
}

export interface EmailTemplate {
    id: number;
    template_name: string;
    template_category: EmailTemplateCategory;
    subject_line: string;
    email_body: string; // text/HTML
    variables_used: string[]; // JSON array
    use_count: number;
    is_public: boolean;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
}

export interface Unsubscribe {
    id: number;
    lead_id?: number; // lead.id
    email: string;
    campaign_id?: number; // campaign.id
    reason?: string;
    feedback?: string;
    unsubscribed_at: string;
    ip_address?: string;
    user_agent?: string;
}

export enum DeviceType {
    DESKTOP = 'desktop',
    MOBILE = 'mobile',
    TABLET = 'tablet',
}

export interface EmailClickTracking {
    id: number;
    email_log_id: number; // email_log.id
    campaign_lead_id: number; // campaign_lead.id
    original_url: string;
    tracking_url: string;
    clicked_at: string;
    ip_address: string;
    user_agent: string;
    device_type?: DeviceType;
    browser?: string;
    location?: string;
}


// --- SALES PIPELINE MODULE ---

export enum OpportunityStage {
    PROSPECTING = 'prospecting',
    QUALIFICATION = 'qualification',
    PROPOSAL = 'proposal',
    NEGOTIATION = 'negotiation',
    CLOSED_WON = 'closed_won',
    CLOSED_LOST = 'closed_lost',
}

export interface Opportunity {
    id: number;
    opportunity_name: string;
    lead_id?: number; // lead.id
    customer_id?: number; // customer.id
    stage: OpportunityStage;
    expected_value: number; // decimal
    currency: Currency;
    probability: number;
    expected_close_date: string;
    actual_close_date?: string;
    assigned_to: number; // user.id
    description: string;
    next_step: string;
    lost_reason?: string;
    created_at: string;
    updated_at: string;
}

export enum OpportunityActivityType {
    CALL = 'call',
    EMAIL = 'email',
    MEETING = 'meeting',
    DEMO = 'demo',
    PROPOSAL_SENT = 'proposal_sent',
    STAGE_CHANGE = 'stage_change',
    NOTE = 'note',
}

export interface OpportunityActivity {
    id: number;
    opportunity_id: number; // opportunity.id
    activity_type: OpportunityActivityType;
    description: string;
    performed_by: number; // user.id
    created_at: string;
}


// --- QUOTE REQUESTS MODULE ---

export enum CargoType {
    GENERAL = 'general',
    PERISHABLE = 'perishable',
    HAZARDOUS = 'hazardous',
    FRAGILE = 'fragile',
    HEAVY = 'heavy',
}

export enum QuoteRequestStatus {
    NEW = 'new',
    VIEWED = 'viewed',
    QUOTED = 'quoted',
    CONVERTED = 'converted',
    DECLINED = 'declined',
}

export interface QuoteRequest {
    id: number;
    request_number: string;
    requester_name: string;
    requester_email: string;
    requester_phone: string;
    company_name?: string;
    pickup_location: string;
    delivery_location: string;
    cargo_type: CargoType;
    weight_tonnes: number; // decimal
    pickup_date: string;
    delivery_date: string;
    estimated_price?: number; // decimal
    currency: Currency;
    status: QuoteRequestStatus;
    quoted_price?: number; // decimal
    quoted_at?: string;
    quoted_by?: number; // user.id
    converted_to_booking_id?: number; // booking.id
    converted_to_lead_id?: number; // lead.id
    notes?: string;
    message: string;
    created_at: string;
    updated_at: string;
}


export enum PreferredContactMethod {
    PHONE = 'phone',
    EMAIL = 'email',
    WHATSAPP = 'whatsapp',
}

export enum ConsultationRequestStatus {
    NEW = 'new',
    CONTACTED = 'contacted',
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    NO_SHOW = 'no_show',
    CONVERTED = 'converted',
}

export interface ConsultationRequest {
    id: number;
    request_number: string;
    name: string;
    email: string;
    phone: string;
    company_name?: string;
    logistics_needs: string;
    preferred_contact_method: PreferredContactMethod;
    preferred_time?: string;
    status: ConsultationRequestStatus;
    scheduled_meeting_at?: string;
    completed_at?: string;
    assigned_to?: number; // user.id
    converted_to_lead_id?: number; // lead.id
    notes?: string;
    created_at: string;
    updated_at: string;
}


// --- FINANCIAL & PAYMENT ---

// --- INVOICING MODULE ---

export enum InvoiceType {
    BOOKING = 'booking',
    SUBSCRIPTION = 'subscription',
    SERVICE = 'service',
    OTHER = 'other',
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    SENT = 'sent',
    VIEWED = 'viewed',
    PARTIAL = 'partial',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export interface Invoice {
    id: number;
    invoice_number: string;
    customer_id: number; // customer.id
    booking_id?: number; // booking.id
    invoice_type: InvoiceType;
    issue_date: string;
    due_date: string;
    subtotal: number; // decimal
    tax_amount: number; // decimal
    discount_amount: number; // decimal
    total_amount: number; // decimal
    amount_paid: number; // decimal
    balance_due: number; // decimal
    currency: Currency;
    status: InvoiceStatus;
    payment_terms: number; // days
    notes?: string;
    customer_notes?: string;
    sent_at?: string;
    viewed_at?: string;
    paid_at?: string;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
}

export enum InvoiceItemType {
    DELIVERY = 'delivery',
    STORAGE = 'storage',
    HANDLING = 'handling',
    FUEL_SURCHARGE = 'fuel_surcharge',
    INSURANCE = 'insurance',
    CUSTOMS = 'customs',
    DETENTION = 'detention',
    OTHER = 'other',
}

export interface InvoiceItem {
    id: number;
    invoice_id: number; // invoice.id
    item_type: InvoiceItemType;
    description: string;
    quantity: number; // decimal
    unit_price: number; // decimal
    tax_rate: number; // decimal
    discount_rate?: number; // decimal
    line_total: number; // decimal
    created_at: string;
}


// --- PAYMENTS MODULE ---

export enum PaymentMethod {
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
    MOBILE_MONEY = 'mobile_money',
    CARD = 'card',
    CREDIT_NOTE = 'credit_note',
    OTHER = 'other',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    CANCELLED = 'cancelled',
}

export interface Payment {
    id: number;
    payment_number: string;
    customer_id: number; // customer.id
    invoice_id?: number; // invoice.id
    booking_id?: number; // booking.id
    amount: number; // decimal
    currency: Currency;
    exchange_rate?: number; // decimal
    amount_in_base_currency: number; // decimal
    payment_method: PaymentMethod;
    payment_provider?: string;
    transaction_reference: string;
    payment_date: string;
    status: PaymentStatus;
    notes?: string;
    receipt_url?: string;
    processed_by: number; // user.id
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

export interface PaymentAllocation {
    id: number;
    payment_id: number; // payment.id
    invoice_id: number; // invoice.id
    amount_allocated: number; // decimal
    created_at: string;
}


// --- EXPENSES MODULE ---

export enum ExpenseCategory {
    FUEL = 'fuel',
    MAINTENANCE = 'maintenance',
    SALARIES = 'salaries',
    INSURANCE = 'insurance',
    LICENSES = 'licenses',
    TOLLS = 'tolls',
    OFFICE = 'office',
    MARKETING = 'marketing',
    UTILITIES = 'utilities',
    RENT = 'rent',
    EQUIPMENT = 'equipment',
    OTHER = 'other',
}

export enum ExpensePaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    REIMBURSED = 'reimbursed',
}

export enum RecurringFrequency {
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
}

export enum ApprovalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface Expense {
    id: number;
    expense_number: string;
    expense_category: ExpenseCategory;
    vehicle_id?: number; // vehicle.id
    driver_id?: number; // driver.id
    booking_id?: number; // booking.id
    vendor_name: string;
    description: string;
    amount: number; // decimal
    currency: Currency;
    exchange_rate?: number; // decimal
    amount_in_base_currency: number; // decimal
    expense_date: string;
    payment_method: PaymentMethod;
    payment_status: ExpensePaymentStatus;
    paid_date?: string;
    receipt_number?: string;
    receipt_url?: string;
    is_recurring: boolean;
    recurring_frequency?: RecurringFrequency;
    approval_status?: ApprovalStatus;
    approved_by?: number; // user.id
    approved_at?: string;
    recorded_by: number; // user.id
    notes?: string;
    created_at: string;
    updated_at: string;
}


// --- REVENUE TRACKING ---

export enum RevenueType {
    DELIVERY = 'delivery',
    STORAGE = 'storage',
    CONSULTATION = 'consultation',
    SUBSCRIPTION = 'subscription',
    OTHER = 'other',
}

export interface RevenueRecord {
    id: number;
    booking_id?: number; // booking.id
    invoice_id?: number; // invoice.id
    customer_id: number; // customer.id
    revenue_type: RevenueType;
    amount: number; // decimal
    currency: Currency;
    amount_in_base_currency: number; // decimal
    revenue_date: string;
    cost_of_service?: number; // decimal
    gross_profit: number; // decimal
    profit_margin: number; // decimal
    created_at: string;
}


// --- PRICING & RATES ---

export enum AppliesToAll {
    ALL = 'all',
}

export interface PricingRule {
    id: number;
    rule_name: string;
    route_from: string;
    route_to: string;
    cargo_type: CargoType | AppliesToAll.ALL;
    vehicle_type: VehicleType | AppliesToAll.ALL;
    base_rate_per_tonne: number; // decimal
    base_rate_per_km?: number; // decimal
    minimum_charge: number; // decimal
    surcharges: Record<string, number>; // JSON
    is_active: boolean;
    valid_from: string;
    valid_until?: string;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
}

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
}

export enum DiscountAppliesTo {
    ALL_BOOKINGS = 'all_bookings',
    FIRST_BOOKING = 'first_booking',
    ROUTE_SPECIFIC = 'route_specific',
    CARGO_SPECIFIC = 'cargo_specific',
    CUSTOMER_SPECIFIC = 'customer_specific',
}

export interface Discount {
    id: number;
    discount_code: string;
    discount_name: string;
    discount_type: DiscountType;
    discount_value: number; // decimal
    applies_to: DiscountAppliesTo;
    minimum_order_value?: number; // decimal
    customer_id?: number; // customer.id
    max_uses?: number;
    max_uses_per_customer?: number;
    current_uses: number;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- LOYALTY PROGRAM ---

export enum LoyaltyTransactionType {
    EARNED = 'earned',
    REDEEMED = 'redeemed',
    EXPIRED = 'expired',
    ADJUSTED = 'adjusted',
}

export interface LoyaltyTransaction {
    id: number;
    customer_id: number; // customer.id
    transaction_type: LoyaltyTransactionType;
    points: number;
    booking_id?: number; // booking.id
    invoice_id?: number; // invoice.id
    description: string;
    balance_after: number;
    expires_at?: string;
    created_at: string;
}

export interface LoyaltyTier {
    id: number;
    tier_name: string;
    tier_level: number;
    points_required: number;
    discount_percentage: number; // decimal
    benefits: Record<string, boolean>; // JSON
    badge_color: string;
    badge_icon_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LoyaltyRedemption {
    id: number;
    customer_id: number; // customer.id
    booking_id?: number; // booking.id
    invoice_id?: number; // invoice.id
    points_redeemed: number;
    monetary_value: number; // decimal
    currency: Currency;
    redeemed_at: string;
    created_at: string;
}


// --- FINANCIAL REPORTS CACHE ---

export enum SummaryType {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
}

export interface FinancialSummary {
    id: number;
    summary_type: SummaryType;
    period_start: string;
    period_end: string;
    total_revenue: number; // decimal
    total_expenses: number; // decimal
    net_profit: number; // decimal
    profit_margin: number; // decimal
    total_bookings: number;
    completed_bookings: number;
    total_km_travelled: number;
    average_km_per_booking: number; // decimal
    fuel_cost: number; // decimal
    maintenance_cost: number; // decimal
    salaries_cost: number; // decimal
    revenue_by_cargo_type: Record<string, any>; // JSON
    revenue_by_route: Record<string, any>; // JSON
    revenue_by_customer: Record<string, any>; // JSON
    generated_at: string;
}


// --- CURRENCY EXCHANGE ---

export enum ExchangeRateSource {
    MANUAL = 'manual',
    RBC = 'rbc',
    OANDA = 'oanda',
    OTHER = 'other',
}

export interface ExchangeRate {
    id: number;
    from_currency: Currency;
    to_currency: Currency;
    rate: number; // decimal
    effective_date: string;
    source: ExchangeRateSource;
    created_at: string;
}


// --- NOTIFICATIONS & COMMUNICATION ---

export enum RelatedEntityType {
    BOOKING = 'booking',
    INVOICE = 'invoice',
    PAYMENT = 'payment',
    VEHICLE = 'vehicle',
    DRIVER = 'driver',
    CAMPAIGN = 'campaign',
    LEAD = 'lead',
    EXPENSE = 'expense',
    SYSTEM = 'system',
    USER = 'user',
    DELIVERY = 'delivery',
}

// --- NOTIFICATIONS MODULE ---

export enum NotificationRecipientType {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    DRIVER = 'driver',
    MARKETING = 'marketing',
}

export enum NotificationType {
    BOOKING_UPDATE = 'booking_update',
    PAYMENT_RECEIVED = 'payment_received',
    INVOICE_DUE = 'invoice_due',
    DELIVERY_COMPLETED = 'delivery_completed',
    VEHICLE_MAINTENANCE = 'vehicle_maintenance',
    INSURANCE_EXPIRY = 'insurance_expiry',
    CAMPAIGN_MILESTONE = 'campaign_milestone',
    LEAD_ACTIVITY = 'lead_activity',
    SYSTEM_ALERT = 'system_alert',
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum NotificationDeliveryMethod {
    IN_APP = 'in_app',
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    WHATSAPP = 'whatsapp',
}

export interface Notification {
    id: number;
    recipient_id: number; // user.id
    recipient_type: NotificationRecipientType;
    notification_type: NotificationType;
    title: string;
    message: string;
    priority: Priority;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    action_url?: string;
    action_label?: string;
    is_read: boolean;
    read_at?: string;
    delivery_method: NotificationDeliveryMethod;
    is_delivered: boolean;
    delivered_at?: string;
    metadata: Record<string, any>; // JSON
    created_at: string;
    expires_at?: string;
}

export interface NotificationPreferences {
    id: number;
    user_id: number; // user.id
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
    whatsapp_enabled: boolean;
    in_app_enabled: boolean;
    booking_updates: boolean;
    payment_updates: boolean;
    marketing_emails: boolean;
    system_alerts: boolean;
    delivery_notifications: boolean;
    quiet_hours_start?: string; // time
    quiet_hours_end?: string; // time
    updated_at: string;
}

// --- SMS MODULE ---

export enum SmsMessageType {
    BOOKING_CONFIRMATION = 'booking_confirmation',
    DELIVERY_UPDATE = 'delivery_update',
    PAYMENT_REMINDER = 'payment_reminder',
    OTP = 'otp',
    MARKETING = 'marketing',
    ALERT = 'alert',
    CUSTOM = 'custom',
}

export enum SmsStatus {
    QUEUED = 'queued',
    SENDING = 'sending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    EXPIRED = 'expired',
}

export enum SmsProvider {
    TWILIO = 'twilio',
    AFRICASTALKING = 'africastalking',
    OTHER = 'other',
}

export interface SmsMessage {
    id: number;
    recipient_phone: string;
    recipient_user_id?: number; // user.id
    recipient_customer_id?: number; // customer.id
    recipient_driver_id?: number; // driver.id
    message_type: SmsMessageType;
    message_body: string;
    status: SmsStatus;
    provider: SmsProvider;
    provider_message_id?: string;
    cost?: number; // decimal
    currency: Currency;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    scheduled_at?: string;
    sent_at?: string;
    delivered_at?: string;
    failed_at?: string;
    error_message?: string;
    created_at: string;
}

export interface SmsTemplate {
    id: number;
    template_name: string;
    template_code: string;
    message_body: string;
    variables_used: string[]; // JSON array
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- EMAIL COMMUNICATION MODULE ---

export enum TransactionalEmailType {
    BOOKING_CONFIRMATION = 'booking_confirmation',
    INVOICE = 'invoice',
    PAYMENT_RECEIPT = 'payment_receipt',
    PASSWORD_RESET = 'password_reset',
    WELCOME = 'welcome',
    DELIVERY_PROOF = 'delivery_proof',
    ALERT = 'alert',
}

export enum TransactionalEmailStatus {
    QUEUED = 'queued',
    SENDING = 'sending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    OPENED = 'opened',
    BOUNCED = 'bounced',
    FAILED = 'failed',
}

export enum EmailProvider {
    SMTP = 'smtp',
    SENDGRID = 'sendgrid',
    MAILGUN = 'mailgun',
    SES = 'ses',
    OTHER = 'other',
}

export interface TransactionalEmail {
    id: number;
    recipient_email: string;
    recipient_name: string;
    recipient_user_id?: number; // user.id
    email_type: TransactionalEmailType;
    subject_line: string;
    email_body: string; // HTML
    from_email: string;
    from_name: string;
    reply_to_email: string;
    status: TransactionalEmailStatus;
    provider: EmailProvider;
    provider_message_id?: string;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    attachments: { name: string; url: string }[]; // JSON array
    scheduled_at?: string;
    sent_at?: string;
    delivered_at?: string;
    opened_at?: string;
    bounced_at?: string;
    bounce_reason?: string;
    error_message?: string;
    created_at: string;
}


// --- WHATSAPP MODULE ---

export enum WhatsAppMessageType {
    TEXT = 'text',
    IMAGE = 'image',
    DOCUMENT = 'document',
    LOCATION = 'location',
    TEMPLATE = 'template',
}

export enum WhatsAppMessageStatus {
    QUEUED = 'queued',
    SENDING = 'sending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
    FAILED = 'failed',
}

export enum WhatsAppProvider {
    TWILIO = 'twilio',
    WHATSAPP_BUSINESS_API = 'whatsapp_business_api',
    OTHER = 'other',
}

export interface WhatsAppMessage {
    id: number;
    recipient_phone: string;
    recipient_user_id?: number; // user.id
    recipient_customer_id?: number; // customer.id
    recipient_driver_id?: number; // driver.id
    message_type: WhatsAppMessageType;
    message_body?: string;
    media_url?: string;
    template_name?: string;
    template_variables?: Record<string, any>; // JSON
    status: WhatsAppMessageStatus;
    provider: WhatsAppProvider;
    provider_message_id?: string;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    sent_at?: string;
    delivered_at?: string;
    read_at?: string;
    failed_at?: string;
    error_message?: string;
    created_at: string;
}


// --- PUSH NOTIFICATIONS MODULE ---

export enum PushNotificationType {
    BOOKING = 'booking',
    DELIVERY = 'delivery',
    PAYMENT = 'payment',
    ALERT = 'alert',
    MARKETING = 'marketing',
}

export enum PushNotificationStatus {
    QUEUED = 'queued',
    SENDING = 'sending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    FAILED = 'failed',
}

export interface PushNotification {
    id: number;
    recipient_user_id: number; // user.id
    title: string;
    body: string;
    icon_url?: string;
    image_url?: string;
    action_url?: string;
    notification_type: PushNotificationType;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    device_tokens: string[]; // JSON array
    status: PushNotificationStatus;
    sent_at?: string;
    delivered_at?: string;
    error_message?: string;
    created_at: string;
}

export enum DeviceTokenType {
    IOS = 'ios',
    ANDROID = 'android',
    WEB = 'web',
}

export interface DeviceToken {
    id: number;
    user_id: number; // user.id
    device_type: DeviceTokenType;
    token: string;
    is_active: boolean;
    last_used_at: string;
    created_at: string;
}

// --- ALERTS & SYSTEM MONITORING MODULE ---

export enum SystemAlertType {
    INSURANCE_EXPIRY = 'insurance_expiry',
    LICENSE_EXPIRY = 'license_expiry',
    MAINTENANCE_DUE = 'maintenance_due',
    LOW_FUEL = 'low_fuel',
    GEOFENCE_BREACH = 'geofence_breach',
    SPEEDING = 'speeding',
    UNAUTHORIZED_STOP = 'unauthorized_stop',
    LATE_DELIVERY = 'late_delivery',
    PAYMENT_OVERDUE = 'payment_overdue',
    SYSTEM_ERROR = 'system_error',
}

export enum AlertSeverity {
    INFO = 'info',
    WARNING = 'warning',
    CRITICAL = 'critical',
    EMERGENCY = 'emergency',
}

export interface SystemAlert {
    id: number;
    alert_type: SystemAlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    action_required?: string;
    action_url?: string;
    is_resolved: boolean;
    resolved_at?: string;
    resolved_by?: number; // user.id
    resolution_notes?: string;
    notified_users: number[]; // JSON array of user.id
    created_at: string;
}

export interface AlertRule {
    id: number;
    rule_name: string;
    alert_type: SystemAlertType;
    condition: Record<string, any>; // JSON
    severity: AlertSeverity;
    notify_users: (number | string)[]; // JSON array of user.id or roles
    notification_channels: ('email' | 'sms' | 'push' | 'in_app')[]; // JSON array
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// --- COMMUNICATION LOGS MODULE ---

export enum CommunicationType {
    EMAIL = 'email',
    SMS = 'sms',
    WHATSAPP = 'whatsapp',
    PUSH = 'push',
    CALL = 'call',
    IN_PERSON = 'in_person',
}

export enum CommunicationDirection {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound',
}

export enum CommunicationPartyType {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    DRIVER = 'driver',
    SYSTEM = 'system',
}

export enum CommunicationLogStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    RECEIVED = 'received',
}

export interface CommunicationLog {
    id: number;
    communication_type: CommunicationType;
    direction: CommunicationDirection;
    sender_id?: number; // user.id
    sender_type?: CommunicationPartyType;
    recipient_id?: number; // user.id
    recipient_type?: CommunicationPartyType;
    recipient_contact: string;
    subject?: string;
    message: string;
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    status: CommunicationLogStatus;
    metadata: Record<string, any>; // JSON
    created_at: string;
}


// --- CHAT/MESSAGING MODULE ---

export enum ConversationStatus {
    OPEN = 'open',
    PENDING = 'pending',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum ConversationChannel {
    WEB_CHAT = 'web_chat',
    WHATSAPP = 'whatsapp',
    EMAIL = 'email',
    SMS = 'sms',
    PHONE = 'phone',
}

export interface Conversation {
    id: number;
    customer_id?: number; // customer.id
    driver_id?: number; // driver.id
    assigned_to?: number; // user.id
    status: ConversationStatus;
    priority: Priority;
    subject: string;
    channel: ConversationChannel;
    related_booking_id?: number; // booking.id
    first_message_at: string;
    last_message_at: string;
    resolved_at?: string;
    closed_at?: string;
    created_at: string;
    updated_at: string;
}

export enum ChatMessageSenderType {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    DRIVER = 'driver',
    SYSTEM = 'system',
}

export enum ChatMessageType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
    SYSTEM = 'system',
}

export interface ChatMessage {
    id: number;
    conversation_id: number; // conversation.id
    sender_id?: number; // user.id
    sender_type: ChatMessageSenderType;
    message_type: ChatMessageType;
    message_body: string;
    attachments: { name: string; url: string; type: string }[]; // JSON array
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

// --- ANNOUNCEMENT/BROADCAST MODULE ---

export enum AnnouncementType {
    MAINTENANCE = 'maintenance',
    FEATURE = 'feature',
    POLICY = 'policy',
    PROMOTION = 'promotion',
    GENERAL = 'general',
}

export enum AnnouncementTargetAudience {
    ALL = 'all',
    CUSTOMERS = 'customers',
    DRIVERS = 'drivers',
    ADMINS = 'admins',
}

export enum AnnouncementDisplayLocation {
    DASHBOARD = 'dashboard',
    MODAL = 'modal',
    BANNER = 'banner',
    ALL = 'all',
}

export interface Announcement {
    id: number;
    title: string;
    content: string; // text/HTML
    announcement_type: AnnouncementType;
    target_audience: AnnouncementTargetAudience;
    priority: Priority;
    is_dismissible: boolean;
    display_location: AnnouncementDisplayLocation;
    is_active: boolean;
    start_date: string;
    end_date?: string;
    published_by: number; // user.id
    created_at: string;
    updated_at: string;
}

export interface AnnouncementView {
    id: number;
    announcement_id: number; // announcement.id
    user_id: number; // user.id
    viewed_at: string;
    dismissed_at?: string;
}


// --- AUTOMATED WORKFLOWS MODULE ---

export enum WorkflowTriggerEvent {
    BOOKING_CREATED = 'booking_created',
    BOOKING_COMPLETED = 'booking_completed',
    PAYMENT_RECEIVED = 'payment_received',
    INVOICE_OVERDUE = 'invoice_overdue',
    VEHICLE_MAINTENANCE_DUE = 'vehicle_maintenance_due',
    LEAD_CREATED = 'lead_created',
    LEAD_INACTIVE_30DAYS = 'lead_inactive_30days',
    DRIVER_SPEEDING = 'driver_speeding',
}

export enum WorkflowActionType {
    SEND_EMAIL = 'send_email',
    SEND_SMS = 'send_sms',
    SEND_NOTIFICATION = 'send_notification',
    CREATE_TASK = 'create_task',
    UPDATE_STATUS = 'update_status',
    ASSIGN_USER = 'assign_user',
}

export interface WorkflowRule {
    id: number;
    rule_name: string;
    description: string;
    trigger_event: WorkflowTriggerEvent;
    conditions: Record<string, any>; // JSON
    action_type: WorkflowActionType;
    action_config: Record<string, any>; // JSON
    delay_minutes?: number;
    is_active: boolean;
    execution_count: number;
    last_executed_at?: string;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
}

export enum WorkflowExecutionStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    SKIPPED = 'skipped',
}

export interface WorkflowExecution {
    id: number;
    workflow_rule_id: number; // workflow_rule.id
    trigger_entity_type: RelatedEntityType;
    trigger_entity_id: number;
    status: WorkflowExecutionStatus;
    result: string;
    error_message?: string;
    executed_at: string;
    created_at: string;
}

// --- SYSTEM SETTINGS, PERMISSIONS & AUDIT ---

// --- USER ROLES & PERMISSIONS ---

export enum PermissionModule {
    BOOKINGS = 'bookings',
    FLEET = 'fleet',
    FINANCE = 'finance',
    CRM = 'crm',
    USERS = 'users',
    SETTINGS = 'settings',
    REPORTS = 'reports',
}

export interface Role {
    id: number;
    role_name: string;
    role_slug: string;
    description: string;
    is_system_role: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    permission_name: string;
    permission_slug: string;
    module: PermissionModule;
    description: string;
    created_at: string;
}

export interface RolePermission {
    id: number;
    role_id: number; // role.id
    permission_id: number; // permission.id
    created_at: string;
}

export interface UserRole {
    id: number;
    user_id: number; // user.id
    role_id: number; // role.id
    assigned_by?: number; // user.id
    assigned_at: string;
}

export interface UserPermission {
    id: number;
    user_id: number; // user.id
    permission_id: number; // permission.id
    is_granted: boolean;
    assigned_by?: number; // user.id
    assigned_at: string;
}

// --- AUDIT LOGS ---

export enum AuditLogAction {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    LOGOUT = 'logout',
    EXPORT = 'export',
    IMPORT = 'import',
    APPROVE = 'approve',
    REJECT = 'reject',
    SEND = 'send',
    DOWNLOAD = 'download',
}

export enum AuditLogEntityType {
    USER = 'user',
    BOOKING = 'booking',
    VEHICLE = 'vehicle',
    DRIVER = 'driver',
    INVOICE = 'invoice',
    PAYMENT = 'payment',
    LEAD = 'lead',
    CAMPAIGN = 'campaign',
    CUSTOMER = 'customer',
    EXPENSE = 'expense',
    SETTING = 'setting',
}

export enum AuditLogStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    ERROR = 'error',
}

export interface AuditLog {
    id: number;
    user_id?: number; // user.id
    user_email: string;
    user_role: string;
    action: AuditLogAction;
    entity_type: AuditLogEntityType;
    entity_id?: number;
    entity_name: string;
    old_values: Record<string, any>; // JSON
    new_values: Record<string, any>; // JSON
    ip_address: string;
    user_agent: string;
    description: string;
    status: AuditLogStatus;
    error_message?: string;
    metadata: Record<string, any>; // JSON
    created_at: string;
}

// --- SYSTEM SETTINGS ---

export enum SettingType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    JSON = 'json',
    DATE = 'date',
}

export enum SettingCategory {
    GENERAL = 'general',
    FINANCE = 'finance',
    BOOKING = 'booking',
    FLEET = 'fleet',
    EMAIL = 'email',
    SMS = 'sms',
    SECURITY = 'security',
    INTEGRATIONS = 'integrations',
}

export interface Setting {
    id: number;
    setting_key: string;
    setting_value: string;
    setting_type: SettingType;
    category: SettingCategory;
    description: string;
    is_public: boolean;
    is_sensitive: boolean;
    updated_by?: number; // user.id
    updated_at: string;
    created_at: string;
}

// --- COMPANY/BUSINESS INFO ---

export interface CompanyProfile {
    id: number;
    company_name: string;
    trading_name?: string;
    company_registration: string;
    tax_id: string;
    logo_url: string;
    favicon_url: string;
    primary_color: string;
    secondary_color: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    country: string;
    postal_code: string;
    phone: string;
    email: string;
    website: string;
    support_email: string;
    support_phone: string;
    bank_name?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    bank_branch?: string;
    swift_code?: string;
    social_media_links: Record<string, string>; // JSON
    business_hours: Record<string, string>; // JSON
    updated_by: number; // user.id
    updated_at: string;
    created_at: string;
}

// --- API KEYS & INTEGRATIONS ---

export enum ApiKeyType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    WEBHOOK = 'webhook',
}

export interface ApiKey {
    id: number;
    key_name: string;
    api_key: string;
    api_secret: string;
    key_type: ApiKeyType;
    permissions: string[]; // JSON array
    rate_limit?: number;
    created_by: number; // user.id
    is_active: boolean;
    expires_at?: string;
    last_used_at?: string;
    last_used_ip?: string;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export enum IntegrationType {
    SMS = 'sms',
    EMAIL = 'email',
    PAYMENT = 'payment',
    MAPS = 'maps',
    AI = 'ai',
    CRM = 'crm',
    ACCOUNTING = 'accounting',
    OTHER = 'other',
}

export interface Integration {
    id: number;
    integration_name: string;
    integration_type: IntegrationType;
    provider: string;
    credentials: Record<string, any>; // JSON, encrypted
    config: Record<string, any>; // JSON
    is_active: boolean;
    is_connected: boolean;
    last_sync_at?: string;
    last_error?: string;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
}

// --- FILE UPLOADS & MEDIA ---

export enum UploadType {
    AVATAR = 'avatar',
    DOCUMENT = 'document',
    RECEIPT = 'receipt',
    SIGNATURE = 'signature',
    DELIVERY_PROOF = 'delivery_proof',
    OTHER = 'other',
}

export interface Upload {
    id: number;
    file_name: string;
    original_name: string;
    file_path: string;
    file_url: string;
    file_size: number;
    mime_type: string;
    entity_type?: AuditLogEntityType;
    entity_id?: number;
    upload_type: UploadType;
    uploaded_by: number; // user.id
    is_public: boolean;
    metadata: Record<string, any>; // JSON
    created_at: string;
}

// --- ACTIVITY STREAMS ---

export enum ActivityFeedActionType {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted',
    COMPLETED = 'completed',
    ASSIGNED = 'assigned',
    COMMENTED = 'commented',
    UPLOADED = 'uploaded',
    SENT = 'sent',
}

export enum ActivityFeedTargetType {
    BOOKING = 'booking',
    VEHICLE = 'vehicle',
    DRIVER = 'driver',
    INVOICE = 'invoice',
    PAYMENT = 'payment',
    LEAD = 'lead',
    CAMPAIGN = 'campaign',
}

export interface ActivityFeed {
    id: number;
    actor_id: number; // user.id
    actor_name: string;
    actor_avatar_url?: string;
    action_type: ActivityFeedActionType;
    target_type: ActivityFeedTargetType;
    target_id: number;
    target_name: string;
    description: string;
    metadata: Record<string, any>; // JSON
    is_important: boolean;
    created_at: string;
}

// --- TASKS & REMINDERS ---

export enum TaskType {
    FOLLOW_UP = 'follow_up',
    CALLBACK = 'callback',
    MEETING = 'meeting',
    PAYMENT_COLLECTION = 'payment_collection',
    VEHICLE_SERVICE = 'vehicle_service',
    DOCUMENT_RENEWAL = 'document_renewal',
    OTHER = 'other',
}

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    OVERDUE = 'overdue',
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    task_type: TaskType;
    priority: Priority;
    status: TaskStatus;
    assigned_to: number; // user.id
    created_by: number; // user.id
    related_entity_type?: RelatedEntityType;
    related_entity_id?: number;
    due_date: string;
    due_time?: string; // time
    reminder_before_minutes?: number;
    reminder_sent: boolean;
    completed_at?: string;
    completed_by?: number; // user.id
    completion_notes?: string;
    created_at: string;
    updated_at: string;
}

// --- TAGS & CATEGORIES ---

export enum TagType {
    LEAD = 'lead',
    CUSTOMER = 'customer',
    BOOKING = 'booking',
    VEHICLE = 'vehicle',
    GENERAL = 'general',
}

export interface Tag {
    id: number;
    tag_name: string;
    tag_slug: string;
    tag_color: string;
    tag_type: TagType;
    usage_count: number;
    created_by: number; // user.id
    created_at: string;
}

export enum TaggableType {
    LEAD = 'lead',
    CUSTOMER = 'customer',
    BOOKING = 'booking',
    VEHICLE = 'vehicle',
    DRIVER = 'driver',
    CAMPAIGN = 'campaign',
}

export interface Taggable {
    id: number;
    tag_id: number; // tag.id
    taggable_type: TaggableType;
    taggable_id: number;
    tagged_by: number; // user.id
    tagged_at: string;
}

// --- NOTES & COMMENTS ---

export enum NoteType {
    GENERAL = 'general',
    INTERNAL = 'internal',
    IMPORTANT = 'important',
    FOLLOW_UP = 'follow_up',
}

export enum NotableType {
    LEAD = 'lead',
    CUSTOMER = 'customer',
    BOOKING = 'booking',
    VEHICLE = 'vehicle',
    DRIVER = 'driver',
    INVOICE = 'invoice',
    OPPORTUNITY = 'opportunity',
}

export interface Note {
    id: number;
    notable_type: NotableType;
    notable_id: number;
    note_type: NoteType;
    content: string;
    is_pinned: boolean;
    is_private: boolean;
    created_by: number; // user.id
    updated_by?: number; // user.id
    created_at: string;
    updated_at: string;
}

export enum CommentableType {
    BOOKING = 'booking',
    INVOICE = 'invoice',
    TASK = 'task',
    NOTE = 'note',
    LEAD = 'lead',
}

export interface Comment {
    id: number;
    commentable_type: CommentableType;
    commentable_id: number;
    parent_comment_id?: number; // comment.id
    content: string;
    created_by: number; // user.id
    updated_by?: number; // user.id
    created_at: string;
    updated_at: string;
}

// --- BOOKMARKS/FAVORITES ---

export enum FavoritableType {
    CUSTOMER = 'customer',
    LEAD = 'lead',
    BOOKING = 'booking',
    ROUTE = 'route',
    DRIVER = 'driver',
    VEHICLE = 'vehicle',
}

export interface Favorite {
    id: number;
    user_id: number; // user.id
    favoritable_type: FavoritableType;
    favoritable_id: number;
    created_at: string;
}

// --- DATA EXPORT/IMPORT LOGS ---

export enum ExportType {
    BOOKINGS = 'bookings',
    CUSTOMERS = 'customers',
    LEADS = 'leads',
    INVOICES = 'invoices',
    VEHICLES = 'vehicles',
    FINANCIAL_REPORT = 'financial_report',
    CUSTOM = 'custom',
}

export enum ExportFormat {
    CSV = 'csv',
    XLSX = 'xlsx',
    PDF = 'pdf',
    JSON = 'json',
}

export interface ExportLog {
    id: number;
    export_type: ExportType;
    export_format: ExportFormat;
    filters_applied: Record<string, any>; // JSON
    file_name: string;
    file_url: string;
    file_size: number;
    record_count: number;
    exported_by: number; // user.id
    exported_at: string;
    expires_at?: string;
}

export enum ImportType {
    LEADS = 'leads',
    CUSTOMERS = 'customers',
    VEHICLES = 'vehicles',
    DRIVERS = 'drivers',
    BOOKINGS = 'bookings',
}

export enum ImportFormat {
    CSV = 'csv',
    XLSX = 'xlsx',
    JSON = 'json',
}

export enum ImportStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    PARTIAL = 'partial',
}

export interface ImportLog {
    id: number;
    import_type: ImportType;
    import_format: ImportFormat;
    original_file_name: string;
    file_url: string;
    total_rows: number;
    successful_imports: number;
    failed_imports: number;
    errors: Record<string, any>[]; // JSON array
    status: ImportStatus;
    imported_by: number; // user.id
    imported_at: string;
    completed_at?: string;
}

// --- SCHEDULED JOBS ---

export enum JobType {
    RECURRING = 'recurring',
    ONE_TIME = 'one_time',
}

export enum JobStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    PARTIAL = 'partial',
}

export interface ScheduledJob {
    id: number;
    job_name: string;
    job_type: JobType;
    schedule: string;
    last_run_at?: string;
    last_run_status?: JobStatus;
    last_run_duration_seconds?: number;
    last_run_details?: string;
    next_run_at?: string;
    is_active: boolean;
    failure_count: number;
    max_retries: number;
    created_at: string;
    updated_at: string;
}

export enum JobExecutionStatus {
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
    TIMEOUT = 'timeout',
}

export interface JobExecution {
    id: number;
    scheduled_job_id: number; // scheduled_job.id
    started_at: string;
    completed_at?: string;
    status: JobExecutionStatus;
    records_processed?: number;
    output: string;
    error_message?: string;
    duration_seconds?: number;
}

// --- SYSTEM HEALTH & MONITORING ---

export enum HealthCheckType {
    DATABASE = 'database',
    EMAIL = 'email',
    SMS = 'sms',
    API = 'api',
    STORAGE = 'storage',
    CACHE = 'cache',
    QUEUE = 'queue',
}

export enum HealthStatus {
    HEALTHY = 'healthy',
    DEGRADED = 'degraded',
    DOWN = 'down',
}

export interface SystemHealthCheck {
    id: number;
    check_name: string;
    check_type: HealthCheckType;
    status: HealthStatus;
    response_time_ms?: number;
    details: Record<string, any>; // JSON
    error_message?: string;
    checked_at: string;
}

export interface SystemMetric {
    id: number;
    metric_name: string;
    metric_value: number; // decimal
    metric_unit: string;
    recorded_at: string;
}

// --- EMAIL/DOMAIN VERIFICATION ---

export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    FAILED = 'failed',
}

export enum VerificationMethod {
    DNS = 'dns',
    EMAIL = 'email',
    FILE = 'file',
}

export interface VerifiedDomain {
    id: number;
    domain: string;
    verification_status: VerificationStatus;
    verification_token: string;
    verification_method: VerificationMethod;
    dns_records: Record<string, any>; // JSON
    verified_at?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// --- WEBHOOKS ---

export enum WebhookDeliveryStatus {
    PENDING = 'pending',
    SENT = 'sent',
    SUCCESS = 'success',
    FAILED = 'failed',
    RETRYING = 'retrying',
}

export interface Webhook {
    id: number;
    webhook_name: string;
    webhook_url: string;
    events: string[]; // JSON array
    secret_key: string;
    is_active: boolean;
    retry_attempts: number;
    timeout_seconds: number;
    created_by: number; // user.id
    created_at: string;
    updated_at: string;
}

export interface WebhookDelivery {
    id: number;
    webhook_id: number; // webhook.id
    event_type: string;
    payload: Record<string, any>; // JSON
    status: WebhookDeliveryStatus;
    http_status_code?: number;
    response_body?: string;
    error_message?: string;
    attempt_count: number;
    sent_at?: string;
    created_at: string;
}

// --- ROUTES, LOCATIONS & GEOGRAPHIC DATA ---

// --- ROUTES & CORRIDORS ---
export enum RouteType {
    DOMESTIC = 'domestic',
    CROSS_BORDER = 'cross_border',
    INTERNATIONAL = 'international',
}

export enum RoadConditions {
    EXCELLENT = 'excellent',
    GOOD = 'good',
    FAIR = 'fair',
    POOR = 'poor',
    MIXED = 'mixed',
}

export interface Route {
    id: number;
    route_name: string;
    route_code: string;
    origin_city: string;
    origin_country: string;
    origin_latitude?: number;
    origin_longitude?: number;
    destination_city: string;
    destination_country: string;
    destination_latitude?: number;
    destination_longitude?: number;
    distance_km: number;
    estimated_duration_hours: number;
    route_type: RouteType;
    border_crossings: { name: string; country_from: string; country_to: string; avg_wait_hours: number }[]; // JSON
    toll_gates: { name: string; cost_usd: number; location: string }[]; // JSON
    total_toll_cost: number;
    road_conditions: RoadConditions;
    is_active: boolean;
    is_popular: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export enum WaypointLocationType {
    BORDER = 'border',
    TOLL = 'toll',
    REST_STOP = 'rest_stop',
    FUEL_STATION = 'fuel_station',
    WAREHOUSE = 'warehouse',
    CHECKPOINT = 'checkpoint',
    CITY = 'city',
}

export interface RouteWaypoint {
    id: number;
    route_id: number; // route.id
    waypoint_order: number;
    location_name: string;
    location_type: WaypointLocationType;
    latitude: number;
    longitude: number;
    estimated_arrival_hours: number;
    is_mandatory_stop: boolean;
    average_stop_duration_minutes?: number;
    notes?: string;
    created_at: string;
}


// --- LOCATIONS & ADDRESSES ---

export enum LocationType {
    WAREHOUSE = 'warehouse',
    DEPOT = 'depot',
    CUSTOMER_SITE = 'customer_site',
    SUPPLIER = 'supplier',
    BORDER_POST = 'border_post',
    SERVICE_CENTER = 'service_center',
    FUEL_STATION = 'fuel_station',
    PARKING_YARD = 'parking_yard',
    OFFICE = 'office',
}

export interface Location {
    id: number;
    location_name: string;
    location_type: LocationType;
    address_line1: string;
    address_line2?: string;
    city: string;
    province_state?: string;
    country: string;
    postal_code?: string;
    latitude: number;
    longitude: number;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    operating_hours: Record<string, string>; // JSON
    has_loading_dock: boolean;
    has_refrigeration: boolean;
    has_security: boolean;
    has_parking: boolean;
    parking_capacity?: number;
    access_instructions?: string;
    is_active: boolean;
    geofence_radius: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export enum CustomerLocationType {
    PICKUP = 'pickup',
    DELIVERY = 'delivery',
    BOTH = 'both',
}

export interface CustomerLocation {
    id: number;
    customer_id: number; // customer.id
    location_id?: number; // location.id
    location_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    province_state?: string;
    country: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    contact_person: string;
    contact_phone: string;
    contact_email?: string;
    location_type: CustomerLocationType;
    is_default: boolean;
    access_instructions?: string;
    special_requirements?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- BORDER CROSSINGS ---

export interface BorderPost {
    id: number;
    border_name: string;
    country_from: string;
    country_to: string;
    latitude: number;
    longitude: number;
    operating_hours: Record<string, string>; // JSON
    is_24_hours: boolean;
    average_wait_time_hours?: number;
    peak_hours: { day: string; start_time: string; end_time: string }[]; // JSON
    required_documents: string[]; // JSON
    crossing_fees: { description: string; amount: number; currency: string }[]; // JSON
    has_weighbridge: boolean;
    has_customs_office: boolean;
    has_parking: boolean;
    contact_phone?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export enum BorderCrossingDirection {
    ENTRY = 'entry',
    EXIT = 'exit',
}

export interface BorderCrossingLog {
    id: number;
    booking_id: number; // booking.id
    vehicle_id: number; // vehicle.id
    driver_id: number; // driver.id
    border_post_id: number; // border_post.id
    direction: BorderCrossingDirection;
    arrival_time: string;
    departure_time?: string;
    wait_duration_minutes: number;
    fees_paid: number;
    currency: Currency | 'ZAR';
    receipt_number?: string;
    receipt_url?: string;
    customs_declaration_number?: string;
    issues_encountered?: string;
    notes?: string;
    created_at: string;
}

// --- FUEL STATIONS ---

export interface FuelStation {
    id: number;
    station_name: string;
    brand: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    contact_phone?: string;
    fuel_types_available: string[]; // JSON
    has_truck_facilities: boolean;
    has_parking: boolean;
    has_restrooms: boolean;
    has_shop: boolean;
    accepts_fleet_cards: boolean;
    accepted_payment_methods: string[]; // JSON
    operating_hours: Record<string, string>; // JSON
    is_24_hours: boolean;
    average_diesel_price?: number;
    price_currency: Currency;
    last_price_update?: string;
    is_active: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
}


// --- REST STOPS & TRUCK STOPS ---

export enum RestStopType {
    REST_AREA = 'rest_area',
    TRUCK_STOP = 'truck_stop',
    SERVICE_STATION = 'service_station',
    PARKING_AREA = 'parking_area',
}

export interface RestStop {
    id: number;
    stop_name: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    stop_type: RestStopType;
    has_parking: boolean;
    parking_capacity?: number;
    parking_fee?: number;
    has_security: boolean;
    has_restrooms: boolean;
    has_food: boolean;
    has_accommodation: boolean;
    has_fuel: boolean;
    has_repairs: boolean;
    operating_hours?: Record<string, string>; // JSON
    is_24_hours: boolean;
    contact_phone?: string;
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- ROUTE OPTIMIZATION & PLANNING ---

export enum RouteOptimizationCriteria {
    FASTEST = 'fastest',
    SHORTEST = 'shortest',
    CHEAPEST = 'cheapest',
    AVOID_TRAFFIC = 'avoid_traffic',
    CUSTOM = 'custom',
}

export enum RoutePlanStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    DEVIATED = 'deviated',
    CANCELLED = 'cancelled',
}

export interface RoutePlan {
    id: number;
    booking_id: number; // booking.id
    vehicle_id: number; // vehicle.id
    driver_id: number; // driver.id
    planned_route_id?: number; // route.id
    origin_location_id?: number; // location.id
    origin_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_location_id?: number; // location.id
    destination_address: string;
    destination_latitude: number;
    destination_longitude: number;
    planned_distance_km: number;
    actual_distance_km?: number;
    planned_duration_hours: number;
    actual_duration_hours?: number;
    planned_departure_time: string;
    actual_departure_time?: string;
    planned_arrival_time: string;
    actual_arrival_time?: string;
    planned_fuel_cost: number;
    actual_fuel_cost?: number;
    planned_toll_cost: number;
    actual_toll_cost?: number;
    route_geometry: string; // encoded polyline or GeoJSON
    planned_stops: { location: string; type: string; duration: number; eta: string }[]; // JSON
    optimization_criteria: RouteOptimizationCriteria;
    status: RoutePlanStatus;
    deviation_notes?: string;
    created_at: string;
    updated_at: string;
}

export enum RouteDeviationType {
    UNPLANNED_STOP = 'unplanned_stop',
    ROUTE_CHANGE = 'route_change',
    DELAY = 'delay',
    DETOUR = 'detour',
}

export interface RouteDeviation {
    id: number;
    route_plan_id: number; // route_plan.id
    booking_id: number; // booking.id
    vehicle_id: number; // vehicle.id
    deviation_type: RouteDeviationType;
    location_name: string;
    latitude: number;
    longitude: number;
    deviation_start_time: string;
    deviation_end_time?: string;
    duration_minutes: number;
    reason: string;
    additional_cost?: number;
    additional_km?: number;
    approved_by?: number; // user.id
    created_at: string;
}


// --- TRAFFIC & ROAD CONDITIONS ---

export enum TrafficIncidentType {
    ACCIDENT = 'accident',
    ROADBLOCK = 'roadblock',
    CONSTRUCTION = 'construction',
    WEATHER = 'weather',
    CONGESTION = 'congestion',
    ROAD_CLOSURE = 'road_closure',
    PROTEST = 'protest',
}

export enum TrafficIncidentSeverity {
    MINOR = 'minor',
    MODERATE = 'moderate',
    MAJOR = 'major',
    CRITICAL = 'critical',
}

export interface TrafficIncident {
    id: number;
    incident_type: TrafficIncidentType;
    location_description: string;
    city?: string;
    country: string;
    latitude: number;
    longitude: number;
    route_id?: number; // route.id
    severity: TrafficIncidentSeverity;
    reported_at: string;
    resolved_at?: string;
    estimated_delay_minutes?: number;
    description: string;
    reported_by?: number; // user.id
    reported_by_driver_id?: number; // driver.id
    alternate_route_suggested?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- GEOGRAPHIC ZONES ---

export enum ServiceZoneType {
    CITY = 'city',
    PROVINCE = 'province',
    COUNTRY = 'country',
    REGION = 'region',
    CUSTOM = 'custom',
}

export enum ServiceLevel {
    FULL = 'full',
    LIMITED = 'limited',
    NO_COVERAGE = 'no_coverage',
}

export interface ServiceZone {
    id: number;
    zone_name: string;
    zone_type: ServiceZoneType;
    countries_included: string[]; // JSON
    cities_included?: string[]; // JSON
    geometry: string; // GeoJSON polygon
    service_level: ServiceLevel;
    surcharge_percentage?: number;
    is_active: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export enum RestrictionType {
    NO_ENTRY = 'no_entry',
    TIME_RESTRICTION = 'time_restriction',
    WEIGHT_LIMIT = 'weight_limit',
    HEIGHT_LIMIT = 'height_limit',
    HAZMAT_PROHIBITED = 'hazmat_prohibited',
    PERMIT_REQUIRED = 'permit_required',
}

export interface RestrictedZone {
    id: number;
    zone_name: string;
    restriction_type: RestrictionType;
    location_description: string;
    city?: string;
    country: string;
    geometry: string; // GeoJSON polygon
    restriction_details: Record<string, any>; // JSON
    time_restrictions?: { days: string[]; start_time: string; end_time: string }; // JSON
    penalty_description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


// --- DISTANCE MATRIX CACHE ---

export interface DistanceCache {
    id: number;
    origin_city: string;
    origin_country: string;
    destination_city: string;
    destination_country: string;
    distance_km: number;
    duration_hours: number;
    route_geometry?: string; // encoded polyline
    last_calculated_at: string;
    created_at: string;
}


// --- PARKING YARDS ---

export interface ParkingYard {
    id: number;
    yard_name: string;
    location_id?: number; // location.id
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    capacity: number;
    current_occupancy: number;
    has_security: boolean;
    has_wash_bay: boolean;
    has_workshop: boolean;
    has_fuel_storage: boolean;
    has_office: boolean;
    operating_hours: Record<string, string>; // JSON
    is_24_hours: boolean;
    manager_name?: string;
    manager_phone?: string;
    gate_access_code?: string;
    is_active: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface YardCheckIn {
    id: number;
    parking_yard_id: number; // parking_yard.id
    vehicle_id: number; // vehicle.id
    driver_id: number; // driver.id
    check_in_time: string;
    check_out_time?: string;
    check_in_odometer?: number;
    check_out_odometer?: number;
    check_in_fuel_level?: number;
    check_out_fuel_level?: number;
    damage_reported: boolean;
    damage_description?: string;
    damage_photos: string[]; // JSON
    notes?: string;
    created_at: string;
}


// --- WEATHER DATA ---

export enum WeatherCondition {
    CLEAR = 'clear',
    RAIN = 'rain',
    STORM = 'storm',
    FOG = 'fog',
    SNOW = 'snow',
    EXTREME_HEAT = 'extreme_heat',
}

export enum RoadImpact {
    NONE = 'none',
    MINOR = 'minor',
    MODERATE = 'moderate',
    SEVERE = 'severe',
}

// FIX: Renamed interface from WeatherCondition to WeatherLog to resolve name conflict with the enum.
export interface WeatherLog {
    id: number;
    location_name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    weather_condition: WeatherCondition;
    temperature: number;
    visibility_km?: number;
    wind_speed_kmh?: number;
    road_impact: RoadImpact;
    warning_issued: boolean;
    warning_description?: string;
    source: string;
    recorded_at: string;
    created_at: string;
}


// --- TOLL PAYMENTS TRACKING ---

export enum TollPaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    TRANSPONDER = 'transponder',
    MOBILE_MONEY = 'mobile_money',
}

export interface TollPayment {
    id: number;
    booking_id?: number; // booking.id
    vehicle_id: number; // vehicle.id
    driver_id?: number; // driver.id
    toll_gate_name: string;
    route_id?: number; // route.id
    location: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
    amount: number;
    currency: Currency | 'ZAR' | 'BWP' | 'ZMW';
    payment_method: TollPaymentMethod;
    receipt_number?: string;
    receipt_url?: string;
    paid_at: string;
    notes?: string;
    created_at: string;
}

// --- ROUTE ANALYTICS ---

export interface RoutePerformance {
    id: number;
    route_id: number; // route.id
    period_start: string; // date
    period_end: string; // date
    total_trips: number;
    total_km_travelled: number;
    average_duration_hours: number;
    fastest_trip_hours: number;
    slowest_trip_hours: number;
    total_fuel_cost: number;
    average_fuel_cost_per_km: number;
    total_toll_cost: number;
    total_revenue: number;
    total_profit: number;
    on_time_deliveries: number;
    delayed_deliveries: number;
    incident_count: number;
    average_customer_rating?: number;
    generated_at: string;
}