-- ─── Vocabulary ──────────────────────────────────────────────────────────────
-- 15 O-Level Chinese vocabulary words (original content, SEAB-aligned)

insert into vocabulary (id, word, pinyin, meaning_en, meaning_zh, example_sentence, difficulty, tags) values
  ('11111111-0001-0001-0001-000000000001', '坚持', 'jiān chí', 'to persist; to persevere; to keep at it', '持续努力，不轻易放弃', '只要坚持练习，你一定会进步的。', 1, array['effort', 'positive']),
  ('11111111-0001-0001-0001-000000000002', '犹豫', 'yóu yù', 'to hesitate; to be indecisive', '拿不定主意，迟迟不作决定', '他犹豫了很久，最终还是决定报名参赛。', 1, array['emotion', 'decision']),
  ('11111111-0001-0001-0001-000000000003', '勤奋', 'qín fèn', 'diligent; hardworking; industrious', '认真努力，不懈怠', '她勤奋学习，成绩一直名列前茅。', 1, array['effort', 'positive']),
  ('11111111-0001-0001-0001-000000000004', '谦虚', 'qiān xū', 'humble; modest; unpretentious', '不自满，虚心接受意见', '取得好成绩后，他依然保持谦虚的态度。', 1, array['character', 'positive']),
  ('11111111-0001-0001-0001-000000000005', '骄傲', 'jiāo ào', 'proud; arrogant (context-dependent)', '因成就而自豪；也可指过分自大', '他为自己的进步感到骄傲，但并不自大。', 1, array['emotion', 'character']),
  ('11111111-0001-0001-0001-000000000006', '珍惜', 'zhēn xī', 'to cherish; to treasure; to value', '重视并好好利用', '我们要珍惜每一天的学习机会。', 1, array['value', 'positive']),
  ('11111111-0001-0001-0001-000000000007', '遗憾', 'yí hàn', 'regret; pity; unfortunate', '感到可惜，没达到期望', '没能参加比赛，他感到非常遗憾。', 1, array['emotion', 'negative']),
  ('11111111-0001-0001-0001-000000000008', '感激', 'gǎn jī', 'grateful; thankful; appreciative', '因得到帮助而心存谢意', '他对老师的耐心指导深感感激。', 1, array['emotion', 'positive']),
  ('11111111-0001-0001-0001-000000000009', '宽容', 'kuān róng', 'tolerant; forgiving; magnanimous', '能接受他人的过错，不计较', '做人要宽容，不要为小事斤斤计较。', 2, array['character', 'positive']),
  ('11111111-0001-0001-0001-000000000010', '刻苦', 'kè kǔ', 'hardworking (through hardship); assiduous', '不怕艰苦，努力学习或工作', '他刻苦钻研，终于解开了这道难题。', 2, array['effort', 'positive']),
  ('11111111-0001-0001-0001-000000000011', '委屈', 'wěi qu', 'to feel wronged; to feel aggrieved; injustice', '受到不公平对待而感到难受', '她虽然感到委屈，但还是选择了原谅对方。', 2, array['emotion', 'negative']),
  ('11111111-0001-0001-0001-000000000012', '枯燥', 'kū zào', 'monotonous; dry; dull; boring', '单调乏味，缺乏趣味', '反复背诵单词固然枯燥，但却十分必要。', 2, array['description', 'negative']),
  ('11111111-0001-0001-0001-000000000013', '半途而废', 'bàn tú ér fèi', 'to give up halfway; to leave unfinished', '事情做到一半就放弃了', '做任何事情都不能半途而废，要坚持到底。', 2, array['chengyu', 'negative', 'effort']),
  ('11111111-0001-0001-0001-000000000014', '坚持不懈', 'jiān chí bù xiè', 'to persevere persistently; tireless dedication', '持续努力，从不松懈', '成功需要坚持不懈的努力，没有捷径可走。', 2, array['chengyu', 'positive', 'effort']),
  ('11111111-0001-0001-0001-000000000015', '体谅', 'tǐ liàng', 'to be understanding; considerate; empathetic', '设身处地为他人着想', '父母工作辛苦，我们应该体谅他们。', 2, array['character', 'positive']);

-- ─── Questions ───────────────────────────────────────────────────────────────

-- Type A: Meaning MCQ (vocab_mcq)
insert into questions (id, type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) values
(
  '22222222-0001-0001-0001-000000000001',
  'vocab_mcq',
  '"坚持"的意思最接近哪一项？',
  '[{"key":"A","text":"放弃努力，不再尝试"},{"key":"B","text":"继续努力，不轻易放弃"},{"key":"C","text":"暂时休息，等待时机"},{"key":"D","text":"改变方向，另谋出路"}]',
  'B',
  '坚持 (jiān chí) means to persist or keep going even when things are difficult. It is the opposite of giving up.',
  '坚持的意思是"继续努力，不轻易放弃"，与A的"放弃"意思相反。',
  '11111111-0001-0001-0001-000000000001',
  1
),
(
  '22222222-0001-0001-0001-000000000002',
  'vocab_mcq',
  '"犹豫"的意思最接近哪一项？',
  '[{"key":"A","text":"果断地做出决定"},{"key":"B","text":"高兴地接受邀请"},{"key":"C","text":"拿不定主意，迟迟不作决定"},{"key":"D","text":"坚定地拒绝他人"}]',
  'C',
  '犹豫 (yóu yù) means to hesitate or be unable to make up one''s mind. It describes indecisiveness.',
  '犹豫的意思是"拿不定主意"，形容一个人在做决定时迟疑不决。',
  '11111111-0001-0001-0001-000000000002',
  1
),
(
  '22222222-0001-0001-0001-000000000003',
  'vocab_mcq',
  '"谦虚"的意思最接近哪一项？',
  '[{"key":"A","text":"自以为是，不接受批评"},{"key":"B","text":"不自满，虚心接受他人意见"},{"key":"C","text":"过分谦让，不敢表达意见"},{"key":"D","text":"对他人的意见漠不关心"}]',
  'B',
  '谦虚 (qiān xū) means humble or modest — being open to feedback and not boastful about achievements.',
  '谦虚是指不自满、不骄傲，愿意虚心向他人学习的好品质。',
  '11111111-0001-0001-0001-000000000004',
  1
),
(
  '22222222-0001-0001-0001-000000000004',
  'vocab_mcq',
  '"遗憾"的意思最接近哪一项？',
  '[{"key":"A","text":"感到愤怒，想要报复"},{"key":"B","text":"感到满意，心情愉快"},{"key":"C","text":"感到可惜，事情未能如愿"},{"key":"D","text":"感到害怕，不敢面对"}]',
  'C',
  '遗憾 (yí hàn) expresses regret or disappointment when something did not turn out as hoped.',
  '遗憾是指对某件事情感到可惜或失望，因为没有达到期望或错失了机会。',
  '11111111-0001-0001-0001-000000000007',
  1
),
(
  '22222222-0001-0001-0001-000000000005',
  'vocab_mcq',
  '"宽容"的意思最接近哪一项？',
  '[{"key":"A","text":"严厉责罚，绝不原谅"},{"key":"B","text":"能原谅他人过错，不斤斤计较"},{"key":"C","text":"对一切事情都漠不关心"},{"key":"D","text":"假装原谅，内心记仇"}]',
  'B',
  '宽容 (kuān róng) means tolerant and forgiving — being able to accept others'' faults without holding grudges.',
  '宽容是指能够接受他人的不足和过错，不斤斤计较，是一种宝贵的品格。',
  '11111111-0001-0001-0001-000000000009',
  2
);

-- Type B: Usage/Cloze MCQ (cloze_mcq)
insert into questions (id, type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) values
(
  '22222222-0001-0001-0001-000000000006',
  'cloze_mcq',
  '虽然学习中文很辛苦，她还是______完成了每天的练习。',
  '[{"key":"A","text":"犹豫"},{"key":"B","text":"坚持"},{"key":"C","text":"遗憾"},{"key":"D","text":"枯燥"}]',
  'B',
  '坚持 fits here because the sentence means "even though studying Chinese is tough, she still persisted in completing her daily practice." 坚持 = to persist/keep going.',
  '句子描述她"尽管辛苦，仍然继续完成练习"，因此用"坚持"最为恰当。',
  '11111111-0001-0001-0001-000000000001',
  1
),
(
  '22222222-0001-0001-0001-000000000007',
  'cloze_mcq',
  '他做事总是______，从来无法将一件事情做到底。',
  '[{"key":"A","text":"坚持不懈"},{"key":"B","text":"勤奋刻苦"},{"key":"C","text":"半途而废"},{"key":"D","text":"珍惜时间"}]',
  'C',
  '半途而废 means "to give up halfway." The sentence describes someone who can never finish what they start — that is exactly 半途而废.',
  '"半途而废"的意思是做事做到一半就放弃。句子说他"无法将事情做到底"，与"半途而废"完全吻合。',
  '11111111-0001-0001-0001-000000000013',
  2
),
(
  '22222222-0001-0001-0001-000000000008',
  'cloze_mcq',
  '面对困难时，我们不应该______，而应该勇敢地寻求解决办法。',
  '[{"key":"A","text":"坚持"},{"key":"B","text":"感激"},{"key":"C","text":"犹豫"},{"key":"D","text":"珍惜"}]',
  'C',
  '犹豫 (hesitate) fits because the sentence contrasts hesitating with being brave. We should NOT hesitate — we should face challenges.',
  '句子的意思是面对困难时"不要迟疑不决"，应该勇敢面对。因此"犹豫"填入最为恰当。',
  '11111111-0001-0001-0001-000000000002',
  1
),
(
  '22222222-0001-0001-0001-000000000009',
  'cloze_mcq',
  '父母为了养育我们付出了很多，我们应该______他们的辛劳。',
  '[{"key":"A","text":"遗憾"},{"key":"B","text":"体谅"},{"key":"C","text":"骄傲"},{"key":"D","text":"委屈"}]',
  'B',
  '体谅 means to be understanding and considerate. The sentence is about appreciating and understanding parents'' hard work.',
  '"体谅"是指理解并体恤他人的处境。句子说应该理解父母的辛劳，用"体谅"最为恰当。',
  '11111111-0001-0001-0001-000000000015',
  1
),
(
  '22222222-0001-0001-0001-000000000010',
  'cloze_mcq',
  '反复背诵单词虽然______，但这是打好语文基础的必要方法。',
  '[{"key":"A","text":"枯燥"},{"key":"B","text":"感激"},{"key":"C","text":"宽容"},{"key":"D","text":"勤奋"}]',
  'A',
  '枯燥 means boring or monotonous. The sentence acknowledges that rote memorisation is dull but necessary.',
  '"枯燥"形容单调乏味。反复背诵单词是令人感到枯燥的事情，但句子说这是必要的方法。',
  '11111111-0001-0001-0001-000000000012',
  1
);

-- ─── Comprehension Passage + Questions ───────────────────────────────────────
-- Original passage: 李明的转变 (Li Ming's Transformation)

insert into questions (id, type, question_text, passage, passage_title, passage_group, options, correct_answer, explanation_en, explanation_zh, difficulty) values
(
  '22222222-0001-0001-0001-000000000011',
  'compre_mcq',
  '李明起初对中文的态度是？',
  '李明是一名中四生，对中文向来不感兴趣。每次考试前，他总是临时抱佛脚，结果成绩一次比一次差。

看着成绩单上鲜红的分数，李明终于下定决心要改变。他开始每天坚持朗读课文，遇到不认识的生词就查字典，一个一个地记下来。

起初，他觉得这样做非常枯燥，总是半途而废。但在老师的鼓励下，他渐渐明白：学习中文不仅仅是为了考试，更是为了了解自己的文化根源。

三个月后，李明参加了学校的中文演讲比赛，虽然没有获奖，但台下同学们热烈的掌声让他深受感动。他知道，只要坚持不懈，终有一天能够掌握这门语言。',
  '李明的转变',
  'passage_li_ming',
  '[{"key":"A","text":"非常喜欢，每天主动复习"},{"key":"B","text":"不感兴趣，考前才临时复习"},{"key":"C","text":"很有天分，轻松取得好成绩"},{"key":"D","text":"因为害怕失败，所以努力学习"}]',
  'B',
  'The passage states clearly: "李明是一名中四生，对中文向来不感兴趣。每次考试前，他总是临时抱佛脚" — he was not interested in Chinese and only crammed before exams.',
  '短文第一段清楚说明：李明"对中文向来不感兴趣"，而且"总是临时抱佛脚"，因此答案是B。',
  1
),
(
  '22222222-0001-0001-0001-000000000012',
  'compre_mcq',
  '是什么事令李明下定决心改变？',
  '李明是一名中四生，对中文向来不感兴趣。每次考试前，他总是临时抱佛脚，结果成绩一次比一次差。

看着成绩单上鲜红的分数，李明终于下定决心要改变。他开始每天坚持朗读课文，遇到不认识的生词就查字典，一个一个地记下来。

起初，他觉得这样做非常枯燥，总是半途而废。但在老师的鼓励下，他渐渐明白：学习中文不仅仅是为了考试，更是为了了解自己的文化根源。

三个月后，李明参加了学校的中文演讲比赛，虽然没有获奖，但台下同学们热烈的掌声让他深受感动。他知道，只要坚持不懈，终有一天能够掌握这门语言。',
  '李明的转变',
  'passage_li_ming',
  '[{"key":"A","text":"老师鼓励他参加演讲比赛"},{"key":"B","text":"同学们的掌声让他深受感动"},{"key":"C","text":"看到成绩单上的低分深感震惊"},{"key":"D","text":"父母要求他努力学习中文"}]',
  'C',
  'The text says: "看着成绩单上鲜红的分数，李明终于下定决心要改变" — seeing the red (failing) scores on his report card was the trigger.',
  '短文说"看着成绩单上鲜红的分数，李明终于下定决心要改变"。是成绩单上的低分促使他下决心改变的。',
  1
),
(
  '22222222-0001-0001-0001-000000000013',
  'compre_mcq',
  '根据短文，"坚持不懈"的意思最接近哪一项？',
  '李明是一名中四生，对中文向来不感兴趣。每次考试前，他总是临时抱佛脚，结果成绩一次比一次差。

看着成绩单上鲜红的分数，李明终于下定决心要改变。他开始每天坚持朗读课文，遇到不认识的生词就查字典，一个一个地记下来。

起初，他觉得这样做非常枯燥，总是半途而废。但在老师的鼓励下，他渐渐明白：学习中文不仅仅是为了考试，更是为了了解自己的文化根源。

三个月后，李明参加了学校的中文演讲比赛，虽然没有获奖，但台下同学们热烈的掌声让他深受感动。他知道，只要坚持不懈，终有一天能够掌握这门语言。',
  '李明的转变',
  'passage_li_ming',
  '[{"key":"A","text":"做事做到一半就放弃"},{"key":"B","text":"持续努力，从不松懈"},{"key":"C","text":"临时努力，应付考试"},{"key":"D","text":"依靠天分，不需努力"}]',
  'B',
  '坚持不懈 literally means "persist without slackening." In context, it contrasts with 半途而废 (giving up halfway) — it means to keep going without stopping.',
  '"坚持不懈"与文中的"半途而废"形成对比。"坚持不懈"的意思是持续努力，从来不松懈，永不放弃。',
  2
);
