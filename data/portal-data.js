/* =========================================================================
 *  PRECISE PORTAL — ไฟล์ข้อมูล
 *  แก้ไข / เพิ่ม / ลบ หมวดหมู่และลิงก์ทั้งหมดได้ที่ไฟล์นี้ไฟล์เดียว
 * =========================================================================
 *
 *  โครงสร้าง
 *  ─────────
 *    หมวดหมู่ (Category)
 *      ├─ links     : ลิงก์ภายใต้หมวดนั้นโดยตรง
 *      └─ children  : หมวดย่อย — ซ้อนลงไปได้ไม่จำกัดชั้น
 *                     (หมวดย่อยใช้ฟิลด์เหมือนหมวดหมู่ทุกอย่าง)
 *
 *  ฟิลด์ของ "หมวดหมู่ / หมวดย่อย"
 *  ─────────────────────────────
 *    id           (จำเป็น) ภาษาอังกฤษตัวเล็ก ไม่เว้นวรรค ห้ามซ้ำในระดับเดียวกัน
 *                 ใช้เป็นที่อยู่หน้า เช่น  index.html#/people/learning
 *    title        ชื่อหมวด
 *    subtitle     ชื่อรอง เช่น ชื่อภาษาอังกฤษ
 *    description  คำอธิบายสั้น ๆ 1–2 บรรทัด
 *    icon         ชื่อไอคอน (ดูทั้งหมดได้ที่  index.html#/_icons)  หรือใส่ Emoji ก็ได้ เช่น "🚀"
 *    color        "orange" | "green" | "blue"
 *                 ไม่ใส่ = หมวดหลักวนสีอัตโนมัติ / หมวดย่อยใช้สีของหมวดแม่
 *    keywords     คำค้นเพิ่มเติม เช่น ["okr", "kpi"]
 *
 *  ฟิลด์ของ "ลิงก์"
 *  ───────────────
 *    title        ชื่อลิงก์
 *    description  คำอธิบายสั้น ๆ
 *    icon         ชื่อไอคอน หรือ Emoji
 *    url          "https://..."          → เปิดในแท็บใหม่
 *                 "#/strategy/vision"    → ไปยังหน้าหมวดหมู่ภายใน Portal
 *                 "#" หรือเว้นว่าง        → ยังไม่มีลิงก์ (ระบบจะแจ้งเมื่อกด)
 *    tag          ป้ายกำกับ เช่น "ใหม่", "PDF", "Dashboard"  หรือหลายป้าย ["ฟอร์ม", "HR"]
 *    newTab       false = เปิดในแท็บเดิม
 *    keywords     คำค้นเพิ่มเติม
 *
 * ========================================================================= */

window.PORTAL_CONFIG = {
  orgName: "Precise",
  title: "Precise Portal",
  brandTagline: "Strategy & Transformation",

  // ใส่ไฟล์โลโก้จริงได้ เช่น "assets/img/precise-logo.png"  (ว่างไว้ = ใช้โลโก้สามสี)
  logo: "",

  heroTitle: "ทุกเรื่องสำคัญขององค์กร",
  heroAccent: "รวมไว้ในที่เดียว",
  tagline: "เข้าถึงกลยุทธ์ ระบบงาน ความรู้ และเครื่องมือ AI ขององค์กรได้อย่างรวดเร็ว ค้นหาง่าย ใช้งานสะดวก",

  // การ์ด "เส้นทางการเปลี่ยนแปลง" บนหน้าแรก  (ลบทั้งก้อนออกได้ถ้าไม่ต้องการ)
  journey: {
    kicker: "Transformation Journey",
    title: "เส้นทางการเปลี่ยนแปลงองค์กร",
    subtitle: "จากองค์กรแบบอุตสาหกรรม สู่ระบบนิเวศที่ขับเคลื่อนด้วย AI",
    steps: [
      { label: "Industrial Capitalism", desc: "ยกระดับประสิทธิภาพ มาตรฐาน และกระบวนการหลัก", color: "orange", link: "#/strategy/transformation/industrial" },
      { label: "Platform Capitalism", desc: "เชื่อมคน ข้อมูล และบริการ บนแพลตฟอร์มเดียวกัน", color: "green", link: "#/strategy/transformation/platform" },
      { label: "Ecosystem Capitalism", desc: "สร้างคุณค่าร่วมกับพันธมิตร ลูกค้า และ AI Agents", color: "blue", link: "#/strategy/transformation/ecosystem" }
    ],
    goal: { caption: "เป้าหมายปลายทาง", label: "Agentic AI Organization", link: "#/ai-hub" }
  },

  footerNote: "ดูแลโดย ฝ่ายกลยุทธ์องค์กร (Corporate Strategy)"
};

window.PORTAL_DATA = [
  /* ───────────────────────────── 1. กลยุทธ์องค์กร ───────────────────────────── */
  {
    id: "strategy",
    title: "กลยุทธ์องค์กร",
    subtitle: "Corporate Strategy",
    description: "วิสัยทัศน์ ทิศทาง แผนกลยุทธ์ และแผนการเปลี่ยนแปลงขององค์กร",
    icon: "target",
    color: "orange",
    keywords: ["strategy", "okr", "vision", "แผน"],
    children: [
      {
        id: "vision",
        title: "วิสัยทัศน์และทิศทาง",
        subtitle: "Vision & Direction",
        icon: "compass",
        links: [
          { title: "วิสัยทัศน์ พันธกิจ และค่านิยม", description: "Vision, Mission & Core Values ขององค์กร", icon: "flag", url: "#", tag: "เอกสาร" },
          { title: "Strategy Map 2569–2573", description: "แผนที่กลยุทธ์ระยะ 5 ปี", icon: "map", url: "#", tag: "PDF" },
          { title: "OKR องค์กร ปี 2569", description: "เป้าหมายและผลลัพธ์หลักระดับองค์กร", icon: "target", url: "#", tag: "Dashboard" },
          { title: "Balanced Scorecard", description: "ตัวชี้วัดเชิงกลยุทธ์ 4 มิติ", icon: "pie-chart", url: "#" }
        ]
      },
      {
        id: "transformation",
        title: "Transformation Roadmap",
        subtitle: "แผนการเปลี่ยนแปลงองค์กร",
        description: "จาก Industrial สู่ Platform และ Ecosystem Capitalism เพื่อก้าวสู่ Agentic AI Organization",
        icon: "trending-up",
        keywords: ["transform", "roadmap", "agentic"],
        links: [
          { title: "ภาพรวม Transformation Roadmap", description: "เป้าหมาย ระยะเวลา และตัวชี้วัดของแต่ละระยะ", icon: "map", url: "#", tag: "ใหม่" },
          { title: "Transformation Office (TMO)", description: "ทีมงาน ธรรมาภิบาล และการติดตามโครงการ", icon: "users", url: "#" }
        ],
        children: [
          {
            id: "industrial",
            title: "ระยะที่ 1 · Industrial Capitalism",
            subtitle: "Operational Excellence",
            icon: "building",
            color: "orange",
            links: [
              { title: "Process Excellence & Lean", description: "ยกระดับกระบวนการทำงานหลัก", icon: "workflow", url: "#" },
              { title: "มาตรฐานการทำงาน (SOP)", description: "ขั้นตอนมาตรฐานของแต่ละหน่วยงาน", icon: "clipboard", url: "#" },
              { title: "Cost Efficiency Program", description: "โครงการเพิ่มประสิทธิภาพต้นทุน", icon: "wallet", url: "#" }
            ]
          },
          {
            id: "platform",
            title: "ระยะที่ 2 · Platform Capitalism",
            subtitle: "Digital Platform",
            icon: "layers",
            color: "green",
            links: [
              { title: "Digital Platform Blueprint", description: "สถาปัตยกรรมแพลตฟอร์มดิจิทัลขององค์กร", icon: "layers", url: "#" },
              { title: "Data Integration", description: "เชื่อมโยงข้อมูลข้ามหน่วยงาน", icon: "database", url: "#" },
              { title: "Shared Service Platform", description: "บริการกลางที่ทุกหน่วยงานใช้ร่วมกัน", icon: "share", url: "#" }
            ]
          },
          {
            id: "ecosystem",
            title: "ระยะที่ 3 · Ecosystem Capitalism",
            subtitle: "Value Co-creation",
            icon: "globe",
            color: "blue",
            links: [
              { title: "Partner Ecosystem Map", description: "พันธมิตรและเครือข่ายธุรกิจ", icon: "share", url: "#" },
              { title: "Co-creation Lab", description: "พื้นที่สร้างนวัตกรรมร่วมกับลูกค้าและพันธมิตร", icon: "lightbulb", url: "#" },
              { title: "Open Innovation Program", description: "เปิดรับไอเดียและความร่วมมือจากภายนอก", icon: "sparkles", url: "#" }
            ]
          }
        ]
      },
      {
        id: "planning",
        title: "แผนธุรกิจและงบประมาณ",
        subtitle: "Business Planning",
        icon: "bar-chart",
        links: [
          { title: "แผนธุรกิจประจำปี 2569", description: "Annual Business Plan", icon: "file-text", url: "#", tag: "PDF" },
          { title: "Budget Planning Template", description: "แบบฟอร์มจัดทำงบประมาณ", icon: "clipboard", url: "#", tag: "Excel" },
          { title: "Strategic Review Meeting", description: "กำหนดการและเอกสารประชุมทบทวนกลยุทธ์", icon: "calendar", url: "#" }
        ]
      }
    ]
  },

  /* ───────────────────────────── 2. ทรัพยากรบุคคล ───────────────────────────── */
  {
    id: "people",
    title: "ทรัพยากรบุคคล",
    subtitle: "People & HR",
    description: "สรรหา พัฒนา ดูแล และสร้างการเติบโตให้คนในองค์กร",
    icon: "users",
    color: "green",
    keywords: ["hr", "human resources", "บุคคล", "พนักงาน"],
    children: [
      {
        id: "talent-acquisition",
        title: "สรรหาและคัดเลือก",
        subtitle: "Talent Acquisition",
        icon: "user-plus",
        links: [
          { title: "ขออนุมัติอัตรากำลัง", description: "Manpower Request", icon: "clipboard", url: "#", tag: "ฟอร์ม" },
          { title: "ตำแหน่งงานที่เปิดรับ", description: "Job Openings ภายในและภายนอก", icon: "briefcase", url: "#" },
          { title: "Interview Guide & Scorecard", description: "แนวทางสัมภาษณ์และแบบประเมินผู้สมัคร", icon: "clipboard-check", url: "#" },
          { title: "แนะนำเพื่อนร่วมงาน", description: "Employee Referral Program", icon: "user-check", url: "#" }
        ]
      },
      {
        id: "learning",
        title: "พัฒนาบุคลากร",
        subtitle: "Learning & Development",
        icon: "graduation-cap",
        links: [
          { title: "ปฏิทินการอบรม 2569", description: "หลักสูตรอบรมตลอดทั้งปี", icon: "calendar", url: "#" },
          { title: "E-Learning", description: "เรียนออนไลน์ได้ทุกที่ทุกเวลา", icon: "monitor", url: "#" },
          { title: "แผนพัฒนารายบุคคล (IDP)", description: "Individual Development Plan", icon: "trending-up", url: "#", tag: "ฟอร์ม" },
          { title: "Competency Framework", description: "สมรรถนะหลักและสมรรถนะตามสายงาน", icon: "layers", url: "#" }
        ],
        children: [
          {
            id: "leadership",
            title: "Leadership Development",
            subtitle: "พัฒนาผู้นำ",
            icon: "award",
            links: [
              { title: "Leadership Pipeline", description: "เส้นทางการเติบโตของผู้นำแต่ละระดับ", icon: "trending-up", url: "#" },
              { title: "Coaching & Mentoring", description: "โปรแกรมพี่เลี้ยงและโค้ช", icon: "message", url: "#" }
            ]
          },
          {
            id: "future-skills",
            title: "Future Skills & AI Literacy",
            subtitle: "ทักษะแห่งอนาคต",
            icon: "sparkles",
            links: [
              { title: "AI Literacy Bootcamp", description: "ปูพื้นฐานการใช้ AI ในการทำงาน", icon: "bot", url: "#", tag: "ใหม่" },
              { title: "Digital Skill Assessment", description: "ประเมินทักษะดิจิทัลของตนเอง", icon: "clipboard-check", url: "#" }
            ]
          }
        ]
      },
      {
        id: "performance",
        title: "บริหารผลงาน",
        subtitle: "Performance Management",
        icon: "clipboard-check",
        links: [
          { title: "KPI / OKR รายบุคคล", description: "ตั้งเป้าหมายและติดตามผลงาน", icon: "target", url: "#" },
          { title: "แบบประเมินผลงาน", description: "Performance Review Form", icon: "clipboard", url: "#", tag: "ฟอร์ม" },
          { title: "Calibration Guideline", description: "แนวทางปรับเทียบผลการประเมิน", icon: "sliders", url: "#" }
        ]
      },
      {
        id: "total-rewards",
        title: "ค่าตอบแทนและสวัสดิการ",
        subtitle: "Total Rewards",
        icon: "gift",
        links: [
          { title: "สวัสดิการพนักงาน", description: "สิทธิประโยชน์และการเบิกจ่าย", icon: "heart", url: "#" },
          { title: "โครงสร้างเงินเดือน", description: "เฉพาะผู้ได้รับสิทธิ์", icon: "lock", url: "#", tag: "จำกัดสิทธิ์" },
          { title: "เบิกค่ารักษาพยาบาล", description: "ยื่นเบิกออนไลน์", icon: "wallet", url: "#", tag: "ฟอร์ม" }
        ]
      },
      {
        id: "culture",
        title: "วัฒนธรรมและความผูกพัน",
        subtitle: "Culture & Engagement",
        icon: "heart",
        links: [
          { title: "Engagement Survey", description: "แบบสำรวจความผูกพันของพนักงาน", icon: "pie-chart", url: "#" },
          { title: "Core Values in Action", description: "เรื่องเล่าค่านิยมองค์กร", icon: "star", url: "#" },
          { title: "Recognition Program", description: "ชื่นชมและให้รางวัลเพื่อนร่วมงาน", icon: "award", url: "#" }
        ]
      }
    ]
  },

  /* ───────────────────────────── 3. Agentic AI Hub ───────────────────────────── */
  {
    id: "ai-hub",
    title: "Agentic AI Hub",
    subtitle: "ศูนย์กลาง AI ขององค์กร",
    description: "AI Agents เครื่องมือ องค์ความรู้ และแนวทางการใช้ AI อย่างรับผิดชอบ",
    icon: "sparkles",
    color: "blue",
    keywords: ["ai", "agent", "genai", "ปัญญาประดิษฐ์"],
    children: [
      {
        id: "agents",
        title: "AI Agents พร้อมใช้งาน",
        subtitle: "Agent Catalog",
        icon: "bot",
        links: [
          { title: "HR Assistant Agent", description: "ตอบคำถามสวัสดิการ การลา และระเบียบ HR", icon: "bot", url: "#", tag: "ใหม่" },
          { title: "Policy Q&A Agent", description: "ค้นหาและสรุปนโยบายองค์กร", icon: "shield", url: "#" },
          { title: "Meeting Summary Agent", description: "สรุปการประชุมและติดตาม Action Items", icon: "message", url: "#" },
          { title: "Data Analyst Agent", description: "วิเคราะห์ข้อมูลและสร้างรายงานอัตโนมัติ", icon: "bar-chart", url: "#" }
        ]
      },
      {
        id: "use-cases",
        title: "คลัง Use Case",
        subtitle: "Use Case Library",
        icon: "lightbulb",
        links: [
          { title: "เสนอ Use Case ใหม่", description: "ส่งไอเดียการนำ AI มาใช้ในงานของคุณ", icon: "lightbulb", url: "#", tag: "ฟอร์ม" },
          { title: "Use Case ที่นำไปใช้แล้ว", description: "ตัวอย่างความสำเร็จจากหน่วยงานต่าง ๆ", icon: "clipboard-check", url: "#" },
          { title: "AI Value Tracker", description: "ติดตามผลลัพธ์และความคุ้มค่า", icon: "trending-up", url: "#", tag: "Dashboard" }
        ]
      },
      {
        id: "governance",
        title: "ธรรมาภิบาล AI",
        subtitle: "AI Governance",
        icon: "shield",
        links: [
          { title: "นโยบายการใช้ AI", description: "AI Usage Policy", icon: "file-text", url: "#", tag: "PDF" },
          { title: "AI Risk Assessment", description: "ประเมินความเสี่ยงก่อนใช้งาน AI", icon: "clipboard-check", url: "#", tag: "ฟอร์ม" },
          { title: "PDPA & Data Privacy", description: "การคุ้มครองข้อมูลส่วนบุคคลกับ AI", icon: "lock", url: "#" }
        ]
      },
      {
        id: "academy",
        title: "AI Academy",
        subtitle: "เรียนรู้และฝึกปฏิบัติ",
        icon: "graduation-cap",
        links: [
          { title: "Prompt Engineering 101", description: "เขียนคำสั่งให้ AI ทำงานได้ตรงใจ", icon: "play-circle", url: "#", tag: "วิดีโอ" },
          { title: "Agent Builder Workshop", description: "ลงมือสร้าง AI Agent สำหรับงานของคุณ", icon: "wrench", url: "#" },
          { title: "Transformation Roadmap", description: "ดูเส้นทางสู่ Agentic AI Organization", icon: "trending-up", url: "#/strategy/transformation" }
        ]
      }
    ]
  },

  /* ───────────────────────────── 4. ข้อมูลและรายงาน ───────────────────────────── */
  {
    id: "insights",
    title: "ข้อมูลและรายงาน",
    subtitle: "Data & Insights",
    description: "Dashboard ผู้บริหาร ข้อมูลบุคลากร และแพลตฟอร์มข้อมูลองค์กร",
    icon: "bar-chart",
    color: "orange",
    keywords: ["dashboard", "report", "data", "รายงาน"],
    children: [
      {
        id: "executive",
        title: "Executive Dashboard",
        subtitle: "สำหรับผู้บริหาร",
        icon: "monitor",
        links: [
          { title: "ผลการดำเนินงานองค์กร", description: "Company Performance Overview", icon: "trending-up", url: "#", tag: "Dashboard" },
          { title: "Strategic KPI Tracking", description: "ติดตามตัวชี้วัดเชิงกลยุทธ์", icon: "target", url: "#", tag: "Dashboard" }
        ]
      },
      {
        id: "people-analytics",
        title: "People Analytics",
        subtitle: "ข้อมูลบุคลากร",
        icon: "pie-chart",
        links: [
          { title: "Headcount & Turnover", description: "อัตรากำลังและอัตราการลาออก", icon: "users", url: "#", tag: "Dashboard" },
          { title: "Workforce Planning", description: "วางแผนกำลังคนล่วงหน้า", icon: "calendar", url: "#" }
        ]
      },
      {
        id: "data-platform",
        title: "Data Platform",
        subtitle: "แพลตฟอร์มข้อมูล",
        icon: "database",
        links: [
          { title: "Data Catalog", description: "รายการชุดข้อมูลขององค์กร", icon: "book-open", url: "#" },
          { title: "ขอสิทธิ์เข้าถึงข้อมูล", description: "Data Access Request", icon: "lock", url: "#", tag: "ฟอร์ม" }
        ]
      }
    ]
  },

  /* ───────────────────────────── 5. คลังความรู้ ───────────────────────────── */
  {
    id: "knowledge",
    title: "คลังความรู้และเอกสาร",
    subtitle: "Knowledge Center",
    description: "นโยบาย ระเบียบ คู่มือ และแบบฟอร์มที่ใช้บ่อย",
    icon: "book-open",
    color: "green",
    keywords: ["policy", "manual", "template", "เอกสาร", "คู่มือ"],
    children: [
      {
        id: "policies",
        title: "นโยบายและระเบียบ",
        subtitle: "Policies & Regulations",
        icon: "shield",
        links: [
          { title: "ข้อบังคับเกี่ยวกับการทำงาน", description: "ระเบียบข้อบังคับของบริษัท", icon: "file-text", url: "#", tag: "PDF" },
          { title: "จรรยาบรรณ (Code of Conduct)", description: "หลักปฏิบัติของพนักงาน", icon: "award", url: "#", tag: "PDF" },
          { title: "นโยบายความปลอดภัยสารสนเทศ", description: "Information Security Policy", icon: "lock", url: "#" }
        ]
      },
      {
        id: "templates",
        title: "แบบฟอร์มและเทมเพลต",
        subtitle: "Forms & Templates",
        icon: "clipboard",
        links: [
          { title: "Presentation Template", description: "เทมเพลตนำเสนอขององค์กร", icon: "presentation", url: "#", tag: "PPT" },
          { title: "Project Charter Template", description: "เอกสารตั้งต้นโครงการ", icon: "file-text", url: "#" },
          { title: "แบบฟอร์ม HR ทั้งหมด", description: "รวมแบบฟอร์มด้านบุคคล", icon: "folder", url: "#" }
        ]
      },
      {
        id: "manuals",
        title: "คู่มือการทำงาน",
        subtitle: "Manuals & SOP",
        icon: "book-open",
        links: [
          { title: "คู่มือพนักงานใหม่", description: "Onboarding Handbook", icon: "book-open", url: "#" },
          { title: "SOP กลางขององค์กร", description: "ขั้นตอนการทำงานมาตรฐาน", icon: "workflow", url: "#" }
        ]
      }
    ]
  },

  /* ───────────────────────────── 6. ระบบงานภายใน (ตัวอย่างหมวดที่มีแต่ลิงก์) ───────────────────────────── */
  {
    id: "systems",
    title: "ระบบงานภายใน",
    subtitle: "Internal Systems",
    description: "เข้าสู่ระบบงานที่ใช้ประจำวันได้ในคลิกเดียว",
    icon: "layout-grid",
    color: "blue",
    keywords: ["system", "it", "ระบบ"],
    links: [
      { title: "ERP", description: "ระบบบริหารทรัพยากรองค์กร", icon: "database", url: "#" },
      { title: "HR Self-Service", description: "ลางาน ดูสลิปเงินเดือน แก้ไขข้อมูลส่วนตัว", icon: "user", url: "#" },
      { title: "อีเมลองค์กร", description: "Outlook / Microsoft 365", icon: "mail", url: "#" },
      { title: "Microsoft Teams", description: "แชท ประชุม และทำงานร่วมกัน", icon: "video", url: "#" },
      { title: "จองห้องประชุม", description: "Meeting Room Booking", icon: "calendar", url: "#" },
      { title: "IT Helpdesk", description: "แจ้งปัญหาการใช้งานระบบ", icon: "headphones", url: "#" },
      { title: "เว็บไซต์ Precise", description: "www.precise.co.th", icon: "globe", url: "https://www.precise.co.th" }
    ]
  },

  /* ───────────────────────────── 7. ข่าวสารและกิจกรรม ───────────────────────────── */
  {
    id: "news",
    title: "ข่าวสารและกิจกรรม",
    subtitle: "News & Events",
    description: "ประกาศ ข่าวสาร และกิจกรรมขององค์กร",
    icon: "megaphone",
    color: "orange",
    keywords: ["news", "event", "ข่าว", "ประกาศ"],
    children: [
      {
        id: "announcements",
        title: "ประกาศองค์กร",
        subtitle: "Announcements",
        icon: "megaphone",
        links: [
          { title: "ประกาศล่าสุด", description: "ข่าวสารและคำสั่งจากองค์กร", icon: "newspaper", url: "#", tag: "ใหม่" },
          { title: "CEO Message", description: "สารจากผู้บริหาร", icon: "message", url: "#", tag: "วิดีโอ" }
        ]
      },
      {
        id: "events",
        title: "กิจกรรม",
        subtitle: "Events",
        icon: "calendar",
        links: [
          { title: "ปฏิทินกิจกรรมองค์กร", description: "กิจกรรมตลอดทั้งปี", icon: "calendar", url: "#" },
          { title: "Town Hall 2569", description: "ย้อนชมการประชุมพนักงาน", icon: "play-circle", url: "#" }
        ]
      }
    ]
  },

  /* ───────────────────────────── 8. ติดต่อและช่วยเหลือ ───────────────────────────── */
  {
    id: "help",
    title: "ติดต่อและช่วยเหลือ",
    subtitle: "Help & Contact",
    description: "ช่องทางติดต่อหน่วยงาน สมุดรายชื่อ และการแจ้งปัญหา",
    icon: "life-buoy",
    color: "green",
    keywords: ["help", "contact", "ติดต่อ"],
    links: [
      { title: "HR Helpdesk", description: "สอบถามเรื่องงานบุคคล", icon: "headphones", url: "#" },
      { title: "สมุดรายชื่อพนักงาน", description: "Employee Directory", icon: "users", url: "#" },
      { title: "แจ้งปัญหา / ข้อเสนอแนะ", description: "ส่งความคิดเห็นถึงผู้ดูแล", icon: "message", url: "#", tag: "ฟอร์ม" },
      { title: "ผังองค์กร", description: "Organization Chart", icon: "workflow", url: "#" }
    ]
  }
];
