"use server";

import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function createTask(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const dueDate = formData.get("dueDate") as string;

    await prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
        },
    });

    revalidatePath("/");
}

export async function toggleTask(taskId: string, completed: boolean) {
    await prisma.task.update({
        where: {id},
        data: {
            completed: !completed
        },
    });
    revalidatePath("/");
}

export async function updateTask(id: string, title: string, description: string) {
    await prisma.task.update({
        where: {id},
        data: {
            title,
            description
        },
    });
    revalidatePath("/");
}