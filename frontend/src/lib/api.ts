// SahayakAI REST API Client
const BACKEND_URL = "http://localhost:8000/api";

// Simple local state store for standalone client mode
let localUser: any = {
  _id: "demo-user-123",
  email: "citizen@sahayak.in",
  name: "Rajesh Kumar",
  onboarded: false,
  profile: {}
};

let localApplications: any[] = [];
let localNotifications: any[] = [
  {
    _id: "notif-1",
    title: "Complete Your Profile",
    message: "Get personalized AI welfare scheme recommendations by completing your onboarding questionnaire.",
    type: "Onboarding",
    read: false,
    date: "10 mins ago"
  }
];

let localChatHistory: any[] = [];

// Static welfare schemes fallback list
const FALLBACK_SCHEMES = [
  {
    _id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    description: "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all small and marginal landholding farmer families as minimum income support.",
    category: "Farmer",
    eligibility_summary: "All small and marginal farmer families who hold cultivable land in their names. Annual income should be below ₹3,00,000.",
    benefits: "₹6,000 per year distributed in three equal installments of ₹2,000 directly into the bank accounts of farmers.",
    required_documents: ["Aadhaar Card", "Land Ownership Documents (Khata/Patta)", "Bank Passbook"],
    state_availability: "All India",
    deadline: "2026-12-31",
    logo_url: "🌾"
  },
  {
    _id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    description: "The largest health assurance scheme in the world, aiming to provide free health cover of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.",
    category: "Healthcare",
    eligibility_summary: "Families listed in the Socio-Economic Caste Census (SECC) database, low-income households (income under ₹2.5 Lakh), and families without adult male members.",
    benefits: "Cashless health cover of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.",
    required_documents: ["Aadhaar Card", "Ration Card (NFSA)", "Income Certificate"],
    state_availability: "All India",
    deadline: "Rolling (No Deadline)",
    logo_url: "🏥"
  },
  {
    _id: "pm-awas-yojana",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "A flagship mission of the Government of India addressing urban and rural housing shortage among the EWS/LIG and MIG categories by ensuring a pucca house to all eligible households.",
    category: "Housing",
    eligibility_summary: "Families without a pucca house. EWS (income up to ₹3 Lakh), LIG (income up to ₹6 Lakh). Candidates must not own another brick-and-mortar home anywhere in India.",
    benefits: "Interest subsidy up to 6.5% on housing loans or direct financial assistance of up to ₹1.2 Lakh (Plains) / ₹1.3 Lakh (Hilly areas) for building houses.",
    required_documents: ["Aadhaar Card", "Income Certificate", "Ration Card", "Affidavit of not owning a Pucca House", "Bank Passbook"],
    state_availability: "All India",
    deadline: "2026-12-31",
    logo_url: "🏠"
  },
  {
    _id: "pm-mudra",
    name: "Pradhan Mantri Mudra Yojana",
    description: "A scheme to provide loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises. These loans are classified as Shishu (up to ₹50,000), Kishor (up to ₹5 Lakh), and Tarun (up to ₹10 Lakh).",
    category: "Financial Services",
    eligibility_summary: "Any Indian citizen who has a business plan for a non-farm sector income-generating activity such as manufacturing, processing, trading, or service sector and needs credit below ₹10 Lakh.",
    benefits: "Collateral-free business loans up to ₹10,000,000 with flexible repayment periods and affordable interest rates.",
    required_documents: ["Aadhaar Card", "PAN Card", "Business Registration Proof", "Project Report/Business Plan", "Bank Statement"],
    state_availability: "All India",
    deadline: "Rolling (No Deadline)",
    logo_url: "💼"
  },
  {
    _id: "atal-pension",
    name: "Atal Pension Yojana (APY)",
    description: "A pension scheme for citizens of India focused on the unorganized sector workers. Under the APY, a guaranteed minimum pension of ₹1,000 to ₹5,000 per month will be given at the age of 60 years.",
    category: "Pension",
    eligibility_summary: "Any Indian citizen aged between 18 and 40 years holding a savings bank account. Must not be a taxpayer or beneficiary of other statutory social security schemes.",
    benefits: "Guaranteed monthly pension between ₹1,000 and ₹5,000 starting from the age of 60, based on monthly contribution amount.",
    required_documents: ["Aadhaar Card", "Bank Account Details", "Mobile Number"],
    state_availability: "All India",
    deadline: "Rolling (No Deadline)",
    logo_url: "🪙"
  },
  {
    _id: "national-scholarship",
    name: "National Scholarship Portal (NSP)",
    description: "A one-stop solution through which various services starting from student application, application receipt, processing, sanction, and disbursal of various scholarships to students are enabled.",
    category: "Student",
    eligibility_summary: "Students enrolled in school, college, or university with good academic record. Annual family income must not exceed ₹2.5 Lakh. Supports minority, SC/ST, and OBC students.",
    benefits: "Direct financial aid ranging from ₹5,000 to ₹50,000 per year directly credited to student accounts for tuition fees and maintenance.",
    required_documents: ["Aadhaar Card", "Previous Class Marksheet", "Income Certificate", "Caste Certificate (if applicable)", "Fee Receipt", "Bonafide Student Certificate"],
    state_availability: "All India",
    deadline: "2026-11-30",
    logo_url: "🎓"
  }
];

export const sahayakApi = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth APIs
  async register(email: string, password: string, name: string): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });
      if (res.ok) return await res.json();
      throw new Error("Registration failed");
    } catch (e) {
      // Mock flow
      localUser = {
        _id: "user-" + Math.random().toString(36).substring(4),
        email,
        name,
        onboarded: false,
        profile: {}
      };
      return { message: "Mock Registration successful", user_id: localUser._id };
    }
  },

  async login(email: string, password: string): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
      throw new Error("Login failed");
    } catch (e) {
      // Mock flow
      if (email.includes("admin")) {
        return {
          message: "Mock Admin Login successful",
          user_id: "admin-999",
          name: "System Officer",
          role: "admin"
        };
      }
      localUser.email = email;
      return {
        message: "Mock Login successful",
        user_id: localUser._id,
        name: localUser.name,
        role: "citizen"
      };
    }
  },

  // User Profile and Onboarding APIs
  async getProfile(userId: string): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}/profile`);
      if (res.ok) return await res.json();
      throw new Error("Profile retrieval failed");
    } catch {
      return localUser;
    }
  },

  async submitOnboarding(userId: string, data: any): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      throw new Error("Onboarding submission failed");
    } catch {
      // Mock score calculation
      const fields = [
        data.full_name, data.age, data.gender, data.state, data.district,
        data.occupation, data.annual_income, data.education, data.caste_category,
        data.family_size
      ];
      const completed = fields.filter(f => f !== undefined && f !== null && f !== "").length;
      const score = Math.round(((completed + 4) / 14) * 100);

      localUser.profile = { ...data, score };
      localUser.name = data.full_name;
      localUser.onboarded = true;

      localNotifications.unshift({
        _id: "notif-welcome",
        title: "Profile Onboarded!",
        message: `Welcome ${data.full_name}. Your profile score is ${score}%. Let's find your scheme recommendation matches!`,
        type: "Onboarding",
        read: false,
        date: "Just Now"
      });

      return { message: "Mock Onboarding complete", profile: localUser.profile };
    }
  },

  // Scheme Discovery and AI recommendations
  async getSchemes(search?: string, category?: string): Promise<any[]> {
    try {
      let url = `${BACKEND_URL}/schemes`;
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (category) params.push(`category=${encodeURIComponent(category)}`);
      if (params.length) url += `?${params.join("&")}`;
      
      const res = await fetch(url);
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      let filtered = [...FALLBACK_SCHEMES];
      if (category) {
        filtered = filtered.filter(s => s.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      return filtered;
    }
  },

  async getRecommendations(userId: string): Promise<any[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}/recommendations`);
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      if (!localUser.onboarded) return [];
      
      const p = localUser.profile;
      return FALLBACK_SCHEMES.map(s => {
        let score = 100;
        const income = p.annual_income || 0;
        
        // Match farmer rules
        if (s._id === "pm-kisan") {
          if (!p.farmer_status) score -= 40;
          if (income > 300000) score -= 30;
        }
        // Match health rules
        if (s._id === "ayushman-bharat") {
          if (income > 250000) score -= 40;
        }
        // Match housing
        if (s._id === "pm-awas-yojana") {
          if (income > 600000) score -= 50;
        }
        // Match student rules
        if (s._id === "national-scholarship") {
          if (income > 250000) score -= 30;
        }
        
        score = Math.max(0, score);
        const status = score >= 85 ? "Eligible" : (score >= 50 ? "Partially Eligible" : "Not Eligible");
        
        const explanation = score >= 70
          ? `You qualify because your annual income of ₹${income.toLocaleString()} is within target guidelines and your category matches perfectly.`
          : `You do not qualify because your annual income exceeds guidelines or you are not in the target demographic segment.`;

        return {
          scheme_id: s._id,
          name: s.name,
          description: s.description,
          category: s.category,
          benefits: s.benefits,
          required_documents: s.required_documents,
          deadline: s.deadline,
          logo_url: s.logo_url,
          score,
          meets_criteria: score >= 70,
          eligibility_status: status,
          ai_explanation: explanation
        };
      }).sort((a, b) => b.score - a.score);
    }
  },

  // Document Upload and OCR Verifier
  async verifyDocument(docType: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("doc_type", docType);
      formData.append("file", file);
      
      const res = await fetch(`${BACKEND_URL}/ocr/verify`, {
        method: "POST",
        body: formData
      });
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      // Mock OCR Scanner
      const fileId = "doc-" + Math.random().toString(36).substring(4);
      let details = {
        name: localUser.name || "Rajesh Kumar",
        dob: "15/08/1985",
        address: "12, MG Road, Indiranagar, Bengaluru, Karnataka - 560038",
        document_number: "5423 8901 6712",
        verification_status: "Verified",
        confidence: 0.96
      };
      
      const type = docType.toLowerCase();
      if (type.includes("pan")) {
        details.document_number = "BPKPK5432R";
        details.address = "Not Listed on PAN Cards";
      } else if (type.includes("income")) {
        details.document_number = "INC/2026/871024";
      } else if (type.includes("ration")) {
        details.document_number = "RC-KA-560038-091";
      }
      
      return {
        _id: fileId,
        type: docType,
        file_name: file.name,
        extracted_name: details.name,
        extracted_dob: details.dob,
        extracted_address: details.address,
        document_number: details.document_number,
        verification_status: details.verification_status,
        confidence: details.confidence
      };
    }
  },

  // Apply and Track Applications
  async submitApplication(userId: string, schemeId: string, documentIds: string[]): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("scheme_id", schemeId);
      formData.append("document_ids", documentIds.join(","));
      
      const res = await fetch(`${BACKEND_URL}/users/${userId}/apply`, {
        method: "POST",
        body: formData
      });
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      const scheme = FALLBACK_SCHEMES.find(s => s._id === schemeId) || { name: schemeId };
      const app_id = "app-" + Math.random().toString(36).substring(4);
      const today = new Date().toISOString().split("T")[0];
      const est_date = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      
      const new_app = {
        _id: app_id,
        user_id: userId,
        scheme_id: schemeId,
        scheme_name: scheme.name,
        document_ids: documentIds,
        status: "Submitted",
        submission_date: today,
        estimated_completion_date: est_date,
        history: [
          { status: "Draft", date: today, note: "Application created" },
          { status: "Submitted", date: today, note: "Application uploaded and sent to sub-division verification team" }
        ]
      };
      
      localApplications.unshift(new_app);
      localNotifications.unshift({
        _id: "notif-apply-" + app_id,
        title: "Application Submitted Successfully",
        message: `Your application for ${scheme.name} is successfully uploaded. Check status in the Tracker.`,
        type: "Application",
        read: false,
        date: "Just Now"
      });
      
      return { message: "Mock Application submitted", application_id: app_id };
    }
  },

  async getApplications(userId: string): Promise<any[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}/applications`);
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      return localApplications;
    }
  },

  // AI Chat bot APIs
  async sendChatMessage(message: string, userId?: string, language: string = "en"): Promise<string> {
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, user_id: userId, language })
      });
      if (res.ok) {
        const data = await res.json();
        return data.response;
      }
      throw new Error();
    } catch {
      // Mock Response
      const msg = message.toLowerCase();
      let response = "I am SahayakAI. I can help you discover schemes, check document requirements, and verify eligibility rules. Ask me about PM Kisan, Ayushman Bharat, or Mudra loans!";
      
      if (msg.includes("kisan") || msg.includes("farmer")) {
        response = "**PM Kisan Samman Nidhi** is a Central Sector Scheme providing direct income support of ₹6,000/year to landholding farmer families. Required documents: Aadhaar, land record khata, and bank details. You can apply directly through the dashboard.";
      } else if (msg.includes("ayushman") || msg.includes("health")) {
        response = "**Ayushman Bharat** offers up to ₹5 Lakh health insurance per family per year for secondary/tertiary hospital treatments. It is cashless and paperless. The main documents needed are Aadhaar Card and your Ration Card.";
      } else if (msg.includes("eligib")) {
        response = "To check your eligibility, you can go to our **Eligibility Checker Wizard** page under the dashboard. It will ask you custom questions and determine your match status using AI.";
      } else if (msg.includes("namaste") || msg.includes("hello") || msg.includes("hi ")) {
        response = "Namaste! I am SahayakAI, your Citizen Copilot. How can I help you find or apply for government welfare programs today?";
      }
      
      localChatHistory.push({ user_message: message, ai_response: response });
      return response;
    }
  },

  // Notifications
  async getNotifications(userId: string): Promise<any[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}/notifications`);
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      return localNotifications;
    }
  },

  async markNotificationRead(notifId: string): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/notifications/${notifId}/read`, { method: "POST" });
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      localNotifications = localNotifications.map(n => n._id === notifId ? { ...n, read: true } : n);
      return { message: "Marked read" };
    }
  },

  // Admin APIs
  async getAdminAnalytics(): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/analytics`);
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      return {
        total_users: 1420 + localUser.onboarded ? 1 : 0,
        total_applications: 1250 + localApplications.length,
        approval_rate: 85.2,
        applications_status: {
          approved: 840,
          rejected: 110,
          processing: 300 + localApplications.length
        },
        chart_data: [
          { name: "PM Kisan", applications: 240 + (localApplications.filter(a => a.scheme_id === "pm-kisan").length * 10) },
          { name: "Ayushman Bharat", applications: 380 + (localApplications.filter(a => a.scheme_id === "ayushman-bharat").length * 10) },
          { name: "PM Awas Yojana", applications: 180 + (localApplications.filter(a => a.scheme_id === "pm-awas-yojana").length * 10) },
          { name: "PM Mudra Loan", applications: 310 },
          { name: "Atal Pension Yojana", applications: 140 }
        ]
      };
    }
  },

  async getAdminApplications(): Promise<any[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/applications`);
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      // Mock applications list
      const staticApps = [
        {
          _id: "app-1",
          applicant_name: "Amit Sharma",
          scheme_name: "Ayushman Bharat PM-JAY",
          status: "Verification",
          submission_date: "2026-07-10",
          estimated_completion_date: "2026-08-25"
        },
        {
          _id: "app-2",
          applicant_name: "Savitri Devi",
          scheme_name: "PM Kisan Samman Nidhi",
          status: "Submitted",
          submission_date: "2026-07-11",
          estimated_completion_date: "2026-08-26"
        },
        {
          _id: "app-3",
          applicant_name: "Vikram Singh",
          scheme_name: "Pradhan Mantri Mudra Yojana",
          status: "Approved",
          submission_date: "2026-06-15",
          estimated_completion_date: "2026-07-30"
        }
      ];
      return [...localApplications.map(a => ({
        _id: a._id,
        applicant_name: localUser.name,
        scheme_name: a.scheme_name,
        status: a.status,
        submission_date: a.submission_date,
        estimated_completion_date: a.estimated_completion_date
      })), ...staticApps];
    }
  },

  async updateApplicationStatus(appId: string, status: string, comments: string): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/applications/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comments })
      });
      if (res.ok) return await res.json();
      throw new Error();
    } catch {
      // Update local apps
      localApplications = localApplications.map(a => {
        if (a._id === appId) {
          const today = new Date().toISOString().split("T")[0];
          return {
            ...a,
            status,
            history: [...a.history, { status, date: today, note: comments }]
          };
        }
        return a;
      });
      
      localNotifications.unshift({
        _id: "notif-status-" + appId,
        title: `Application ${status}`,
        message: `Your scheme application status has been updated to ${status}. Details: ${comments}`,
        type: "Application Update",
        read: false,
        date: "Just Now"
      });
      
      return { message: "Mock Status updated" };
    }
  }
};
