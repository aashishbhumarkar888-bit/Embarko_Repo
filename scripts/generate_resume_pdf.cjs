const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createResume() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 dimensions
  
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helv = await doc.embedFont(StandardFonts.Helvetica);

  // Palette
  const darkNavy = rgb(0.12, 0.18, 0.32); // #1f2e52
  const textBlack = rgb(0.1, 0.1, 0.12);
  const mutedGray = rgb(0.35, 0.38, 0.42);
  const lineGray = rgb(0.2, 0.25, 0.35);
  const linkBlue = rgb(0.08, 0.28, 0.62);

  const leftMargin = 38;
  const contentWidth = 595.28 - (leftMargin * 2); // 519.28
  let currentY = 810;

  // Helper for drawing horizontal rule under section headers
  function drawSectionHeader(title) {
    currentY -= 13;
    page.drawText(title, {
      x: leftMargin,
      y: currentY,
      size: 11.5,
      font: timesBold,
      color: darkNavy,
    });
    currentY -= 4;
    page.drawLine({
      start: { x: leftMargin, y: currentY },
      end: { x: leftMargin + contentWidth, y: currentY },
      thickness: 0.8,
      color: lineGray,
    });
    currentY -= 8;
  }

  // 1. Header (Centered)
  const nameText = "AASHISH BHUMARKAR";
  const nameWidth = timesBold.widthOfTextAtSize(nameText, 20);
  page.drawText(nameText, {
    x: (595.28 - nameWidth) / 2,
    y: currentY,
    size: 20,
    font: timesBold,
    color: darkNavy,
  });

  currentY -= 14;
  const titleText = "SOFTWARE ENGINEER STUDENT";
  const titleWidth = helvBold.widthOfTextAtSize(titleText, 9.5);
  page.drawText(titleText, {
    x: (595.28 - titleWidth) / 2,
    y: currentY,
    size: 9.5,
    font: helvBold,
    color: rgb(0.25, 0.3, 0.4),
  });

  currentY -= 12;
  const contactText = "Email : aashishbhumarkar888@gmail.com  |  +91-9617385985  |  LINKEDIN: Aashish Bhumarkar  |  GITHUB: aashishbhumarkar888-bit";
  const contactWidth = helv.widthOfTextAtSize(contactText, 7.8);
  page.drawText(contactText, {
    x: (595.28 - contactWidth) / 2,
    y: currentY,
    size: 7.8,
    font: helv,
    color: textBlack,
  });

  // 2. Career Objective
  drawSectionHeader("Career Objective");
  const objText1 = "IT engineering student with hands-on experience in C++, full-stack web development, AI-powered applications, and";
  const objText2 = "hackathon projects. Seeking a software development internship to apply problem-solving skills, build reliable";
  const objText3 = "applications, and contribute to practical engineering challenges.";
  
  [objText1, objText2, objText3].forEach(line => {
    page.drawText(line, { x: leftMargin, y: currentY, size: 8.8, font: timesRoman, color: textBlack });
    currentY -= 10.5;
  });

  // 3. Education
  drawSectionHeader("Education");
  page.drawText("Bansal Institute of Science & Technology Bhopal (Madhya Pradesh), India", {
    x: leftMargin,
    y: currentY,
    size: 9,
    font: timesBold,
    color: textBlack,
  });
  page.drawText("2024 - 2028  •  Branch-IT  |  CGPA: 8.21 till 4th Semester.", {
    x: leftMargin + 295,
    y: currentY,
    size: 8.8,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 11.5;

  page.drawText("Sri Aurobindo School, Bhopal, India", {
    x: leftMargin,
    y: currentY,
    size: 8.8,
    font: timesBold,
    color: textBlack,
  });
  page.drawText("2023 - 2024 (Class XII): 89.8%", {
    x: leftMargin + 295,
    y: currentY,
    size: 8.8,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 11.5;

  page.drawText("Sri Aurobindo School, Bhopal, India", {
    x: leftMargin,
    y: currentY,
    size: 8.8,
    font: timesBold,
    color: textBlack,
  });
  page.drawText("2021 - 2022 (Class X): 84.4%", {
    x: leftMargin + 295,
    y: currentY,
    size: 8.8,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 8;

  // 4. Skills
  drawSectionHeader("Skills");
  const skillsList = [
    { label: "Programming Languages", val: ": C, C++, Python, Java." },
    { label: "Web Development", val: ": Node.js, HTML, CSS, JavaScript, React.js." },
    { label: "Databases", val: ": MongoDB, SQL, Firebase." },
    { label: "Core Concepts", val: ": DSA, DBMS, OOP." },
    { label: "Developer Tools", val: ": Git, GitHub, Postman, Vite." },
  ];

  skillsList.forEach(s => {
    page.drawText(s.label, { x: leftMargin + 20, y: currentY, size: 8.6, font: timesBold, color: textBlack });
    page.drawText(s.val, { x: leftMargin + 160, y: currentY, size: 8.6, font: timesRoman, color: textBlack });
    currentY -= 10.5;
  });
  currentY -= 3;

  // 5. Projects
  drawSectionHeader("Projects");
  
  // Project 1: Voltpath AI
  page.drawText("Voltpath AI", { x: leftMargin, y: currentY, size: 9.2, font: timesBold, color: darkNavy });
  const p1Meta = " | React.js, Node.js, Firebase, Base44 | Live Demo";
  page.drawText(p1Meta, { x: leftMargin + 56, y: currentY, size: 8.6, font: timesItalic, color: rgb(0.2, 0.2, 0.2) });
  currentY -= 10.5;

  page.drawText("• Developed a full-stack EV charging platform using React.js, Node.js, Firebase, and REST APIs with AI-assisted station", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("  recommendations and real-time slot booking.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Integrated Firebase for robust authentication, secure user management, and seamless real-time data synchronization.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Link: https://github.com/aashishbhumarkar888-bit/Voltpath-ai  |  Demo: https://voltpath-ai.base44.app/", {
    x: leftMargin + 8,
    y: currentY,
    size: 7.8,
    font: helv,
    color: linkBlue,
  });
  currentY -= 11.5;

  // Project 2: Secure Fill
  page.drawText("Secure Fill", { x: leftMargin, y: currentY, size: 9.2, font: timesBold, color: darkNavy });
  const p2Meta = " | Node.js, Express.js, MongoDB, React.js | Prototype";
  page.drawText(p2Meta, { x: leftMargin + 52, y: currentY, size: 8.6, font: timesItalic, color: rgb(0.2, 0.2, 0.2) });
  currentY -= 10.5;

  page.drawText("• Developed an automated form filling tool using React.js, Node.js, Express.js, and MongoDB to streamline secure data input.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Implemented full-stack architecture with secure data validation and payload hashing for faster, reliable submissions.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Link: https://github.com/aashishbhumarkar888-bit/Secure-fill  |  Demo: https://secure-fill-production.up.railway.app/", {
    x: leftMargin + 8,
    y: currentY,
    size: 7.8,
    font: helv,
    color: linkBlue,
  });
  currentY -= 11.5;

  // Project 3: SPO / Grave Ambition Vault
  page.drawText("SPO — Smart Farmer Trade Platform", { x: leftMargin, y: currentY, size: 9.2, font: timesBold, color: darkNavy });
  const p3Meta = " | Next.js, Tailwind CSS, Vercel | Live Demo";
  page.drawText(p3Meta, { x: leftMargin + 168, y: currentY, size: 8.6, font: timesItalic, color: rgb(0.2, 0.2, 0.2) });
  currentY -= 10.5;

  page.drawText("• Developed a web application enabling farmers to directly trade produce with local buyers at benchmarked mandi prices.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Built dynamic rate calculator, instant digital trade receipts, and responsive UI deployed on Vercel.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Link: https://github.com/aashishbhumarkar888-bit/SPO  |  Demo: https://spo-snowy.vercel.app/", {
    x: leftMargin + 8,
    y: currentY,
    size: 7.8,
    font: helv,
    color: linkBlue,
  });
  currentY -= 10;

  // 6. Internships
  drawSectionHeader("Internships");
  page.drawText("CodeAlpha", { x: leftMargin, y: currentY, size: 9.2, font: timesBold, color: darkNavy });
  page.drawText(" | Software Development Intern", { x: leftMargin + 50, y: currentY, size: 8.8, font: timesItalic, color: textBlack });
  currentY -= 10.5;

  page.drawText("• Developed C++ applications including Bank Management System and Student Management System using object-oriented", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("  programming, file handling, and modular software design.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Built responsive frontend components using HTML, CSS, JavaScript, and React.js while collaborating on web development projects.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 9.5;
  page.drawText("• Improved debugging, code optimization, and software engineering practices through project-based development.", {
    x: leftMargin + 8,
    y: currentY,
    size: 8.4,
    font: timesRoman,
    color: textBlack,
  });
  currentY -= 10;

  // 7. Certifications
  drawSectionHeader("Certifications");
  const certs = [
    "• NPTEL – Fundamentals of Object Oriented Programming (IIT Roorkee)",
    "• Oracle Cloud Infrastructure 2024 Foundations Associate & AI Foundation Associate – Oracle",
    "• AWS Academy Cloud Foundations – AWS Academy",
    "• C++ Essentials 1 – Cisco Networking Academy & OpenEDG C++ Institute"
  ];
  certs.forEach(c => {
    page.drawText(c, { x: leftMargin + 8, y: currentY, size: 8.4, font: timesRoman, color: textBlack });
    currentY -= 9.8;
  });
  currentY -= 2;

  // 8. Positions of Responsibility / Additional information
  drawSectionHeader("Positions of Responsibility / Additional Information");
  const posText1 = "• Runner-up at BGI Collegiate Hackathon, Global Nominee in NASA Space Apps Challenge (Bhopal local event),";
  const posText2 = "  3rd Place in Azure Developer Day Hackathon Sprint, and served as Google Student Ambassador promoting developer programs.";
  const posText3 = "• Competitive Programming: CodeChef (150+ Solved), LeetCode (100+ Solved, C++), GeeksforGeeks (70+ Solved), HackerRank (40+).";
  
  page.drawText(posText1, { x: leftMargin + 8, y: currentY, size: 8.4, font: timesRoman, color: textBlack });
  currentY -= 9.5;
  page.drawText(posText2, { x: leftMargin + 8, y: currentY, size: 8.4, font: timesRoman, color: textBlack });
  currentY -= 9.5;
  page.drawText(posText3, { x: leftMargin + 8, y: currentY, size: 8.4, font: timesBold, color: darkNavy });

  const pdfBytes = await doc.save();
  const outputPath = path.resolve(process.cwd(), 'public', 'Aashish_Bhumarkar_Resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`[SUCCESS] Generated pristine resume PDF at ${outputPath} (${pdfBytes.length} bytes)`);
}

createResume().catch(console.error);
