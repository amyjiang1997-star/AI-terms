import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question_cn: "把检索到的资料塞给大模型再作答，这种方法是？",
    options: [
      { key: "A", text: "RLHF (Reinforcement Learning from Human Feedback)" },
      { key: "B", text: "RAG (Retrieval-Augmented Generation)" },
      { key: "C", text: "MoE (Mixture of Experts)" },
      { key: "D", text: "NAS (Neural Architecture Search)" }
    ],
    correct_key: "B",
    term: "RAG — 检索增强生成",
    memory: "RAG = 先查资料，再生成（减少瞎编）",
    example: "We use RAG to ground answers in internal docs.",
    example_cn: "我们利用 RAG 让回答基于内部文档有据可查。"
  },
  {
    id: 2,
    question_cn: "不只聊天，还会自己拆解任务、规划步骤、调用工具去完成，这种 AI 更像？",
    options: [
      { key: "A", text: "Tokenizer" },
      { key: "B", text: "Agent" },
      { key: "C", text: "Batch Inference" },
      { key: "D", text: "Backpropagation" }
    ],
    correct_key: "B",
    term: "Agent — 智能体",
    memory: "Agent = 会做事的模型（不仅会说）",
    example: "An agent can plan, act, and verify results.",
    example_cn: "智能体可以规划、行动并验证结果。"
  },
  {
    id: 3,
    question_cn: "模型决定要不要调用某个函数/工具，并自动填参数，这种能力是？",
    options: [
      { key: "A", text: "Beam Search" },
      { key: "B", text: "Prompt Tuning" },
      { key: "C", text: "Tool Calling" },
      { key: "D", text: "Quantization" }
    ],
    correct_key: "C",
    term: "Tool Calling — 工具调用",
    memory: "Tool calling = 让模型从‘会说’变‘能做’",
    example: "We enabled tool calling so the model can query the database.",
    example_cn: "我们启用了工具调用，以便模型可以查询数据库。"
  },
  {
    id: 4,
    question_cn: "用统一协议把模型和外部系统（文件、Git、DB、工具）连接起来，这套协议常被称为？",
    options: [
      { key: "A", text: "RPC (Remote Procedure Call)" },
      { key: "B", text: "OAuth (Open Authorization)" },
      { key: "C", text: "MCP (Model Context Protocol)" },
      { key: "D", text: "HTTP/3 (Hypertext Transfer Protocol, Version 3)" }
    ],
    correct_key: "C",
    term: "MCP — 模型上下文协议",
    memory: "MCP = AI 的“通用外接线/转接头”",
    example: "We integrated our tools via MCP for consistent access.",
    example_cn: "我们通过 MCP 集成工具以实现统一且稳定的访问。"
  },
  {
    id: 5,
    question_cn: "同一个模型能同时理解文字+图片+音频/视频，这种能力是？",
    options: [
      { key: "A", text: "Unimodal" },
      { key: "B", text: "Multimodal" },
      { key: "C", text: "Monolithic" },
      { key: "D", text: "Distributed" }
    ],
    correct_key: "B",
    term: "Multimodal — 多模态",
    memory: "Multimodal = 多种输入一起懂",
    example: "The multimodal model can analyze screenshots and text together.",
    example_cn: "多模态模型可以同时分析截图和文字。"
  },
  {
    id: 6,
    question_cn: "输入一段文字，直接生成一段视频，这种模型/方向一般是？",
    options: [
      { key: "A", text: "Text-to-Speech" },
      { key: "B", text: "Speech-to-Text" },
      { key: "C", text: "Text-to-Video" },
      { key: "D", text: "Image-to-Text" }
    ],
    correct_key: "C",
    term: "Text-to-Video — 文生视频",
    memory: "Text-to-Video = 文生视频",
    example: "We tested a text-to-video model for product demos.",
    example_cn: "我们测试了一个文生视频模型来制作产品演示。"
  },
  {
    id: 7,
    question_cn: "大模型一本正经地胡说八道，甚至还给你编出引用和数据。这种现象一般称为？",
    options: [
      { key: "A", text: "Overfitting" },
      { key: "B", text: "Hallucination" },
      { key: "C", text: "Quantization" },
      { key: "D", text: "Tokenization" }
    ],
    correct_key: "B",
    term: "Hallucination — 幻觉",
    memory: "Hallucination = AI 幻觉：说得像真的，其实是编的",
    example: "The model sometimes hallucinates facts when sources are missing.",
    example_cn: "当缺乏来源时，模型有时会产生幻觉（编造事实）。"
  },
  {
    id: 8,
    question_cn: "先写清楚规格，再让 AI 按规格生成与迭代代码，这种开发方式被称为？",
    options: [
      { key: "A", text: "TDD (Test-Driven Development)" },
      { key: "B", text: "BDD (Behavior-Driven Development)" },
      { key: "C", text: "DDD (Domain-Driven Development)" },
      { key: "D", text: "SDD (Spec-Driven Development)" }
    ],
    correct_key: "D",
    term: "SDD — 规格驱动开发",
    memory: "SDD = 规格先行，Spec 当“第一真相”，再让 AI 依规写代码。",
    example: "We adopted SDD: write the spec first, then let the agent generate code against it.",
    example_cn: "我们采用了 SDD：先写规格，然后让 Agent 根据规格生成代码。"
  },
  {
    id: 9,
    question_cn: "不全量微调大模型，只训练一小撮可插拔参数（适配器），这种高性价比微调是？",
    options: [
      { key: "A", text: "Full Fine-tuning" },
      { key: "B", text: "LoRA (Low-Rank Adaptation)" },
      { key: "C", text: "Reinforcement Learning" },
      { key: "D", text: "Knowledge Graph" }
    ],
    correct_key: "B",
    term: "LoRA — 低秩自适应",
    memory: "LoRA = 小改动，大适配",
    example: "We fine-tuned with LoRA to save GPU memory.",
    example_cn: "我们使用 LoRA 进行微调以节省 GPU 显存。"
  },
  {
    id: 10,
    question_cn: "哪种对齐方式强调“奖励可验证”，能用规则/程序/判题器直接验对错？",
    options: [
      { key: "A", text: "RLHF (Reinforcement Learning from Human Feedback)" },
      { key: "B", text: "RLAIF (Reinforcement Learning from AI Feedback)" },
      { key: "C", text: "RLVF (Reinforcement Learning from Verbal Feedback)" },
      { key: "D", text: "RLVR (Reinforcement Learning with Verifiable Rewards)" }
    ],
    correct_key: "D",
    term: "RLVR — 基于可验证奖励的强化学习",
    memory: "RLVR = 用“可验证的对错信号”当奖励（能自动判定，不靠主观打分）",
    example: "RLVR works well when rewards are verifiable, such as unit tests or exact-answer tasks.",
    example_cn: "当奖励可验证时（如单元测试或确切答案任务），RLVR 效果很好。"
  }
];