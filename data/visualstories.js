export const visualStories = {
  "ดอกส้มสีทอง": [
    {
      id: 0,
      type: 'dialogue',
      title: "Chapter 1: เริ่มต้นเรื่องราว",
      backgroundImage: "/images/background/1.png",
      characterImage: "/images/character/doraemon.png",
      characterName: "โนบิตะ",
      dialogue: "สวัสดี วันนี้เป็นวันแรกของฉันที่โรงเรียนแห่งใหม่",
      mood: "neutral",
      nextScene: { 
        type: 'choice',
        options: [
          { 
            text: "ยิ้มทัก", 
            nextSceneId: 1,
            impact: {
  
              knowledge: 0,
              trust: 5,
              romance: 5
            }
          },
          { 
            text: "มองตรงไปข้างหน้า", 
            nextSceneId: 2,
            impact: {
              happiness: -5,
              knowledge: 0,
              trust: -10,
              romance: 0
            }
          }
        ]
      }
    },
    {
      id: 1,
      type: 'dialogue',
      title: "Chapter 1: เริ่มต้นเรื่องราว",
      backgroundImage: "/images/background/1.png",
      characterImage: "/images/character/nobita.png",
      characterName: "โนบิตะ",
      dialogue: "สวัสดีจ้า เธอดูเป็นมิตรจังนะ! ฉันชื่อโนบิตะ",
      mood: "friendly",
      nextScene: {
        type: 'auto',
        nextSceneId: 3
      }
    },
    {
      id: 2,
      type: 'dialogue',
      title: "Chapter 1: เริ่มต้นเรื่องราว",
      backgroundImage: "/images/background/1.png",
      characterImage: "/images/character/doraemon.png",
      dialogue: "ฉันจะยึดครองที่นี่ให้ได้",
      mood: "serious",
      nextScene: {
        type: 'auto',
        nextSceneId: 3
      }
    },
    {
      id: 3,
      type: 'dialogue',
      title: "Chapter 1: เริ่มต้นเรื่องราว",
      backgroundImage: "/images/background/1.png",
      characterImage: "/images/character/teacher.png",
      characterName: "คุณครู",
      dialogue: "ยินดีต้อนรับทุกคน วันนี้เราจะเรียนรู้เรื่องราวใหม่ๆ กัน",
      nextScene: {
        type: 'choice',
        options: [
          { 
            text: "ตั้งใจฟัง", 
            nextSceneId: 5,
            impact: { knowledge: 1, mood: 'positive' }
          },
          { 
            text: "มองออกนอกหน้าต่าง", 
            nextSceneId: 6,
            impact: { knowledge: 0, mood: 'neutral' }
          }
        ]
      }
    }
    // More scenes can be added...
  ]
};