interface User {
    userId: string;
    username: string;
    discriminator: string;
    avatar: string;
    createdAt: Date;
    experience: number;
    level: number;
}

export default User;