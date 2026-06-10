/* ─── About ──────────────────────────────────────────────────────────── */
export const ABOUT_TEAM = [
  { name: "CEO",     role: "Founder & CEO",        emoji: "👨‍💼" },
  { name: "COO",     role: "Head of Design",        emoji: "🎨" },
  { name: "CTO",     role: "Lead Engineer",         emoji: "💻" },
  { name: "Manager", role: "Customer Experience",   emoji: "🌟" },
];

export const ABOUT_VALUES = [
  { icon: "🎯", title: "Quality First",    desc: "Every product is curated to meet strict quality standards before it reaches you." },
  { icon: "💚", title: "Sustainability",   desc: "We partner with eco-conscious suppliers to reduce our environmental footprint." },
  { icon: "🤝", title: "Customer Trust",   desc: "Transparent pricing, honest descriptions, and no hidden fees — ever." },
  { icon: "🚀", title: "Constant Growth",  desc: "We continuously expand our catalogue based on your feedback and trends." },
  { icon: "🔒", title: "Secure Shopping",  desc: "Bank-grade encryption keeps your data and payments completely safe." },
  { icon: "💬", title: "Always Available", desc: "Our support team is reachable 6 days a week to solve any issue fast." },
];

/* ─── Contact ────────────────────────────────────────────────────────── */
export const CONTACT_CHANNELS = [
  { icon: "📧", label: "Email Us",    value: "support@vishnusstore.in",    note: "Reply within 24 hrs"   },
  { icon: "📞", label: "Call Us",     value: "+91 98765 43210",             note: "Mon–Sat, 9 am – 6 pm"  },
  { icon: "💬", label: "Live Chat",   value: "Chat on our website",         note: "Avg wait < 3 mins"     },
  { icon: "📍", label: "Our Address", value: "Hyderabad, Telangana 500032", note: "India"                 },
];

export const CONTACT_TOPICS = [
  "Order Issue",
  "Return / Refund",
  "Product Query",
  "Payment Problem",
  "Other",
];

/* ─── Shipping ───────────────────────────────────────────────────────── */
export const DELIVERY_OPTIONS = [
  {
    icon: "⚡",
    type: "Express Delivery",
    time: "1–2 Business Days",
    price: "₹99",
    note: "Order before 12 pm for same-day dispatch",
  },
  {
    icon: "🚚",
    type: "Standard Delivery",
    time: "3–5 Business Days",
    price: "₹49",
    note: "Free on orders above ₹499",
  },
  {
    icon: "🎁",
    type: "Free Shipping",
    time: "3–5 Business Days",
    price: "FREE",
    note: "Automatically applied on orders ≥ ₹499",
  },
];

export const DELIVERY_ZONES = [
  { zone: "Metro Cities",     cities: "Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata",  time: "1–3 days" },
  { zone: "Tier-2 Cities",    cities: "Pune, Jaipur, Lucknow, Ahmedabad, Surat, Nagpur",        time: "2–4 days" },
  { zone: "Tier-3 & Remote",  cities: "All other pin codes",                                    time: "4–7 days" },
  { zone: "North-East India", cities: "Assam, Meghalaya, Nagaland, Manipur & others",           time: "5–8 days" },
];

export const SHIPPING_STEPS = [
  { icon: "🛒", label: "Place Order",  desc: "Complete checkout and receive your order confirmation email." },
  { icon: "📦", label: "Processing",   desc: "We verify your order and pack it within 24 hours." },
  { icon: "🏭", label: "Dispatched",   desc: "Your parcel leaves our warehouse with a tracking number." },
  { icon: "🚛", label: "In Transit",   desc: "Our courier partner carries the package to your city." },
  { icon: "🏠", label: "Delivered",    desc: "Your order arrives at your doorstep." },
];

export const SHIPPING_FAQS = [
  {
    q: "Can I change my delivery address after placing an order?",
    a: "Address changes are possible within 1 hour of placing the order. Contact support immediately.",
  },
  {
    q: "Will I receive a tracking number?",
    a: "Yes — a tracking link is sent to your email once your order is dispatched, usually within 24 hours.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, we ship only within India. International shipping is planned for the future.",
  },
  {
    q: "What if my order is delayed?",
    a: "If your order exceeds the estimated delivery window, please contact our support team for an update or full refund.",
  },
];

/* ─── Returns ────────────────────────────────────────────────────────── */
export const RETURN_ELIGIBLE = [
  "Item received in a damaged or defective condition",
  "Wrong item delivered (different from what was ordered)",
  "Item does not match the description or images on site",
  "Size or fit issue — item differs from size chart",
  "Item missing from the package",
];

export const RETURN_NOT_ELIGIBLE = [
  "Items returned after the 7-day return window",
  "Used, washed, or altered items",
  "Items without original tags and packaging",
  "Innerwear, socks, and personal accessories (hygiene reasons)",
  "Items marked as 'Non-Returnable' on the product page",
  "Damage caused by the customer (tears, stains, etc.)",
];

export const RETURN_STEPS = [
  { icon: "📧", step: "01", title: "Contact Support",  desc: "Email us at returns@vishnusstore.in or use the Contact Us form within 7 days of delivery." },
  { icon: "📸", step: "02", title: "Share Photos",     desc: "Attach clear photos of the item and packaging to help us assess the issue quickly." },
  { icon: "✅", step: "03", title: "Get Approval",     desc: "Our team reviews your request and sends a return approval email within 24–48 hours." },
  { icon: "📦", step: "04", title: "Ship it Back",     desc: "Pack the item securely in original packaging and ship it to our return address." },
  { icon: "💰", step: "05", title: "Refund Processed", desc: "Refund is credited to your original payment method within 5–7 business days of receipt." },
];

export const REFUND_MODES = [
  { mode: "UPI / Net Banking",   time: "2–3 Business Days", note: "Fastest option"              },
  { mode: "Credit / Debit Card", time: "5–7 Business Days", note: "Depends on your bank"        },
  { mode: "Cash on Delivery",    time: "5–7 Business Days", note: "Transferred to bank account" },
  { mode: "Store Credit",        time: "Instant",           note: "Use on your next order"      },
];

export const RETURN_FAQS = [
  {
    q: "Can I exchange an item instead of returning it?",
    a: "Yes! We offer size and colour exchanges for eligible items. Mention 'Exchange' in your return request.",
  },
  {
    q: "Do I have to pay for the return shipping?",
    a: "If the return is due to our error (wrong/defective item), we cover the return shipping cost. For size issues, return shipping is at the customer's expense.",
  },
  {
    q: "What if I received a partial order?",
    a: "Contact support immediately. We'll dispatch the missing item or issue a refund for the undelivered portion.",
  },
  {
    q: "How do I track my refund?",
    a: "You'll receive an email confirmation once your refund is processed. Check with your bank if you don't see it within the stated window.",
  },
  {
    q: "Can I return a sale or discounted item?",
    a: "Sale items can be returned only if they are defective or wrongly delivered. Items bought at regular price follow standard return policy.",
  },
];

/* ─── Privacy Policy ─────────────────────────────────────────────────── */
export const PRIVACY_SECTIONS = [
  {
    id: "collect",
    icon: "📋",
    title: "Information We Collect",
    content: [
      {
        sub: "Account Information",
        text: "When you register, we collect your name, email address, phone number, and password (stored encrypted). This information is used to manage your account and personalise your experience.",
      },
      {
        sub: "Order & Payment Data",
        text: "We collect billing address, shipping address, and transaction details necessary to fulfil your orders. We do not store full card numbers — payments are processed by PCI-DSS compliant third-party gateways.",
      },
      {
        sub: "Usage Data",
        text: "We automatically collect information about how you interact with our platform — pages visited, products viewed, cart activity, device type, browser, and IP address — to improve performance and personalisation.",
      },
      {
        sub: "Communications",
        text: "When you contact our support team, we retain those communications to help resolve issues and improve our services.",
      },
    ],
  },
  {
    id: "use",
    icon: "🎯",
    title: "How We Use Your Information",
    content: [
      { sub: "Order Fulfilment",      text: "To process, confirm, ship, and support your purchases." },
      { sub: "Account Management",    text: "To authenticate your sessions, update your preferences, and keep your account secure." },
      { sub: "Customer Support",      text: "To respond to your queries, handle returns, and resolve disputes efficiently." },
      { sub: "Marketing (opt-in)",    text: "To send you order updates, promotional offers, and newsletters — only if you have opted in. You can unsubscribe at any time." },
      { sub: "Platform Improvement",  text: "To analyse aggregate usage patterns, fix bugs, and add new features." },
      { sub: "Legal Compliance",      text: "To meet our obligations under applicable Indian laws and regulations." },
    ],
  },
  {
    id: "share",
    icon: "🤝",
    title: "Information Sharing",
    content: [
      { sub: "Delivery Partners",      text: "We share your name, phone number, and delivery address with our logistics partners solely to deliver your order." },
      { sub: "Payment Processors",     text: "Transaction data is shared with our payment gateway partners to process payments securely." },
      { sub: "No Third-Party Selling", text: "We do not sell, rent, or trade your personal data to advertisers or data brokers under any circumstances." },
      { sub: "Legal Obligations",      text: "We may disclose information if required by law, court order, or government authority." },
    ],
  },
  {
    id: "cookies",
    icon: "🍪",
    title: "Cookies & Tracking",
    content: [
      { sub: "Essential Cookies",  text: "Required for login sessions, cart functionality, and security. Cannot be disabled without breaking core features." },
      { sub: "Analytics Cookies",  text: "Help us understand traffic patterns and improve the shopping experience. These can be declined." },
      { sub: "Marketing Cookies",  text: "Used only if you opt-in to personalised offers. You can manage cookie preferences in your browser settings." },
    ],
  },
  {
    id: "rights",
    icon: "🔑",
    title: "Your Rights",
    content: [
      { sub: "Access",      text: "Request a copy of the personal data we hold about you at any time." },
      { sub: "Correction",  text: "Update incorrect or incomplete data via your Profile page or by contacting support." },
      { sub: "Deletion",    text: "Request deletion of your account and associated personal data (subject to legal retention requirements)." },
      { sub: "Portability", text: "Request your data in a machine-readable format." },
      { sub: "Opt-Out",     text: "Unsubscribe from marketing emails at any time via the link at the bottom of any email or through your account settings." },
    ],
  },
  {
    id: "security",
    icon: "🔒",
    title: "Data Security",
    content: [
      { sub: "Encryption",      text: "All data in transit is protected with TLS 1.3 encryption. Passwords are hashed using bcrypt and never stored in plain text." },
      { sub: "Access Controls", text: "Only authorised personnel with a legitimate business need can access personal data." },
      { sub: "Breach Protocol", text: "In the event of a data breach, we will notify affected users within 72 hours in line with applicable regulations." },
    ],
  },
];
