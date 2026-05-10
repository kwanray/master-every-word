-- O-Level Chinese (SEAB Syllabus 1160) Vocabulary & Questions Seed
-- Run this in Supabase → SQL Editor
-- WARNING: clears existing vocabulary, questions, and related progress data

TRUNCATE vocabulary CASCADE;

-- ─── VOCABULARY ───────────────────────────────────────────────────────────────

INSERT INTO vocabulary (word, pinyin, meaning_zh, meaning_en, example_sentence, difficulty, tags) VALUES

-- 品格与价值观 Character & Values
('勤奋', 'qín fèn', '努力工作，不懒惰', 'diligent; hardworking', '他勤奋学习，终于考上了理想的大学。', 1, ARRAY['品格','学习']),
('珍惜', 'zhēn xī', '重视并爱护，不浪费', 'to cherish; to treasure', '我们要珍惜与家人在一起的时光。', 1, ARRAY['品格','家庭']),
('坚持', 'jiān chí', '坚定地持续做某事，不放弃', 'to persist; to persevere', '无论多难，他都坚持每天练习钢琴。', 1, ARRAY['品格']),
('谦虚', 'qiān xū', '不自大，愿意向别人学习', 'humble; modest', '他成绩优秀，却依然谦虚，从不骄傲。', 2, ARRAY['品格']),
('诚实', 'chéng shí', '说真话，不欺骗别人', 'honest; truthful', '诚实是做人最基本的品格。', 1, ARRAY['品格']),
('感激', 'gǎn jī', '对别人的帮助或好意表示感谢', 'grateful; thankful', '他非常感激老师多年来的教导。', 1, ARRAY['品格','家庭']),
('慷慨', 'kāng kǎi', '大方，愿意给予别人帮助或财物', 'generous; magnanimous', '他慷慨地把零用钱捐给了慈善机构。', 2, ARRAY['品格','社会']),
('毅力', 'yì lì', '坚强的意志，遇到困难不放弃的精神', 'willpower; perseverance', '要成功，就必须有毅力，坚持到底。', 2, ARRAY['品格']),
('自律', 'zì lǜ', '自己约束自己的行为，不需要别人督促', 'self-discipline', '自律是成功人士的重要特质之一。', 2, ARRAY['品格','学习']),
('责任感', 'zé rèn gǎn', '对自己的行为和义务认真负责的意识', 'sense of responsibility', '有责任感的人不会轻易放弃自己的承诺。', 2, ARRAY['品格','社会']),
('宽容', 'kuān róng', '能接受他人的过错，不计较', 'tolerant; forgiving', '做人要宽容，不要为小事斤斤计较。', 2, ARRAY['品格']),

-- 家庭与人际关系 Family & Relationships
('孝顺', 'xiào shùn', '尊重和照顾父母长辈', 'filial; respectful to parents', '他是个孝顺的孩子，经常帮父母做家务。', 1, ARRAY['家庭','品格']),
('体贴', 'tǐ tiē', '关心别人的感受和需要，体谅他人', 'considerate; thoughtful', '她非常体贴，总是想到别人的需求。', 1, ARRAY['家庭','品格']),
('沟通', 'gōu tōng', '交流信息和意见，互相理解', 'to communicate; communication', '良好的沟通能解决很多家庭矛盾。', 2, ARRAY['家庭','社会']),
('信任', 'xìn rèn', '相信对方，对对方有信心', 'trust; confidence in someone', '友谊建立在互相信任的基础上。', 1, ARRAY['家庭','品格']),
('包容', 'bāo róng', '能接受和容忍不同的人或意见', 'to be tolerant; to accept differences', '家人之间需要互相包容，才能和睦相处。', 2, ARRAY['家庭','品格']),
('和睦', 'hé mù', '相处融洽，没有争吵', 'harmonious; on good terms', '一家人和睦相处，生活才会幸福。', 1, ARRAY['家庭']),

-- 学校与学习 School & Learning
('专注', 'zhuān zhù', '把注意力完全集中在某件事上', 'focused; concentrated', '上课时要专注听讲，不要分心。', 1, ARRAY['学习']),
('培养', 'péi yǎng', '通过教育和训练来发展某种能力或习惯', 'to cultivate; to nurture', '学校的责任是培养学生的各种能力。', 2, ARRAY['学习','教育']),
('克服', 'kè fú', '努力战胜困难或不良习惯', 'to overcome; to surmount', '他克服了语言障碍，在新学校交到了朋友。', 2, ARRAY['学习','品格']),
('压力', 'yā lì', '来自外部或内部的心理负担或紧张感', 'pressure; stress', '考试前很多学生都感到巨大的压力。', 1, ARRAY['学习','健康']),
('终身学习', 'zhōng shēn xué xí', '在整个人生过程中不断吸收新知识', 'lifelong learning', '在瞬息万变的时代，终身学习非常重要。', 2, ARRAY['学习','教育']),
('半途而废', 'bàn tú ér fèi', '事情做到一半就放弃了', 'to give up halfway; to leave unfinished', '做任何事情都不能半途而废，要坚持到底。', 2, ARRAY['品格','学习','成语']),

-- 社会与公民 Society & Citizenship
('贡献', 'gòng xiàn', '为社会或他人付出努力或资源', 'contribution; to contribute', '每个公民都应该为社会做出贡献。', 1, ARRAY['社会','品格']),
('志愿', 'zhì yuàn', '自愿参加服务活动，不求报酬', 'volunteer; voluntary service', '她利用假期参加志愿活动，帮助有需要的人。', 1, ARRAY['社会','品格']),
('合作', 'hé zuò', '共同努力完成某项任务', 'cooperation; to cooperate', '团队合作是完成大项目的关键。', 1, ARRAY['社会','品格']),
('促进', 'cù jìn', '推动某事向前发展', 'to promote; to advance', '政府推出措施，促进各族群和谐共处。', 2, ARRAY['社会']),
('关爱', 'guān ài', '关心和爱护他人', 'to care for; love and care', '邻里之间互相关爱，形成温馨的社区。', 1, ARRAY['社会','品格']),
('影响', 'yǐng xiǎng', '对人或事产生作用，使其发生变化', 'to influence; influence', '父母的言行举止深深影响孩子的成长。', 1, ARRAY['社会','家庭']),

-- 环境 Environment
('环保', 'huán bǎo', '保护自然环境，防止污染和破坏', 'environmental protection', '我们每个人都应该为环保出一份力。', 1, ARRAY['环境']),
('节约', 'jié yuē', '减少浪费，合理使用资源', 'to save; to conserve', '节约用水是保护环境的重要方法之一。', 1, ARRAY['环境']),
('污染', 'wū rǎn', '有害物质进入环境，使环境变坏', 'pollution; to pollute', '工厂排放的废气造成了严重的空气污染。', 1, ARRAY['环境']),
('回收', 'huí shōu', '把废旧物品重新加工利用', 'to recycle; recycling', '我们应该把纸张和瓶子分类回收。', 1, ARRAY['环境']),
('可持续', 'kě chí xù', '能够长期维持而不损耗自然资源', 'sustainable', '我们需要采取可持续的生活方式来保护地球。', 2, ARRAY['环境','社会']),
('爱护', 'ài hù', '爱惜并保护，不加以破坏', 'to cherish and protect; to take care of', '我们应该爱护公共设施和自然环境。', 1, ARRAY['环境','品格']),

-- 科技 Technology
('网络', 'wǎng luò', '电脑和设备之间相互连接的系统', 'internet; network', '网络改变了人们的生活和工作方式。', 1, ARRAY['科技']),
('社交媒体', 'shè jiāo méi tǐ', '让用户分享内容和互动的网络平台', 'social media', '社交媒体让人们更容易与朋友保持联系。', 1, ARRAY['科技','社会']),
('人工智能', 'rén gōng zhì néng', '让机器模拟和执行人类智能活动的技术', 'artificial intelligence (AI)', '人工智能正在改变许多行业的工作方式。', 2, ARRAY['科技']),
('依赖', 'yī lài', '过于需要某人或某物，无法独立', 'to rely on; dependence', '现代人越来越依赖手机，甚至无法片刻离开。', 2, ARRAY['科技','社会']),
('创新', 'chuàng xīn', '创造新的方法、想法或产品', 'innovation; to innovate', '科技创新推动了社会的快速发展。', 2, ARRAY['科技','社会']),
('网络安全', 'wǎng luò ān quán', '保护网络系统和个人信息免受攻击', 'cybersecurity', '在网上分享个人信息时要注意网络安全。', 2, ARRAY['科技']),

-- 健康 Health
('锻炼', 'duàn liàn', '通过运动来增强体质和健康', 'to exercise; to work out', '每天锻炼有助于保持身心健康。', 1, ARRAY['健康']),
('均衡', 'jūn héng', '各方面保持适当的比例，不偏重某一方', 'balanced; well-balanced', '均衡的饮食对健康非常重要。', 2, ARRAY['健康']),
('心理健康', 'xīn lǐ jiàn kāng', '精神和情绪上的良好状态', 'mental health', '心理健康和身体健康同样重要，不可忽视。', 2, ARRAY['健康','社会']),
('作息', 'zuò xī', '工作和休息的规律安排', 'daily routine; work-rest schedule', '规律的作息有助于提高学习效率和身体健康。', 1, ARRAY['健康','学习']),
('枯燥', 'kū zào', '单调乏味，缺乏趣味', 'monotonous; dry; dull', '他想办法让枯燥的课堂变得生动有趣。', 2, ARRAY['学习']),

-- 成语 Idioms
('持之以恒', 'chí zhī yǐ héng', '坚持不懈，长期努力不放弃', 'to persist consistently; to persevere', '学习语言需要持之以恒，不能三分钟热度。', 2, ARRAY['品格','成语']),
('废寝忘食', 'fèi qǐn wàng shí', '形容专心努力工作或学习，连睡觉和吃饭都忘了', 'to forget to eat and sleep while working hard', '他废寝忘食地备考，终于取得了优异成绩。', 2, ARRAY['学习','成语']),
('精益求精', 'jīng yì qiú jīng', '在已经好的基础上追求更好', 'to strive for excellence; to keep improving', '他精益求精的态度使他成为了出色的工程师。', 3, ARRAY['品格','成语']),
('滴水穿石', 'dī shuǐ chuān shí', '比喻只要坚持不懈，终能达到目标', 'dripping water wears through stone; persistent effort achieves results', '滴水穿石，只要坚持，再难的目标也能实现。', 3, ARRAY['品格','成语']),
('一鸣惊人', 'yī míng jīng rén', '原本默默无闻，突然做出令人惊叹的成就', 'to amaze everyone with one remarkable feat', '他平时低调，却在比赛中一鸣惊人，夺得冠军。', 3, ARRAY['品格','成语']),
('勤能补拙', 'qín néng bǔ zhuō', '努力勤奋可以弥补天赋或能力上的不足', 'diligence can compensate for lack of talent', '勤能补拙，只要努力，天赋不高也能成功。', 2, ARRAY['品格','学习','成语']),
('助人为乐', 'zhù rén wéi lè', '以帮助别人为快乐，乐于助人', 'to find joy in helping others', '她助人为乐，常常主动帮助有困难的同学。', 1, ARRAY['品格','社会','成语']),
('见贤思齐', 'jiàn xián sī qí', '看到有德行或才能的人，应该向他学习', 'see the worthy and aspire to be like them', '我们应该见贤思齐，向优秀的人学习看齐。', 3, ARRAY['品格','成语']);


-- ─── MCQ QUESTIONS ────────────────────────────────────────────────────────────

-- 勤奋
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '以下哪个词语的意思与"勤奋"最相近？',
 '[{"key":"A","text":"懒散"},{"key":"B","text":"努力"},{"key":"C","text":"随意"},{"key":"D","text":"浪漫"}]',
 'B', '"Hardworking" means putting in consistent effort, closest to 努力 (to work hard).', '"勤奋"的意思是努力工作，与"努力"意思最相近。',
 (SELECT id FROM vocabulary WHERE word = '勤奋' LIMIT 1), 1),

('cloze_mcq', '他每天坚持复习，______地备考，最终取得了优异的成绩。',
 '[{"key":"A","text":"懒散"},{"key":"B","text":"随便"},{"key":"C","text":"勤奋"},{"key":"D","text":"枯燥"}]',
 'C', 'The sentence describes consistent hard work in preparing for exams — 勤奋 (diligent) fits perfectly.', '句子描述了认真备考的态度，"勤奋"最符合语境。',
 (SELECT id FROM vocabulary WHERE word = '勤奋' LIMIT 1), 1);

-- 珍惜
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"珍惜时间"中"珍惜"的意思是什么？',
 '[{"key":"A","text":"浪费"},{"key":"B","text":"忽视"},{"key":"C","text":"重视并好好利用"},{"key":"D","text":"随意对待"}]',
 'C', '珍惜 means to value and make good use of something — the opposite of wasting it.', '"珍惜"的意思是重视并好好利用，不浪费。',
 (SELECT id FROM vocabulary WHERE word = '珍惜' LIMIT 1), 1),

('cloze_mcq', '青春一去不复返，我们要______每一天，努力实现自己的梦想。',
 '[{"key":"A","text":"浪费"},{"key":"B","text":"珍惜"},{"key":"C","text":"忽略"},{"key":"D","text":"放弃"}]',
 'B', 'Since youth cannot return, we should 珍惜 (cherish) every day.', '青春短暂，应该"珍惜"每一天，努力奋斗。',
 (SELECT id FROM vocabulary WHERE word = '珍惜' LIMIT 1), 1);

-- 坚持
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '学习华语并不容易，但只要______，一定会有进步的。',
 '[{"key":"A","text":"放弃"},{"key":"B","text":"坚持"},{"key":"C","text":"逃避"},{"key":"D","text":"抱怨"}]',
 'B', 'The sentence encourages not giving up — 坚持 (to persist) fits the context.', '句子鼓励不放弃，"坚持"最符合语境。',
 (SELECT id FROM vocabulary WHERE word = '坚持' LIMIT 1), 1);

-- 谦虚
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '以下哪句话最能体现"谦虚"的精神？',
 '[{"key":"A","text":"我比所有人都聪明，不需要向别人请教。"},{"key":"B","text":"我成绩虽好，但还有很多不足，要继续向别人学习。"},{"key":"C","text":"我已经很厉害了，无需再努力。"},{"key":"D","text":"别人的意见都是错的，只有我是对的。"}]',
 'B', '谦虚 means being humble and willing to learn from others despite doing well.', '"谦虚"是指不骄傲自满，愿意向别人学习，选项B最能体现这种精神。',
 (SELECT id FROM vocabulary WHERE word = '谦虚' LIMIT 1), 2);

-- 感激
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '老师多年来耐心地教导我，我对她充满了______。',
 '[{"key":"A","text":"埋怨"},{"key":"B","text":"感激"},{"key":"C","text":"厌倦"},{"key":"D","text":"忽视"}]',
 'B', 'The sentence expresses thankfulness for a teacher''s patient guidance — 感激 (gratitude) is correct.', '对老师多年的教导，自然应该充满"感激"之情。',
 (SELECT id FROM vocabulary WHERE word = '感激' LIMIT 1), 1);

-- 毅力
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"毅力"的意思是什么？',
 '[{"key":"A","text":"轻松完成任务的能力"},{"key":"B","text":"遇到困难就退缩的性格"},{"key":"C","text":"坚强的意志，遇到困难不放弃"},{"key":"D","text":"依赖他人的习惯"}]',
 'C', '毅力 refers to the strong willpower to keep going despite difficulties.', '"毅力"是指面对困难时，坚强的意志力和不放弃的精神。',
 (SELECT id FROM vocabulary WHERE word = '毅力' LIMIT 1), 2),

('cloze_mcq', '马拉松运动员在赛跑途中虽然筋疲力尽，但凭着顽强的______，终于跑到了终点。',
 '[{"key":"A","text":"运气"},{"key":"B","text":"毅力"},{"key":"C","text":"速度"},{"key":"D","text":"技巧"}]',
 'B', 'Finishing a marathon despite exhaustion requires 毅力 (willpower/perseverance).', '在极度疲劳下仍能坚持跑完全程，靠的是"毅力"。',
 (SELECT id FROM vocabulary WHERE word = '毅力' LIMIT 1), 2);

-- 孝顺
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '以下哪个行为最能体现"孝顺"？',
 '[{"key":"A","text":"经常与父母争吵，不听他们的意见"},{"key":"B","text":"每天帮父母做家务，关心他们的身体健康"},{"key":"C","text":"只顾自己的娱乐，忽视父母的需求"},{"key":"D","text":"用零用钱买东西给自己"}]',
 'B', '孝顺 means showing respect and care for parents — helping with chores and caring for their health is a clear example.', '"孝顺"是指尊重和照顾父母，选项B最能体现这种品格。',
 (SELECT id FROM vocabulary WHERE word = '孝顺' LIMIT 1), 1);

-- 沟通
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '父母和孩子之间应该多______，增进彼此的了解，减少误会。',
 '[{"key":"A","text":"争吵"},{"key":"B","text":"沟通"},{"key":"C","text":"冷漠"},{"key":"D","text":"回避"}]',
 'B', '沟通 (communication) helps families understand each other and reduce misunderstandings.', '家人之间多"沟通"，才能增进了解，减少误会。',
 (SELECT id FROM vocabulary WHERE word = '沟通' LIMIT 1), 1);

-- 贡献
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"贡献"的意思与以下哪个词最相近？',
 '[{"key":"A","text":"索取"},{"key":"B","text":"奉献"},{"key":"C","text":"浪费"},{"key":"D","text":"争夺"}]',
 'B', '贡献 (to contribute) is closest in meaning to 奉献 (to dedicate/give selflessly).', '"贡献"与"奉献"意思最相近，都是为他人或社会付出。',
 (SELECT id FROM vocabulary WHERE word = '贡献' LIMIT 1), 1);

-- 环保
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '为了保护地球，我们每个人都应该积极参与______活动，减少浪费。',
 '[{"key":"A","text":"破坏"},{"key":"B","text":"污染"},{"key":"C","text":"环保"},{"key":"D","text":"消费"}]',
 'C', 'The sentence is about protecting the earth — 环保 (environmental protection) is the right word.', '保护地球要参与"环保"活动，减少对自然的破坏。',
 (SELECT id FROM vocabulary WHERE word = '环保' LIMIT 1), 1);

-- 污染
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '以下哪项行为会导致环境"污染"？',
 '[{"key":"A","text":"把垃圾分类回收"},{"key":"B","text":"骑自行车上学"},{"key":"C","text":"工厂把废水排入河流"},{"key":"D","text":"使用节能灯泡"}]',
 'C', 'Dumping factory waste into rivers is a clear example of causing environmental pollution.', '工厂把废水排入河流，会直接造成水源"污染"。',
 (SELECT id FROM vocabulary WHERE word = '污染' LIMIT 1), 1);

-- 依赖
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '现代人越来越______手机，有些人甚至一刻也不能离开它。',
 '[{"key":"A","text":"厌恶"},{"key":"B","text":"依赖"},{"key":"C","text":"忽视"},{"key":"D","text":"排斥"}]',
 'B', 'The sentence describes people unable to be without their phones — 依赖 (to rely on/be dependent on) fits.', '无法离开手机，说明人们对手机产生了"依赖"。',
 (SELECT id FROM vocabulary WHERE word = '依赖' LIMIT 1), 2);

-- 创新
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"创新"的意思是什么？',
 '[{"key":"A","text":"重复旧有的方法"},{"key":"B","text":"创造新的想法、方法或产品"},{"key":"C","text":"拒绝改变"},{"key":"D","text":"模仿别人"}]',
 'B', '创新 means to create something new — new ideas, methods, or products.', '"创新"是指创造新的想法、方法或产品，推动进步。',
 (SELECT id FROM vocabulary WHERE word = '创新' LIMIT 1), 2);

-- 压力
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '面对繁重的功课和考试，很多学生感到很大的______，心情十分紧张。',
 '[{"key":"A","text":"轻松"},{"key":"B","text":"快乐"},{"key":"C","text":"压力"},{"key":"D","text":"自信"}]',
 'C', 'Heavy schoolwork and exams cause students to feel 压力 (stress/pressure).', '繁重的功课和考试让学生感到"压力"，心情紧张。',
 (SELECT id FROM vocabulary WHERE word = '压力' LIMIT 1), 1);

-- 锻炼
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '医生建议他每天______，保持身体健康，增强免疫力。',
 '[{"key":"A","text":"睡觉"},{"key":"B","text":"锻炼"},{"key":"C","text":"休息"},{"key":"D","text":"玩游戏"}]',
 'B', 'Doctors advise daily 锻炼 (exercise) to maintain health and boost immunity.', '医生建议每天"锻炼"，以保持健康、增强体质。',
 (SELECT id FROM vocabulary WHERE word = '锻炼' LIMIT 1), 1);

-- 枯燥
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"枯燥"的反义词是什么？',
 '[{"key":"A","text":"单调"},{"key":"B","text":"乏味"},{"key":"C","text":"生动有趣"},{"key":"D","text":"沉闷"}]',
 'C', '枯燥 means dull and uninteresting, so its opposite is 生动有趣 (lively and interesting).', '"枯燥"是单调乏味的意思，反义词是"生动有趣"。',
 (SELECT id FROM vocabulary WHERE word = '枯燥' LIMIT 1), 2);

-- 持之以恒
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"持之以恒"这个成语的意思是什么？',
 '[{"key":"A","text":"做事三分钟热度，很快放弃"},{"key":"B","text":"坚持不懈，长期努力"},{"key":"C","text":"做事急于求成"},{"key":"D","text":"遇到困难就退缩"}]',
 'B', '持之以恒 describes sustained, consistent effort over time without giving up.', '"持之以恒"是指坚持不懈，长期努力，不轻易放弃。',
 (SELECT id FROM vocabulary WHERE word = '持之以恒' LIMIT 1), 2),

('cloze_mcq', '学习书法需要______，只练习几天是看不出效果的。',
 '[{"key":"A","text":"半途而废"},{"key":"B","text":"急于求成"},{"key":"C","text":"持之以恒"},{"key":"D","text":"一知半解"}]',
 'C', 'Learning calligraphy requires sustained practice — 持之以恒 (persistent effort) is the right idiom.', '学书法需要"持之以恒"，长期坚持练习才能见效。',
 (SELECT id FROM vocabulary WHERE word = '持之以恒' LIMIT 1), 2);

-- 废寝忘食
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"废寝忘食"用来形容一个人怎样的状态？',
 '[{"key":"A","text":"贪吃懒睡"},{"key":"B","text":"极度专注地工作或学习，连睡觉吃饭都忘了"},{"key":"C","text":"无所事事，游手好闲"},{"key":"D","text":"沉迷于游戏，不思进取"}]',
 'B', '废寝忘食 describes someone so absorbed in work/study that they forget to sleep and eat.', '"废寝忘食"形容专心努力，忘了睡觉和吃饭的状态。',
 (SELECT id FROM vocabulary WHERE word = '废寝忘食' LIMIT 1), 2);

-- 半途而废
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"半途而废"这个成语最适合用来形容哪种情况？',
 '[{"key":"A","text":"一个学生坚持每天练习，最终学会了游泳"},{"key":"B","text":"一个学生学了一个月钢琴后就不再练习了"},{"key":"C","text":"一个运动员克服伤病，坚持完成比赛"},{"key":"D","text":"一个孩子每天帮父母做家务"}]',
 'B', '半途而废 means giving up halfway through — stopping piano after only one month perfectly describes this.', '"半途而废"是指做事中途放弃，学了一个月就停止练琴，正是这种行为。',
 (SELECT id FROM vocabulary WHERE word = '半途而废' LIMIT 1), 2);

-- 一鸣惊人
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '他平时成绩平平，没想到在全国比赛中却______，夺得了第一名。',
 '[{"key":"A","text":"一败涂地"},{"key":"B","text":"一鸣惊人"},{"key":"C","text":"一知半解"},{"key":"D","text":"一无所获"}]',
 'B', '一鸣惊人 describes someone previously unnoticed who suddenly achieves something amazing.', '"一鸣惊人"形容原本默默无闻，突然做出惊人成就，符合句子语境。',
 (SELECT id FROM vocabulary WHERE word = '一鸣惊人' LIMIT 1), 3);

-- 助人为乐
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '"助人为乐"这个成语表达了什么精神？',
 '[{"key":"A","text":"只帮助能回报自己的人"},{"key":"B","text":"以帮助别人为快乐，乐于助人"},{"key":"C","text":"帮助别人是一种负担"},{"key":"D","text":"只关心自己的利益"}]',
 'B', '助人为乐 means finding genuine joy and happiness in helping others, with no expectation of reward.', '"助人为乐"是指以帮助别人为快乐，不求回报地乐于助人。',
 (SELECT id FROM vocabulary WHERE word = '助人为乐' LIMIT 1), 1);

-- 滴水穿石
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '他虽然资质普通，但凭着______的精神，每天坚持练习，终于成为了一名出色的棋手。',
 '[{"key":"A","text":"一鸣惊人"},{"key":"B","text":"半途而废"},{"key":"C","text":"滴水穿石"},{"key":"D","text":"废寝忘食"}]',
 'C', '滴水穿石 describes achieving success through persistent, consistent effort over time — perfect for this context.', '"滴水穿石"比喻坚持不懈终能成功，符合每天坚持练习最终成才的语境。',
 (SELECT id FROM vocabulary WHERE word = '滴水穿石' LIMIT 1), 3);

-- 自律
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '以下哪种行为最能体现"自律"？',
 '[{"key":"A","text":"等父母提醒才去做作业"},{"key":"B","text":"在没有人监督的情况下，主动完成功课再玩"},{"key":"C","text":"趁父母不在家，整天打游戏"},{"key":"D","text":"只做自己喜欢的事，不管责任"}]',
 'B', '自律 means disciplining yourself without external pressure — doing homework before playing without being told is a perfect example.', '"自律"是不需要他人督促，自觉约束自己的行为，选项B最能体现。',
 (SELECT id FROM vocabulary WHERE word = '自律' LIMIT 1), 2);

-- 包容
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '新加坡是一个多元种族的社会，各族人民互相______，和睦共处。',
 '[{"key":"A","text":"排斥"},{"key":"B","text":"歧视"},{"key":"C","text":"包容"},{"key":"D","text":"冷漠"}]',
 'C', 'In a multiracial society like Singapore, mutual 包容 (tolerance and acceptance) enables harmony.', '多元种族社会需要互相"包容"，才能和睦共处。',
 (SELECT id FROM vocabulary WHERE word = '包容' LIMIT 1), 2);

-- 影响
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '父母的言行举止会深深______孩子的性格和价值观的形成。',
 '[{"key":"A","text":"忽视"},{"key":"B","text":"影响"},{"key":"C","text":"阻碍"},{"key":"D","text":"破坏"}]',
 'B', 'Parents'' behaviour deeply 影响 (influences) their children''s character and values.', '父母的行为会深深"影响"孩子的性格和价值观。',
 (SELECT id FROM vocabulary WHERE word = '影响' LIMIT 1), 1);

-- 节约
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '我们应该养成______用水的习惯，因为水是非常宝贵的自然资源。',
 '[{"key":"A","text":"浪费"},{"key":"B","text":"污染"},{"key":"C","text":"节约"},{"key":"D","text":"消耗"}]',
 'C', 'Since water is a precious resource, we should 节约 (conserve) it.', '水是宝贵资源，应该养成"节约"用水的习惯。',
 (SELECT id FROM vocabulary WHERE word = '节约' LIMIT 1), 1);

-- 心理健康
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('vocab_mcq', '以下哪项做法有助于维护"心理健康"？',
 '[{"key":"A","text":"把所有烦恼都压在心里，不告诉任何人"},{"key":"B","text":"遇到压力时，找朋友或辅导员倾诉"},{"key":"C","text":"整天沉迷于网络，逃避现实"},{"key":"D","text":"因为小事就大发脾气"}]',
 'B', 'Sharing problems with friends or counsellors when stressed supports good mental health.', '遇到压力时，向朋友或辅导员倾诉，有助于维护"心理健康"。',
 (SELECT id FROM vocabulary WHERE word = '心理健康' LIMIT 1), 2);

-- 终身学习
INSERT INTO questions (type, question_text, options, correct_answer, explanation_en, explanation_zh, tested_vocab_id, difficulty) VALUES
('cloze_mcq', '在科技快速发展的时代，我们需要不断更新知识，保持______的态度。',
 '[{"key":"A","text":"终身学习"},{"key":"B","text":"固步自封"},{"key":"C","text":"自满自足"},{"key":"D","text":"不思进取"}]',
 'A', 'In a fast-changing world, a 终身学习 (lifelong learning) mindset is essential.', '科技快速发展，需要保持"终身学习"的态度，才能跟上时代。',
 (SELECT id FROM vocabulary WHERE word = '终身学习' LIMIT 1), 2);
