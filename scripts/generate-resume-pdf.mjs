import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateResume() {
  const pdfDoc = await PDFDocument.create();
  // Standard A4 page: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let y = height - 42;
  const margin = 48;
  const contentWidth = width - margin * 2;

  // Header: Name
  page.drawText("AASHISH BHUMARKAR", {
    x: margin,
    y: y,
    size: 20,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.15)
  });

  y -= 16;
  page.drawText("Full-Stack Developer | 3rd-Year B.Tech Information Technology (CGPA: 8.21 / 10)", {
    x: margin,
    y: y,
    size: 10,
    font: fontBold,
    color: rgb(0.85, 0.4, 0.1) // Amber/Orange accent
  });

  y -= 14;
  page.drawText(
    "Bhopal, MP, India  |  +91 9617385985  |  aashishbhumarkar888@gmail.com",
    {
      x: margin,
      y: y,
      size: 9,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.35)
    }
  );

  y -= 13;
  page.drawText(
    "GitHub: github.com/aashishbhumarkar888-bit   |   LinkedIn: linkedin.com/in/aashish-bhumarkar",
    {
      x: margin,
      y: y,
      size: 9,
      font: fontRegular,
      color: rgb(0.2, 0.4, 0.7)
    }
  );

  // Section divider line
  y -= 10;
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: width - margin, y: y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.88)
  });

  const drawSectionHeader = (title) => {
    y -= 18;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y: y,
      size: 11,
      font: fontBold,
      color: rgb(0.12, 0.12, 0.18)
    });
    y -= 5;
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: width - margin, y: y },
      thickness: 0.75,
      color: rgb(0.9, 0.5, 0.2)
    });
    y -= 10;
  };

  // 1. EDUCATION
  drawSectionHeader("Education");
  page.drawText("Bansal Institute of Science and Technology, Bhopal (MP)", {
    x: margin,
    y: y,
    size: 9.5,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });
  page.drawText("2024 – 2028 (3rd Year)", {
    x: width - margin - 100,
    y: y,
    size: 9,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3)
  });
  y -= 12;
  page.drawText("Bachelor of Technology in Information Technology — CGPA: 8.21 / 10.0", {
    x: margin,
    y: y,
    size: 9,
    font: fontOblique,
    color: rgb(0.25, 0.25, 0.25)
  });
  y -= 12;
  page.drawText("Sri Aurobindo School, Bhopal — Class XII (CBSE, 2024): 89.8%  |  Class X (CBSE, 2022): 84.4%", {
    x: margin,
    y: y,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.35, 0.35, 0.35)
  });

  // 2. TECHNICAL SKILLS
  drawSectionHeader("Technical Skills");
  const skillsList = [
    { label: "Core Stack:", val: "React.js (React 19), TypeScript, Node.js, Express.js, Tailwind CSS, Firebase Firestore, PostgreSQL, C++, Git" },
    { label: "Languages:", val: "C++ (DSA & Object-Oriented Programming), JavaScript (ES6+), TypeScript, SQL" },
    { label: "Frontend & UI:", val: "React.js, Tailwind CSS, Component Architecture, Vite, HTML5, CSS3, Responsive Design" },
    { label: "Backend & DB:", val: "Node.js, Express REST APIs, Firebase Firestore (Realtime Sync), PostgreSQL, Relational Schema Normalization" },
    { label: "Developer Tools:", val: "Git, GitHub (Branching & PRs), npm, Vite, Postman, Linux CLI, Railway, Vercel" }
  ];
  for (const s of skillsList) {
    page.drawText(s.label, { x: margin, y: y, size: 8.5, font: fontBold, color: rgb(0.15, 0.15, 0.2) });
    page.drawText(s.val, { x: margin + 75, y: y, size: 8.5, font: fontRegular, color: rgb(0.25, 0.25, 0.3) });
    y -= 11.5;
  }

  // 3. COMPETITIVE PROBLEM SOLVING
  drawSectionHeader("Problem Solving & Competitive Profiles");
  page.drawText("• CodeChef: 150+ Problems Solved  |  Division 3 Contests  (codechef.com/users/aashish_9617)", {
    x: margin, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  y -= 11.5;
  page.drawText("• LeetCode: 100+ Problems Solved in C++  |  Arrays, Two Pointers, Hashing, Trees  (leetcode.com/u/Aashish-11/)", {
    x: margin, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  y -= 11.5;
  page.drawText("• GeeksforGeeks: 70+ Problems Solved  |  Campus Activity & Core DSA  (geeksforgeeks.org/profile/aashishbhueb6p)", {
    x: margin, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  y -= 11.5;
  page.drawText("• HackerRank: 40+ Problems Solved  |  C++ & Problem Solving Badges  (hackerrank.com/profile/aashishbhumarkar1)", {
    x: margin, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });

  // 4. FEATURED PROJECTS
  drawSectionHeader("Featured Projects");
  
  // Project 1: SPO
  page.drawText("SPO — Direct Farmer Trade Platform", { x: margin, y: y, size: 9.5, font: fontBold, color: rgb(0.1, 0.1, 0.15) });
  page.drawText("Live: spo-snowy.vercel.app  |  React 19, TypeScript, Node.js, Express, Tailwind CSS", {
    x: width - margin - 260, y: y, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.4)
  });
  y -= 11;
  page.drawText("• Web platform connecting smallholder farmers directly with local buyers at benchmarked mandi rates.", {
    x: margin + 8, y: y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25)
  });
  y -= 10.5;
  page.drawText("• Eliminates price opacity by calculating net trade estimates and generating digital receipts on the spot.", {
    x: margin + 8, y: y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25)
  });
  y -= 13;

  // Project 2: VoltPath AI
  page.drawText("VoltPath AI — EV Station Locator Prototype", { x: margin, y: y, size: 9.5, font: fontBold, color: rgb(0.1, 0.1, 0.15) });
  page.drawText("Live: voltpath-ai.base44.app  |  React, Node.js, Firebase Firestore, Tailwind CSS", {
    x: width - margin - 260, y: y, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.4)
  });
  y -= 11;
  page.drawText("• Reduced simulated queue wait times by 45% via predictive slot booking heuristics.", {
    x: margin + 8, y: y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25)
  });
  y -= 10.5;
  page.drawText("• Implemented real-time Firestore synchronization listeners across 50+ mock station nodes.", {
    x: margin + 8, y: y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25)
  });
  y -= 13;

  // Project 3: Secure-Fill
  page.drawText("Secure-Fill — Form Sanitization Microservice", { x: margin, y: y, size: 9.5, font: fontBold, color: rgb(0.1, 0.1, 0.15) });
  page.drawText("Live: secure-fill-production.up.railway.app  |  TypeScript, Node.js, Express, Railway", {
    x: width - margin - 260, y: y, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.4)
  });
  y -= 11;
  page.drawText("• Client-side form sanitization and anti-injection validation service deployed on Railway using SHA-256 integrity checksums.", {
    x: margin + 8, y: y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25)
  });

  // 5. HONORS & HACKATHONS
  drawSectionHeader("Honors & Hackathons");
  const awards = [
    { title: "Runner-Up (2nd Place) — BGI Collegiate Hackathon:", detail: "Built and deployed a full-stack MVP in a 36-hour sprint at Bansal Group of Institutes." },
    { title: "Global Nominee — NASA Space Apps Challenge:", detail: "Selected as Global Nominee at the Bhopal local event for space telemetry data visualization." },
    { title: "3rd Position Award — Azure Developer Day:", detail: "Workshop and coding sprint organized by Microsoft Learn Student Ambassadors at BIST Bhopal." },
    { title: "Peer Technical Mentorship:", detail: "Assisted 100+ junior students with Git, GitHub, and full-stack web development fundamentals." }
  ];
  for (const a of awards) {
    page.drawText(a.title, { x: margin, y: y, size: 8.5, font: fontBold, color: rgb(0.1, 0.1, 0.15) });
    page.drawText(a.detail, { x: margin + 195, y: y, size: 8.5, font: fontRegular, color: rgb(0.25, 0.25, 0.3) });
    y -= 12;
  }

  // 6. CERTIFICATIONS & VERIFICATION
  drawSectionHeader("Certifications & Verifications");
  page.drawText("• Oracle Cloud Infrastructure 2024 Foundations Associate (Oracle University)", {
    x: margin, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  page.drawText("• IBM Introduction to Cloud Computing (IBM MDL-301)", {
    x: margin + 280, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  y -= 11.5;
  page.drawText("• C++ Essentials 1 (Cisco Networking Academy & OpenEDG)", {
    x: margin, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  page.drawText("• TCS iON Career Edge — Young Professional (TCS)", {
    x: margin + 280, y: y, size: 8.5, font: fontRegular, color: rgb(0.15, 0.15, 0.2)
  });
  y -= 13;
  page.drawText("Verified Scans Vault: https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM", {
    x: margin, y: y, size: 8, font: fontOblique, color: rgb(0.2, 0.4, 0.7)
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), "public", "Aashish_Bhumarkar_Resume.pdf");
  fs.writeFileSync(outputPath, pdfBytes);
  console.log("PDF generated successfully at:", outputPath);
}

generateResume().catch(err => {
  console.error("Failed to generate resume PDF:", err);
  process.exit(1);
});
