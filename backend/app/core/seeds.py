import logging

logger = logging.getLogger("sahayak_seeds")

SCHEMES_DATA = [
    {
        "_id": "pm-kisan",
        "name": "PM Kisan Samman Nidhi",
        "description": "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to all small and marginal landholding farmer families as minimum income support.",
        "category": "Farmer",
        "eligibility_rules": {
            "farmer_status": True,
            "max_income": 300000,
            "min_age": 18
        },
        "eligibility_summary": "All small and marginal farmer families who hold cultivable land in their names. Annual income should ideally be below ₹3,00,000.",
        "benefits": "₹6,000 per year distributed in three equal installments of ₹2,000 directly into the bank accounts of farmers.",
        "required_documents": ["Aadhaar Card", "Land Ownership Documents (Khata/Patta)", "Bank Passbook"],
        "state_availability": "All India",
        "deadline": "2026-12-31",
        "logo_url": "🌾"
    },
    {
        "_id": "ayushman-bharat",
        "name": "Ayushman Bharat PM-JAY",
        "description": "The largest health assurance scheme in the world, aiming to provide free health cover of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.",
        "category": "Healthcare",
        "eligibility_rules": {
            "max_income": 250000,
            "caste_categories": ["SC", "ST", "OBC", "General"]
        },
        "eligibility_summary": "Families listed in the Socio-Economic Caste Census (SECC) database, low-income households (income under ₹2.5 Lakh), and families without adult male members or with disabled members.",
        "benefits": "Cashless health cover of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.",
        "required_documents": ["Aadhaar Card", "Ration Card (NFSA)", "Income Certificate"],
        "state_availability": "All India",
        "deadline": "Rolling (No Deadline)",
        "logo_url": "🏥"
    },
    {
        "_id": "pm-awas-yojana",
        "name": "Pradhan Mantri Awas Yojana (PMAY)",
        "description": "A flagship mission of the Government of India addressing urban and rural housing shortage among the EWS/LIG and MIG categories by ensuring a pucca house to all eligible households.",
        "category": "Housing",
        "eligibility_rules": {
            "max_income": 600000
        },
        "eligibility_summary": "Families without a pucca house. EWS (income up to ₹3 Lakh), LIG (income up to ₹6 Lakh). Candidates must not own another brick-and-mortar home anywhere in India.",
        "benefits": "Interest subsidy up to 6.5% on housing loans or direct financial assistance of up to ₹1.2 Lakh (Plains) / ₹1.3 Lakh (Hilly areas) for building houses.",
        "required_documents": ["Aadhaar Card", "Income Certificate", "Ration Card", "Affidavit of not owning a Pucca House", "Bank Passbook"],
        "state_availability": "All India",
        "deadline": "2026-12-31",
        "logo_url": "🏠"
    },
    {
        "_id": "pm-mudra",
        "name": "Pradhan Mantri Mudra Yojana",
        "description": "A scheme to provide loans up to ₹10 Lakh to non-corporate, non-farm small/micro enterprises. These loans are classified as Shishu (up to ₹50,000), Kishor (up to ₹5 Lakh), and Tarun (up to ₹10 Lakh).",
        "category": "Financial Services",
        "eligibility_rules": {
            "min_age": 18
        },
        "eligibility_summary": "Any Indian citizen who has a business plan for a non-farm sector income-generating activity such as manufacturing, processing, trading, or service sector and needs credit below ₹10 Lakh.",
        "benefits": "Collateral-free business loans up to ₹10,000,000 with flexible repayment periods and affordable interest rates.",
        "required_documents": ["Aadhaar Card", "PAN Card", "Business Registration Proof", "Project Report/Business Plan", "Bank Statement"],
        "state_availability": "All India",
        "deadline": "Rolling (No Deadline)",
        "logo_url": "💼"
    },
    {
        "_id": "atal-pension",
        "name": "Atal Pension Yojana (APY)",
        "description": "A pension scheme for citizens of India focused on the unorganized sector workers. Under the APY, a guaranteed minimum pension of ₹1,000 to ₹5,000 per month will be given at the age of 60 years.",
        "category": "Pension",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 40
        },
        "eligibility_summary": "Any Indian citizen aged between 18 and 40 years holding a savings bank account. Must not be a taxpayer or beneficiary of other statutory social security schemes.",
        "benefits": "Guaranteed monthly pension between ₹1,000 and ₹5,000 starting from the age of 60, based on monthly contribution amount.",
        "required_documents": ["Aadhaar Card", "Bank Account Details", "Mobile Number"],
        "state_availability": "All India",
        "deadline": "Rolling (No Deadline)",
        "logo_url": "🪙"
    },
    {
        "_id": "national-scholarship",
        "name": "National Scholarship Portal (NSP)",
        "description": "A one-stop solution through which various services starting from student application, application receipt, processing, sanction, and disbursal of various scholarships to students are enabled.",
        "category": "Student",
        "eligibility_rules": {
            "max_income": 250000,
            "is_student": True
        },
        "eligibility_summary": "Students enrolled in school, college, or university with good academic record. Annual family income must not exceed ₹2.5 Lakh. Supports minority, SC/ST, and OBC students.",
        "benefits": "Direct financial aid ranging from ₹5,000 to ₹50,000 per year directly credited to student accounts for tuition fees and maintenance.",
        "required_documents": ["Aadhaar Card", "Previous Class Marksheet", "Income Certificate", "Caste Certificate (if applicable)", "Fee Receipt", "Bonafide Student Certificate"],
        "state_availability": "All India",
        "deadline": "2026-11-30",
        "logo_url": "🎓"
    },
    {
        "_id": "skill-india",
        "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        "description": "Skill India is a flagship program aiming to enable a large number of Indian youth to take up industry-relevant skill training that will help them secure a better livelihood.",
        "category": "Skill Development",
        "eligibility_rules": {
            "min_age": 15,
            "max_age": 45
        },
        "eligibility_summary": "Any Indian national youth aged between 15-45 who is unemployed or school/college dropouts looking for employable skill certification.",
        "benefits": "Free skill certification courses, monetary rewards upon completion, and placement assistance through Rozgar Melas.",
        "required_documents": ["Aadhaar Card", "Educational Qualification Marksheet", "Bank Passbook"],
        "state_availability": "All India",
        "deadline": "2026-12-31",
        "logo_url": "🛠️"
    },
    {
        "_id": "stand-up-india",
        "name": "Stand Up India",
        "description": "A scheme designed to promote entrepreneurship at the grassroots level, specifically focusing on economic empowerment of women and SC/ST communities.",
        "category": "Women Entrepreneur",
        "eligibility_rules": {
            "min_age": 18,
            "caste_categories": ["SC", "ST", "OBC", "General"],
            "gender": "Female"
        },
        "eligibility_summary": "Women entrepreneurs or Scheduled Caste (SC) and Scheduled Tribe (ST) individuals above 18 years of age setting up greenfield enterprises.",
        "benefits": "Bank loans between ₹10 Lakh and ₹1 Crore for setting up greenfield manufacturing, services, or trading enterprises.",
        "required_documents": ["Aadhaar Card", "PAN Card", "Caste Certificate", "Business Entity Proof", "Assets & Liabilities Statement"],
        "state_availability": "All India",
        "deadline": "Rolling (No Deadline)",
        "logo_url": "🚀"
    }
]

def seed_schemes(db):
    try:
        # Seed schemes
        collection = db.get_collection("schemes")
        count = collection.count_documents({})
        if count == 0:
            logger.info("Database is empty. Seeding welfare schemes...")
            for scheme in SCHEMES_DATA:
                collection.insert_one(scheme)
            logger.info("Successfully seeded all schemes!")
        else:
            logger.info(f"Database already contains {count} schemes. Skipping seed.")
            
        # Seed default admin
        admins_col = db.get_collection("admins")
        if admins_col.count_documents({}) == 0:
            logger.info("Seeding default admin user...")
            admins_col.insert_one({
                "_id": "default-admin-id",
                "email": "admin@sahayak.gov.in",
                "password": "admin123",
                "name": "Officer Rajesh"
            })
            logger.info("Successfully seeded default admin user!")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

