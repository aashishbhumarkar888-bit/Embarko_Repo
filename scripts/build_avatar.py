import os, zlib, struct

svg_master = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Background Space Gradient -->
    <radialGradient id="bgObsidian" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#070c18" />
      <stop offset="45%" stop-color="#04060c" />
      <stop offset="85%" stop-color="#010204" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Fire / Orange Chakra Left Glow -->
    <radialGradient id="fireAura" cx="30%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ff7b00" stop-opacity="0.9" />
      <stop offset="35%" stop-color="#ff4400" stop-opacity="0.45" />
      <stop offset="70%" stop-color="#ff2200" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Electric Cyan Right Glow -->
    <radialGradient id="cyanAura" cx="70%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.9" />
      <stop offset="35%" stop-color="#0099ff" stop-opacity="0.45" />
      <stop offset="70%" stop-color="#0044ff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Dual Tone Lighting Gradients for Face -->
    <linearGradient id="faceDualTone" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d48a5e" />
      <stop offset="40%" stop-color="#c98155" />
      <stop offset="65%" stop-color="#b6734c" />
      <stop offset="100%" stop-color="#5a7a9c" />
    </linearGradient>

    <!-- Hair Dual Tone Gradient -->
    <linearGradient id="hairDualTone" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3d2a1c" />
      <stop offset="25%" stop-color="#1f1d1c" />
      <stop offset="75%" stop-color="#131924" />
      <stop offset="100%" stop-color="#1c3d5a" />
    </linearGradient>

    <!-- Suit Blazer Dual Tone Gradient -->
    <linearGradient id="suitDualTone" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a1a12" />
      <stop offset="20%" stop-color="#121316" />
      <stop offset="80%" stop-color="#0e141d" />
      <stop offset="100%" stop-color="#102538" />
    </linearGradient>

    <!-- Transparent Clear Glasses Glass Reflection -->
    <linearGradient id="glassesGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
      <stop offset="30%" stop-color="#ff9900" stop-opacity="0.25" />
      <stop offset="70%" stop-color="#00f0ff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.5" />
    </linearGradient>

    <!-- Circular Aperture Clip -->
    <clipPath id="circleAperture">
      <circle cx="500" cy="495" r="320" />
    </clipPath>
  </defs>

  <!-- Deep Obsidian Dark Background -->
  <rect width="1000" height="1000" fill="url(#bgObsidian)" />

  <!-- Subtle Blueprint Hex Grid Lines -->
  <g opacity="0.08" stroke="#00f0ff" stroke-width="0.8">
    <line x1="0" y1="200" x2="1000" y2="200" />
    <line x1="0" y1="400" x2="1000" y2="400" />
    <line x1="0" y1="600" x2="1000" y2="600" />
    <line x1="0" y1="800" x2="1000" y2="800" />
    <line x1="200" y1="0" x2="200" y2="1000" />
    <line x1="400" y1="0" x2="400" y2="1000" />
    <line x1="600" y1="0" x2="600" y2="1000" />
    <line x1="800" y1="0" x2="800" y2="1000" />
  </g>

  <!-- ========================================== -->
  <!-- TOP-LEFT: KONOHA EMBLEM & NARUTO HUD       -->
  <!-- ========================================== -->
  <g transform="translate(60, 50)">
    <!-- Outer Framing Bracket -->
    <path d="M 0 100 L 0 0 L 140 0" fill="none" stroke="#ff7b00" stroke-width="2.5" opacity="0.85" />
    <rect x="-4" y="-4" width="8" height="8" fill="#ff7b00" />
    
    <!-- Konoha Leaf Spiral Crest -->
    <g transform="translate(25, 20) scale(1.8)">
      <path d="M 12 28 C 6 28 0 22 0 14 C 0 6 8 0 18 0 C 30 0 38 8 38 18 C 38 29 28 36 18 36 C 8 36 2 29 2 20 C 2 13 8 8 15 8 C 22 8 26 13 26 18 C 26 23 22 26 18 26 C 15 26 13 23 13 20" 
            fill="none" stroke="#ff7b00" stroke-width="4.5" stroke-linecap="round" />
      <polygon points="34,8 44,6 40,14" fill="#ff7b00" />
    </g>

    <!-- Japanese Katakana: + ナルト - (Naruto) -->
    <g transform="translate(10, 160)" font-family="sans-serif" font-weight="bold" font-size="16" fill="#ff7b00" opacity="0.85" letter-spacing="4">
      <text x="0" y="0">✛</text>
      <text x="0" y="24">ナ</text>
      <text x="0" y="48">ル</text>
      <text x="0" y="72">ト</text>
      <text x="0" y="96">ー</text>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- TOP-RIGHT: AASHISH BHUMARKAR TITLE BANNER  -->
  <!-- ========================================== -->
  <g transform="translate(940, 70)" text-anchor="end">
    <!-- First Name: AASHISH in Glowing Orange -->
    <text x="0" y="32" font-family="'Space Grotesk', system-ui, sans-serif" font-size="44" font-weight="900" fill="#ff7b00" letter-spacing="6">
      AASHISH
    </text>
    <!-- Last Name: BHUMARKAR in Crisp White -->
    <text x="0" y="70" font-family="'Space Grotesk', system-ui, sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="8">
      BHUMARKAR
    </text>
    <!-- Orange & Cyan Underline Bar with Segments -->
    <g transform="translate(0, 88)">
      <line x1="-200" y1="0" x2="-80" y2="0" stroke="#ff7b00" stroke-width="4" stroke-linecap="round" />
      <line x1="-70" y1="0" x2="-55" y2="0" stroke="#00f0ff" stroke-width="3" />
      <line x1="-45" y1="0" x2="-30" y2="0" stroke="#00f0ff" stroke-width="3" />
      <line x1="-20" y1="0" x2="-5" y2="0" stroke="#00f0ff" stroke-width="3" />
    </g>
  </g>

  <!-- ========================================== -->
  <!-- CENTER APERTURE: CIRCULAR CYBERNETIC RINGS -->
  <!-- ========================================== -->
  <circle cx="440" cy="495" r="320" fill="url(#fireAura)" opacity="0.75" />
  <circle cx="560" cy="495" r="320" fill="url(#cyanAura)" opacity="0.75" />

  <!-- Segmented Outer Dual-Tone Mechanical HUD Caliper -->
  <g transform="translate(500, 495)">
    <!-- Left Orange Arc (Chakra fire side) -->
    <path d="M 0 -340 A 340 340 0 0 0 0 340" fill="none" stroke="#ff7b00" stroke-width="8" stroke-linecap="round" />
    <path d="M -120 -325 A 346 346 0 0 0 -325 -120" fill="none" stroke="#ff9900" stroke-width="14" stroke-linecap="round" opacity="0.9" />
    <path d="M -325 120 A 346 346 0 0 0 -120 325" fill="none" stroke="#ff5500" stroke-width="14" stroke-linecap="round" opacity="0.9" />

    <!-- Right Cyan Arc (Quantum electric side) -->
    <path d="M 0 -340 A 340 340 0 0 1 0 340" fill="none" stroke="#00f0ff" stroke-width="8" stroke-linecap="round" />
    <path d="M 120 -325 A 346 346 0 0 1 325 -120" fill="none" stroke="#00d4ff" stroke-width="14" stroke-linecap="round" opacity="0.9" />
    <path d="M 325 120 A 346 346 0 0 1 120 325" fill="none" stroke="#0088ff" stroke-width="14" stroke-linecap="round" opacity="0.9" />

    <!-- Caliper Tick Markers & Mechanical Brackets -->
    <circle cx="0" cy="0" r="332" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="2 12" opacity="0.4" />
    <circle cx="0" cy="0" r="324" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="8 8 24 8" opacity="0.6" />
    
    <!-- Precision Crosshairs -->
    <line x1="0" y1="-355" x2="0" y2="-325" stroke="#00f0ff" stroke-width="3" />
    <line x1="0" y1="325" x2="0" y2="355" stroke="#ff7b00" stroke-width="3" />
    <line x1="-355" y1="0" x2="-325" y2="0" stroke="#ff7b00" stroke-width="3" />
    <line x1="325" y1="0" x2="355" y2="0" stroke="#00f0ff" stroke-width="3" />
  </g>

  <!-- CHARACTER PORTRAIT (AASHISH BHUMARKAR) -->
  <g clip-path="url(#circleAperture)">
    <!-- Dark Inner Chamber Background -->
    <circle cx="500" cy="495" r="320" fill="#040711" />
    <circle cx="500" cy="495" r="280" fill="none" stroke="#00f0ff" stroke-width="1" opacity="0.2" />

    <!-- Shoulders & Tailored Black Suit Blazer -->
    <path d="M 220 860 L 260 680 C 310 610 390 575 425 565 L 500 635 L 575 565 C 610 575 690 610 740 680 L 780 860 Z" 
          fill="url(#suitDualTone)" stroke="#1a2333" stroke-width="2" />

    <!-- Left Blazer Lapel (Orange rim reflection) -->
    <path d="M 360 585 L 435 740 L 500 755 L 440 568 Z" fill="#14161c" stroke="#ff7b00" stroke-width="1.5" />
    <!-- Right Blazer Lapel (Cyan rim reflection) -->
    <path d="M 640 585 L 565 740 L 500 755 L 560 568 Z" fill="#111622" stroke="#00f0ff" stroke-width="1.5" />

    <!-- Crisp White Collared Dress Shirt V-Neck -->
    <polygon points="440,568 500,670 560,568 500,580" fill="#f0f4fa" />
    <polygon points="460,568 500,660 540,568 500,578" fill="#ffffff" />
    <line x1="500" y1="670" x2="500" y2="820" stroke="#cbd5e1" stroke-width="3" />
    <circle cx="500" cy="710" r="3" fill="#94a3b8" />
    <circle cx="500" cy="760" r="3" fill="#94a3b8" />

    <!-- Neck & Throat -->
    <path d="M 450 510 L 450 590 C 475 605 525 605 550 590 L 550 510 Z" fill="url(#faceDualTone)" />
    <path d="M 450 510 C 475 540 525 540 550 510 L 550 530 C 525 560 475 560 450 530 Z" fill="#7a4628" opacity="0.6" />

    <!-- Head & Face -->
    <path d="M 380 370 C 375 470 415 540 500 558 C 585 540 625 470 620 370 C 620 295 580 270 500 270 C 420 270 380 295 380 370 Z" 
          fill="url(#faceDualTone)" />

    <!-- Ears -->
    <ellipse cx="372" cy="405" rx="14" ry="30" fill="#c98155" />
    <ellipse cx="628" cy="405" rx="14" ry="30" fill="#738da8" />

    <!-- Hair (Voluminous textured styled dark hair) -->
    <path d="M 355 370 C 345 270 405 200 500 200 C 595 200 655 270 645 370 C 630 330 610 315 570 305 C 575 290 580 265 550 265 C 525 265 515 295 490 295 C 465 295 450 275 425 295 C 400 315 385 335 375 355 C 365 340 358 355 355 370 Z" 
          fill="url(#hairDualTone)" />
    <!-- Hair Texture Highlights -->
    <path d="M 410 260 Q 450 230 500 240 Q 480 270 450 280 Z" fill="#66432b" opacity="0.8" />
    <path d="M 530 245 Q 575 230 600 270 Q 565 275 550 260 Z" fill="#2d577a" opacity="0.8" />

    <!-- Eyebrows -->
    <path d="M 410 370 Q 450 355 475 368" stroke="#1d1612" stroke-width="7" stroke-linecap="round" fill="none" />
    <path d="M 525 368 Q 550 355 590 370" stroke="#141a24" stroke-width="7" stroke-linecap="round" fill="none" />

    <!-- Eyes -->
    <ellipse cx="445" cy="390" rx="20" ry="10" fill="#ffffff" />
    <ellipse cx="555" cy="390" rx="20" ry="10" fill="#ffffff" />
    <circle cx="447" cy="390" r="9" fill="#261b14" />
    <circle cx="553" cy="390" r="9" fill="#141e26" />
    <circle cx="449" cy="387" r="3" fill="#ff7b00" />
    <circle cx="555" cy="387" r="3" fill="#00f0ff" />
    <circle cx="444" cy="392" r="1.5" fill="#ffffff" />
    <circle cx="551" cy="392" r="1.5" fill="#ffffff" />

    <!-- Nose -->
    <path d="M 500 375 L 495 440 L 508 444" stroke="#8c5030" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />

    <!-- Mustache -->
    <path d="M 470 458 Q 500 464 530 458" stroke="#221b16" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.8" />
    <path d="M 492 485 Q 500 490 508 485" stroke="#221b16" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.6" />

    <!-- Lips -->
    <path d="M 465 470 Q 500 484 535 470" stroke="#873e24" stroke-width="3.8" stroke-linecap="round" fill="none" />
    <path d="M 475 472 Q 500 478 525 472" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" fill="none" />

    <!-- CLEAR TRANSPARENT RECTANGULAR GLASSES -->
    <rect x="405" y="365" width="75" height="48" rx="8" fill="url(#glassesGlass)" stroke="#ffffff" stroke-width="3.5" stroke-opacity="0.8" />
    <rect x="408" y="368" width="69" height="42" rx="6" fill="none" stroke="#ff7b00" stroke-width="1.5" stroke-opacity="0.7" />

    <rect x="520" y="365" width="75" height="48" rx="8" fill="url(#glassesGlass)" stroke="#ffffff" stroke-width="3.5" stroke-opacity="0.8" />
    <rect x="523" y="368" width="69" height="42" rx="6" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.7" />

    <path d="M 480 380 Q 500 374 520 380" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" stroke-opacity="0.85" />
    <line x1="405" y1="380" x2="375" y2="386" stroke="#ffffff" stroke-width="3" stroke-opacity="0.75" />
    <line x1="595" y1="380" x2="625" y2="386" stroke="#ffffff" stroke-width="3" stroke-opacity="0.75" />
  </g>

  <!-- ========================================== -->
  <!-- BOTTOM-LEFT: TECHNICAL ROLE BADGE          -->
  <!-- ========================================== -->
  <g transform="translate(40, 840)">
    <polygon points="0,20 20,0 320,0 350,30 350,80 330,100 30,100 0,70" 
             fill="#04060d" stroke="#00f0ff" stroke-width="2" opacity="0.9" />
    <path d="M 10 10 L 40 10 M 10 10 L 10 40" stroke="#ff7b00" stroke-width="2" fill="none" />
    
    <g transform="translate(30, 36)">
      <text x="0" y="24" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="900" fill="#ff7b00">&lt;/&gt;</text>
    </g>

    <g transform="translate(100, 32)" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="bold" fill="#ffffff" letter-spacing="2">
      <text x="0" y="0">FULL STACK DEVELOPER</text>
      <text x="0" y="20" fill="#00f0ff">AI ENTHUSIAST</text>
      <text x="0" y="40">PRODUCT DESIGNER</text>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- BOTTOM-RIGHT: CORE ACTION MANIFESTO        -->
  <!-- ========================================== -->
  <g transform="translate(880, 650)" text-anchor="start">
    <g font-family="'Space Grotesk', system-ui, sans-serif" font-size="16" font-weight="800" fill="#ffffff" letter-spacing="4">
      <text x="0" y="0">BUILD</text>
      <text x="0" y="32">CODE</text>
      <text x="0" y="64">DESIGN</text>
      <text x="0" y="96">INNOVATE</text>
      <line x1="68" y1="-14" x2="68" y2="16" stroke="#ff7b00" stroke-width="4.5" stroke-linecap="round" />
      <line x1="0" y1="130" x2="35" y2="130" stroke="#ff7b00" stroke-width="3" />
    </g>
  </g>

  <!-- Location Badge: Bhopal, India with Wireframe Mountains -->
  <g transform="translate(700, 860)">
    <polygon points="0,50 30,0 270,0 270,50" fill="#04060d" stroke="#ff7b00" stroke-width="1.8" opacity="0.9" />
    <path d="M 15 48 L 50 18 L 68 38 L 85 22 L 105 48" fill="none" stroke="#ff7b00" stroke-width="3" stroke-linejoin="round" />
    <g transform="translate(115, 32)">
      <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="bold" fill="#ffffff" letter-spacing="1.5">
        📍 Bhopal, India
      </text>
    </g>
  </g>
</svg>"""

os.makedirs("public", exist_ok=True)

targets = [
    "public/profile_avatar.svg",
    "public/Cyberpunk Developer Profile HUD.svg",
    "public/3f64f21e-0f71-405c-994b-04d9fa11994f.svg"
]

for t in targets:
    with open(t, "w") as f:
        f.write(svg_master)
    print("Wrote SVG target:", t)

# Generate valid PNG matching dual-tone Cyberpunk HUD
def generate_dual_tone_png(filename, width=400, height=400):
    png = b"\\x89PNG\\r\\n\\x1a\\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png += struct.pack(">I", 13) + b"IHDR" + ihdr + struct.pack(">I", zlib.crc32(b"IHDR" + ihdr))
    
    raw = bytearray()
    cx, cy = width / 2, height / 2
    r_max = width * 0.33
    
    for y in range(height):
        raw.append(0)
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = (dx*dx + dy*dy)**0.5
            
            if abs(dist - r_max) <= 6:
                if x < cx:
                    raw.extend([255, 123, 0])
                else:
                    raw.extend([0, 240, 255])
            elif dist > r_max:
                if 20 <= y <= 50 and 260 <= x <= 380:
                    raw.extend([255, 123, 0] if y < 35 else [255, 255, 255])
                elif 20 <= y <= 60 and 20 <= x <= 70:
                    raw.extend([255, 123, 0])
                elif 340 <= y <= 380 and 20 <= x <= 140:
                    raw.extend([0, 240, 255] if x > 60 else [255, 123, 0])
                elif 340 <= y <= 380 and 260 <= x <= 380:
                    raw.extend([255, 123, 0] if x < 300 else [255, 255, 255])
                else:
                    raw.extend([4, 6, 12])
            else:
                hdx = x - cx
                hdy = y - 185
                hdist = (hdx*hdx + hdy*hdy*0.8)**0.5
                is_suit = (y >= 250 and abs(dx) <= 120)
                is_shirt = (y >= 240 and y <= 300 and abs(dx) <= 18 + (y - 240)*0.3)
                is_glasses = (168 <= y <= 188 and ((162 <= x <= 192) or (208 <= x <= 238)))
                is_rim = is_glasses and (y in (168, 169, 187, 188) or x in (162, 163, 191, 192, 208, 209, 237, 238))
                is_hair = (hdist <= 62 and y <= 165)
                is_mustache = (208 <= y <= 212 and abs(dx) <= 16)
                
                if is_rim:
                    raw.extend([255, 255, 255])
                elif is_glasses:
                    raw.extend([200, 130, 80] if x < cx else [60, 140, 180])
                elif is_mustache:
                    raw.extend([30, 22, 18])
                elif is_hair:
                    raw.extend([55, 38, 26] if x < cx else [28, 50, 72])
                elif hdist <= 54:
                    if x < cx - 10:
                        raw.extend([212, 138, 94])
                    elif x > cx + 10:
                        raw.extend([100, 135, 170])
                    else:
                        raw.extend([185, 120, 88])
                elif is_shirt:
                    raw.extend([245, 248, 252])
                elif is_suit:
                    raw.extend([38, 24, 18] if x < cx else [16, 32, 48])
                else:
                    raw.extend([6, 9, 18])
                    
    compressed = zlib.compress(bytes(raw), 9)
    png += struct.pack(">I", len(compressed)) + b"IDAT" + compressed + struct.pack(">I", zlib.crc32(b"IDAT" + compressed))
    png += struct.pack(">I", 0) + b"IEND" + struct.pack(">I", zlib.crc32(b"IEND"))
    
    with open(filename, "wb") as f:
        f.write(png)
    print("Generated PNG target:", filename)

png_targets = [
    "public/profile_avatar.png",
    "public/Cyberpunk Developer Profile HUD.png",
    "public/3f64f21e-0f71-405c-994b-04d9fa11994f.png"
]
for pt in png_targets:
    generate_dual_tone_png(pt)
