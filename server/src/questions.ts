// The "Source of Truth" with correct answers.
// Keys derived from your frontend data.ts
export const QUESTIONS_SOURCE = [
  {
    id: 1,
    correct_key: "B", // RAG
    term: "RAG — 检索增强生成",
    memory: "RAG = 先查资料，再生成（减少瞎编）",
    example: "We use RAG to ground answers in internal docs.",
    example_cn: "我们利用 RAG 让回答基于内部文档有据可查。"
  },
  {
    id: 2,
    correct_key: "B", // Agent
    term: "Agent — 智能体",
    memory: "Agent = 会做事的模型（不仅会说）",
    example: "An agent can plan, act, and verify results.",
    example_cn: "智能体可以规划、行动并验证结果。"
  },
  {
    id: 3,
    correct_key: "C", // Tool Calling
    term: "Tool Calling — 工具调用",
    memory: "Tool calling = 让模型从‘会说’变‘能做’",
    example: "We enabled tool calling so the model can query the database.",
    example_cn: "我们启用了工具调用，以便模型可以查询数据库。"
  },
  {
    id: 4,
    correct_key: "C", // MCP
    term: "MCP — 模型上下文协议",
    memory: "MCP = AI 的“通用外接线/转接头”",
    example: "We integrated our tools via MCP for consistent access.",
    example_cn: "我们通过 MCP 集成工具以实现统一且稳定的访问。"
  },
  {
    id: 5,
    correct_key: "B", // Multimodal
    term: "Multimodal — 多模态",
    memory: "Multimodal = 多种输入一起懂",
    example: "The multimodal model can analyze screenshots and text together.",
    example_cn: "多模态模型可以同时分析截图和文字。"
  },
  {
    id: 6,
    correct_key: "C", // Text-to-Video
    term: "Text-to-Video — 文生视频",
    memory: "Text-to-Video = 文生视频",
    example: "We tested a text-to-video model for product demos.",
    example_cn: "我们测试了一个文生视频模型来制作产品演示。"
  },
  {
    id: 7,
    correct_key: "B", // Hallucination
    term: "Hallucination — 幻觉",
    memory: "Hallucination = AI 幻觉：说得像真的，其实是编的",
    example: "The model sometimes hallucinates facts when sources are missing.",
    example_cn: "当缺乏来源时，模型有时会产生幻觉（编造事实）。"
  },
  {
    id: 8,
    correct_key: "D", // SDD
    term: "SDD — 规格驱动开发",
    memory: "SDD = 规格先行，Spec 当“第一真相”，再让 AI 依规写代码。",
    example: "We adopted SDD: write the spec first, then let the agent generate code against it.",
    example_cn: "我们采用了 SDD：先写规格，然后让 Agent 根据规格生成代码。"
  },
  {
    id: 9,
    correct_key: "B", // LoRA
    term: "LoRA — 低秩自适应",
    memory: "LoRA = 小改动，大适配",
    example: "We fine-tuned with LoRA to save GPU memory.",
    example_cn: "我们使用 LoRA 进行微调以节省 GPU 显存。"
  },
  {
    id: 10,
    correct_key: "D", // RLVR
    term: "RLVR — 基于可验证奖励的强化学习",
    memory: "RLVR = 用“可验证的对错信号”当奖励（能自动判定，不靠主观打分）",
    example: "RLVR works well when rewards are verifiable, such as unit tests or exact-answer tasks.",
    example_cn: "当奖励可验证时（如单元测试或确切答案任务），RLVR 效果很好。"
  }
];