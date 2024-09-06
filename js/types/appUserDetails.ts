export type AppUserDetails = {
    personalTasks: {
        [username: string]: number[]
    };
    currentUser: string;
    filters: any; // has a type, but server doesn't need to know
    simple: boolean;
    darkMode: boolean;
}