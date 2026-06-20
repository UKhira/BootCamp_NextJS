import AddTaskForm from "@/components/AddTaskForm";
import TaskList from "@/components/TaskList";
import {prisma} from "@/lib/prisma";

export default async function Home() {
  searchParams,
} : {
  searchParams: Promise<{
    search?: string;
    filter?: string; 
  }>;
}} {
  const params: await searchParams;
  const search = params.search || "";
  const filter = params.filter || "all";

  const tasks = await prisma.task.findMany({
    where:{
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive"
        },
      }),
      ...(filter !== "completed" && {completed: true}),
      ...(filter !== "pending" && {completed: false}),
    }.
    orderBy: {
      createdAt: "desc"
    },
  });

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.length - completedCount;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center w-full">Taskflow Pro</h1>
      
      <form>
        <input name="search" defaultValue={search} placeholder="Search tasks..." className="border p-2 w-full rounded-md" />
      </form>

      <div className="flex gap-4 mb-4">
        <a href = "/">All</a>
        <a href = "/?filter=completed">Completed</a>
        <a href = "/?filter=pending">Pending</a>
      </div>

      <div className="flex gap-6 mb-6">
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {completedCount}</p>
        <p>Pending: {pendingCount}</p>
      </div>
        
      <AddTaskForm />
      <TaskList tasks={tasks} />
    </main>
  );
}
