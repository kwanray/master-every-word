-- ─── Comprehension Passages ──────────────────────────────────────────────────
-- Run this in Supabase SQL Editor after 01_vocab_and_questions.sql
-- Each passage_group is a unique tag shared by all questions from that passage.
-- The mission generate route picks the first 3 compre_mcq questions, so
-- questions within a passage_group should stay together at the top of the table.

-- ─── Passage 1: 守护我们的地球 ─────────────────────────────────────────────────

INSERT INTO questions (type, passage_group, passage_title, passage, question_text, options, correct_answer, explanation_en, explanation_zh, difficulty)
VALUES
(
  'compre_mcq',
  'passage_earth',
  '守护我们的地球',
  '近年来，全球气候变化问题日趋严峻。冰川融化、海平面上升、极端天气频繁出现，这些都是大自然向人类发出的警告。许多科学家认为，人类的工业活动所排放的温室气体是导致这一现象的主要原因。

面对这一挑战，各国政府纷纷采取措施，减少碳排放，推广清洁能源。许多城市也鼓励市民乘坐公共交通工具，减少使用私家车。此外，植树造林、保护湿地等举措也在全球范围内广泛推行。

然而，仅靠政府的努力是不够的。每一个普通市民都应该从日常生活做起，养成节约能源、减少浪费的良好习惯。只有政府与公民携手合作，才能真正有效地应对气候变化的挑战，守护我们共同的家园——地球。',
  '根据文章，导致全球气候变化的主要原因是什么？',
  '[
    {"key": "A", "text": "过度捕鱼破坏海洋生态"},
    {"key": "B", "text": "人类工业活动排放温室气体"},
    {"key": "C", "text": "城市化进程加速扩张"},
    {"key": "D", "text": "大量使用农药污染土壤"}
  ]'::jsonb,
  'B',
  'The passage states that "greenhouse gases emitted by human industrial activities" are the main cause. The other options are not mentioned.',
  '文章明确指出"人类工业活动排放的温室气体"是主要原因，其余选项文章均未提及。',
  2
),
(
  'compre_mcq',
  'passage_earth',
  '守护我们的地球',
  '近年来，全球气候变化问题日趋严峻。冰川融化、海平面上升、极端天气频繁出现，这些都是大自然向人类发出的警告。许多科学家认为，人类的工业活动所排放的温室气体是导致这一现象的主要原因。

面对这一挑战，各国政府纷纷采取措施，减少碳排放，推广清洁能源。许多城市也鼓励市民乘坐公共交通工具，减少使用私家车。此外，植树造林、保护湿地等举措也在全球范围内广泛推行。

然而，仅靠政府的努力是不够的。每一个普通市民都应该从日常生活做起，养成节约能源、减少浪费的良好习惯。只有政府与公民携手合作，才能真正有效地应对气候变化的挑战，守护我们共同的家园——地球。',
  '文章提到各国政府为应对气候变化采取了哪些措施？',
  '[
    {"key": "A", "text": "征收高额环境税，惩罚排污企业"},
    {"key": "B", "text": "减少碳排放、推广清洁能源、鼓励使用公共交通"},
    {"key": "C", "text": "禁止私家车上路，强制全民种树"},
    {"key": "D", "text": "关闭重污染工厂，改用核能发电"}
  ]'::jsonb,
  'B',
  'The passage lists three specific government measures: reducing carbon emissions, promoting clean energy, and encouraging public transport. Option B is the most complete and accurate.',
  '文章列举了三项政府措施：减少碳排放、推广清洁能源、鼓励乘坐公共交通，B选项最为完整准确。',
  2
),
(
  'compre_mcq',
  'passage_earth',
  '守护我们的地球',
  '近年来，全球气候变化问题日趋严峻。冰川融化、海平面上升、极端天气频繁出现，这些都是大自然向人类发出的警告。许多科学家认为，人类的工业活动所排放的温室气体是导致这一现象的主要原因。

面对这一挑战，各国政府纷纷采取措施，减少碳排放，推广清洁能源。许多城市也鼓励市民乘坐公共交通工具，减少使用私家车。此外，植树造林、保护湿地等举措也在全球范围内广泛推行。

然而，仅靠政府的努力是不够的。每一个普通市民都应该从日常生活做起，养成节约能源、减少浪费的良好习惯。只有政府与公民携手合作，才能真正有效地应对气候变化的挑战，守护我们共同的家园——地球。',
  '作者在文章最后想传达什么主要观点？',
  '[
    {"key": "A", "text": "政府应独力承担所有环保责任"},
    {"key": "B", "text": "科学家应率先研发新能源技术"},
    {"key": "C", "text": "政府与公民须携手合作，共同应对气候变化"},
    {"key": "D", "text": "减少工业生产是解决气候问题的唯一方法"}
  ]'::jsonb,
  'C',
  'The final paragraph explicitly states that "only when the government and citizens work hand in hand" can climate change be effectively addressed. The author stresses shared responsibility.',
  '文章最后一段明确指出"只有政府与公民携手合作"才能有效应对气候变化，强调双方共同承担责任。',
  2
);

-- ─── Passage 2: 科技改变生活 ──────────────────────────────────────────────────

INSERT INTO questions (type, passage_group, passage_title, passage, question_text, options, correct_answer, explanation_en, explanation_zh, difficulty)
VALUES
(
  'compre_mcq',
  'passage_tech',
  '科技改变生活',
  '随着科技的迅猛发展，人工智能、大数据和物联网等新兴技术已悄然渗透到我们日常生活的方方面面。从智能手机到自动驾驶汽车，从网上购物到远程医疗，科技正以前所未有的速度改变着人类的生活方式。

科技的进步为人们带来了极大的便利。足不出户，人们便可购物、就医、接受教育。许多重复性的工作由机器取代，人们得以将更多时间和精力投入到具有创造性的工作中。残疾人士也因辅助技术的发展而获得了更大的自主生活能力。

然而，科技的双刃剑效应也不容忽视。部分人因过度依赖电子设备而忽略了面对面的社交，人与人之间的情感纽带逐渐淡化。此外，隐私泄露和网络安全问题日益突出，大量个人数据被收集和分析，令许多人感到忧虑。

面对科技带来的机遇与挑战，我们需要以理性的态度加以应对，既善用科技提升生活质量，也谨慎地保护个人隐私与社会情感的联结。',
  '"科技的双刃剑效应"在文中指的是什么？',
  '[
    {"key": "A", "text": "科技既能用于军事，也能用于民用"},
    {"key": "B", "text": "科技既带来便利，也带来负面影响"},
    {"key": "C", "text": "科技发展速度既快也慢"},
    {"key": "D", "text": "科技让部分人受益，另一部分人受损"}
  ]'::jsonb,
  'B',
  '"Double-edged sword" is a metaphor for something that has both benefits and drawbacks. The passage explains both the conveniences of technology and its negative effects (social isolation, privacy concerns).',
  '"双刃剑"比喻既有好处也有坏处的事物。文章阐述了科技带来的便利以及其负面影响（社交疏离、隐私问题）。',
  2
),
(
  'compre_mcq',
  'passage_tech',
  '科技改变生活',
  '随着科技的迅猛发展，人工智能、大数据和物联网等新兴技术已悄然渗透到我们日常生活的方方面面。从智能手机到自动驾驶汽车，从网上购物到远程医疗，科技正以前所未有的速度改变着人类的生活方式。

科技的进步为人们带来了极大的便利。足不出户，人们便可购物、就医、接受教育。许多重复性的工作由机器取代，人们得以将更多时间和精力投入到具有创造性的工作中。残疾人士也因辅助技术的发展而获得了更大的自主生活能力。

然而，科技的双刃剑效应也不容忽视。部分人因过度依赖电子设备而忽略了面对面的社交，人与人之间的情感纽带逐渐淡化。此外，隐私泄露和网络安全问题日益突出，大量个人数据被收集和分析，令许多人感到忧虑。

面对科技带来的机遇与挑战，我们需要以理性的态度加以应对，既善用科技提升生活质量，也谨慎地保护个人隐私与社会情感的联结。',
  '根据文章，科技进步对残疾人士有什么影响？',
  '[
    {"key": "A", "text": "令他们的隐私更容易受到侵犯"},
    {"key": "B", "text": "取代了他们原有的工作"},
    {"key": "C", "text": "帮助他们获得更大的自主生活能力"},
    {"key": "D", "text": "使他们更难融入社会"}
  ]'::jsonb,
  'C',
  'The passage states that people with disabilities "have gained greater independence in daily life" due to the development of assistive technologies.',
  '文章明确指出残疾人士"因辅助技术的发展而获得了更大的自主生活能力"。',
  1
),
(
  'compre_mcq',
  'passage_tech',
  '科技改变生活',
  '随着科技的迅猛发展，人工智能、大数据和物联网等新兴技术已悄然渗透到我们日常生活的方方面面。从智能手机到自动驾驶汽车，从网上购物到远程医疗，科技正以前所未有的速度改变着人类的生活方式。

科技的进步为人们带来了极大的便利。足不出户，人们便可购物、就医、接受教育。许多重复性的工作由机器取代，人们得以将更多时间和精力投入到具有创造性的工作中。残疾人士也因辅助技术的发展而获得了更大的自主生活能力。

然而，科技的双刃剑效应也不容忽视。部分人因过度依赖电子设备而忽略了面对面的社交，人与人之间的情感纽带逐渐淡化。此外，隐私泄露和网络安全问题日益突出，大量个人数据被收集和分析，令许多人感到忧虑。

面对科技带来的机遇与挑战，我们需要以理性的态度加以应对，既善用科技提升生活质量，也谨慎地保护个人隐私与社会情感的联结。',
  '作者认为我们应该如何面对科技带来的机遇与挑战？',
  '[
    {"key": "A", "text": "拒绝使用可能侵犯隐私的科技产品"},
    {"key": "B", "text": "由政府立法全面监管科技公司"},
    {"key": "C", "text": "以理性态度善用科技，同时保护隐私与社会联结"},
    {"key": "D", "text": "减慢科技发展速度，优先解决社会问题"}
  ]'::jsonb,
  'C',
  'The final paragraph calls for a rational approach — making good use of technology to improve quality of life while carefully protecting personal privacy and social bonds.',
  '最后一段呼吁以理性态度应对，"善用科技提升生活质量，也谨慎地保护个人隐私与社会情感的联结"。',
  3
);
