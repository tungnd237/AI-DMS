import Dexie from 'dexie';

export const db = new Dexie('dms');
db.version(1).stores({
    items: 'id', // Primary key and indexed props,
    tasks: 'id'
});

export const getItems = async () => {
    return await db.items.toArray();
}

export const getCount = async () => {
    return await db.items.count();
}

export const addItem = async (dmsItem) => {
    await db.items.put({
        id: dmsItem.id,
        name: dmsItem.name,
        url: dmsItem.url
    });
}

export const addItemBulk = async (dmsItems) => {
    await db.items.bulkPut(dmsItems);
}

export const clearAll = async () => {
    await db.items.clear();
}

export const removeItem = async (itemId) => {
    await db.items.delete(itemId);
}

export const getCartItems = () => {
    return JSON.parse(localStorage.getItem("items"))
}

export const addTasks = async (workspaceTask) => {
    await db.tasks.put({
        ...workspaceTask,
        // modules: workspaceTask.modules ? workspaceTask.modules.toString() : null
    });
}

export const getTasks = async () => {
    return await db.tasks.toArray();
}

export const getTaskCount = async () => {
    return await db.tasks.count();
}

export const removeTask = async (taskId) => {
    await db.tasks.delete(taskId);
}

export const removeAllTasks = async () => {
    await db.tasks.clear();
}