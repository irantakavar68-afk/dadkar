"use client";

import React, { useState, useMemo, useEffect } from "react";

// --- Ù¾Ø§ÛŒÚ¯Ø§Ù‡ Ø¯Ø§Ø¯Ù‡ Ø¬Ø§Ù…Ø¹ Ù‚ÙˆØ§Ù†ÛŒÙ† Ú©Ø§Ø±ØŒ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ Ùˆ Ø¢Ø±Ø§ÛŒ Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª Ø§Ø¯Ø§Ø±ÛŒ ---
interface LawItem {
  id: string;
  category: "labor" | "tamin" | "court" | "unemployment";
  title: string;
  subject: string;
  content: string;
  tags: string[];
}

const LAWS_DATABASE: LawItem[] = [
  {
    id: "l1",
    category: "labor",
    title: "Ù…Ø§Ø¯Ù‡ Û²Û´ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø± - Ø­Ù‚ Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù† Ú©Ø§Ø±",
    subject: "Ù…Ø­Ø§Ø³Ø¨Ù‡ Ù¾Ø§Ø¯Ø§Ø´ Ù¾Ø§ÛŒØ§Ù†â€ŒÚ©Ø§Ø± Ùˆ Ø³Ù†ÙˆØ§Øª Ø®Ø¯Ù…Øª",
    content:
      "Ø¯Ø± ØµÙˆØ±Øª Ø®Ø§ØªÙ…Ù‡ Ù‚Ø±Ø§Ø±Ø¯Ø§Ø¯ Ú©Ø§Ø±ØŒ Ú©Ø§Ø±ÙØ±Ù…Ø§ Ù…Ú©Ù„Ù Ø§Ø³Øª Ø¨Ù‡ Ú©Ø§Ø±Ú¯Ø±ÛŒ Ú©Ù‡ Ù…Ø·Ø§Ø¨Ù‚ Ù‚Ø±Ø§Ø±Ø¯Ø§Ø¯ØŒ ÛŒÚ© Ø³Ø§Ù„ ÛŒØ§ Ø¨ÛŒØ´ØªØ± Ø¨Ù‡ Ú©Ø§Ø± Ø§Ø´ØªØºØ§Ù„ Ø¯Ø§Ø´ØªÙ‡ Ø§Ø³Øª Ø¨Ø±Ø§ÛŒ Ù‡Ø± Ø³Ø§Ù„ Ø³Ø§Ø¨Ù‚Ù‡ (Ø§Ø¹Ù… Ø§Ø² Ù…ØªÙˆØ§Ù„ÛŒ ÛŒØ§ Ù…ØªÙ†Ø§ÙˆØ¨) Ø¨Ø± Ø§Ø³Ø§Ø³ Ø¢Ø®Ø±ÛŒÙ† Ø­Ù‚ÙˆÙ‚ØŒ Ù…Ø¨Ù„ØºÛŒ Ù…Ø¹Ø§Ø¯Ù„ ÛŒÚ© Ù…Ø§Ù‡ Ø­Ù‚ÙˆÙ‚ Ø¨Ù‡ Ø¹Ù†ÙˆØ§Ù† Ù…Ø²Ø§ÛŒØ§ÛŒ Ù¾Ø§ÛŒØ§Ù† Ú©Ø§Ø± (Ø­Ù‚ Ø³Ù†ÙˆØ§Øª) Ù¾Ø±Ø¯Ø§Ø®Øª Ù†Ù…Ø§ÛŒØ¯. Ù‡Ù…Ú†Ù†ÛŒÙ† Ø¨Ù‡ Ø§Ø³ØªÙ†Ø§Ø¯ Ø¯Ø§Ø¯Ù†Ø§Ù…Ù‡ Û±Û²ÛµÛ³ Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª Ø§Ø¯Ø§Ø±ÛŒØŒ Ú©Ù„ÛŒÙ‡ Ù…Ø²Ø§ÛŒØ§ÛŒ Ù¾Ø±Ø¯Ø§Ø®ØªÛŒ Ø¨Ù‡ ØªØ¨Ø¹ Ø´ØºÙ„ Ø¨Ø§ÛŒØ¯ Ø¯Ø± Ù…Ø­Ø§Ø³Ø¨Ù‡ Ø³Ù†ÙˆØ§Øª Ù„Ø­Ø§Ø¸ Ú¯Ø±Ø¯Ø¯.",
    tags: ["Ø³Ù†ÙˆØ§Øª", "Ù…Ø§Ø¯Ù‡ Û²Û´", "Ù¾Ø§ÛŒØ§Ù† Ú©Ø§Ø±", "Ø¯Ø§Ø¯Ù†Ø§Ù…Ù‡ Û±Û²ÛµÛ³", "Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§"]
  },
  {
    id: "l2",
    category: "labor",
    title: "Ù…Ø§Ø¯Ù‡ Û³Û¶ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø± - Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª Ùˆ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§",
    subject: "ØªØ¹Ø±ÛŒÙ Ø§Ø¬Ø²Ø§ÛŒ ØªØ´Ú©ÛŒÙ„â€ŒØ¯Ù‡Ù†Ø¯Ù‡ Ø¯Ø³ØªÙ…Ø²Ø¯",
    content:
      "Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª Ø¹Ø¨Ø§Ø±Øª Ø§Ø³Øª Ø§Ø² Ù…Ø¬Ù…ÙˆØ¹ Ù…Ø²Ø¯ Ø´ØºÙ„ Ùˆ Ù…Ø²Ø§ÛŒØ§ÛŒ Ø«Ø§Ø¨Øª Ù¾Ø±Ø¯Ø§Ø®ØªÛŒ Ø¨Ù‡ ØªØ¨Ø¹ Ø´ØºÙ„. ØªØ¨ØµØ±Ù‡ Û±: Ù…Ø²Ø§ÛŒØ§ÛŒ Ø±ÙØ§Ù‡ÛŒ Ùˆ Ø§Ù†Ú¯ÛŒØ²Ø´ÛŒ Ù…Ø§Ù†Ù†Ø¯ Ú©Ù…Ú© Ù‡Ø²ÛŒÙ†Ù‡ Ù…Ø³Ú©Ù†ØŒ Ø®ÙˆØ§Ø±Ø¨Ø§Ø± Ùˆ Ø¹Ø§Ø¦Ù„Ù‡â€ŒÙ…Ù†Ø¯ÛŒ Ø¬Ø²Ø¡ Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª Ùˆ Ù…Ø¨Ù†Ø§ Ù…Ø­Ø³ÙˆØ¨ Ù†Ù…ÛŒâ€ŒØ´ÙˆÙ†Ø¯ Ù…Ú¯Ø± Ø¨Ø§ ØªÙˆØ§ÙÙ‚ ÛŒØ§ Ø±ÙˆÛŒÙ‡ Ú©Ø§Ø±Ú¯Ø§Ù‡. ØªØ¨ØµØ±Ù‡ Û²: Ø¯Ø± Ú©Ø§Ø±Ú¯Ø§Ù‡â€ŒÙ‡Ø§ÛŒÛŒ Ú©Ù‡ Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„ Ø¨Ù‡ Ø§Ø¬Ø±Ø§ Ø¯Ø±Ø¢Ù…Ø¯Ù‡ Ø§Ø³ØªØŒ Ù…Ø²Ø¯ Ú¯Ø±ÙˆÙ‡ Ùˆ Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª Ùˆ Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡ØŒ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ Ø±Ø§ ØªØ´Ú©ÛŒÙ„ Ù…ÛŒâ€ŒØ¯Ù‡Ù†Ø¯.",
    tags: ["Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª", "Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§", "Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ", "Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡", "Ù…Ø²Ø¯ Ú¯Ø±ÙˆÙ‡"]
  },
  {
    id: "l3",
    category: "unemployment",
    title: "Ù…Ø§Ø¯Ù‡ Û· Ù‚Ø§Ù†ÙˆÙ† Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ - Ù…ÛŒØ²Ø§Ù† Ùˆ Ù…Ø¯Øª Ù…Ù‚Ø±Ø±ÛŒ",
    subject: "ÙØ±Ù…ÙˆÙ„ Ù…Ø­Ø§Ø³Ø¨Ù‡ Ù…Ù‚Ø±Ø±ÛŒ Ø¨ÛŒÚ©Ø§Ø±ÛŒ Ùˆ Ø³Ù‚Ù Ù‚Ø§Ù†ÙˆÙ†ÛŒ",
    content:
      "Ù…ÛŒØ²Ø§Ù† Ù…Ù‚Ø±Ø±ÛŒ Ø±ÙˆØ²Ø§Ù†Ù‡ Ø¨ÛŒÙ…Ù‡â€ŒØ´Ø¯Ù‡ Ø¨ÛŒÚ©Ø§Ø± Ù…Ø¹Ø§Ø¯Ù„ ÛµÛµ Ø¯Ø±ØµØ¯ Ù…ØªÙˆØ³Ø· Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ Ùˆ ÛŒØ§ Ú©Ø§Ø±Ù…Ø²Ø¯ Ø±ÙˆØ²Ø§Ù†Ù‡ Ø¨ÛŒÙ…Ù‡â€ŒØ´Ø¯Ù‡ Ù…ÛŒâ€ŒØ¨Ø§Ø´Ø¯. Ø¨Ù‡ Ù…Ù‚Ø±Ø±ÛŒ Ø§ÙØ±Ø§Ø¯ Ù…ØªØ£Ù‡Ù„ ÛŒØ§ Ù…ØªÚ©ÙÙ„ØŒ ØªØ§ Ø­Ø¯Ø§Ú©Ø«Ø± Û´ Ù†ÙØ± Ø§Ø² Ø§ÙØ±Ø§Ø¯ ØªØ­Øª ØªÚ©ÙÙ„ Ø¨Ù‡ Ø§Ø²Ø§ÛŒ Ù‡Ø± ÛŒÚ© Ø§Ø² Ø¢Ù†Ù‡Ø§ Ø¨Ù‡ Ù…ÛŒØ²Ø§Ù† Û±Û° Ø¯Ø±ØµØ¯ Ø­Ø¯Ø§Ù‚Ù„ Ø¯Ø³ØªÙ…Ø²Ø¯ Ø§ÙØ²ÙˆØ¯Ù‡ Ø®ÙˆØ§Ù‡Ø¯ Ø´Ø¯. Ø¯Ø± Ù‡Ø± Ø­Ø§Ù„ Ú©Ù„ÛŒÙ‡ Ø¯Ø±ÛŒØ§ÙØªÛŒ Ø¨ÛŒÙ…Ù‡â€ŒØ´Ø¯Ù‡ Ù†Ø¨Ø§ÛŒØ¯ Ø§Ø² Ø­Ø¯Ø§Ù‚Ù„ Ø¯Ø³ØªÙ…Ø²Ø¯ Ú©Ù…ØªØ± Ùˆ Ø§Ø² Û¸Û° Ø¯Ø±ØµØ¯ Ù…ØªÙˆØ³Ø· Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ ÙˆÛŒ Ø¨ÛŒØ´ØªØ± Ø¨Ø§Ø´Ø¯.",
    tags: ["Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ", "Ù…Ø§Ø¯Ù‡ Û·", "Ù…Ù‚Ø±Ø±ÛŒ", "ØªØ­Øª ØªÚ©ÙÙ„"]
  },
  {
    id: "l4",
    category: "tamin",
    title: "Ù…Ø§Ø¯Ù‡ Û²Û¸ Ù‚Ø§Ù†ÙˆÙ† ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ - Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ø³Ù‡Ù… Ú©Ø§Ø±Ú¯Ø± Ùˆ Ú©Ø§Ø±ÙØ±Ù…Ø§",
    subject: "Ø¯Ø±ØµØ¯Ù‡Ø§ Ùˆ Ø¶Ø±Ø§ÛŒØ¨ Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ù¾Ø±Ø¯Ø§Ø®ØªÛŒ",
    content:
      "Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ø§Ø² Ø§ÙˆÙ„ Ø¢Ø°Ø±Ù…Ø§Ù‡ Ø³Ø§Ù„ Û±Û³ÛµÛ´ Ø¨Ù‡ Ù…ÛŒØ²Ø§Ù† Û²Û¸ Ø¯Ø±ØµØ¯ Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ Ø§Ø³Øª Ú©Ù‡ Û· Ø¯Ø±ØµØ¯ Ø¢Ù† Ø¨Ù‡ Ø¹Ù‡Ø¯Ù‡ Ø¨ÛŒÙ…Ù‡â€ŒØ´Ø¯Ù‡ØŒ Û²Û° Ø¯Ø±ØµØ¯ Ø¨Ù‡ Ø¹Ù‡Ø¯Ù‡ Ú©Ø§Ø±ÙØ±Ù…Ø§ Ùˆ Û³ Ø¯Ø±ØµØ¯ Ø¨Ù‡ ÙˆØ³ÛŒÙ„Ù‡ Ø¯ÙˆÙ„Øª ØªØ£Ù…ÛŒÙ† Ù…ÛŒâ€ŒØ´ÙˆØ¯. Ø¨Ù‡ Ù‡Ù…Ø±Ø§Ù‡ Û³ Ø¯Ø±ØµØ¯ Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ (Ù…ÙˆØ¶ÙˆØ¹ Ù‚Ø§Ù†ÙˆÙ† Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ)ØŒ Ù…Ø¬Ù…ÙˆØ¹ Ø³Ù‡Ù… Ú©Ø§Ø±ÙØ±Ù…Ø§ Ø¨Ù‡ Û²Û³ Ø¯Ø±ØµØ¯ Ø§ÙØ²Ø§ÛŒØ´ Ù…ÛŒâ€ŒÛŒØ§Ø¨Ø¯.",
    tags: ["Ø­Ù‚ Ø¨ÛŒÙ…Ù‡", "Ù…Ø§Ø¯Ù‡ Û²Û¸", "Ø³Ù‡Ù… Ú©Ø§Ø±ÙØ±Ù…Ø§", "Ø³Ù‡Ù… Ú©Ø§Ø±Ú¯Ø±", "Ø¨ÛŒÙ…Ù‡ Ø§Ø¬Ø¨Ø§Ø±ÛŒ"]
  },
  {
    id: "l5",
    category: "tamin",
    title: "Ù…Ø§Ø¯Ù‡ Û·Û· Ù‚Ø§Ù†ÙˆÙ† ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ - Ù…ÛŒØ²Ø§Ù† Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ",
    subject: "ÙØ±Ù…ÙˆÙ„ Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ ØªØ§Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ",
    content:
      "Ù…ÛŒØ²Ø§Ù† Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ Ø¹Ø¨Ø§Ø±Øª Ø§Ø³Øª Ø§Ø² ÛŒÚ© Ø³ÛŒâ€ŒØ§Ù… Ù…ØªÙˆØ³Ø· Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ Ø¨ÛŒÙ…Ù‡â€ŒØ´Ø¯Ù‡ Ø¶Ø±Ø¨Ø¯Ø± Ø³Ù†ÙˆØ§Øª Ù¾Ø±Ø¯Ø§Ø®Øª Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ù…Ø´Ø±ÙˆØ· Ø¨Ø± Ø¢Ù†Ú©Ù‡ Ø§Ø² Ø³ÛŒ Ùˆ Ù¾Ù†Ø¬ Ø³ÛŒâ€ŒØ§Ù… (Û³Ûµ/Û³Û°) Ù…ØªÙˆØ³Ø· Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ ØªØ¬Ø§ÙˆØ² Ù†Ù†Ù…Ø§ÛŒØ¯. Ù…ØªÙˆØ³Ø· Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ Ø¹Ø¨Ø§Ø±Øª Ø§Ø³Øª Ø§Ø² Ù…Ø¬Ù…ÙˆØ¹ Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ Ù…Ø¨Ù†Ø§ÛŒ Ú©Ø³Ø± Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ø¯Ø± Ø¢Ø®Ø±ÛŒÙ† Ø¯Ùˆ Ø³Ø§Ù„ Ù¾Ø±Ø¯Ø§Ø®Øª Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ØªÙ‚Ø³ÛŒÙ… Ø¨Ø± Û²Û´.",
    tags: ["Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ", "Ù…Ø§Ø¯Ù‡ Û·Û·", "Ù…Ø³ØªÙ…Ø±ÛŒ", "Ø³Ø§Ø¨Ù‚Ù‡ Ø¨ÛŒÙ…Ù‡"]
  },
  {
    id: "l6",
    category: "court",
    title: "Ø¯Ø§Ø¯Ù†Ø§Ù…Ù‡ Ø´Ù…Ø§Ø±Ù‡ Û±Û²ÛµÛ³ Ù‡ÛŒØ£Øª Ø¹Ù…ÙˆÙ…ÛŒ Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª Ø§Ø¯Ø§Ø±ÛŒ",
    subject: "Ø´Ù…ÙˆÙ„ ØªÙ…Ø§Ù…ÛŒ Ù…Ø²Ø§ÛŒØ§ÛŒ Ø¨Ù‡ ØªØ¨Ø¹ Ø´ØºÙ„ Ø¯Ø± Ø³Ù†ÙˆØ§Øª",
    content:
      "Ù…Ø¨Ù†Ø§ÛŒ Ù…Ø­Ø§Ø³Ø¨Ù‡ Ù¾Ø§Ø¯Ø§Ø´ Ù¾Ø§ÛŒØ§Ù† Ø®Ø¯Ù…Øª (Ø­Ù‚ Ø³Ù†ÙˆØ§Øª) Ù…ÙˆØ¶ÙˆØ¹ Ù…Ø§Ø¯Ù‡ Û²Û´ Ùˆ Û³Û± Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±ØŒ Ù…Ø·Ù„Ù‚ Ø­Ù‚ÙˆÙ‚ Ùˆ ÙÙˆÙ‚â€ŒØ§Ù„Ø¹Ø§Ø¯Ù‡â€ŒÙ‡Ø§ Ùˆ Ù…Ø²Ø§ÛŒØ§ÛŒ Ù…Ø³ØªÙ…Ø± Ù¾Ø±Ø¯Ø§Ø®ØªÛŒ Ø¨Ù‡ ØªØ¨Ø¹ Ø´ØºÙ„ Ú©Ø§Ø±Ú¯Ø± Ø§Ø³Øª Ùˆ Ù…Ø­Ø¯ÙˆØ¯ Ú©Ø±Ø¯Ù† Ø¢Ù† ØµØ±ÙØ§Ù‹ Ø¨Ù‡ Ø­Ø¯Ø§Ù‚Ù„ Ø¯Ø³ØªÙ…Ø²Ø¯ Ù…ØµÙˆØ¨ Ù…ØºØ§ÛŒØ± Ù‚Ø§Ù†ÙˆÙ† Ø§Ø³Øª.",
    tags: ["Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª Ø§Ø¯Ø§Ø±ÛŒ", "Ø¯Ø§Ø¯Ù†Ø§Ù…Ù‡ Û±Û²ÛµÛ³", "Ø­Ù‚ Ø³Ù†ÙˆØ§Øª", "Ù…Ø²Ø§ÛŒØ§ÛŒ Ø¨Ù‡ ØªØ¨Ø¹ Ø´ØºÙ„"]
  }
];

export default function DadKarApp() {
  const [dailyLawIndex, setDailyLawIndex] = useState(0);
  useEffect(() => {
    setDailyLawIndex(Math.floor(Math.random() * LAWS_DATABASE.length));
  }, []);

  const [activeTab, setActiveTab] = useState<"home" | "calculators" | "laws" | "about">("home");
  const [selectedCalc, setSelectedCalc] = useState<"severance" | "unemployment" | "tamin" | "pension">("severance");

  // ÙˆØ¶Ø¹ÛŒØª Ù†Ù…Ø§ÛŒØ´ Ù¾Ø±ÛŒÙ†Øª ÙÛŒØ´ Ø³Ù†ÙˆØ§Øª
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  // Û±. Ù…ØªØºÛŒØ±Ù‡Ø§ÛŒ Ø¨ÛŒÙ…Ù‡ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ
  const [taminWage, setTaminWage] = useState<number>(15000000);
  const [taminType, setTaminType] = useState<"mandatory" | "freelance_12" | "freelance_14" | "freelance_18" | "optional">(
    "mandatory"
  );

  // Û². Ù…ØªØºÛŒØ±Ù‡Ø§ÛŒ Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ
  const [unempAvgWage, setUnempAvgWage] = useState<number>(25000000);
  const [unempMinWage, setUnempMinWage] = useState<number>(11500000);
  const [unempDependents, setUnempDependents] = useState<number>(1);
  const [unempServiceMonths, setUnempServiceMonths] = useState<number>(36);
  const [unempIsMarried, setUnempIsMarried] = useState<boolean>(true);

  // Û³. Ù…ØªØºÛŒØ±Ù‡Ø§ÛŒ Ø³Ù†ÙˆØ§Øª Ùˆ ØªÙÚ©ÛŒÚ© Ù…Ø²Ø¯ (Ù…Ø§Ø¯Ù‡ Û²Û´ Ùˆ Û³Û¶ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±)
  const [sevWageBasisType, setSevWageBasisType] = useState<"base" | "detailed">("base");
  const [sevMonthlyWage, setSevMonthlyWage] = useState<number>(40000000); // ÙˆØ±ÙˆØ¯ Ù…Ø³ØªÙ‚ÛŒÙ… Ø³Ø±Ø¬Ù…Ø¹
  
  // Ø§Ù‚Ù„Ø§Ù… ØªÙÚ©ÛŒÚ©ÛŒ Ú©Ø§Ø±Ú¯Ø§Ù‡â€ŒÙ‡Ø§ÛŒ Ø¯Ø§Ø±Ø§ÛŒ Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„
  const [sevJobWage, setSevJobWage] = useState<number>(30000000);       // Ù…Ø²Ø¯ Ú¯Ø±ÙˆÙ‡ / Ù…Ø²Ø¯ Ø´ØºÙ„
  const [sevRankWage, setSevRankWage] = useState<number>(6000000);      // Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡
  const [sevBaseSanavat, setSevBaseSanavat] = useState<number>(4000000);// Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª ØªØ¬Ù…ÛŒØ¹ÛŒ Ù…Ø§Ù‡Ø§Ù†Ù‡

  const [sevYears, setSevYears] = useState<number>(30);
  const [sevMonths, setSevMonths] = useState<number>(6);
  const [sevDays, setSevDays] = useState<number>(0);

  // Û´. Ù…ØªØºÛŒØ±Ù‡Ø§ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ
  const [penAvgWage, setPenAvgWage] = useState<number>(30000000);
  const [penYears, setPenYears] = useState<number>(30);

  // ÙÛŒÙ„ØªØ± Ù‚ÙˆØ§Ù†ÛŒÙ†
  const [lawSearch, setLawSearch] = useState<string>("");
  const [lawFilter, setLawFilter] = useState<string>("all");

  // ØªÙˆØ§Ø¨Ø¹ Ú©Ù…Ú©ÛŒ Ø¬Ø¯Ø§Ø³Ø§Ø²ÛŒ Ø§Ø±Ù‚Ø§Ù… Ø³Ù‡â€ŒØ±Ù‚Ù…ÛŒ
  const formatToman = (num: number) => {
    return Math.round(num).toLocaleString("fa-IR") + " ØªÙˆÙ…Ø§Ù†";
  };

  const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  // ÙˆØ±ÙˆØ¯ÛŒ Ù¾ÙˆÙ„ÛŒ: Ø±Ù‚Ù… ÙØ§Ø±Ø³ÛŒ/Ø¹Ø±Ø¨ÛŒ Ø±Ø§ Ø¨Ù‡ Ù„Ø§ØªÛŒÙ† ØªØ¨Ø¯ÛŒÙ„ Ù…ÛŒâ€ŒÚ©Ù†Ø¯ Ùˆ Ù…Ú©Ø§Ù†â€ŒÙ†Ù…Ø§ÛŒ ØªØ§ÛŒÙ¾ Ø±Ø§
  // Ø¨Ø§ ÙˆØ¬ÙˆØ¯ Ø¬Ø¯Ø§Ú©Ù†Ù†Ø¯Ù‡â€ŒÙ‡Ø§ÛŒ Ù‡Ø²Ø§Ø±Ú¯Ø§Ù† Ø¯Ø± Ù‡Ù…Ø§Ù† Ù…ÙˆÙ‚Ø¹ÛŒØª Ù†Ú¯Ù‡ Ù…ÛŒâ€ŒØ¯Ø§Ø±Ø¯.
  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const input = e.currentTarget;
    const oldValue = input.value;
    const caret = input.selectionStart ?? oldValue.length;
    const normalizeDigits = (value: string) => value
      .replace(/[Û°-Û¹]/g, (d) => String("Û°Û±Û²Û³Û´ÛµÛ¶Û·Û¸Û¹".indexOf(d)))
      .replace(/[Ù -Ù©]/g, (d) => String("Ù Ù¡Ù¢Ù£Ù¤Ù¥Ù¦Ù§Ù¨Ù©".indexOf(d)));
    const beforeCaret = normalizeDigits(oldValue.slice(0, caret));
    const normalized = normalizeDigits(oldValue).replace(/[^0-9]/g, "");
    const digitsBeforeCaret = (beforeCaret.match(/[0-9]/g) || []).length;
    const parsed = normalized ? Number(normalized) : 0;
    setter(Number.isFinite(parsed) ? parsed : 0);

    requestAnimationFrame(() => {
      const formatted = formatNumberWithCommas(parsed);
      let nextCaret = formatted.length;
      if (digitsBeforeCaret < normalized.length) {
        let seen = 0;
        nextCaret = 0;
        while (nextCaret < formatted.length && seen < digitsBeforeCaret) {
          if (/[Û°-Û¹0-9]/.test(formatted[nextCaret])) seen++;
          nextCaret++;
        }
      }
      input.setSelectionRange(nextCaret, nextCaret);
    });
  };

  // --- Ù…Ø­Ø§Ø³Ø¨Ø§Øª Û±: Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ ---
  const taminResult = useMemo(() => {
    let workerRate = 0.07;
    let employerRate = 0.2;
    let unempRate = 0.03;

    if (taminType === "freelance_12") {
      workerRate = 0.12;
      employerRate = 0;
      unempRate = 0;
    } else if (taminType === "freelance_14") {
      workerRate = 0.14;
      employerRate = 0;
      unempRate = 0;
    } else if (taminType === "freelance_18") {
      workerRate = 0.18;
      employerRate = 0;
      unempRate = 0;
    } else if (taminType === "optional") {
      workerRate = 0.27;
      employerRate = 0;
      unempRate = 0;
    }

    const workerAmount = taminWage * workerRate;
    const employerAmount = taminWage * (employerRate + unempRate);
    const totalAmount = workerAmount + employerAmount;

    return {
      workerRate: Math.round(workerRate * 100),
      employerRate: Math.round((employerRate + unempRate) * 100),
      workerAmount,
      employerAmount,
      totalAmount
    };
  }, [taminWage, taminType]);

  // --- Ù…Ø­Ø§Ø³Ø¨Ø§Øª Û²: Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ (Ù…Ø§Ø¯Ù‡ Û· Ù‚Ø§Ù†ÙˆÙ† Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ) ---
  const unempResult = useMemo(() => {
    const base55 = unempAvgWage * 0.55;
    const validDepCount = Math.min(Math.max(0, unempDependents), 4);
    const depBonus = validDepCount * (unempMinWage * 0.1);
    let calculatedMonthly = base55 + depBonus;

    let appliedFloor = false;
    let appliedCap = false;

    if (calculatedMonthly < unempMinWage) {
      calculatedMonthly = unempMinWage;
      appliedFloor = true;
    }

    const cap80 = unempAvgWage * 0.8;
    if (calculatedMonthly > cap80) {
      calculatedMonthly = cap80;
      appliedCap = true;
    }

    let durationMonths = 0;
    if (unempServiceMonths >= 6 && unempServiceMonths <= 24) {
      durationMonths = unempIsMarried ? 12 : 6;
    } else if (unempServiceMonths >= 25 && unempServiceMonths <= 120) {
      durationMonths = unempIsMarried ? 18 : 12;
    } else if (unempServiceMonths >= 121 && unempServiceMonths <= 180) {
      durationMonths = unempIsMarried ? 26 : 18;
    } else if (unempServiceMonths >= 181 && unempServiceMonths <= 240) {
      durationMonths = unempIsMarried ? 36 : 24;
    } else if (unempServiceMonths >= 241) {
      durationMonths = unempIsMarried ? 50 : 36;
    }

    return {
      monthlyPayment: calculatedMonthly,
      durationMonths,
      base55,
      depBonus,
      cap80,
      appliedFloor,
      appliedCap,
      validDepCount
    };
  }, [unempAvgWage, unempMinWage, unempDependents, unempServiceMonths, unempIsMarried]);

  // --- Ù…Ø­Ø§Ø³Ø¨Ø§Øª Û³: Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù†â€ŒÚ©Ø§Ø± (Ù…Ø§Ø¯Ù‡ Û²Û´ Ùˆ ØªØ¨ØµØ±Ù‡ Û² Ù…Ø§Ø¯Ù‡ Û³Û¶ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±) ---
  const sevResult = useMemo(() => {
    const safeYears = Math.max(0, sevYears);
    const safeMonths = Math.min(11, Math.max(0, sevMonths));
    const safeDays = Math.min(30, Math.max(0, sevDays));

    const effectiveYears = safeYears + (safeMonths / 12) + (safeDays / 365);
    
    // Ø¯Ø± ØµÙˆØ±Øª ØªÙÚ©ÛŒÚ© Ø§Ù‚Ù„Ø§Ù…ØŒ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ Ø¨Ø±Ø§Ø¨Ø± Ø§Ø³Øª Ø¨Ø§: Ù…Ø²Ø¯ Ø´ØºÙ„ (Ú¯Ø±ÙˆÙ‡) + Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡ + Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª
    const effectiveMonthlyWage =
      sevWageBasisType === "base"
        ? sevMonthlyWage
        : sevJobWage + sevRankWage + sevBaseSanavat;

    const dailyWage = effectiveMonthlyWage / 30;
    const totalSeverance = effectiveMonthlyWage * effectiveYears;

    return {
      monthlyWage: effectiveMonthlyWage,
      dailyWage,
      effectiveYears,
      totalSeverance,
      basisLabel:
        sevWageBasisType === "base"
          ? "Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ / Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª (ÙˆØ±ÙˆØ¯ ÛŒÚ©Ù¾Ø§Ø±Ú†Ù‡)"
          : "Ù…Ø¬Ù…ÙˆØ¹ ØªÙÚ©ÛŒÚ©ÛŒ (Ù…Ø²Ø¯ Ø´ØºÙ„ + Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡ + Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª)",
      jobWage: sevJobWage,
      rankWage: sevRankWage,
      baseSanavat: sevBaseSanavat
    };
  }, [sevWageBasisType, sevMonthlyWage, sevJobWage, sevRankWage, sevBaseSanavat, sevYears, sevMonths, sevDays]);

  // --- Ù…Ø­Ø§Ø³Ø¨Ø§Øª Û´: Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ (Ù…Ø§Ø¯Ù‡ Û·Û· ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ) ---
  const penResult = useMemo(() => {
    const effectiveYears = Math.min(Math.max(0, penYears), 35);
    const estimatedPension = (penAvgWage / 30) * effectiveYears;
    return { estimatedPension, effectiveYears };
  }, [penAvgWage, penYears]);

  // ÙÛŒÙ„ØªØ± Ù‚ÙˆØ§Ù†ÛŒÙ† Ø¨Ø± Ø§Ø³Ø§Ø³ Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒ Ùˆ Ø¹Ø¨Ø§Ø±Øª Ø¬Ø³ØªØ¬Ùˆ
  const filteredLaws = useMemo(() => {
    return LAWS_DATABASE.filter((law) => {
      const matchCat = lawFilter === "all" || law.category === lawFilter;
      const matchSearch =
        law.title.includes(lawSearch) ||
        law.subject.includes(lawSearch) ||
        law.content.includes(lawSearch) ||
        law.tags.some((t) => t.includes(lawSearch));
      return matchCat && matchSearch;
    });
  }, [lawFilter, lawSearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none antialiased" dir="rtl">
      {/* Ù‡Ø¯Ø± Ø«Ø§Ø¨Øª Ùˆ Ø´ÛŒÚ© Ø¨Ø±Ù†Ø§Ù…Ù‡ */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
              Ø¯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Ø¯Ø§Ø¯Ú©Ù€Ø§Ø±
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  v2.2 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Ø¯Ø³ØªÛŒØ§Ø± Ø¬Ø§Ù…Ø¹ Ù…Ø­Ø§Ø³Ø¨Ø§Øª Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±ØŒ Ø³Ù†ÙˆØ§Øª Ùˆ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Ù…Ø­Ø§Ø³Ø¨Ø§Øª Ø¨Ø±Ø®Ø·
            </span>
          </div>
        </div>
      </header>

      {/* Ù…Ø­ØªÙˆØ§ÛŒ ØµÙØ­Ø§Øª */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28">
        {/* ================= ØµÙØ­Ù‡ Ø§ØµÙ„ÛŒ ================= */}
        {activeTab === "home" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <section className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[#0c211f] px-5 py-8 sm:px-10 sm:py-11 shadow-2xl shadow-emerald-950/30">
              <div className="absolute -left-16 -top-24 -z-10 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
              <div className="absolute -bottom-24 right-1/3 -z-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="absolute left-8 top-8 hidden text-7xl opacity-[0.08] sm:block" aria-hidden="true">âš–</div>
              <div className="relative max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> Ø¯Ø³ØªÛŒØ§Ø± Ù‡ÙˆØ´Ù…Ù†Ø¯ Ø±ÙˆØ§Ø¨Ø· Ú©Ø§Ø±
                </div>
                <h1 className="text-3xl font-black leading-[1.35] tracking-tight text-white sm:text-5xl">
                  Ø­Ù‚â€ŒÙˆØ­Ù‚ÙˆÙ‚â€ŒØªØ§Ù†ØŒ<br className="sm:hidden" /> <span className="text-emerald-300">Ø±ÙˆØ´Ù† Ùˆ Ø­Ø³Ø§Ø¨â€ŒØ´Ø¯Ù‡.</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Ù…Ø­Ø§Ø³Ø¨Ù‡â€ŒÚ¯Ø±Ù‡Ø§ÛŒ Ú©Ø§Ø±Ø¨Ø±Ø¯ÛŒ Ùˆ Ù…ØªÙ† Ù‚ÙˆØ§Ù†ÛŒÙ† Ú©Ø§Ø± Ø±Ø§ ÛŒÚ©â€ŒØ¬Ø§ Ø¯Ø§Ø´ØªÙ‡ Ø¨Ø§Ø´ÛŒØ¯Ø› Ø³Ø±ÛŒØ¹ØŒ Ø³Ø§Ø¯Ù‡ Ùˆ Ù‚Ø§Ø¨Ù„â€ŒÙÙ‡Ù….
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button type="button" onClick={() => { setActiveTab("calculators"); setSelectedCalc("severance"); }} className="group inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-200">
                    <span>Ø´Ø±ÙˆØ¹ Ù…Ø­Ø§Ø³Ø¨Ù‡</span><span className="transition-transform group-hover:-translate-x-1">â†</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab("laws")} className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Ø¬Ø³Øªâ€ŒÙˆØ¬Ùˆ Ø¯Ø± Ù‚ÙˆØ§Ù†ÛŒÙ†</button>
                </div>
              </div>
              <div className="relative mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 sm:absolute sm:bottom-8 sm:left-8 sm:mt-0 sm:w-64 sm:border-0 sm:pt-0">
                <div className="rounded-xl bg-black/15 p-3 text-center backdrop-blur-sm"><div className="text-xl font-black text-white">Û´</div><div className="mt-1 text-[10px] text-slate-400 sm:text-xs">Ù…Ø­Ø§Ø³Ø¨Ù‡â€ŒÚ¯Ø± Ú©Ø§Ø±Ø¨Ø±Ø¯ÛŒ</div></div>
                <div className="rounded-xl bg-black/15 p-3 text-center backdrop-blur-sm"><div className="text-xl font-black text-white">Û¶</div><div className="mt-1 text-[10px] text-slate-400 sm:text-xs">Ù…ØªÙ† Ùˆ Ø±Ø£ÛŒ Ø­Ù‚ÙˆÙ‚ÛŒ</div></div>
                <div className="rounded-xl bg-black/15 p-3 text-center backdrop-blur-sm"><div className="text-xl font-black text-white">Û²Û´/Û·</div><div className="mt-1 text-[10px] text-slate-400 sm:text-xs">Ø¯Ø± Ø¯Ø³ØªØ±Ø³ Ø´Ù…Ø§</div></div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div><span className="text-xs font-bold tracking-wide text-emerald-400">Ø¯Ø³ØªØ±Ø³ÛŒ Ø³Ø±ÛŒØ¹</span><h2 className="mt-1 text-xl font-black text-white">Ø§Ø² Ú©Ø¬Ø§ Ø´Ø±ÙˆØ¹ Ú©Ù†ÛŒÙ…ØŸ</h2></div>
                <button type="button" onClick={() => setActiveTab("calculators")} className="text-xs font-bold text-slate-400 transition hover:text-emerald-300">Ù‡Ù…Ù‡ Ø§Ø¨Ø²Ø§Ø±Ù‡Ø§ â†</button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { id: "severance" as const, icon: "âš–ï¸", title: "Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù†â€ŒÚ©Ø§Ø±", desc: "Ø¨Ø±Ø¢ÙˆØ±Ø¯ Ù¾Ø§Ø¯Ø§Ø´ Ù¾Ø§ÛŒØ§Ù† Ø®Ø¯Ù…Øª Ùˆ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§", law: "Ù…Ø§Ø¯Ù‡ Û²Û´", color: "emerald" },
                  { id: "unemployment" as const, icon: "ðŸ›Ÿ", title: "Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ", desc: "Ù…Ø­Ø§Ø³Ø¨Ù‡ Ù…Ù‚Ø±Ø±ÛŒ Ùˆ Ù…Ø¯Øª Ø§Ø³ØªØ­Ù‚Ø§Ù‚", law: "Ù…Ø§Ø¯Ù‡ Û·", color: "teal" },
                  { id: "tamin" as const, icon: "ðŸ›¡ï¸", title: "Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ", desc: "ØªÙÚ©ÛŒÚ© Ø³Ù‡Ù… Ú©Ø§Ø±Ú¯Ø± Ùˆ Ú©Ø§Ø±ÙØ±Ù…Ø§", law: "Ù…Ø§Ø¯Ù‡ Û²Û¸", color: "cyan" },
                  { id: "pension" as const, icon: "ðŸŒ…", title: "Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ", desc: "ØªØ®Ù…ÛŒÙ† Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø± Ù¾Ø§ÛŒÙ‡ Ø³Ø§Ø¨Ù‚Ù‡ Ùˆ Ù…Ø²Ø¯", law: "Ù…Ø§Ø¯Ù‡ Û·Û·", color: "indigo" },
                ].map((item, index) => (
                  <button key={item.id} type="button" onClick={() => { setActiveTab("calculators"); setSelectedCalc(item.id); }} className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/70 p-4 text-right transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-800 hover:shadow-xl hover:shadow-emerald-950/20" style={{ animationDelay: `${index * 70}ms` }}>
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/70 text-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-3">{item.icon}</span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-white transition group-hover:text-emerald-300">{item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{item.desc}</span></span>
                    <span className="shrink-0 self-start rounded-full border border-slate-600/70 bg-slate-900/60 px-2 py-1 text-[10px] text-slate-400">{item.law}</span>
                    <span className="absolute bottom-3 left-4 text-slate-600 transition group-hover:-translate-x-1 group-hover:text-emerald-300">â†</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl border border-amber-300/15 bg-gradient-to-l from-amber-400/10 via-slate-800/80 to-slate-800/80 p-5 sm:p-6">
              <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-xl">ðŸ“œ</span><div><div className="text-[11px] font-bold tracking-wide text-amber-300">ÛŒÚ© Ù†Ú©ØªÙ‡ Ø§Ø² Ù‚ÙˆØ§Ù†ÛŒÙ† Ú©Ø§Ø±</div><h3 className="mt-1 text-sm font-extrabold text-white">{LAWS_DATABASE[dailyLawIndex]?.title}</h3><p className="mt-2 text-xs leading-6 text-slate-300">{LAWS_DATABASE[dailyLawIndex]?.content}</p><button type="button" onClick={() => setActiveTab("laws")} className="mt-3 text-xs font-bold text-amber-300 transition hover:text-amber-200">Ù…Ø·Ø§Ù„Ø¹Ù‡â€ŒÛŒ Ø¨ÛŒØ´ØªØ± Ø¯Ø± Ø¨Ø§Ù†Ú© Ù‚ÙˆØ§Ù†ÛŒÙ† â†</button></div></div>
            </section>
            <p className="pb-1 text-center text-[10px] leading-5 text-slate-500">Ù…Ø­Ø§Ø³Ø¨Ø§Øª Ø§ÛŒÙ† Ø³Ø§Ù…Ø§Ù†Ù‡ Ø¨Ø±Ø¢ÙˆØ±Ø¯ÛŒ Ùˆ Ø¬Ù‡Øª Ø±Ø§Ù‡Ù†Ù…Ø§ÛŒÛŒ Ø§ÙˆÙ„ÛŒÙ‡ Ø§Ø³ØªØ› Ø¨Ø±Ø§ÛŒ ØªØµÙ…ÛŒÙ… Ù†Ù‡Ø§ÛŒÛŒØŒ Ø¢Ø®Ø±ÛŒÙ† Ù…Ù‚Ø±Ø±Ø§Øª Ùˆ Ø´Ø±Ø§ÛŒØ· Ù¾Ø±ÙˆÙ†Ø¯Ù‡ Ø±Ø§ Ø¨Ø±Ø±Ø³ÛŒ Ú©Ù†ÛŒØ¯.</p>
          </div>
        )}

        {/* ================= ØµÙØ­Ù‡ Ø§Ø¨Ø²Ø§Ø±Ù‡Ø§ Ùˆ Ù…Ø­Ø§Ø³Ø¨Ø§Øª ================= */}
        {activeTab === "calculators" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Ø³ÙˆØ¦ÛŒÚ† Ø¨ÛŒÙ† Û´ Ù…Ø§Ø´ÛŒÙ† Ø­Ø³Ø§Ø¨ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => setSelectedCalc("severance")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "severance"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù†â€ŒÚ©Ø§Ø±
              </button>
              <button
                onClick={() => setSelectedCalc("unemployment")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "unemployment"
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ
              </button>
              <button
                onClick={() => setSelectedCalc("tamin")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "tamin"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ØªØ£Ù…ÛŒÙ†
              </button>
              <button
                onClick={() => setSelectedCalc("pension")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCalc === "pension"
                    ? "bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ
              </button>
            </div>

            {/* --- ÙØ±Ù… Û±: Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù† Ú©Ø§Ø± --- */}
            {selectedCalc === "severance" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-5">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-emerald-400"></span>
                      Ù¾Ø§Ø±Ø§Ù…ØªØ±Ù‡Ø§ÛŒ Ù…Ø­Ø§Ø³Ø¨Ù‡ Ø­Ù‚ Ø³Ù†ÙˆØ§Øª (Ù…Ø§Ø¯Ù‡ Û²Û´ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ù…Ø­Ø§Ø³Ø¨Ù‡ Ø¯Ù‚ÛŒÙ‚ Ø¨Ø§ Ù¾ÙˆØ´Ø´ Ú©Ø§Ù…Ù„ Ú©Ø§Ø±Ú¯Ø§Ù‡â€ŒÙ‡Ø§ÛŒ Ø¹Ø§Ø¯ÛŒ Ùˆ Ú©Ø§Ø±Ú¯Ø§Ù‡â€ŒÙ‡Ø§ÛŒ Ø¯Ø§Ø±Ø§ÛŒ Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„
                    </p>
                  </div>

                  {/* Ø³ÙˆØ¦ÛŒÚ† Ù†Ø­ÙˆÙ‡ ÙˆØ±ÙˆØ¯ Ø¯Ø³ØªÙ…Ø²Ø¯ */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Ù†Ø­ÙˆÙ‡ ÙˆØ±ÙˆØ¯ Ø¯Ø³ØªÙ…Ø²Ø¯ Ù…Ù„Ø§Ú© Ø³Ù†ÙˆØ§Øª (ØªØ¨ØµØ±Ù‡ Û² Ù…Ø§Ø¯Ù‡ Û³Û¶ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSevWageBasisType("base")}
                        className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-right flex flex-col justify-center ${
                          sevWageBasisType === "base"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                            : "bg-slate-850 border-slate-700 text-slate-400 hover:bg-slate-750"
                        }`}
                      >
                        <span className="font-extrabold">Û±. ÙˆØ±ÙˆØ¯ ÛŒÚ©Ù¾Ø§Ø±Ú†Ù‡ (Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ / Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª)</span>
                        <span className="text-[11px] opacity-75 mt-0.5 font-normal">
                          Ù…Ø®ØµÙˆØµ Ú©Ø§Ø±Ù…Ù†Ø¯Ø§Ù†ÛŒ Ú©Ù‡ Ø±Ù‚Ù… Ú©Ù„ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ Ø¯Ø± ÙÛŒØ´ Ø­Ù‚ÙˆÙ‚ÛŒ Ø¢Ù†â€ŒÙ‡Ø§ Ø¯Ø±Ø¬ Ø´Ø¯Ù‡ Ø§Ø³Øª
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSevWageBasisType("detailed")}
                        className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-right flex flex-col justify-center ${
                          sevWageBasisType === "detailed"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                            : "bg-slate-850 border-slate-700 text-slate-400 hover:bg-slate-750"
                        }`}
                      >
                        <span className="font-extrabold">Û². ØªÙÚ©ÛŒÚ© Ø§Ù‚Ù„Ø§Ù… (Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„)</span>
                        <span className="text-[11px] opacity-75 mt-0.5 font-normal">
                          ØªÙÚ©ÛŒÚ© Ø¯Ù‚ÛŒÙ‚: Ù…Ø²Ø¯ Ú¯Ø±ÙˆÙ‡ (Ø´ØºÙ„) + Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡ + Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª Ù…Ø§Ù‡Ø§Ù†Ù‡
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* ÙØ±Ù… ÙÛŒÙ„Ø¯Ù‡Ø§ÛŒ ÙˆØ±ÙˆØ¯ Ø­Ù‚ÙˆÙ‚: Ø¨Ø³ØªÙ‡ Ø¨Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ø§Ø±Ø¨Ø± */}
                  {sevWageBasisType === "base" ? (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          Ø¢Ø®Ø±ÛŒÙ† Ù…Ø²Ø¯ Ù…Ø§Ù‡Ø§Ù†Ù‡ Ù…Ø¨Ù†Ø§ / Ø­Ù‚ÙˆÙ‚ Ø«Ø§Ø¨Øª (ØªÙˆÙ…Ø§Ù†):
                        </label>
                        <span className="text-[11px] text-emerald-400 font-mono">
                          Ù…Ø²Ø¯ Ø±ÙˆØ²Ø§Ù†Ù‡: {formatToman(sevMonthlyWage / 30)}
                        </span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={formatNumberWithCommas(sevMonthlyWage)}
                        onChange={(e) => handlePriceInputChange(e, setSevMonthlyWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white font-mono text-base outline-none transition-all"
                        placeholder="Ù…Ø«Ù„Ø§Ù‹: Û´Û°,Û°Û°Û°,Û°Û°Û°"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
                      <div className="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2">
                        Ø§Ø¬Ø²Ø§ÛŒ ØªØ´Ú©ÛŒÙ„â€ŒØ¯Ù‡Ù†Ø¯Ù‡ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ Ø¨Ø± Ø§Ø³Ø§Ø³ Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„ ÙˆØ²Ø§Ø±Øª Ú©Ø§Ø±:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Û±. Ù…Ø²Ø¯ Ø´ØºÙ„ / Ù…Ø²Ø¯ Ú¯Ø±ÙˆÙ‡ (ØªÙˆÙ…Ø§Ù†):
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            value={formatNumberWithCommas(sevJobWage)}
                            onChange={(e) => handlePriceInputChange(e, setSevJobWage)}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Û². Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡ Ù…Ø§Ù‡ÛŒØ§Ù†Ù‡ (ØªÙˆÙ…Ø§Ù†):
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            value={formatNumberWithCommas(sevRankWage)}
                            onChange={(e) => handlePriceInputChange(e, setSevRankWage)}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Û³. Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª Ù…Ø§Ù‡Ø§Ù†Ù‡ (ØªÙˆÙ…Ø§Ù†):
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            value={formatNumberWithCommas(sevBaseSanavat)}
                            onChange={(e) => handlePriceInputChange(e, setSevBaseSanavat)}
                            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex flex-wrap justify-between items-center text-xs">
                        <span className="text-slate-300 font-semibold">Ù…Ø¬Ù…ÙˆØ¹ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ÛŒ Ø­Ø§ØµÙ„Ù‡ Ù…Ù„Ø§Ú© Ø³Ù†ÙˆØ§Øª:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-300 font-bold font-mono text-sm">
                            {formatToman(sevJobWage + sevRankWage + sevBaseSanavat)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (Ø±ÙˆØ²Ø§Ù†Ù‡: {formatToman((sevJobWage + sevRankWage + sevBaseSanavat) / 30)})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ø³Ø§Ø¨Ù‚Ù‡ Ø®Ø¯Ù…Øª Ø¨Ù‡ ØªÙÚ©ÛŒÚ© Ø³Ø§Ù„ØŒ Ù…Ø§Ù‡ØŒ Ø±ÙˆØ² */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Ù…Ø¯Øª Ø³Ø§Ø¨Ù‚Ù‡ Ø§Ø´ØªØºØ§Ù„ (Ø±ÙˆØ²Ø´Ù…Ø§Ø± Ø¯Ù‚ÛŒÙ‚):
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Ø³Ø§Ù„:</span>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={sevYears}
                          onChange={(e) => setSevYears(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Ù…Ø§Ù‡ (Û° Ø§Ù„ÛŒ Û±Û±):</span>
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={sevMonths}
                          onChange={(e) =>
                            setSevMonths(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))
                          }
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Ø±ÙˆØ² (Û° Ø§Ù„ÛŒ Û³Û°):</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={sevDays}
                          onChange={(e) =>
                            setSevDays(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))
                          }
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ú©Ø§Ø±Øª Ù†Ù…Ø§ÛŒØ´ Ù†ØªØ§ÛŒØ¬ Ø³Ù†ÙˆØ§Øª */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Ù†ØªÛŒØ¬Ù‡ Ø±Ø³Ù…ÛŒ Ù…Ø­Ø§Ø³Ø¨Ø§Øª
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPdfModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <span>ðŸ–¨ï¸</span>
                      Ú†Ø§Ù¾ ÙÛŒØ´ Ø±Ø³Ù…ÛŒ / Ø®Ø±ÙˆØ¬ÛŒ PDF
                    </button>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Ù…Ø¨Ù„Øº Ú©Ù„ Ø­Ù‚ Ø³Ù†ÙˆØ§Øª Ø§Ø³ØªØ­Ù‚Ø§Ù‚ÛŒ:</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
                      {formatToman(sevResult.totalSeverance)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">Ø³Ø§Ø¨Ù‚Ù‡ Ù…Ø¤Ø«Ø± Ù…Ø­Ø§Ø³Ø¨Ø§ØªÛŒ:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {sevResult.effectiveYears.toFixed(2)} Ø³Ø§Ù„
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ÛŒ Ù…Ø§Ù‡Ø§Ù†Ù‡:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(sevResult.monthlyWage)}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">Ù†Ø­ÙˆÙ‡ Ù…Ø¨Ù†Ø§Ú¯Ø°Ø§Ø±ÛŒ:</span>
                      <span className="font-bold text-slate-200 truncate block">
                        {sevResult.basisLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ÙØ±Ù… Û²: Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ --- */}
            {selectedCalc === "unemployment" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-teal-400"></span>
                      Ù¾Ø§Ø±Ø§Ù…ØªØ±Ù‡Ø§ÛŒ Ù…Ù‚Ø±Ø±ÛŒ Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ (Ù…Ø§Ø¯Ù‡ Û· Ù‚Ø§Ù†ÙˆÙ† Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Ù…ØªÙˆØ³Ø· Ù…Ø²Ø¯ ÛŒØ§ Ø­Ù‚ÙˆÙ‚ Û¹Û° Ø±ÙˆØ² Ø¢Ø®Ø± (ØªÙˆÙ…Ø§Ù†):
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={formatNumberWithCommas(unempAvgWage)}
                        onChange={(e) => handlePriceInputChange(e, setUnempAvgWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Ø­Ø¯Ø§Ù‚Ù„ Ø¯Ø³ØªÙ…Ø²Ø¯ Ù…Ø§Ù‡Ø§Ù†Ù‡ Ø³Ø§Ù„ Ø¬Ø§Ø±ÛŒ (ØªÙˆÙ…Ø§Ù†):
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={formatNumberWithCommas(unempMinWage)}
                        onChange={(e) => handlePriceInputChange(e, setUnempMinWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Ø³Ø§Ø¨Ù‚Ù‡ Ù¾Ø±Ø¯Ø§Ø®Øª Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ (Ù…Ø§Ù‡):
                      </label>
                      <input
                        type="number"
                        min="6"
                        value={unempServiceMonths}
                        onChange={(e) => setUnempServiceMonths(Math.max(6, parseInt(e.target.value) || 6))}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-white font-mono text-center outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        ØªØ¹Ø¯Ø§Ø¯ Ø§ÙØ±Ø§Ø¯ ØªØ­Øª ØªÚ©ÙÙ„ (Ø­Ø¯Ø§Ú©Ø«Ø± Û´ Ù†ÙØ±):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={unempDependents}
                        onChange={(e) =>
                          setUnempDependents(Math.min(4, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-white font-mono text-center outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">ÙˆØ¶Ø¹ÛŒØª ØªØ£Ù‡Ù„:</label>
                      <button
                        type="button"
                        onClick={() => setUnempIsMarried(!unempIsMarried)}
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          unempIsMarried
                            ? "bg-teal-500/20 border-teal-500 text-teal-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        {unempIsMarried ? "Ù…ØªØ£Ù‡Ù„ ÛŒØ§ Ù…ØªÚ©ÙÙ„" : "Ù…Ø¬Ø±Ø¯ (Ø¨Ø¯ÙˆÙ† ØªÚ©ÙÙ„)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ú©Ø§Ø±Øª Ù†ØªØ§ÛŒØ¬ Ø¨ÛŒÚ©Ø§Ø±ÛŒ */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-teal-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Ø¨Ø±Ø¢ÙˆØ±Ø¯ Ù…Ù‚Ø±Ø±ÛŒ Ù…Ø§Ù‡Ø§Ù†Ù‡ Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">
                      Ù…Ø¯Øª Ù…Ø¬Ø§Ø² Ø§Ø³ØªØ­Ù‚Ø§Ù‚:{" "}
                      <strong className="text-teal-400 font-mono text-sm">
                        {unempResult.durationMonths} Ù…Ø§Ù‡
                      </strong>
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Ù…Ø¨Ù„Øº Ù¾Ø±Ø¯Ø§Ø®ØªÛŒ Ù…Ø§Ù‡Ø§Ù†Ù‡ Ø¨Ù‡ Ù…ØªÙ‚Ø§Ø¶ÛŒ:</span>
                    <div className="text-2xl sm:text-3xl font-black text-teal-400 tracking-tight font-mono">
                      {formatToman(unempResult.monthlyPayment)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">Ù¾Ø§ÛŒÙ‡ ÛµÛµÙª Ø­Ù‚ÙˆÙ‚ Ù…ØªÙˆØ³Ø·:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(unempResult.base55)}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">Ø§ÙØ²Ø§ÛŒØ´ Ø¹Ø§Ø¦Ù„Ù‡â€ŒÙ…Ù†Ø¯ÛŒ (ØªÚ©ÙÙ„):</span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(unempResult.depBonus)}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">ÙˆØ¶Ø¹ÛŒØª Ø³Ù‚Ù Ùˆ Ú©Ù Ù‚Ø§Ù†ÙˆÙ†ÛŒ:</span>
                      <span className="font-bold text-slate-200">
                        {unempResult.appliedFloor
                          ? "Ø§Ø¹Ù…Ø§Ù„ Ø­Ø¯Ø§Ù‚Ù„ Ø¯Ø³ØªÙ…Ø²Ø¯ (Ú©Ù)"
                          : unempResult.appliedCap
                          ? "Ø§Ø¹Ù…Ø§Ù„ Ø³Ù‚Ù Û¸Û°Ùª"
                          : "Ø¹Ø§Ø¯ÛŒ"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ÙØ±Ù… Û³: Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ --- */}
            {selectedCalc === "tamin" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-cyan-400"></span>
                      Ù…Ø­Ø§Ø³Ø¨Ù‡ Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ (Ù…Ø§Ø¯Ù‡ Û²Û¸ Ù‚Ø§Ù†ÙˆÙ†)
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Ø­Ù‚ÙˆÙ‚ Ùˆ Ù…Ø²Ø§ÛŒØ§ÛŒ Ù…Ø´Ù…ÙˆÙ„ Ú©Ø³Ø± Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ù…Ø§Ù‡Ø§Ù†Ù‡ (ØªÙˆÙ…Ø§Ù†):
                    </label>
                    <input
                      type="text"
                      value={formatNumberWithCommas(taminWage)}
                      onChange={(e) => handlePriceInputChange(e, setTaminWage)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white font-mono text-base outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Ù†ÙˆØ¹ Ù¾ÙˆØ´Ø´ Ø¨ÛŒÙ…Ù‡â€ŒØ§ÛŒ:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTaminType("mandatory")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "mandatory"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Ø§Ø¬Ø¨Ø§Ø±ÛŒ Ú©Ø§Ø±Ú¯Ø±ÛŒ (Û³Û°Ùª Ú©Ù„: Û·Ùª Ø³Ù‡Ù… Ú©Ø§Ø±Ú¯Ø± + Û²Û³Ùª Ú©Ø§Ø±ÙØ±Ù…Ø§)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("freelance_12")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "freelance_12"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Ù…Ø´Ø§ØºÙ„ Ø¢Ø²Ø§Ø¯ Û±Û²Ùª (Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ Ùˆ ÙÙˆØª Ø¨Ø¹Ø¯ Ø§Ø² Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("freelance_14")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "freelance_14"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Ù…Ø´Ø§ØºÙ„ Ø¢Ø²Ø§Ø¯ Û±Û´Ùª (Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ Ùˆ ÙÙˆØª Ù‚Ø¨Ù„ Ùˆ Ø¨Ø¹Ø¯ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("freelance_18")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all ${
                          taminType === "freelance_18"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Ù…Ø´Ø§ØºÙ„ Ø¢Ø²Ø§Ø¯ Û±Û¸Ùª (Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒØŒ ÙÙˆØª Ùˆ Ø§Ø²Ú©Ø§Ø±Ø§ÙØªØ§Ø¯Ú¯ÛŒ)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTaminType("optional")}
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition-all sm:col-span-2 ${
                          taminType === "optional"
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Ø¨ÛŒÙ…Ù‡ Ø§Ø®ØªÛŒØ§Ø±ÛŒ Û²Û·Ùª (Ú©Ø§Ù…Ù„ Ø´Ø§Ù…Ù„ Ø¯Ø±Ù…Ø§Ù† Ùˆ Ø§Ø²Ú©Ø§Ø±Ø§ÙØªØ§Ø¯Ú¯ÛŒ)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ú©Ø§Ø±Øª Ù†Ù…Ø§ÛŒØ´ Ù†ØªØ§ÛŒØ¬ Ø¨ÛŒÙ…Ù‡ */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-cyan-500/30 shadow-xl space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Ø³Ø±Ø¬Ù…Ø¹ Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ Ù…Ø§Ù‡Ø§Ù†Ù‡ Ùˆ ØªÙÚ©ÛŒÚ© Ø³Ù‡Ø§Ù…
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Ù…Ø¬Ù…ÙˆØ¹ Ú©Ù„ Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ ÙˆØ§Ø±ÛŒØ²ÛŒ Ø¨Ù‡ ØªØ§Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ:</span>
                    <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">
                      {formatToman(taminResult.totalAmount)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        Ø³Ù‡Ù… Ú©Ø³Ø± Ø§Ø² Ø¨ÛŒÙ…Ù‡â€ŒØ´Ø¯Ù‡ ({taminResult.workerRate}Ùª):
                      </span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(taminResult.workerAmount)}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        Ø³Ù‡Ù… Ù¾Ø±Ø¯Ø§Ø®ØªÛŒ Ú©Ø§Ø±ÙØ±Ù…Ø§ ({taminResult.employerRate}Ùª):
                      </span>
                      <span className="font-bold font-mono text-slate-200">
                        {formatToman(taminResult.employerAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ÙØ±Ù… Û´: Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ --- */}
            {selectedCalc === "pension" && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/80 shadow-lg space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-indigo-400"></span>
                      Ø¨Ø±Ø¢ÙˆØ±Ø¯ Ù…Ø³ØªÙ…Ø±ÛŒ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ (Ù…Ø§Ø¯Ù‡ Û·Û· Ù‚Ø§Ù†ÙˆÙ† ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Ù…ÛŒØ§Ù†Ú¯ÛŒÙ† Ø¯Ø³ØªÙ…Ø²Ø¯ Ù…Ø´Ù…ÙˆÙ„ Ø¨ÛŒÙ…Ù‡ Û² Ø³Ø§Ù„ Ø¢Ø®Ø± (ØªÙˆÙ…Ø§Ù†):
                      </label>
                      <input
                        type="text"
                        value={formatNumberWithCommas(penAvgWage)}
                        onChange={(e) => handlePriceInputChange(e, setPenAvgWage)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-white font-mono text-base outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Ø³Ø§Ø¨Ù‚Ù‡ Ù¾Ø±Ø¯Ø§Ø®Øª Ø­Ù‚ Ø¨ÛŒÙ…Ù‡ (Ø³Ø§Ù„):
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="35"
                        value={penYears}
                        onChange={(e) => setPenYears(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-white font-mono text-center outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Ú©Ø§Ø±Øª Ù†ØªØ§ÛŒØ¬ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-6 border border-indigo-500/30 shadow-xl space-y-4">
                  <div className="border-b border-slate-700 pb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Ø¨Ø±Ø¢ÙˆØ±Ø¯ Ø§ÙˆÙ„ÛŒÙ‡ Ø­Ú©Ù… Ù…Ø³ØªÙ…Ø±ÛŒ Ù…Ø§Ù‡ÛŒØ§Ù†Ù‡
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Ù…Ø³ØªÙ…Ø±ÛŒ Ù†Ø§Ø®Ø§Ù„Øµ Ø¨Ø§Ø²Ù†Ø´Ø³ØªÚ¯ÛŒ Ù…Ø§Ù‡Ø§Ù†Ù‡:</span>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight font-mono">
                      {formatToman(penResult.estimatedPension)}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    ÙØ±Ù…ÙˆÙ„ Ø±Ø³Ù…ÛŒ Ù…Ø§Ø¯Ù‡ Û·Û·:{" "}
                    <code className="text-indigo-300 font-mono">
                      (Ù…ÛŒØ§Ù†Ú¯ÛŒÙ† Û²Û´ Ù…Ø§Ù‡ Ø¢Ø®Ø± Ã· Û³Û°) Ã— Ø³Ø§Ø¨Ù‚Ù‡ Ù…Ø¬Ø§Ø² (Ø­Ø¯Ø§Ú©Ø«Ø± Û³Ûµ Ø³Ø§Ù„)
                    </code>
                    . Ø´Ø§ÛŒØ§Ù† Ø°Ú©Ø± Ø§Ø³Øª Ú©Ù…Ú©â€ŒÙ‡Ø²ÛŒÙ†Ù‡â€ŒÙ‡Ø§ÛŒ Ø¹Ø§Ø¦Ù„Ù‡â€ŒÙ…Ù†Ø¯ÛŒ Ùˆ Ù…Ø³Ú©Ù† Ø¯Ø± Ø²Ù…Ø§Ù† ØµØ¯ÙˆØ± Ø­Ú©Ù… Ù†Ù‡Ø§ÛŒÛŒ ØªÙˆØ³Ø· Ø³Ø§Ø²Ù…Ø§Ù† ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ Ø¨Ù‡ Ø§ÛŒÙ† Ù…Ø¨Ù„Øº Ø§Ø¶Ø§ÙÙ‡ Ø®ÙˆØ§Ù‡Ø¯ Ø´Ø¯.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ØµÙØ­Ù‡ Ø¨Ø§Ù†Ú© Ù‚ÙˆØ§Ù†ÛŒÙ† ================= */}
        {activeTab === "laws" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Ù†ÙˆØ§Ø± Ø¬Ø³ØªØ¬Ùˆ Ùˆ ÙÛŒÙ„ØªØ± */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
              <input
                type="text"
                placeholder="Ø¬Ø³ØªØ¬Ùˆ Ø¯Ø± Ù…ØªÙ† Ù…ÙˆØ§Ø¯ Ù‚Ø§Ù†ÙˆÙ†ÛŒØŒ Ø¨Ø®Ø´Ù†Ø§Ù…Ù‡â€ŒÙ‡Ø§ Ùˆ Ø¯Ø§Ø¯Ù†Ø§Ù…Ù‡â€ŒÙ‡Ø§..."
                value={lawSearch}
                onChange={(e) => setLawSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder:text-slate-500"
              />

              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setLawFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "all"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Ù‡Ù…Ù‡ Ù‚ÙˆØ§Ù†ÛŒÙ†
                </button>
                <button
                  onClick={() => setLawFilter("labor")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "labor"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±
                </button>
                <button
                  onClick={() => setLawFilter("tamin")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "tamin"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ØªØ£Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ
                </button>
                <button
                  onClick={() => setLawFilter("unemployment")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "unemployment"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ
                </button>
                <button
                  onClick={() => setLawFilter("court")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    lawFilter === "court"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Ø¢Ø±Ø§ÛŒ Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª
                </button>
              </div>
            </div>

            {/* Ù„ÛŒØ³Øª Ù‚ÙˆØ§Ù†ÛŒÙ† */}
            <div className="space-y-4">
              {filteredLaws.length > 0 ? (
                filteredLaws.map((law) => (
                  <div
                    key={law.id}
                    className="p-5 rounded-2xl bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-emerald-400">{law.title}</h3>
                      <span className="text-[10px] bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">
                        {law.category}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300">{law.subject}</p>
                    <p className="text-xs text-slate-400 leading-relaxed text-justify">{law.content}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {law.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-900/80 text-slate-400 px-2 py-0.5 rounded border border-slate-750"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Ù…ÙˆØ±Ø¯ÛŒ Ù…Ø·Ø§Ø¨Ù‚ Ø¨Ø§ Ø¬Ø³ØªØ¬ÙˆÛŒ Ø´Ù…Ø§ ÛŒØ§ÙØª Ù†Ø´Ø¯.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ØµÙØ­Ù‡ Ø¯Ø±Ø¨Ø§Ø±Ù‡ Ù…Ø§ Ùˆ Ø±Ø§Ù‡Ù†Ù…Ø§ ================= */}
        {activeTab === "about" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">âš–ï¸</span>
                Ø¯Ø±Ø¨Ø§Ø±Ù‡ Ù†Ø±Ù…â€ŒØ§ÙØ²Ø§Ø± ØªØ®ØµØµÛŒ Ø¯Ø§Ø¯Ú©Ø§Ø±
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                Ø³Ø§Ù…Ø§Ù†Ù‡ <strong>Ø¯Ø§Ø¯Ú©Ø§Ø±</strong> Ø§Ø¨Ø²Ø§Ø± ØªØ®ØµØµÛŒ ØªØ­Øª ÙˆØ¨ Ø¨Ø±Ø§ÛŒ Ú©Ø§Ø±Ø´Ù†Ø§Ø³Ø§Ù† Ù…Ù†Ø§Ø¨Ø¹ Ø§Ù†Ø³Ø§Ù†ÛŒØŒ Ø­Ø³Ø§Ø¨Ø¯Ø§Ø±Ø§Ù† Ø­Ù‚ÙˆÙ‚ Ùˆ Ø¯Ø³ØªÙ…Ø²Ø¯ØŒ Ú©Ø§Ø±ÙØ±Ù…Ø§ÛŒØ§Ù† Ùˆ Ú©Ø§Ø±Ú¯Ø±Ø§Ù† Ø´Ø±ÛŒÙ Ø§Ø³Øª ØªØ§ Ù…Ø­Ø§Ø³Ø¨Ø§Øª Ù¾ÛŒÚ†ÛŒØ¯Ù‡ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø± Ùˆ Ø¨ÛŒÙ…Ù‡ ØªØ§Ù…ÛŒÙ† Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ Ø±Ø§ Ø¨Ø§ Ø§ØªÚ©Ø§ Ø¨Ù‡ Ù†ØµÙˆØµ Ù‚Ø§Ù†ÙˆÙ†ÛŒ Ùˆ Ù…Ø¹ØªØ¨Ø±ØªØ±ÛŒÙ† Ø¢Ø±Ø§Ø¡ ÙˆØ­Ø¯Øª Ø±ÙˆÛŒÙ‡ Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª Ø§Ø¯Ø§Ø±ÛŒ Ø¨Ø¯ÙˆÙ† Ú©ÙˆÚ†Ú©â€ŒØªØ±ÛŒÙ† Ø®Ø·Ø§ Ùˆ Ø¯Ø± Ú†Ù†Ø¯ Ø«Ø§Ù†ÛŒÙ‡ Ø§Ù†Ø¬Ø§Ù… Ø¯Ù‡Ù†Ø¯.
              </p>
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-xs text-slate-400 space-y-2">
                <p>âœ”ï¸ Ù…Ø­Ø§Ø³Ø¨Ù‡ Ø±ÙˆØ²Ø´Ù…Ø§Ø± Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù†â€ŒÚ©Ø§Ø± ÙˆÙÙ‚ Ù…Ø§Ø¯Ù‡ Û²Û´ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø±</p>
                <p>âœ”ï¸ Ù¾Ø´ØªÛŒØ¨Ø§Ù†ÛŒ Ù‡Ù…Ø²Ù…Ø§Ù† Ø§Ø² Ù…Ø²Ø¯ Ø«Ø§Ø¨Øª Ø¹Ø§Ø¯ÛŒ Ùˆ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ÛŒ Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„ (Ù…Ø§Ø¯Ù‡ Û³Û¶)</p>
                <p>âœ”ï¸ ØªØ¹ÛŒÛŒÙ† Ø¯Ù‚ÛŒÙ‚ Ø¯ÙˆØ±Ù‡ Ùˆ Ø³Ù‚Ù Ø§Ø³ØªØ­Ù‚Ø§Ù‚ Ù…Ù‚Ø±Ø±ÛŒ Ø¨ÛŒÙ…Ù‡ Ø¨ÛŒÚ©Ø§Ø±ÛŒ Ø·Ø¨Ù‚ Ù…Ø§Ø¯Ù‡ Û·</p>
                <p>âœ”ï¸ Ù¾Ø´ØªÛŒØ¨Ø§Ù†ÛŒ Ø§Ø² Ú†Ø§Ù¾ ÙÛŒØ´ Ùˆ Ø®Ø±ÙˆØ¬ÛŒ Ø§Ø³Ù†Ø§Ø¯ Ø±Ø³Ù…ÛŒ Ø¬Ù‡Øª Ø§Ù…ÙˆØ± Ù…Ø§Ù„ÛŒ Ùˆ ØªØ³ÙˆÛŒÙ‡â€ŒØ­Ø³Ø§Ø¨</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= Ù…ÙˆØ¯Ø§Ù„ Ø®Ø±ÙˆØ¬ÛŒ Ù¾Ø±ÛŒÙ†Øª Ø±Ø³Ù…ÛŒ ÙÛŒØ´ Ø³Ù†ÙˆØ§Øª ================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            {/* Ø³Ø±Ø¨Ø±Ú¯ Ø±Ø³Ù…ÛŒ Ø³Ù†Ø¯ */}
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl">
                  Ø¯
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Ø¨Ø±Ú¯Ù‡ Ø±Ø³Ù…ÛŒ Ù…Ø­Ø§Ø³Ø¨Ù‡ Ø­Ù‚ Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù† Ø®Ø¯Ù…Øª</h2>
                  <p className="text-[11px] text-slate-600">Ø³Ø§Ù…Ø§Ù†Ù‡ Ù…Ø­Ø§Ø³Ø¨Ø§Øª Ø­Ù‚ÙˆÙ‚ Ùˆ Ø±ÙˆØ§Ø¨Ø· Ú©Ø§Ø± Â«Ø¯Ø§Ø¯Ú©Ø§Ø±Â»</p>
                </div>
              </div>
              <div className="text-left text-xs font-mono text-slate-600">
                <div>ØªØ§Ø±ÛŒØ® ØµØ¯ÙˆØ±: {new Date().toLocaleDateString("fa-IR")}</div>
                <div className="text-emerald-700 font-bold">ÙˆØ¶Ø¹ÛŒØª: Ù…Ø¹ØªØ¨Ø± Ù‚Ø§Ù†ÙˆÙ†ÛŒ</div>
              </div>
            </div>

            {/* Ø¬Ø¯ÙˆÙ„ Ù…Ø´Ø®ØµØ§Øª Ùˆ Ø§Ù‚Ù„Ø§Ù… ÙÛŒØ´ */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Ù…Ø¨Ù†Ø§ÛŒ Ø¯Ø³ØªÙ…Ø²Ø¯:</span>
                  <span className="font-bold text-slate-800">{sevResult.basisLabel}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Ù…Ø¬Ù…ÙˆØ¹ Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ÛŒ Ù…Ø§Ù‡Ø§Ù†Ù‡:</span>
                  <span className="font-bold font-mono text-slate-800">{formatToman(sevResult.monthlyWage)}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Ù…Ø¯Øª Ø²Ù…Ø§Ù† Ø³Ø§Ø¨Ù‚Ù‡ Ú©Ø§Ø±:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {sevYears} Ø³Ø§Ù„ Ùˆ {sevMonths} Ù…Ø§Ù‡ Ùˆ {sevDays} Ø±ÙˆØ²
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Ø¶Ø±ÛŒØ¨ Ø³Ø§Ù„Ø§Ù†Ù‡ Ù…Ø¤Ø«Ø±:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {sevResult.effectiveYears.toFixed(3)} Ø³Ø§Ù„
                  </span>
                </div>
              </div>

              {/* Ù†Ù…Ø§ÛŒØ´ Ø±ÛŒØ² Ø§Ù‚Ù„Ø§Ù… Ù…Ø²Ø¯ Ø¯Ø± ØµÙˆØ±Øª Ø§Ù†ØªØ®Ø§Ø¨ Ø­Ø§Ù„Øª ØªÙÚ©ÛŒÚ©ÛŒ */}
              {sevWageBasisType === "detailed" && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block mb-2">
                    Ø±ÛŒØ² Ø§Ù‚Ù„Ø§Ù… Ù…Ø²Ø¯ Ù…Ø¨Ù†Ø§ (Ø·Ø±Ø­ Ø·Ø¨Ù‚Ù‡â€ŒØ¨Ù†Ø¯ÛŒ Ù…Ø´Ø§ØºÙ„):
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-600 block">Ù…Ø²Ø¯ Ú¯Ø±ÙˆÙ‡:</span>
                      <strong>{formatToman(sevJobWage)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Ù…Ø²Ø¯ Ø±ØªØ¨Ù‡:</span>
                      <strong>{formatToman(sevRankWage)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Ù¾Ø§ÛŒÙ‡ Ø³Ù†ÙˆØ§Øª:</span>
                      <strong>{formatToman(sevBaseSanavat)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Ø¨Ø®Ø´ Ø¬Ù…Ø¹ Ù†Ù‡Ø§ÛŒÛŒ */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs opacity-90 block">Ù…Ø¨Ù„Øº Ú©Ù„ Ù‚Ø§Ø¨Ù„ Ù¾Ø±Ø¯Ø§Ø®Øª (Ø­Ù‚ Ø³Ù†ÙˆØ§Øª Ù¾Ø§ÛŒØ§Ù† Ú©Ø§Ø±):</span>
                  <span className="text-2xl font-black font-mono tracking-tight">
                    {formatToman(sevResult.totalSeverance)}
                  </span>
                </div>
                <div className="text-3xl">âš–ï¸</div>
              </div>

              <div className="text-[11px] text-slate-500 text-justify leading-relaxed">
                Ù…Ø£Ø®Ø° Ù…Ø­Ø§Ø³Ø¨Ø§Øª: Ù…Ø§Ø¯Ù‡ Û²Û´ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø± Ø¬Ù…Ù‡ÙˆØ±ÛŒ Ø§Ø³Ù„Ø§Ù…ÛŒ Ø§ÛŒØ±Ø§Ù†ØŒ ØªØ¨ØµØ±Ù‡ Û² Ù…Ø§Ø¯Ù‡ Û³Û¶ Ù‚Ø§Ù†ÙˆÙ† Ú©Ø§Ø± Ùˆ Ø¯Ø§Ø¯Ù†Ø§Ù…Ù‡ Ø´Ù…Ø§Ø±Ù‡ Û±Û²ÛµÛ³ Ù‡ÛŒØ£Øª Ø¹Ù…ÙˆÙ…ÛŒ Ø¯ÛŒÙˆØ§Ù† Ø¹Ø¯Ø§Ù„Øª Ø§Ø¯Ø§Ø±ÛŒ Ù…Ø¨Ù†ÛŒ Ø¨Ø± Ù…Ø­Ø§Ø³Ø¨Ù‡ Ú©Ù„ÛŒÙ‡ Ù…Ø²Ø§ÛŒØ§ÛŒ Ù…Ø³ØªÙ…Ø± Ø¨Ù‡ ØªØ¨Ø¹ Ø´ØºÙ„.
              </div>
            </div>

            {/* Ú©Ù„ÛŒØ¯Ù‡Ø§ÛŒ Ø§Ù‚Ø¯Ø§Ù… */}
            <div className="flex gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md active:scale-95 text-center"
              >
                Ú†Ø§Ù¾ ÙÛŒØ´ / Ø°Ø®ÛŒØ±Ù‡ Ø¨Ù‡ ØµÙˆØ±Øª PDF
              </button>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="py-3 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-all active:scale-95"
              >
                Ø¨Ø³ØªÙ†
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ù…Ù†ÙˆÛŒ Ù†Ø§ÙˆØ¨Ø±ÛŒ Ø«Ø§Ø¨Øª Ù¾Ø§ÛŒÛŒÙ† ØµÙØ­Ù‡ (Bottom Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 px-3">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "home" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">ðŸ </span>
            <span className="text-[10px]">Ø®Ø§Ù†Ù‡</span>
          </button>

          <button
            onClick={() => setActiveTab("calculators")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "calculators" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">ðŸ§®</span>
            <span className="text-[10px]">Ù…Ø­Ø§Ø³Ø¨Ù‡â€ŒÚ¯Ø±Ù‡Ø§</span>
          </button>

          <button
            onClick={() => setActiveTab("laws")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "laws" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">ðŸ“–</span>
            <span className="text-[10px]">Ø¨Ø§Ù†Ú© Ù‚ÙˆØ§Ù†ÛŒÙ†</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex flex-col items-center gap-1 py-1 transition-all ${
              activeTab === "about" ? "text-emerald-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">â„¹ï¸</span>
            <span className="text-[10px]">Ø¯Ø±Ø¨Ø§Ø±Ù‡ Ø¯Ø§Ø¯Ú©Ø§Ø±</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
