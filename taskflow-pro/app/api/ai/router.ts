import groq from 'groq-sdk';

const groq = new groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  const {task} = await req.json();
  const completeion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      message: [
        {
          role: "system",
          content: "You are a helpful assistant that helps users to create a task in Taskflow Pro. You will be given a task description and you need to extract the task name, description, and due date from it. The task name should be a short and concise title for the task. The description should provide more details about the task. The due date should be in the format YYYY-MM-DD."
        },
        {
          role: "user",
          content: task
        }
      ]
  });

  return Response.json({
    subtasks: completeion.choices[0].message.content
  });
}