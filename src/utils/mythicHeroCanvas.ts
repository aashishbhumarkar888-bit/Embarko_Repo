import type { ForgeVisualProfile } from "../data/portfolioData";

export interface CapeNode {
  x: number;
  y: number;
}

/**
 * Create a 6-node cloak anchored near the shoulders and naturally draped downward toward the ankles.
 */
export function createInitialCape(anchorX: number): CapeNode[] {
  return Array.from({ length: 6 }, (_, i) => ({
    x: anchorX - i * 2.8,
    y: -58 + i * 9.2,
  }));
}

/**
 * Update a 6-node cloak chain with natural downward gravity when idle
 * and a soft, organic S-curve ripple when walking or dashing.
 */
export function updateNaturalCloakNodes(
  nodes: CapeNode[],
  anchorX: number,
  facing: 1 | -1,
  moveFactor: number,
  isDashing: boolean,
  breath: number,
  dt: number
): void {
  if (nodes.length === 0) return;

  const breathBob = Math.sin(breath * 2.3) * 1.4 * (1 - moveFactor);
  nodes[0].x = anchorX - facing * 5.5;
  nodes[0].y = -58 + breathBob;

  const dashBoost = isDashing ? 1 : 0;

  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const tNorm = i / (nodes.length - 1);

    // Idle: hangs smoothly downward toward the ankles with a gentle breeze sway.
    // Moving/Dashing: lifts smoothly behind the hero with an organic S-curve ripple.
    const idleTrailX = -facing * (1.8 + tNorm * 2.6) + Math.sin(breath * 1.6 - i * 0.7) * 1.1;
    const runTrailX =
      -facing * (6.8 + moveFactor * 5.2 + dashBoost * 5.5) +
      Math.sin(breath * 7.2 - i * 1.15) * (1.6 + tNorm * 2.2);

    const stepX = idleTrailX * (1 - moveFactor) + runTrailX * moveFactor;

    const idleDropY = 9.6 - tNorm * 0.6;
    const runDropY =
      7.2 -
      moveFactor * 2.6 -
      dashBoost * 1.6 +
      Math.sin(breath * 6.5 - i * 1.25) * (1.5 + tNorm * 2.1);

    const stepY = idleDropY * (1 - moveFactor) + runDropY * moveFactor;

    const goalX = prev.x + stepX;
    // Clamp lowest hem slightly above boot sole (-6) so it never clips under the floor
    const goalY = Math.min(-6.5, prev.y + stepY);

    const stiffness = Math.min(1, dt * (15 + (1 - tNorm) * 6));
    curr.x += (goalX - curr.x) * stiffness;
    curr.y += (goalY - curr.y) * stiffness;
  }
}

export interface LeviathanAxeOptions {
  bladePrimary: string;
  bladeSecondary: string;
  auraColor: string;
  isGhost?: boolean;
  isGoldenCharged?: boolean;
  isRecalling?: boolean;
  spinMotionBlur?: number; // 0..1 intensity of circular frost-arc motion blur when spinning
  scale?: number;
}

/**
 * Draw an unmistakable, iconic SINGLE-SIDED asymmetric Nordic Leviathan War-Axe.
 * - Dark obsidian/wood haft with burnished-gold wrapped grip bands & pointed metallic pommel
 * - On ONE side of the top only (+X): sleek razor-curved bearded crescent blade with hooked lower edge & glowing runes
 * - On the opposite back side (-X): small sharp metallic counter-spike
 * Local coordinate origin (0, 0) is near the mid-upper grip / balance center.
 */
export function drawLeviathanWarAxe(
  ctx: CanvasRenderingContext2D,
  opts: LeviathanAxeOptions
): void {
  const {
    bladePrimary,
    bladeSecondary,
    auraColor,
    isGhost = false,
    isGoldenCharged = false,
    isRecalling = false,
    spinMotionBlur = 0,
    scale = 1,
  } = opts;

  const edgeColor = isGoldenCharged
    ? "#FFE08A"
    : isRecalling
    ? "#98F5E1"
    : bladePrimary;

  const secondaryColor = isGoldenCharged ? "#FFB85C" : bladeSecondary;
  const runeGlow = isGoldenCharged ? "#FFF3C4" : auraColor;

  ctx.save();
  if (scale !== 1) ctx.scale(scale, scale);

  // 1. Optional high-speed spinning circular frost-arc motion blur (Boss Combat Throw/Recall)
  if (spinMotionBlur > 0.05 && !isGhost) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const blurAlpha = Math.min(0.75, spinMotionBlur * 0.72);
    ctx.strokeStyle = edgeColor;
    ctx.shadowColor = edgeColor;
    ctx.shadowBlur = 14;
    ctx.lineCap = "round";

    // Outer razor sweep arc
    ctx.globalAlpha = blurAlpha * 0.7;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, -4, 29, -Math.PI * 0.85, Math.PI * 0.35);
    ctx.stroke();

    // Secondary inner shimmer arc
    ctx.globalAlpha = blurAlpha * 0.45;
    ctx.strokeStyle = isGoldenCharged ? "#FFF4D2" : "#F2F4FB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -4, 24, -Math.PI * 0.55, Math.PI * 0.5);
    ctx.stroke();

    // Opposing trailing wake
    ctx.globalAlpha = blurAlpha * 0.32;
    ctx.strokeStyle = runeGlow;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -4, 27, Math.PI * 0.55, Math.PI * 1.15);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Dark Obsidian-Wood Curved Haft (vertical-ish in local space: pommel at +Y, axe head at -Y)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-2.1, -24);
  ctx.lineTo(1.9, -24);
  ctx.quadraticCurveTo(2.6, 2, 1.4, 24);
  ctx.lineTo(-1.8, 24);
  ctx.quadraticCurveTo(-0.8, 2, -2.1, -24);
  ctx.closePath();

  const haftGrad = ctx.createLinearGradient(-3, -24, 3, 24);
  haftGrad.addColorStop(0, isGhost ? edgeColor : "#1E263D");
  haftGrad.addColorStop(0.5, isGhost ? edgeColor : "#2A2430");
  haftGrad.addColorStop(1, isGhost ? edgeColor : "#14192A");
  ctx.fillStyle = haftGrad;
  ctx.fill();

  if (!isGhost) {
    // Subtle dark-wood edge bevel
    ctx.strokeStyle = "rgba(165, 232, 255, 0.2)";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Burnished gold leather-wrapped grip bands along lower-mid haft
    ctx.strokeStyle = "#E6C999";
    ctx.lineWidth = 1.45;
    const wrapYs = [-3, 1.5, 6, 10.5, 15];
    for (const wy of wrapYs) {
      ctx.beginPath();
      ctx.moveTo(-2.1, wy);
      ctx.lineTo(2.3, wy + 1.3);
      ctx.stroke();
    }

    // Small pointed metallic pommel at bottom of haft
    ctx.fillStyle = "#E6C999";
    ctx.beginPath();
    ctx.moveTo(-2.4, 23.5);
    ctx.lineTo(2.2, 23.5);
    ctx.lineTo(0, 30);
    ctx.closePath();
    ctx.fill();

    // Forged bronze/gold collar ring just below the axe socket
    ctx.fillStyle = "#D4B47E";
    ctx.fillRect(-3.1, -14.5, 6.2, 2.8);
  }
  ctx.restore();

  // 3. Back Side (-X): Small Sharp Metallic Counter-Spike (asymmetric balance!)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-2, -23.5);
  ctx.lineTo(-10.5, -20.5); // razor sharp rear thorn spike
  ctx.lineTo(-2.5, -16.5);
  ctx.closePath();
  ctx.fillStyle = isGhost ? edgeColor : "#2A3656";
  ctx.fill();
  if (!isGhost) {
    ctx.strokeStyle = "#A5E8FF";
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
  ctx.restore();

  // 4. Front Side ONLY (+X): Sleek Razor-Curved Bearded Crescent Axe Blade
  ctx.save();
  ctx.beginPath();
  // Socket cheek attachment along the haft
  ctx.moveTo(1.2, -24.5);
  // Sweeping concave upper spine out to sharp upper horn
  ctx.quadraticCurveTo(10, -25.5, 19.5, -31.5);
  // Razor-curved convex crescent cutting edge sweeping down into bearded lower tip
  ctx.bezierCurveTo(25.5, -21, 25.5, -8.5, 17.5, -1.5);
  // Hooked lower beard notch curling gracefully back inward toward the haft
  ctx.quadraticCurveTo(12.5, -8.5, 8.5, -10.5);
  ctx.quadraticCurveTo(5.2, -12, 1.5, -14.5);
  ctx.closePath();

  const steelGrad = ctx.createLinearGradient(1, -28, 25, -4);
  steelGrad.addColorStop(0, isGhost ? edgeColor : "#131A2E");
  steelGrad.addColorStop(0.55, isGhost ? edgeColor : "#212D4B");
  steelGrad.addColorStop(0.85, isGhost ? edgeColor : secondaryColor);
  steelGrad.addColorStop(1, edgeColor);
  ctx.fillStyle = steelGrad;
  ctx.fill();

  if (!isGhost) {
    // Forged steel cheek bevel shadow
    ctx.strokeStyle = "rgba(165, 232, 255, 0.32)";
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // Glowing etched Nordic runes running parallel to the curved blade cheek
    ctx.save();
    ctx.strokeStyle = edgeColor;
    ctx.shadowColor = edgeColor;
    ctx.shadowBlur = isGoldenCharged ? 14 : 10;
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    // Main runic fuller arc
    ctx.moveTo(7.5, -21.5);
    ctx.quadraticCurveTo(14.5, -17.5, 14, -9.5);
    // Etched cross-glyph notches
    ctx.moveTo(10.5, -20);
    ctx.lineTo(14.5, -22.5);
    ctx.moveTo(12.8, -15.5);
    ctx.lineTo(17.5, -15.5);
    ctx.moveTo(12.2, -11.8);
    ctx.lineTo(16.2, -9.5);
    ctx.stroke();

    // Luminous Razor Crescent Cutting Edge
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = isGoldenCharged ? 3 : 2.3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(19.5, -31.5);
    ctx.bezierCurveTo(25.5, -21, 25.5, -8.5, 17.5, -1.5);
    ctx.stroke();

    // Crisp white-hot razor glint along the very cutting edge
    ctx.strokeStyle = "#F8FAFF";
    ctx.shadowBlur = 4;
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(19.7, -30.2);
    ctx.bezierCurveTo(25.2, -20.5, 25.1, -9, 17.8, -2.5);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  ctx.restore();
}

export interface CyberNordicHeroParams {
  sx: number;
  groundY: number;
  facing: 1 | -1;
  stride: number;
  moveFactor: number;
  breath: number;
  axeFlourish: number;
  capeNodes: CapeNode[];
  cameraX: number;
  forgeProfile: ForgeVisualProfile;
  alpha: number;
  isGhost?: boolean;
  isReflection?: boolean;
  isDashing?: boolean;
  hideWeapon?: boolean;
  isGoldenCharged?: boolean;
  damageFlash?: number; // 0..1 subtle red/gold rim flash on hit instead of hiding player
  scale?: number;
}

/**
 * Draw the shared, high-craft Articulated Hooded Cyber-Nordic Architect (~78px tall).
 * - Sleek angled pointed Nordic traveler's hood shadowing the face + twin glowing frost-blue eyes
 * - Natural gravity 6-node Bezier cloak (draping down to ankles idle, soft S-curve moving)
 * - Armored cuirass, pastel rune sash, broad layered pauldrons, articulated armored legs & boots
 * - Unmistakable single-sided Leviathan War-Axe carried naturally angled low at the side / shoulder
 */
export function drawCyberNordicHero(
  ctx: CanvasRenderingContext2D,
  params: CyberNordicHeroParams
): void {
  const {
    sx,
    groundY,
    facing,
    stride,
    moveFactor,
    breath,
    axeFlourish,
    capeNodes,
    cameraX,
    forgeProfile: fp,
    alpha,
    isGhost = false,
    isReflection = false,
    isDashing = false,
    hideWeapon = false,
    isGoldenCharged = false,
    damageFlash = 0,
    scale = 1,
  } = params;

  ctx.save();
  ctx.globalAlpha = alpha;

  if (scale !== 1) {
    ctx.translate(sx, groundY);
    ctx.scale(scale, scale);
    ctx.translate(-sx, -groundY);
  }

  const dashLean = isDashing ? facing * 7.5 : moveFactor * facing * 2.2;
  const bob =
    Math.sin(breath * 2.3) * 1.4 * (1 - moveFactor) +
    Math.abs(Math.sin(stride)) * -3.1 * moveFactor +
    (isDashing ? 2.5 : 0);

  const footY = groundY;
  const hipY = footY - 34 + bob;
  const torsoTopY = hipY - 25;
  const headY = torsoTopY - 10;

  const ghostColor = isGoldenCharged ? "#FFE08A" : "#A5E8FF";

  // Subtle atmospheric ground halo + crisp ground shadow (main pass only)
  if (!isGhost && !isReflection) {
    const aura = ctx.createRadialGradient(sx, footY - 38, 6, sx, footY - 38, 74);
    aura.addColorStop(0, isGoldenCharged ? "rgba(255, 224, 138, 0.25)" : `${fp.auraColor}24`);
    aura.addColorStop(0.55, `${fp.bladePrimary}0D`);
    aura.addColorStop(1, "rgba(6,8,14,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(sx, footY - 38, 74, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(2, 4, 9, 0.82)";
    ctx.beginPath();
    ctx.ellipse(sx, footY + 1, isDashing ? 28 : 22, 5.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─── 1. NATURAL GRAVITY 6-NODE FLOWING BEZIER CLOAK ──────────────────────
  if (capeNodes.length >= 6) {
    const pts = capeNodes.map((n) => ({
      x: n.x - cameraX,
      y: footY + n.y,
    }));
    // Pin top cloak shoulder seamlessly to current hero shoulder
    pts[0] = { x: sx - facing * 5.5 + dashLean * 0.5, y: torsoTopY + 2 };

    ctx.beginPath();
    // Outer flowing back edge (smooth quadratic Bezier spine)
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) * 0.5;
      const midY = (pts[i].y + pts[i + 1].y) * 0.5;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    const tail = pts[pts.length - 1];
    ctx.lineTo(tail.x, tail.y);

    // Tapered Nordic lower hem curling gently forward toward ankle/calf
    const hemWidth = 10.5 + moveFactor * 4;
    ctx.quadraticCurveTo(
      tail.x + facing * (hemWidth * 0.55),
      Math.min(footY - 3, tail.y + 5.5),
      tail.x + facing * hemWidth,
      Math.min(footY - 4, tail.y + 1.5)
    );

    // Inner drape edge ascending gracefully back up to torso
    for (let i = pts.length - 2; i >= 1; i--) {
      const tNorm = i / (pts.length - 1);
      const innerOffset = facing * (4.5 + tNorm * (hemWidth - 4));
      const prev = pts[i - 1];
      const prevOffset = facing * (4.5 + ((i - 1) / (pts.length - 1)) * (hemWidth - 4));
      const midX = (pts[i].x + innerOffset + prev.x + prevOffset) * 0.5;
      const midY = (pts[i].y + prev.y) * 0.5 + 2;
      ctx.quadraticCurveTo(pts[i].x + innerOffset, pts[i].y + 2, midX, midY);
    }
    ctx.lineTo(sx + facing * 1 + dashLean * 0.4, torsoTopY + 8);
    ctx.closePath();

    if (isGhost) {
      ctx.fillStyle = ghostColor;
      ctx.fill();
    } else {
      const cloakGrad = ctx.createLinearGradient(pts[0].x, pts[0].y, tail.x, tail.y);
      cloakGrad.addColorStop(0, "#1A223A");
      cloakGrad.addColorStop(0.6, "#101528");
      cloakGrad.addColorStop(1, `${fp.auraColor}4E`);
      ctx.fillStyle = cloakGrad;
      ctx.fill();

      // Subtle glowing mantle edge trim
      ctx.strokeStyle = isGoldenCharged ? "#FFE08A99" : `${fp.auraColor}88`;
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }
  }

  // ─── 2. ARTICULATED ARMORED LEGS (THIGH + KNEE + GREAVE + BOOT) ──────────
  const drawArmoredLeg = (phaseOffset: number, isFront: boolean) => {
    const s = Math.sin(stride + phaseOffset) * moveFactor;
    const c = Math.cos(stride + phaseOffset) * moveFactor;
    const hipX = sx + (isFront ? facing * 2.5 : -facing * 2.5) + dashLean * 0.25;
    const kneeX =
      hipX +
      s * 10.5 +
      facing * (isFront ? 2.5 : -1) * (1 - moveFactor * 0.4) +
      (isDashing ? facing * (isFront ? 6 : -5) : 0);
    const kneeY = hipY + 15.5 - Math.max(0, c) * 3.5;
    const ankleX =
      hipX +
      s * 14.5 -
      (s < 0 ? facing * 3 : 0) +
      (isDashing ? facing * (isFront ? 8 : -9) : 0);
    const ankleY = footY - 4 - Math.max(0, c) * 5.2;

    const legFill = isGhost
      ? ghostColor
      : isFront
      ? "#182038"
      : "#0E1324";

    ctx.fillStyle = legFill;
    // Thigh
    ctx.beginPath();
    ctx.moveTo(hipX - 4.8, hipY);
    ctx.lineTo(hipX + 4.8, hipY);
    ctx.lineTo(kneeX + 3.7, kneeY);
    ctx.lineTo(kneeX - 3.7, kneeY);
    ctx.closePath();
    ctx.fill();

    // Shin greave
    ctx.beginPath();
    ctx.moveTo(kneeX - 3.7, kneeY);
    ctx.lineTo(kneeX + 3.7, kneeY);
    ctx.lineTo(ankleX + 3.1, ankleY);
    ctx.lineTo(ankleX - 3.1, ankleY);
    ctx.closePath();
    ctx.fill();

    // Nordic boot
    ctx.beginPath();
    ctx.moveTo(ankleX - 3.5, ankleY - 1);
    ctx.lineTo(ankleX + facing * 9, ankleY + 3.5);
    ctx.lineTo(ankleX - facing * 4.5, ankleY + 4);
    ctx.closePath();
    ctx.fill();

    if (!isGhost && isFront) {
      ctx.strokeStyle = "rgba(165, 232, 255, 0.34)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(kneeX + facing * 3, kneeY);
      ctx.lineTo(ankleX + facing * 2.8, ankleY);
      ctx.stroke();
    }
  };

  drawArmoredLeg(Math.PI, false);
  drawArmoredLeg(0, true);

  // ─── 3. SCULPTED CUIRASS TORSO + PASTEL RUNE SASH + BROAD PAULDRONS ──────
  const torsoCenterX = sx + dashLean * 0.55;
  ctx.fillStyle = isGhost ? ghostColor : "#151C32";
  ctx.beginPath();
  ctx.moveTo(torsoCenterX - 11.5, torsoTopY + 1);
  ctx.lineTo(torsoCenterX + 11.5, torsoTopY + 1);
  ctx.lineTo(torsoCenterX + 9, hipY + 3);
  ctx.lineTo(torsoCenterX + 12.5, hipY + 13);
  ctx.lineTo(torsoCenterX - 12.5, hipY + 13);
  ctx.lineTo(torsoCenterX - 9, hipY + 3);
  ctx.closePath();
  ctx.fill();

  if (!isGhost) {
    ctx.strokeStyle =
      damageFlash > 0.1
        ? `rgba(255, 117, 151, ${0.4 + damageFlash * 0.6})`
        : "rgba(165, 232, 255, 0.24)";
    ctx.lineWidth = damageFlash > 0.1 ? 1.8 : 1.05;
    ctx.stroke();

    // Glowing Pastel Rune Sash Draped Across Chest
    ctx.save();
    const sashColor = isGoldenCharged ? "#FFE08A" : fp.bladePrimary;
    ctx.strokeStyle = sashColor;
    ctx.shadowColor = sashColor;
    ctx.shadowBlur = isGoldenCharged ? 12 : 8;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(torsoCenterX - facing * 7.5, torsoTopY + 3);
    ctx.lineTo(torsoCenterX + facing * 7.5, hipY + 1);
    ctx.stroke();

    // Burnished pale-gold belt clasp
    ctx.fillStyle = "#E6C999";
    ctx.shadowBlur = 0;
    ctx.fillRect(torsoCenterX - 8.5, hipY + 1, 17, 2.4);
    ctx.restore();
  }

  // Broad Layered Armored Pauldrons
  const drawPauldron = (side: -1 | 1) => {
    ctx.fillStyle = isGhost ? ghostColor : side === facing ? "#202A49" : "#13192D";
    ctx.beginPath();
    ctx.moveTo(torsoCenterX + side * 4, torsoTopY - 2);
    ctx.lineTo(torsoCenterX + side * 15, torsoTopY + 2);
    ctx.lineTo(torsoCenterX + side * 16.5, torsoTopY + 10.5);
    ctx.lineTo(torsoCenterX + side * 7.5, torsoTopY + 11.5);
    ctx.closePath();
    ctx.fill();

    if (!isGhost) {
      ctx.strokeStyle = side === facing ? "#E6C999AA" : "rgba(165,232,255,0.28)";
      ctx.lineWidth = 1.05;
      ctx.stroke();
    }
  };
  drawPauldron((-facing) as -1 | 1);
  drawPauldron(facing);

  // ─── 4. SLEEK ANGLED POINTED NORDIC TRAVELER'S HOOD + TWIN FROST EYES ────
  const headX = torsoCenterX + dashLean * 0.25;
  ctx.save();
  ctx.fillStyle = isGhost ? ghostColor : "#13192E";
  ctx.beginPath();
  // Base cowl hugging shoulders & neck
  ctx.moveTo(headX - facing * 10.5, headY + 9);
  // Swept-back pointed traveler's hood peak (sleek silhouette, NOT blocky!)
  ctx.quadraticCurveTo(headX - facing * 15.5, headY + 1, headX - facing * 12, headY - 7.5);
  // Crisp angled ridge rising to the forward brow overhang
  ctx.quadraticCurveTo(headX - facing * 3, headY - 14.5, headX + facing * 11, headY - 5.5);
  // Sharp shadowed cowl overhang down to chin
  ctx.lineTo(headX + facing * 8.5, headY + 3.5);
  ctx.lineTo(headX + facing * 5.5, headY + 9);
  ctx.closePath();
  ctx.fill();

  if (!isGhost) {
    // Subtle moonlit rim-light tracing the upper pointed hood ridge
    ctx.strokeStyle =
      damageFlash > 0.1
        ? "#FF7597"
        : isGoldenCharged
        ? "#FFE08A"
        : `${fp.auraColor}98`;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(headX - facing * 12, headY - 7.5);
    ctx.quadraticCurveTo(headX - facing * 3, headY - 14.5, headX + facing * 11, headY - 5.5);
    ctx.stroke();

    // Deeply shadowed face recess beneath the pointed hood brow
    ctx.fillStyle = "#04060D";
    ctx.beginPath();
    ctx.moveTo(headX + facing * 1.5, headY - 4.5);
    ctx.lineTo(headX + facing * 9.8, headY - 4.2);
    ctx.lineTo(headX + facing * 7.8, headY + 4.8);
    ctx.lineTo(headX + facing * 1.2, headY + 4.8);
    ctx.closePath();
    ctx.fill();

    // Twin Subtle Glowing Frost-Blue Eyes (#A5E8FF) peering from shadow
    ctx.save();
    const eyeColor = isGoldenCharged ? "#FFE08A" : "#A5E8FF";
    ctx.fillStyle = eyeColor;
    ctx.shadowColor = eyeColor;
    ctx.shadowBlur = 7;
    ctx.fillRect(headX + facing * 4.6 - (facing === -1 ? 1.8 : 0), headY - 1.2, 2.0, 1.45);
    ctx.fillRect(headX + facing * 7.4 - (facing === -1 ? 1.7 : 0), headY - 1.1, 1.75, 1.35);
    ctx.restore();
  }
  ctx.restore();

  // ─── 5. FRONT ARM + SINGLE-SIDED LEVIATHAN WAR-AXE (OR OUTSTRETCHED RECALL ARM) ─
  const shoulderX = torsoCenterX + facing * 6.5;
  const shoulderY = torsoTopY + 7;

  if (hideWeapon) {
    // Outstretched casting / recalling armored gauntlet when axe is in flight
    const reachX = shoulderX + facing * 18;
    const reachY = shoulderY + 2;
    ctx.strokeStyle = isGhost ? ghostColor : "#232E4F";
    ctx.lineWidth = 4.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(reachX, reachY);
    ctx.stroke();

    if (!isGhost) {
      ctx.save();
      ctx.fillStyle = isGoldenCharged ? "#FFE08A" : "#98F5E1";
      ctx.shadowColor = isGoldenCharged ? "#FFE08A" : "#98F5E1";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(reachX + facing * 2, reachY, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    // Carried naturally low at the side / angled slightly forward so the single-sided crescent blade silhouette is unmistakable!
    const handX = torsoCenterX + facing * 10.5;
    const handY = torsoTopY + 20 + Math.sin(stride) * 1.8 * moveFactor;
    const idleSway = Math.sin(breath * 2.0) * 0.045 + Math.sin(stride) * 0.14 * moveFactor;
    const flourishArc =
      axeFlourish > 0 ? Math.sin((1 - axeFlourish / 0.55) * Math.PI) * 1.1 : 0;

    // Armored forearm holding haft
    ctx.strokeStyle = isGhost ? ghostColor : "#202A49";
    ctx.lineWidth = 4.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    ctx.save();
    ctx.translate(handX, handY);
    ctx.scale(facing, 1);
    // Natural battle-ready forward-angled grip (~36° tilted forward so single-sided crescent faces front & slightly up)
    ctx.rotate(0.58 + idleSway - flourishArc);
    ctx.translate(0, -4);
    drawLeviathanWarAxe(ctx, {
      bladePrimary: fp.bladePrimary,
      bladeSecondary: fp.bladeSecondary,
      auraColor: fp.auraColor,
      isGhost,
      isGoldenCharged,
      scale: 0.96,
    });
    ctx.restore();
  }

  ctx.restore();
}
