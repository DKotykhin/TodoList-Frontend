export interface IUserLogin {    
    email: string;
    password: string;    
}

export interface IUserRegister extends IUserLogin {
    name: string    
}

export interface IUserUpdate {    
    name?: string;
    password?: string
}

export interface IUser {    
    _id: string;
    email: string;
    name: string;
    createdAt: string; 
    avatarURL?: string;    
}

export interface IUserWithToken {
    user: IUser;
    token: string;
}

export interface IUserResponse extends IUser {    
    token: string;
    message: string; 
}

export interface IUserResponseWithoutToken extends IUser {    
    message: string; 
}

export interface IUserDeleteResponse {
    status: object;
    message: string;
}

export interface IUserConfirmPasswordResponse {
    status: boolean;
    message: string;
}

export interface IUserAvatar {
    avatarURL: string;
    message: string;
}